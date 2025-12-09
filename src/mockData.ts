import type { Site, RiskFactor } from './structure_types';

/**
 * LEZIONE 2: I Dati "Mock" (Finti)
 * 
 * Invece di collegarci subito a un database (complesso),
 * creiamo dei dati "finti" in memoria per vedere se la nostra interfaccia funziona.
 * È come usare dei manichini per testare un vestito.
 */

// Creiamo alcuni rischi comuni
const electricalRisk: RiskFactor = {
    id: 'r1',
    name: 'Cavi scoperti',
    description: 'I cavi presentano isolamento danneggiato',
    probability: 4, // Alta
    severity: 5,    // Molto grave
    status: 'OPEN',
    dateIdentified: '2025-10-10',
    category: 'Elettrico'
};

const tripRisk: RiskFactor = {
    id: 'r2',
    name: 'Pavimento scivoloso',
    description: 'Presenza di olio sul pavimento',
    probability: 3,
    severity: 2,
    status: 'OPEN',
    dateIdentified: '2025-10-12',
    category: 'Sicurezza Fisica'
};

// Creiamo un esempio complesso: Una Fabbrica
export const mockSite: Site = {
    id: 'site-001',
    name: 'Stabilimento MetalMeccanica SPA',
    address: 'Via dell\'Industria 10, Milano',
    clientName: 'Mario Rossi',
    rootZones: [
        {
            id: 'z-1',
            name: 'Capannone Produzione A',
            assets: [],
            subZones: [
                {
                    id: 'z-1-1',
                    name: 'Area Presse',
                    subZones: [],
                    assets: [
                        {
                            id: 'a-1',
                            name: 'Pressa Idraulica 50T',
                            type: 'Macchinario',
                            risks: [electricalRisk]
                        }
                    ]
                },
                {
                    id: 'z-1-2',
                    name: 'Area Magazzino',
                    assets: [],
                    subZones: [
                        {
                            id: 'z-1-2-1',
                            name: 'Scaffalatura Alta',
                            subZones: [],
                            assets: [
                                {
                                    id: 'a-2',
                                    name: 'Muletto Elettrico',
                                    type: 'Veicolo',
                                    risks: [tripRisk]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'z-2',
            name: 'Uffici Amministrativi',
            assets: [],
            subZones: [
                {
                    id: 'z-2-1',
                    name: 'Reception',
                    subZones: [],
                    assets: []
                }
            ]
        }
    ]
};
