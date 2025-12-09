/**
 * LEZIONE 1: Definizione del Modello Dati (La Struttura)
 * 
 * In informatica, prima di costruire la grafica, dobbiamo definire
 * lo "scheletro" dei dati. Qui usiamo TypeScript (un'evoluzione di JavaScript)
 * che ci permette di definire i "Tipi" (Types) o "Interfacce".
 * 
 * Immagina queste interfaccie come dei moduli di carta bianca che 
 * dobbiamo riempire per ogni casa o fabbrica.
 */

// 1. Definiamo i livelli di Rischio possibili
// "enum" è un elenco fisso di opzioni.
export const RiskLevel = {
  LOW: 'Basso',
  MEDIUM: 'Medio',
  HIGH: 'Alto',
  CRITICAL: 'Critico'
} as const;
export type RiskLevel = typeof RiskLevel[keyof typeof RiskLevel];


// 2. Definiamo cos'è un "Fattore di Rischio"
// Questo è il cuore del tuo lavoro: il problema rilevato.
export interface RiskFactor {
  id: string;             // Codice univoco (es. "R-001")
  name: string;           // Nome del rischio (es. "Rischio Elettrico")
  description: string;    // Dettagli tecnici
  probability: number;    // Probabilità (es. 1-5)
  severity: number;       // Danno (es. 1-5)
  category?: string;      // Es. "Sicurezza Fisica", "Elettrico"

  // --- NUOVE PROPRIETÀ PROFESSIONALI ---
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'; // Stato Mitigazione
  estimatedCost?: number; // Costo stimato per la risoluzione (€)
  notes?: string; // Note operative per il tecnico
  dateIdentified?: string; // Data rilevamento (ISO)
}

// 3. Definiamo l'ELEMENTO (Asset)
// L'oggetto fisico che stiamo ispezionando (es. "Caldaia", "Scala")
export interface Asset {
  id: string;
  name: string;           // Nome oggetto
  type: string;           // Tipo (es. "Impianto", "Struttura")
  photoUrl?: string;      // Foto (il ? significa che è opzionale)

  // UN ELEMENTO HA DEI RISCHI
  // Qui diciamo che 'risks' è una LISTA (Array) di RiskFactor
  risks: RiskFactor[];
}

// 4. Definiamo la ZONA (La Sottostruttura)
// Qui usiamo la "Ricorsione": una Zona può contenere altre Zone!
export interface Zone {
  id: string;
  name: string;           // Es. "Piano Terra", "Cucina", "Reparto A"

  // Una zona contiene Elementi (Assets)
  assets: Asset[];

  // MA una zona può contenere anche SOTTO-ZONE (Sottostrutture)
  // Questo permette infinite profondità: Casa -> Piano -> Stanza -> Ripostiglio...
  subZones: Zone[];
}

// 5. Definiamo il SITO (Edificio/Luogo principale)
export interface Site {
  id: string;
  name: string;           // Es. "Residenza Rossi"
  address: string;        // Indirizzo
  clientName: string;     // Cliente

  // Il sito inizia con una lista di Zone principali
  rootZones: Zone[];
}
