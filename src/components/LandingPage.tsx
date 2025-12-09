import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export const LandingPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });

            if (error) {
                setError(error.message);
            } else {
                setEmailSent(true);
            }
        } catch (err) {
            setError("Si è verificato un errore imprevisto.");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div style={{
                minHeight: '100vh', width: '100%', background: '#0f172a', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Inter', sans-serif"
            }}>
                <div style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem', background: 'rgba(30,30,30,0.5)', borderRadius: '1rem', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Controlla la tua Email</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Ti abbiamo inviato un <b>Magic Link</b> a <i>{email}</i>.<br />
                        Clicca sul link nell'email per accedere automagicamente ✨
                    </p>
                    <button
                        onClick={() => setEmailSent(false)}
                        style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Non hai ricevuto l'email? Riprova
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: '#0f172a',
            color: 'white',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '2rem'
        }}>
            {/* HERO SECTION - Compact */}
            <div style={{ padding: '2rem 1rem 1rem 1rem', textAlign: 'center', maxWidth: '800px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', animation: 'bounce 2s infinite' }}>🛡️</div>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    lineHeight: 1.1,
                    background: 'linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Risk Assessment Pro
                </h1>
                <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    La piattaforma intelligente per professionisti della sicurezza.<br />
                    <b>Mappa</b>, <b>Valuta</b> e <b>Genera Report</b> in pochi click.
                </p>
            </div>

            {/* FEATURES GRID - Compact */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                maxWidth: '900px',
                padding: '0 1rem 2rem 1rem',
                width: '100%',
                margin: '0 auto',
                justifyContent: 'center'
            }}>
                <div className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '0.25rem', fontSize: '1rem' }}>📍 Mappatura Visuale</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Crea l'albero digitale dei tuoi asset.</p>
                </div>
                <div className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <h3 style={{ color: '#a78bfa', marginBottom: '0.25rem', fontSize: '1rem' }}>🧠 Intelligence R=PxD</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Calcolo automatico del rischio.</p>
                </div>
                <div className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <h3 style={{ color: '#f472b6', marginBottom: '0.25rem', fontSize: '1rem' }}>📋 Export PDF</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Report professionali pronti all'uso.</p>
                </div>
            </div>

            {/* ACCESS FORM - Compact */}
            <div style={{
                maxWidth: '400px',
                width: '100%',
                background: 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                borderRadius: '20px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.25rem', fontSize: '1.25rem' }}>Accedi alla Piattaforma</h2>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    Tool gratuito per professionisti.
                </p>

                {error && (
                    <div style={{ padding: '10px', background: '#ef444420', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.25rem' }}>
                            EMAIL AZIENDALE
                        </label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '0.95rem' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-glow"
                        disabled={loading}
                        style={{
                            padding: '14px',
                            background: loading ? '#475569' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Invio in corso...' : '🚀 Entra (Magic Link)'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', marginTop: '0.5rem', margin: 0 }}>
                        Riceverai un link di accesso via email.
                    </p>
                </form>
            </div>
        </div>
    );
};
