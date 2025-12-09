import { useState, useEffect } from 'react';
import { ZoneTreeItem } from './components/ZoneTreeItem';
import { RiskSelector } from './components/RiskSelector';
import { RiskEditModal } from './components/RiskEditModal';
import { LandingPage } from './components/LandingPage';
import { ExportReportModal } from './components/ExportReportModal';
import type { Asset, Zone, Site, RiskFactor } from './structure_types';
import './index.css';
import { calculateSiteStats } from './utils/riskCalculator';
import { generateHTMLReport } from './utils/reportGenerator';

// SUPABASE SERVICES
import * as riskService from './services/riskService';
import { supabase } from './supabaseClient';

function App() {
  // --- AUTENTICAZIONE ---
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    window.location.reload();
  };

  // --- STATO DATI (Supabase) ---
  const [projects, setProjects] = useState<Site[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [siteData, setSiteData] = useState<Site | null>(null); // Dati completi del progetto attivo
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // 1. CARICAMENTO INIZIALE PROGETTI (Al login)
  useEffect(() => {
    if (userEmail) {
      loadProjects();
    }
  }, [userEmail]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const list = await riskService.fetchUserProjects(userEmail!);
      setProjects(list);
      // Se c'è già un progetto attivo salvato, usalo, altrimenti il primo
      const savedActive = localStorage.getItem('risk-platform-active-id');
      const toActivate = list.find(p => p.id === savedActive) || list[0];

      if (toActivate) {
        setActiveProjectId(toActivate.id);
      }
    } catch (err) {
      console.error("Errore caricamento progetti:", err);
      // Fallback gentile: non mostrare errore rosso se è solo un elenco vuoto iniziale
    } finally {
      setIsLoading(false);
    }
  };

  // 2. CARICAMENTO DETTAGLI PROGETTO ATTIVO
  useEffect(() => {
    if (activeProjectId) {
      loadActiveSiteData(activeProjectId);
      localStorage.setItem('risk-platform-active-id', activeProjectId);
    }
  }, [activeProjectId]);

  const loadActiveSiteData = async (projectId: string) => {
    setIsLoading(true);
    try {
      // 1. Trova info base del progetto
      const projectBasic = projects.find(p => p.id === projectId);
      if (!projectBasic) return;

      // 2. Carica albero completo
      const rootZones = await riskService.fetchFullProjectTree(projectId);

      setSiteData({
        ...projectBasic,
        rootZones: rootZones
      });
    } catch (err) {
      console.error("Errore caricamento dettagli sito:", err);
      setError("Impossibile caricare i dati del progetto. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };


  // --- UI STATE ---
  const [selectedItem, setSelectedItem] = useState<Zone | Asset | null>(null);
  const [showRiskSelector, setShowRiskSelector] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskFactor | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);


  // --- AZIONI (CRUD su DATABASE) ---

  // NUOVO PROGETTO
  const handleNewProject = async () => {
    const name = prompt("Nome del nuovo progetto:");
    if (!name || !userEmail) return;

    try {
      setIsLoading(true);
      const newProject = await riskService.createProject(name, userEmail);
      setProjects(prev => [...prev, newProject]);
      setActiveProjectId(newProject.id); // Questo triggererà il loadActiveSiteData
    } catch (err) {
      console.error(err);
      alert("Errore creazione progetto");
    } finally {
      setIsLoading(false);
    }
  };

  // AGGIUNGI STRUTTURA (ZONA/ASSET)
  const handleAddStructure = async (type: 'ZONE' | 'ASSET') => {
    if (!selectedItem || !activeProjectId) {
      alert("Seleziona una zona padre.");
      return;
    }
    // Type guard semplice
    if ((selectedItem as Asset).type !== undefined) {
      alert("Non puoi aggiungere figli a un Asset!");
      return;
    }

    const name = prompt(`Nome del nuovo ${type === 'ZONE' ? 'Ambiente' : 'Asset'}:`);
    if (!name) return;

    try {
      await riskService.addElement(activeProjectId, selectedItem.id, type, name);
      // Ricarica tutto per semplicità (o potremmo aggiornare optimisticamente)
      await loadActiveSiteData(activeProjectId);
    } catch (err) {
      console.error(err);
      alert("Errore salvataggio elemento");
    }
  };

  // AGGIUNGI ROOT ZONE
  const handleAddRootZone = async () => {
    if (!activeProjectId) return;
    const name = prompt("Nome della nuova Area Principale:");
    if (!name) return;

    try {
      await riskService.addElement(activeProjectId, null, 'ZONE', name);
      await loadActiveSiteData(activeProjectId);
    } catch (err) {
      alert("Errore creazione zona");
    }
  };

  // ELIMINA ELEMENTO
  const handleDeleteStructure = async () => {
    if (!selectedItem) return;
    if (!confirm(`Vuoi davvero eliminare "${selectedItem.name}"?`)) return;

    try {
      await riskService.deleteElement(selectedItem.id);
      setSelectedItem(null);
      if (activeProjectId) await loadActiveSiteData(activeProjectId);
    } catch (err) {
      alert("Errore eliminazione");
    }
  };

  // AGGIUNGI RISCHIO
  const handleAddRisk = async (standardRisk: any) => {
    if (!selectedItem || !activeProjectId) return;

    try {
      await riskService.addRisk(selectedItem.id, {
        name: standardRisk.name,
        description: standardRisk.defaultDescription,
        category: standardRisk.category,
        probability: 3,
        severity: standardRisk.suggestedSeverity,
        status: 'OPEN',
        estimatedCost: 0,
        dateIdentified: new Date().toISOString().split('T')[0]
      });
      setShowRiskSelector(false);
      await loadActiveSiteData(activeProjectId);
      // Tenta di riselezionare l'item aggiornato (opzionale, richiederebbe logica di ricerca nell'albero nuovo)
      setSelectedItem(null); // Reset selezione per semplicità, oppure rimaniamo sul vecchio (ma non vedremmo il rischio nuovo subito)
      // TODO: Migliorare UX mantenendo selezione
    } catch (err) {
      alert("Errore aggiunta rischio");
    }
  };

  // AGGIORNA RISCHIO
  const handleUpdateRisk = async (updatedRisk: RiskFactor) => {
    try {
      await riskService.updateRisk(updatedRisk.id, updatedRisk);
      setEditingRisk(null);
      if (activeProjectId) await loadActiveSiteData(activeProjectId);
    } catch (err) {
      alert("Errore aggiornamento rischio");
    }
  };

  // ELIMINA RISCHIO
  const handleDeleteRisk = async (riskId: string) => {
    if (!confirm("Eliminare questo rischio?")) return;
    try {
      await riskService.deleteRisk(riskId);
      setEditingRisk(null);
      if (activeProjectId) await loadActiveSiteData(activeProjectId);
    } catch (err) {
      alert("Errore eliminazione rischio");
    }
  };

  // EXPORT
  const handleFinalizeExport = (_feedback: string) => {
    if (!siteData) return;
    // (Feedback save logic removed/simplified for Database integration focus)

    const htmlContent = generateHTMLReport(siteData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };


  // --- RENDER ---
  const isAsset = (item: any): item is Asset => {
    return (item as Asset).type !== undefined;
  };

  if (!userEmail) return <LandingPage />;

  if (isLoading && !siteData && projects.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Caricamento Progetti...</div>;
  }

  // Se non c'è nessun progetto, mostriamo UI vuota o invito a creare
  if (!siteData && !isLoading && projects.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#cbd5e1' }}>
        <h1>Benvenuto, {userEmail}</h1>
        <button onClick={handleNewProject} className="btn-modern" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>+ Crea il tuo Primo Progetto di Risk Assessment</button>
        <button onClick={handleLogout} style={{ marginTop: '2rem', display: 'block', marginInline: 'auto', background: 'none', color: '#ef4444', border: 'none' }}>Esci</button>
      </div>
    );
  }

  // Stats calculation need safe check
  const stats = siteData ? calculateSiteStats(siteData) : { totalRiskScore: 0, criticalCount: 0, averageRiskScore: 0, riskCount: 0, categoryBreakdown: {} };

  // Stili comuni
  const btnStyle = { fontSize: '0.8rem', padding: '6px 12px', background: 'var(--color-bg-app)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-text-main)' };
  const primaryBtnStyle = { ...btnStyle, background: 'var(--color-primary)', color: 'white', border: 'none' };

  return (
    <div className="app-container">
      {/* MODALE DI EDITING RISCHIO */}
      {editingRisk && (
        <RiskEditModal
          risk={editingRisk}
          onSave={handleUpdateRisk}
          onCancel={() => setEditingRisk(null)}
          onDelete={handleDeleteRisk}
        />
      )}

      {showExportModal && (
        <ExportReportModal
          onClose={() => setShowExportModal(false)}
          onConfirm={handleFinalizeExport}
        />
      )}

      {showRiskSelector && (
        <RiskSelector
          onCancel={() => setShowRiskSelector(false)}
          onRiskSelected={handleAddRisk}
        />
      )}

      {/* SIDEBAR */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Progetto Attivo</label>
            <button onClick={handleNewProject} className="btn-modern secondary" style={{ padding: '2px 8px', fontSize: '0.7rem', height: '24px' }}>+ Nuovo</button>
          </div>
          <select
            value={activeProjectId || ''}
            onChange={(e) => setActiveProjectId(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: 'white', fontWeight: 'bold' }}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <button onClick={() => setSelectedItem(null)} className="btn-modern" style={{ width: '100%', textAlign: 'left', background: !selectedItem ? '#3b82f6' : 'transparent', border: !selectedItem ? 'none' : '1px solid #475569', paddingLeft: '12px' }}>
            📊 Dashboard
          </button>
          <button onClick={() => setShowExportModal(true)} className="btn-modern" style={{ width: '100%', textAlign: 'left', background: 'transparent', border: '1px solid #8b5cf6', color: '#a78bfa', paddingLeft: '12px', marginTop: '4px' }}>
            📄 Export PDF
          </button>
        </div>

        <div className="sidebar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {siteData && (
            <>
              <button onClick={handleAddRootZone} className="btn-modern" style={{ width: '100%', justifyContent: 'center', background: '#334155', marginBottom: '1rem' }}>+ Nuova Area</button>

              {selectedItem && !isAsset(selectedItem) && (
                <div style={{ marginBottom: '1rem', padding: '8px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '6px', border: '1px solid #475569' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Azioni su "{selectedItem.name}":</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleAddStructure('ZONE')} className="btn-modern secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px' }}>+ Stanza</button>
                    <button onClick={() => handleAddStructure('ASSET')} className="btn-modern secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '4px 8px' }}>+ Asset</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {siteData.rootZones.map(zone => (
                  <ZoneTreeItem key={zone.id} zone={zone} onSelect={setSelectedItem} selectedId={selectedItem?.id} />
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid #334155', fontSize: '0.8rem', color: '#94a3b8' }}>
          <div>Loggato come: <br /><b style={{ color: 'white' }}>{userEmail}</b></div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}>Esci</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {isLoading && <div className="spinner" style={{ position: 'absolute', top: '1rem', right: '1rem' }}></div>}
        {error && <div style={{ color: 'red', padding: '1rem', textAlign: 'center' }}>{error}</div>}

        {!selectedItem ? (
          // DASHBOARD
          siteData && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', color: 'var(--color-text-main)' }}>📊 Dashboard Analitica</h1>
                <p style={{ color: 'var(--color-text-dim)' }}>Panoramica avanzata: {siteData.name}</p>
              </header>

              <div className="dashboard-grid" style={{ marginBottom: '3rem' }}>
                <div className="stat-card">
                  <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1 }}>{stats.totalRiskScore}</div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 600 }}>CUMULATIVE RISK</div>
                </div>
                <div className="stat-card" style={{ borderTop: stats.criticalCount > 0 ? '4px solid var(--color-risk-crit)' : '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: '800', color: stats.criticalCount > 0 ? 'var(--color-risk-crit)' : 'var(--color-risk-low)', lineHeight: 1 }}>{stats.criticalCount}</div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 600 }}>CRITICITÀ</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#3b82f6', lineHeight: 1 }}>{Math.round(stats.averageRiskScore * 10) / 10}</div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 600 }}>GRAVITÀ MEDIA</div>
                </div>
              </div>
              {/* Visualizzazione Semplificata Categorie */}
              <div className="stat-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3>Distribuzione Categorie</h3>
                {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>{cat}</span> <b>{count}</b>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          // DETTAGLIO SELEZIONE
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ background: isAsset(selectedItem) ? '#ecfeff' : '#f3f4f6', color: isAsset(selectedItem) ? '#0e7490' : '#4b5563', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {isAsset(selectedItem) ? 'ASSET' : 'ZONA'}
                </span>
                <h1 style={{ margin: '0.5rem 0 0 0', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>{selectedItem.name}</h1>
              </div>
              <button onClick={handleDeleteStructure} style={{ padding: '8px 16px', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>🗑️ Elimina</button>
            </header>

            {isAsset(selectedItem) ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2>⚠️ Analisi Vulnerabilità</h2>
                  <button onClick={() => setShowRiskSelector(true)} style={primaryBtnStyle}>+ Aggiungi Vulnerabilità</button>
                </div>
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                  {selectedItem.risks.map(risk => (
                    <div key={risk.id} className="card-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderTop: `4px solid ${risk.severity * risk.probability >= 15 ? 'var(--color-risk-crit)' : 'var(--color-risk-med)'}`, background: 'white', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase',
                          background: risk.status === 'RESOLVED' ? '#dcfce7' : (risk.status === 'IN_PROGRESS' ? '#fef9c3' : '#fee2e2'),
                          color: risk.status === 'RESOLVED' ? '#166534' : (risk.status === 'IN_PROGRESS' ? '#854d0e' : '#991b1b')
                        }}>
                          {risk.status === 'RESOLVED' ? 'RISOLTO' : (risk.status === 'IN_PROGRESS' ? 'IN LAVORAZ.' : 'APERTO')}
                        </span>
                        {risk.estimatedCost && risk.estimatedCost > 0 && (
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>€ {risk.estimatedCost}</span>
                        )}
                      </div>
                      <h3 style={{ marginTop: 0 }}>{risk.name}</h3>
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{risk.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>R = {risk.probability * risk.severity}</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => setEditingRisk(risk)} style={{ cursor: 'pointer', padding: '4px 8px', border: '1px solid #ddd', background: 'white', borderRadius: '4px' }}>✏️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3>Sottostrutture</h3>
                <ul>
                  {(selectedItem as Zone).subZones.map(z => <li key={z.id}>📂 {z.name}</li>)}
                  {(selectedItem as Zone).assets.map(a => <li key={a.id}>📦 {a.name}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
