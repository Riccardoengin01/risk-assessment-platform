import React, { useState } from 'react';

interface Props {
    onClose: () => void;
    onConfirm: (feedback: string) => void;
}

export const ExportReportModal: React.FC<Props> = ({ onClose, onConfirm }) => {
    const [feedback, setFeedback] = useState('');
    const [step, setStep] = useState<'feedback' | 'generating' | 'done'>('feedback');

    const handleStart = () => {
        setStep('generating');
        // Simula generazione e salvataggio feedback
        setTimeout(() => {
            onConfirm(feedback); // Callback al genitore
            setStep('done');
        }, 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center', padding: '2rem' }}>

                {step === 'feedback' && (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h2 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Il tuo Report è quasi pronto!</h2>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            Prima di scaricare il PDF professionale, ci piacerebbe sapere come ti sei trovato con il tool.
                        </p>

                        <textarea
                            placeholder="Cosa ti è piaciuto? Cosa miglioreresti?"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                minHeight: '100px',
                                marginBottom: '1.5rem',
                                fontFamily: 'inherit',
                                resize: 'none'
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'end', gap: '1rem' }}>
                            <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#64748b', fontWeight: 600 }}>
                                Annulla
                            </button>
                            <button
                                onClick={handleStart}
                                className="btn-glow"
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                Genera PDF
                            </button>
                        </div>
                    </>
                )}

                {step === 'generating' && (
                    <div style={{ padding: '2rem' }}>
                        <div className="spinner" style={{ margin: '0 auto 1.5rem auto', width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <h3>Generazione Documento in corso...</h3>
                        <p style={{ color: '#64748b' }}>Stiamo compilando le tabelle e calcolando i grafici.</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {step === 'done' && (
                    <div style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#22c55e' }}>✅</div>
                        <h2 style={{ marginBottom: '1rem' }}>Download Completato!</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Il tuo Risk Assessment è stato scaricato.</p>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 2rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                            Chiudi e Torna al Lavoro
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
