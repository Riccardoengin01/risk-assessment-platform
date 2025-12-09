import type { Site, Zone } from '../structure_types';

export const generateHTMLReport = (site: Site): string => {
    const date = new Date().toLocaleDateString('it-IT');

    // 1. Appiattiamo tutti i rischi per la tabella
    let allRisks: any[] = [];

    const visualizzaZone = (items: (Zone | any)[], parentName: string) => {
        items.forEach(item => {
            const name = parentName ? `${parentName} > ${item.name}` : item.name;

            // Se è un Asset
            if ('risks' in item) {
                item.risks.forEach((r: any) => {
                    allRisks.push({
                        path: name,
                        riskName: r.name,
                        p: r.probability,
                        s: r.severity,
                        score: r.probability * r.severity,
                        status: r.status,
                        cost: r.estimatedCost
                    });
                });
            }

            // Ricorsione
            if ('subZones' in item) visualizzaZone(item.subZones, name);
            if ('assets' in item) visualizzaZone(item.assets, name);
        });
    };

    visualizzaZone(site.rootZones, '');

    const totalRisk = allRisks.reduce((acc, r) => acc + r.score, 0);
    const highRisks = allRisks.filter(r => r.score >= 15).length;
    const totalCost = allRisks.reduce((acc, r) => acc + (r.cost || 0), 0);

    return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>Report Risk Assessment - ${site.name}</title>
      <style>
        body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
        h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        .summary-box { display: flex; gap: 20px; margin-bottom: 40px; }
        .card { background: #f1f5f9; padding: 20px; border-radius: 8px; flex: 1; text-align: center; }
        .card h3 { margin: 0; font-size: 2rem; color: #0f172a; }
        .card p { margin: 0; color: #64748b; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.9rem; }
        th { background: #1e293b; color: white; text-align: left; padding: 12px; }
        td { border-bottom: 1px solid #e2e8f0; padding: 10px; }
        tr:nth-child(even) { background-color: #f8fafc; }
        
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; color: white; }
        .low { background-color: #10b981; }
        .med { background-color: #f59e0b; }
        .high { background-color: #ef4444; }
        .crit { background-color: #7f1d1d; }

        footer { margin-top: 50px; font-size: 0.8rem; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      </style>
    </head>
    <body>
      <h1>🛡️ Risk Assessment Report</h1>
      <p><strong>Progetto:</strong> ${site.name}<br><strong>Data:</strong> ${date}</p>

      <div class="summary-box">
        <div class="card">
            <h3>${totalRisk}</h3>
            <p>Indice Vulnerabilità</p>
        </div>
        <div class="card">
            <h3>${highRisks}</h3>
            <p>Rischi Critici</p>
        </div>
        <div class="card">
            <h3>€ ${totalCost.toLocaleString()}</h3>
            <p>Stima Costi</p>
        </div>
      </div>

      <h2>Dettaglio Rischi Rilevati</h2>
      <table>
        <thead>
            <tr>
                <th>Asset / Posizione</th>
                <th>Rischio</th>
                <th>PxD</th>
                <th>Score</th>
                <th>Stato</th>
                <th>Costo</th>
            </tr>
        </thead>
        <tbody>
            ${allRisks.map(r => `
                <tr>
                    <td><b>${r.path}</b></td>
                    <td>${r.riskName}</td>
                    <td>${r.p} x ${r.s}</td>
                    <td>
                        <span class="badge ${r.score >= 15 ? 'crit' : r.score >= 10 ? 'high' : r.score >= 5 ? 'med' : 'low'}">
                            ${r.score}
                        </span>
                    </td>
                    <td>${r.status}</td>
                    <td>€ ${r.cost || 0}</td>
                </tr>
            `).join('')}
        </tbody>
      </table>

      <footer>
        Generato con Risk Assessment Pro il ${date}
      </footer>
    </body>
    </html>
  `;
};
