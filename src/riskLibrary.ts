export interface StandardRisk {
    id: string;
    category: string;
    name: string;
    defaultDescription: string;
    suggestedSeverity: number;
}

export const RISK_LIBRARY: StandardRisk[] = [
    // ==============================================================================
    // 1. SICUREZZA FISICA & ANTI-INTRUSIONE (Physical Security)
    // ==============================================================================
    {
        id: 'sec-phys-001',
        category: 'Sicurezza Fisica',
        name: 'Recinzione Perimetrale Inadeguata',
        defaultDescription: 'Recinzione assente, danneggiata, arrugginita o di altezza insufficiente (< 2m). Facilita lo scavalcamento.',
        suggestedSeverity: 5
    },
    {
        id: 'sec-phys-002',
        category: 'Sicurezza Fisica',
        name: 'Varchi Pedonali Non Presidiati',
        defaultDescription: 'Cancelli o porte secondarie lasciate aperte, senza serratura di sicurezza o controllo accessi.',
        suggestedSeverity: 5
    },
    {
        id: 'sec-phys-003',
        category: 'Sicurezza Fisica',
        name: 'Illuminazione Esterna Insufficiente',
        defaultDescription: 'Zone d\'ombra critiche lungo il perimetro o nei parcheggi che favoriscono l\'occultamento di malintenzionati.',
        suggestedSeverity: 4
    },
    {
        id: 'sec-phys-004',
        category: 'Sicurezza Fisica',
        name: 'Videosorveglianza (TVCC) Assente/Guasta',
        defaultDescription: 'Telecamere inesistenti, non funzionanti, sporche o con angoli ciechi significativi su aree sensibili.',
        suggestedSeverity: 4
    },
    {
        id: 'sec-phys-005',
        category: 'Sicurezza Fisica',
        name: 'Vegetazione Incontrollata (Nascondigli)',
        defaultDescription: 'Alberi o siepi a ridosso del perimetro che offrono nascondigli o appigli per scavalcare.',
        suggestedSeverity: 3
    },
    {
        id: 'sec-phys-006',
        category: 'Sicurezza Fisica',
        name: 'Controllo Accessi Veicolare Assente',
        defaultDescription: 'Sbarra assente o sempre aperta. Mancanza di barriere anti-sfondamento (fittoni/panettoni).',
        suggestedSeverity: 4
    },
    {
        id: 'sec-phys-007',
        category: 'Sicurezza Fisica',
        name: 'Finestre Piano Terra Non Protette',
        defaultDescription: 'Assenza di inferriate o vetri antisfondamento su finestre accessibili dalla strada.',
        suggestedSeverity: 5
    },
    {
        id: 'sec-phys-008',
        category: 'Sicurezza Fisica',
        name: 'Sistemi di Allarme (Intrusione)',
        defaultDescription: 'Impianto allarme assente, non manutenuto o non collegato a vigilanza.',
        suggestedSeverity: 5
    },
    {
        id: 'sec-phys-009',
        category: 'Sicurezza Fisica',
        name: 'Gestione Chiavi Critica',
        defaultDescription: 'Mancanza di procedura gestione chiavi master. Chiavi lasciate incustodite.',
        suggestedSeverity: 4
    },

    // ==============================================================================
    // 2. PREVENZIONE INCENDI (Fire Safety)
    // ==============================================================================
    {
        id: 'fire-001',
        category: 'Antincendio',
        name: 'Estintori Scaduti o Mancanti',
        defaultDescription: 'Estintori non presenti nelle zone a rischio o con revisione scaduta.',
        suggestedSeverity: 5
    },
    {
        id: 'fire-002',
        category: 'Antincendio',
        name: 'Uscite di Emergenza Ostruite',
        defaultDescription: 'Materiale stoccato davanti alle porte di emergenza o lungo le vie di fuga.',
        suggestedSeverity: 5
    },
    {
        id: 'fire-003',
        category: 'Antincendio',
        name: 'Segnaletica di Emergenza Assente',
        defaultDescription: 'Mancanza di cartelli indicanti uscite, estintori o pulsanti di allarme.',
        suggestedSeverity: 3
    },
    {
        id: 'fire-004',
        category: 'Antincendio',
        name: 'Porte Tagliafuoco Danneggiate',
        defaultDescription: 'Porte REI che non chiudono bene o tenute aperte con cunei.',
        suggestedSeverity: 4
    },
    {
        id: 'fire-005',
        category: 'Antincendio',
        name: 'Accumulo Materiale Infiammabile',
        defaultDescription: 'Cartoni, pallet o rifiuti accatastati in aree non idonee o vicino a fonti di calore.',
        suggestedSeverity: 4
    },
    {
        id: 'fire-006',
        category: 'Antincendio',
        name: 'Impianto Rilevazione Fumi Non Funzionante',
        defaultDescription: 'Sensori di fumo sporchi, coperti o centrale rilevazione in avaria.',
        suggestedSeverity: 5
    },
    {
        id: 'fire-007',
        category: 'Antincendio',
        name: 'Registro Antincendio Non Aggiornato',
        defaultDescription: 'Mancata compilazione del registro dei controlli periodici obbligatori.',
        suggestedSeverity: 3
    },

    // ==============================================================================
    // 3. IMPIANTI ELETTRICI (Electrical)
    // ==============================================================================
    {
        id: 'elec-001',
        category: 'Elettrico',
        name: 'Cavi Elettrici Scoperti/Danneggiati',
        defaultDescription: 'Guaina isolante usurata con rame a vista. Rischio folgorazione o corto circuito.',
        suggestedSeverity: 5
    },
    {
        id: 'elec-002',
        category: 'Elettrico',
        name: 'Prese Sovraccariche (Multiprese)',
        defaultDescription: 'Uso eccessivo di "ciabatte" in cascata. Rischio surriscaldamento.',
        suggestedSeverity: 3
    },
    {
        id: 'elec-003',
        category: 'Elettrico',
        name: 'Quadro Elettrico Aperto/Sporco',
        defaultDescription: 'Sportello quadro rotto o mancante. Presenza di polvere interna.',
        suggestedSeverity: 4
    },
    {
        id: 'elec-004',
        category: 'Elettrico',
        name: 'Messa a Terra Assente',
        defaultDescription: 'Impianto di terra non verificato o scollegato su macchinari.',
        suggestedSeverity: 5
    },
    {
        id: 'elec-005',
        category: 'Elettrico',
        name: 'Segnaletica Rischio Elettrico',
        defaultDescription: 'Mancanza etichette di pericolo su quadri elettrici e cabine.',
        suggestedSeverity: 2
    },

    // ==============================================================================
    // 4. STRUTTURE E AMBIENTI (Structural)
    // ==============================================================================
    {
        id: 'struct-001',
        category: 'Strutturale',
        name: 'Pavimentazione Sconnessa',
        defaultDescription: 'Buche, piastrelle rotte o dislivelli non segnalati. Rischio inciampo.',
        suggestedSeverity: 3
    },
    {
        id: 'struct-002',
        category: 'Strutturale',
        name: 'Infiltrazioni d\'Acqua',
        defaultDescription: 'Macchie di umidità su soffitti o pareti. Rischio muffe o danni strutturali.',
        suggestedSeverity: 3
    },
    {
        id: 'struct-003',
        category: 'Strutturale',
        name: 'Caduta Calcinacci/Intonaco',
        defaultDescription: 'Parti di soffitto o cornicioni pericolanti.',
        suggestedSeverity: 4
    },
    {
        id: 'struct-004',
        category: 'Strutturale',
        name: 'Scale Senza Corrimano',
        defaultDescription: 'Scale fisse prive di protezione laterale o corrimano.',
        suggestedSeverity: 4
    },
    {
        id: 'struct-005',
        category: 'Strutturale',
        name: 'Scaffalature Non Ancorate',
        defaultDescription: 'Scaffalature industriali non fissate a terra o a parete. Rischio ribaltamento.',
        suggestedSeverity: 5
    },
    {
        id: 'struct-006',
        category: 'Strutturale',
        name: 'Portata Solai Non Esposta',
        defaultDescription: 'Assenza cartelli indicanti la portata massima (kg/mq) dei soppalchi.',
        suggestedSeverity: 3
    },

    // ==============================================================================
    // 5. SICUREZZA SUL LAVORO (Occupational Safety)
    // ==============================================================================
    {
        id: 'occ-001',
        category: 'Sicurezza Lavoro',
        name: 'Mancanza DPI',
        defaultDescription: 'Operatori senza scarpe antinfortunistiche, caschetti o guanti necessari.',
        suggestedSeverity: 4
    },
    {
        id: 'occ-004',
        category: 'Sicurezza Lavoro',
        name: 'Postazione non Ergonomica',
        defaultDescription: 'Sedute rotte, monitor ad altezza errata, movimenti ripetitivi.',
        suggestedSeverity: 2
    },
    {
        id: 'occ-005',
        category: 'Sicurezza Lavoro',
        name: 'Organi in Movimento non Protetti',
        defaultDescription: 'Macchinari con ingranaggi o cinghie accessibili senza carter di protezione.',
        suggestedSeverity: 5
    },
    {
        id: 'occ-006',
        category: 'Sicurezza Lavoro',
        name: 'Caduta dall\'Alto',
        defaultDescription: 'Lavori in quota senza parapetti o linee vita (es. tetto, soppalchi aperti).',
        suggestedSeverity: 5
    },

    // ==============================================================================
    // 6. RISCHIO CHIMICO E BIOLOGICO (HazMat)
    // ==============================================================================
    {
        id: 'chem-001',
        category: 'Chimico/Biologico',
        name: 'Stoccaggio Chimici Inadeguato',
        defaultDescription: 'Prodotti incompatibili stoccati vicini, assenza vasche di contenimento.',
        suggestedSeverity: 5
    },
    {
        id: 'chem-002',
        category: 'Chimico/Biologico',
        name: 'Etichettatura Sostanze Assente',
        defaultDescription: 'Flaconi o fusti privi di etichetta CLP o sbiadita.',
        suggestedSeverity: 4
    },
    {
        id: 'chem-003',
        category: 'Chimico/Biologico',
        name: 'Kit Sversamento Assente',
        defaultDescription: 'Mancanza di materiali assorbenti per gestire perdite accidentali.',
        suggestedSeverity: 3
    },
    {
        id: 'bio-001',
        category: 'Chimico/Biologico',
        name: 'Presenza infestanti (Roditori/Insetti)',
        defaultDescription: 'Segni evidenti di presenza ratti o insetti nocivi. Rischio sanitario.',
        suggestedSeverity: 4
    },
    {
        id: 'bio-002',
        category: 'Chimico/Biologico',
        name: 'Rifiuti non Gestiti',
        defaultDescription: 'Accumulo di rifiuti organici o speciali non smaltiti correttamente.',
        suggestedSeverity: 3
    },

    // ==============================================================================
    // 7. AMBIENTALE E ESTERNI (Environmental)
    // ==============================================================================
    {
        id: 'env-001',
        category: 'Ambientale',
        name: 'Scarichi Idrici Ostruiti',
        defaultDescription: 'Caditoie e tombini pieni di detriti. Rischio allagamento piazzale.',
        suggestedSeverity: 3
    },
    {
        id: 'env-002',
        category: 'Ambientale',
        name: 'Sversamento al Suolo',
        defaultDescription: 'Macchie d\'olio o carburante sul piazzale non bonificate.',
        suggestedSeverity: 4
    },
    {
        id: 'env-003',
        category: 'Ambientale',
        name: 'Illuminazione Stradale',
        defaultDescription: 'Viabilità interna scarsamente illuminata. Rischio collisioni.',
        suggestedSeverity: 3
    }
];
