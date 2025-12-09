import type { Site, Zone, Asset } from '../structure_types';

/**
 * LEZIONE 6: Algoritmi Ricorsivi (Il Calcolatore)
 * 
 * Qui sta il "cervello" matematico. Dobbiamo calcolare il rischio totale
 * esplorando tutte le stanze, sottostanze e macchinari.
 * 
 * Siccome la struttura è ad albero, useremo funzioni RICORSIVE:
 * una funzione che chiama se stessa per scendere in profondità.
 */

export interface RiskStats {
    totalRiskScore: number; // Somma di (P x D)
    riskCount: number;      // Numero totale di rischi
    criticalCount: number;  // Numero di rischi critici (P x D >= 15)
    highCount: number;      // Numero di rischi alti (P x D >= 10)
    averageRiskScore: number; // Media (Totale / Numero Rischi)
    categoryBreakdown: Record<string, number>; // Es. { "Elettrico": 5, "Fisico": 2 }
}

// Funzione Iniziale (Wrapper)
export function calculateSiteStats(site: Site): RiskStats {
    let stats: RiskStats = {
        totalRiskScore: 0,
        riskCount: 0,
        criticalCount: 0,
        highCount: 0,
        averageRiskScore: 0,
        categoryBreakdown: {}
    };

    // Per ogni "Zona Radice" (es. Capannone, Uffici), scendiamo in profondità
    site.rootZones.forEach(zone => {
        const zoneStats = traverseZone(zone);
        stats = sumStats(stats, zoneStats);
    });

    // CALCOLO FINALE MEDIA
    // Se ci sono rischi, calcoliamo la media arrotondata a 1 decimale
    if (stats.riskCount > 0) {
        stats.averageRiskScore = parseFloat((stats.totalRiskScore / stats.riskCount).toFixed(1));
    }

    return stats;
}

// Funzione Ricorsiva: "Esplora la Zona"
function traverseZone(zone: Zone): RiskStats {
    let currentStats: RiskStats = {
        totalRiskScore: 0,
        riskCount: 0,
        criticalCount: 0,
        highCount: 0,
        averageRiskScore: 0,
        categoryBreakdown: {}
    };

    // 1. Calcola rischi degli ASSET in questa zona
    zone.assets.forEach(asset => {
        const assetStats = calculateAssetStats(asset);
        currentStats = sumStats(currentStats, assetStats);
    });

    // 2. Calcola rischi delle SOTTO ZONE (Ricorsione!)
    zone.subZones.forEach(subZone => {
        const subStats = traverseZone(subZone); // <--- Qui chiama se stessa!
        currentStats = sumStats(currentStats, subStats);
    });

    return currentStats;
}

// Calcolo per singolo Asset
function calculateAssetStats(asset: Asset): RiskStats {
    let stats: RiskStats = {
        totalRiskScore: 0,
        riskCount: 0,
        criticalCount: 0,
        highCount: 0,
        averageRiskScore: 0,
        categoryBreakdown: {}
    };

    asset.risks.forEach(risk => {
        const score = risk.probability * risk.severity;
        stats.totalRiskScore += score;
        stats.riskCount += 1;

        if (score >= 15) stats.criticalCount++;
        else if (score >= 10) stats.highCount++;

        // Categoria
        const cat = risk.category || 'Generico';
        stats.categoryBreakdown[cat] = (stats.categoryBreakdown[cat] || 0) + 1;
    });

    return stats;
}

// Funzione di utilità per sommare due oggetti statistiche
function sumStats(a: RiskStats, b: RiskStats): RiskStats {
    const mergedCategories = { ...a.categoryBreakdown };

    // Somma categorie di B in A
    for (const [cat, count] of Object.entries(b.categoryBreakdown)) {
        mergedCategories[cat] = (mergedCategories[cat] || 0) + count;
    }

    return {
        totalRiskScore: a.totalRiskScore + b.totalRiskScore,
        riskCount: a.riskCount + b.riskCount,
        criticalCount: a.criticalCount + b.criticalCount,
        highCount: a.highCount + b.highCount,
        averageRiskScore: 0, // Placeholder, si calcola solo alla fine
        categoryBreakdown: mergedCategories
    };
}
