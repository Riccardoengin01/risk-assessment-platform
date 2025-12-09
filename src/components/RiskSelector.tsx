import React, { useState } from 'react';
import type { StandardRisk } from '../riskLibrary';
import { RISK_LIBRARY } from '../riskLibrary';
import '../index.css';

interface Props {
    onRiskSelected: (risk: StandardRisk) => void;
    onCancel: () => void;
}

export const RiskSelector: React.FC<Props> = ({ onRiskSelected, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');

    // Estraiamo le categorie uniche e contiamo i rischi per ognuna
    const categories = ['Tutti', ...new Set(RISK_LIBRARY.map(r => r.category))];

    // Funzione helper per contare
    const getCount = (cat: string) => {
        if (cat === 'Tutti') return RISK_LIBRARY.length;
        return RISK_LIBRARY.filter(r => r.category === cat).length;
    };

    const filteredRisks = RISK_LIBRARY.filter(risk => {
        const matchesSearch = risk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            risk.defaultDescription.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tutti' || risk.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '75vh', height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>

                {/* HEADER */}
                <header style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    background: '#f8fafc'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>📚 Libreria Rischi</h2>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Seleziona un rischio predefinito dalla normativa.</span>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>✖️</button>
                </header>

                {/* BODY (Split Layout) */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* SIDEBAR CATEGORIE */}
                    <aside style={{
                        width: '240px',
                        background: '#f8fafc', // Match header/footer bg
                        borderRight: '1px solid #e2e8f0',
                        overflowY: 'auto',
                        padding: '1rem'
                    }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Categorie</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        textAlign: 'left',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid',
                                        borderColor: selectedCategory === cat ? '#3b82f6' : 'transparent',
                                        background: selectedCategory === cat ? '#eff6ff' : 'transparent',
                                        color: selectedCategory === cat ? '#1d4ed8' : '#475569',
                                        cursor: 'pointer',
                                        fontWeight: selectedCategory === cat ? 600 : 400,
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    <span>{cat}</span>
                                    {cat !== 'Tutti' && (
                                        <span style={{
                                            fontSize: '0.7rem',
                                            background: selectedCategory === cat ? '#bfdbfe' : '#e2e8f0',
                                            padding: '1px 6px',
                                            borderRadius: '10px',
                                            minWidth: '20px',
                                            textAlign: 'center',
                                            color: selectedCategory === cat ? '#1e3a8a' : '#64748b'
                                        }}>
                                            {getCount(cat)}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>

                        {/* SEARCH BAR */}
                        <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', opacity: 0.5 }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Cerca rischio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 36px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* RISKS LIST */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            {filteredRisks.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤔</div>
                                    <p style={{ fontSize: '0.9rem' }}>Nessun risultato.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                                    {filteredRisks.map(risk => (
                                        <div
                                            key={risk.id}
                                            onClick={() => onRiskSelected(risk)}
                                            style={{
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                background: 'white',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                minHeight: '120px'
                                            }}
                                            className="risk-card-hover"
                                        >
                                            <div>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    color: '#94a3b8',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    {risk.category}
                                                    {risk.suggestedSeverity >= 5 && <span style={{ color: '#ef4444' }}>CRITICO</span>}
                                                </div>
                                                <h4 style={{ margin: '0 0 0.25rem 0', color: '#334155', fontSize: '0.95rem' }}>{risk.name}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {risk.defaultDescription}
                                                </p>
                                            </div>

                                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ display: 'flex', gap: '2px', flex: 1 }}>
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} style={{
                                                            height: '4px',
                                                            flex: 1,
                                                            borderRadius: '2px',
                                                            background: i <= risk.suggestedSeverity
                                                                ? (risk.suggestedSeverity >= 4 ? '#ef4444' : '#fbbf24')
                                                                : '#e2e8f0'
                                                        }} />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>+ Agg.</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* FOOTER */}
                <div style={{
                    padding: '1rem 1.5rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            background: 'white',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            color: '#475569',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}
                    >
                        Annulla
                    </button>
                </div>

            </div>
        </div>
    );
};
