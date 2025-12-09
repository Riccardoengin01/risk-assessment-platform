import { Component, type ErrorInfo, type ReactNode } from 'react';


interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        // Clear all app data
        localStorage.clear();
        // Reload page
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fee2e2',
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#991b1b',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💥</div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Qualcosa è andato storto</h1>
                    <p style={{ maxWidth: '500px', marginBottom: '2rem', lineHeight: '1.5' }}>
                        Si è verificato un errore critico nell'applicazione. Potrebbe essere dovuto a dati salvati corrotti o a un errore imprevisto.
                    </p>

                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #fca5a5', marginBottom: '2rem', width: '100%', maxWidth: '600px', overflowX: 'auto' }}>
                        <code style={{ fontSize: '0.85rem', color: '#ef4444' }}>
                            {this.state.error?.toString()}
                        </code>
                    </div>

                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '12px 24px',
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: 'white',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(239, 68, 68, 0.4)'
                        }}
                    >
                        🔄 Resetta e Ripara Tutto
                    </button>
                    <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.8 }}>
                        Attenzione: Questo cancellerà i dati locali del browser e riavvierà l'app.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
