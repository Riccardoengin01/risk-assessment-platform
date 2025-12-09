import React, { useState } from 'react';
import type { RiskFactor } from '../structure_types';
import '../index.css';

interface Props {
    risk: RiskFactor;
    onSave: (updatedRisk: RiskFactor) => void;
    onCancel: () => void;
    onDelete: (riskId: string) => void;
}

export const RiskEditModal: React.FC<Props> = ({ risk, onSave, onCancel, onDelete }) => {
    // Clone del rischio per editing locale
    const [editedRisk, setEditedRisk] = useState<RiskFactor>({ ...risk });

    const handleChange = (field: keyof RiskFactor, value: any) => {
        setEditedRisk(prev => ({ ...prev, [field]: value }));
    };

    const statusOptions = [
        { value: 'OPEN', label: 'APERTO', color: '#ef4444', icon: '🔴' },
        { value: 'IN_PROGRESS', label: 'IN LAVORAZIONE', color: '#eab308', icon: '🟡' },
        { value: 'RESOLVED', label: 'RISOLTO', color: '#22c55e', icon: '🟢' }
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '650px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* HEADER */}
                <header style={{
                    padding: '1.5rem',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{risk.name}</h2>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{risk.category} • ID: {risk.id.slice(-6)}</span>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>✖️</button>
                </header>

                <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>

                    {/* RISK SCORE CARD */}
                    <div style={{
                        background: '#f1f5f9',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Valutazione Rischio</span>
                            <div style={{ marginTop: '0.25rem' }}>
                                Prob. <b>{risk.probability}</b> × Danno <b>{risk.severity}</b>
                            </div>
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: risk.probability * risk.severity >= 10 ? '#ef4444' : '#334155'
                        }}>
                            = {risk.probability * risk.severity}
                        </div>
                    </div>

                    {/* STATUS SELECTOR STRIP */}
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>
                        STATO ATTUALE
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                        {statusOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleChange('status', opt.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: `2px solid ${editedRisk.status === opt.value ? opt.color : '#e2e8f0'}`,
                                    background: editedRisk.status === opt.value ? `${opt.color}15` : 'white',
                                    color: editedRisk.status === opt.value ? opt.color : '#64748b',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* FORM GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                                📅 Data Rilevamento
                            </label>
                            <input
                                type="date"
                                value={editedRisk.dateIdentified || ''}
                                onChange={e => handleChange('dateIdentified', e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                                💰 Costo Stimato (€)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0.00"
                                value={editedRisk.estimatedCost || ''}
                                onChange={e => handleChange('estimatedCost', parseFloat(e.target.value))}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    {/* NOTES */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                            📝 Note Operative / Piano d'Azione
                        </label>
                        <textarea
                            value={editedRisk.notes || ''}
                            onChange={e => handleChange('notes', e.target.value)}
                            placeholder="Descrivi le azioni intraprese o pianificate..."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }}
                        />
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div style={{
                    padding: '1.5rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <button
                        onClick={() => {
                            if (confirm('Questa azione è irreversibile. Confermi eliminazione?')) onDelete(risk.id);
                        }}
                        style={{ color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px', fontSize: '0.9rem' }}>
                        Elimina Risorsa
                    </button>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={onCancel} style={{ padding: '10px 20px', cursor: 'pointer', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600 }}>
                            Annulla
                        </button>
                        <button
                            onClick={() => onSave(editedRisk)}
                            className="btn-glow"
                            style={{
                                padding: '10px 24px',
                                cursor: 'pointer',
                                background: '#3b82f6',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                            Salva Modifiche
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
