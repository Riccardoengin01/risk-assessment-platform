import { supabase } from '../supabaseClient';
import type { Site, Zone, Asset, RiskFactor } from '../structure_types';

// --- TIPI PER IL DB (Mappano le tabelle SQL) ---
// --- TIPI PER IL DB (Mappano le tabelle SQL) ---
// Utilizzato per tipizzare le risposte di Supabase
export interface DBProject {
    id: string;
    user_email: string;
    name: string;
    description: string | null;
    created_at: string;
}

interface DBElement {
    id: string;
    project_id: string;
    parent_id: string | null;
    type: 'ZONE' | 'ASSET';
    name: string;
    created_at: string;
}

interface DBRisk {
    id: string;
    element_id: string;
    name: string;
    description: string;
    category: string;
    probability: number;
    severity: number;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    estimated_cost: number;
    date_identified: string;
    created_at: string;
}

// --- SERVIZIO ---

// 1. CARICA TUTTI I PROGETTI DI UN UTENTE
export const fetchUserProjects = async (email: string): Promise<Site[]> => {
    // A. Prendi i progetti
    const { data: projects, error: pError } = await supabase
        .from('ra_projects')
        .select('*')
        .eq('user_email', email);

    if (pError) throw pError;
    if (!projects) return [];

    // Per ogni progetto, dobbiamo ricostruire l'intero albero (costoso ma necessario per la UI attuale)
    // Ottimizzazione: Facciamo una query unica per tutti gli elementi di QUESTI progetti
    // MA per semplicità MVP, carichiamo i dettagli solo del progetto attivo. Qui restituiamo lista shallow.

    // Per ora ritorniamo i progetti "vuoti" per la lista. 
    // Il caricamento profondo lo faremo quando l'utente seleziona il progetto.
    return projects.map(p => ({
        id: p.id,
        name: p.name,
        address: 'Indirizzo da DB', // TODO: Aggiungere colonna address
        clientName: 'Cliente da DB', // TODO: Aggiungere colonna client
        rootZones: [] // Si caricheranno dopo
    }));
};

// 2. CREA NUOVO PROGETTO
export const createProject = async (name: string, email: string): Promise<Site> => {
    const { data, error } = await supabase
        .from('ra_projects')
        .insert({ name, user_email: email })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: data.name,
        address: '',
        clientName: '',
        rootZones: []
    };
};

// 3. CARICAMENTO PROFONDO DI UN PROGETTO (Ricostruzione Albero)
export const fetchFullProjectTree = async (projectId: string): Promise<Zone[]> => {
    // A. Prendi tutti gli elementi (Zone e Asset) del progetto
    const { data: elements, error: eError } = await supabase
        .from('ra_elements')
        .select('*')
        .eq('project_id', projectId);

    if (eError) throw eError;

    // B. Prendi tutti i rischi di questi elementi
    // Ottimizzazione: prendiamo tutti i rischi collegati agli elementi trovati
    const elementIds = elements.map(e => e.id);
    const { data: risks, error: rError } = await supabase
        .from('ra_risks')
        .select('*')
        .in('element_id', elementIds);

    if (rError) throw rError;

    // C. RICOSTRUZIONE ALBERO IN MEMORIA
    const riskMap = new Map<string, RiskFactor[]>();
    (risks || []).forEach((r: DBRisk) => {
        const risk: RiskFactor = {
            id: r.id,
            name: r.name,
            description: r.description,
            category: r.category,
            probability: r.probability,
            severity: r.severity,
            status: r.status,
            estimatedCost: r.estimated_cost,
            dateIdentified: r.date_identified
        };
        if (!riskMap.has(r.element_id)) riskMap.set(r.element_id, []);
        riskMap.get(r.element_id)!.push(risk);
    });

    const zoneMap = new Map<string, Zone>();
    const assetMap = new Map<string, Asset>();

    // Primo passaggio: Creiamo oggetti in memoria
    elements.forEach((e: DBElement) => {
        if (e.type === 'ZONE') {
            zoneMap.set(e.id, {
                id: e.id,
                name: e.name,
                subZones: [],
                assets: []
            });
        } else {
            assetMap.set(e.id, {
                id: e.id,
                name: e.name,
                type: 'Generico',
                risks: riskMap.get(e.id) || []
            });
        }
    });

    // Secondo passaggio: Linkiamo genitori-figli
    const rootZones: Zone[] = [];

    elements.forEach((e: DBElement) => {
        if (!e.parent_id) {
            // È una root zone? (Solo se è tipo ZONE)
            if (e.type === 'ZONE') {
                rootZones.push(zoneMap.get(e.id)!);
            }
            // Se è un asset orfano alla radice (non previsto dal modello UI attuale ma possibile nel DB), lo ignoriamo o lo mettiamo in una zona "Unassigned"
        } else {
            // Ha un genitore
            const parentZone = zoneMap.get(e.parent_id);
            if (parentZone) {
                if (e.type === 'ZONE') {
                    parentZone.subZones.push(zoneMap.get(e.id)!);
                } else {
                    parentZone.assets.push(assetMap.get(e.id)!);
                }
            }
        }
    });

    return rootZones;
};

// 4. AGGIUNGI ELEMENTO (Zona o Asset)
export const addElement = async (projectId: string, parentId: string | null, type: 'ZONE' | 'ASSET', name: string) => {
    const { data, error } = await supabase
        .from('ra_elements')
        .insert({
            project_id: projectId,
            parent_id: parentId, // Se null, è una Root Zone
            type,
            name
        })
        .select()
        .single();
    if (error) throw error;
    return data;
};

// 5. ELIMINA ELEMENTO (Cascading automatico nel DB)
export const deleteElement = async (elementId: string) => {
    const { error } = await supabase
        .from('ra_elements')
        .delete()
        .eq('id', elementId);
    if (error) throw error;
};

// 6. AGGIUNGI RISCHIO
export const addRisk = async (elementId: string, risk: Partial<RiskFactor>) => {
    const { data, error } = await supabase
        .from('ra_risks')
        .insert({
            element_id: elementId,
            name: risk.name,
            description: risk.description,
            category: risk.category,
            probability: risk.probability,
            severity: risk.severity,
            status: risk.status,
            estimated_cost: risk.estimatedCost,
            date_identified: risk.dateIdentified
        })
        .select()
        .single();
    if (error) throw error;
    return data;
};

// 7. AGGIORNA RISCHIO
export const updateRisk = async (riskId: string, updates: Partial<RiskFactor>) => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.probability) dbUpdates.probability = updates.probability;
    if (updates.severity) dbUpdates.severity = updates.severity;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.estimatedCost !== undefined) dbUpdates.estimated_cost = updates.estimatedCost;
    if (updates.notes) dbUpdates.description = (dbUpdates.description || "") + "\n\nNOTE: " + updates.notes; // Hack semplice per le note

    const { error } = await supabase
        .from('ra_risks')
        .update(dbUpdates)
        .eq('id', riskId);
    if (error) throw error;
};

// 8. ELIMINA RISCHIO
export const deleteRisk = async (riskId: string) => {
    const { error } = await supabase
        .from('ra_risks')
        .delete()
        .eq('id', riskId);
    if (error) throw error;
};
