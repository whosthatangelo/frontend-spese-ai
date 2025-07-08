import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AudioRecorder from '../components/AudioRecorder';
import { getLatestExpenses, getLatestIncomes, getStats, getIncomeStats } from '../api';
import { useUserCompany } from '../contexts/UserCompanyContext';

function Home() {
  const { company } = useUserCompany();
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [latestIncomes, setLatestIncomes] = useState([]);
  const [quickStats, setQuickStats] = useState({ expenses: null, incomes: null });

  useEffect(() => {
    if (!company) return;
    async function fetchData() {
      try {
        const [expenses, incomes, expenseStats, incomeStats] = await Promise.all([
          getLatestExpenses(company.id),
          getLatestIncomes(company.id),
          getStats(),
          getIncomeStats()
        ]);
        setLatestExpenses(expenses);
        setLatestIncomes(incomes);
        setQuickStats({ expenses: expenseStats, incomes: incomeStats });
      } catch (err) {
        console.error('Errore nel caricamento degli ultimi documenti:', err);
      }
    }
    fetchData();
  }, [company]);

  const renderExpenseCard = (exp) => (
    <div key={exp.id} className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ color: '#6366f1', marginBottom: '0.25rem' }}>
              📄 Fattura #{exp.numero_fattura || 'N/D'}
            </h4>
            {exp.data_fattura && (
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                📅 {new Date(exp.data_fattura).toLocaleDateString("it-IT")}
              </p>
            )}
          </div>
          <span 
            style={{ 
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: exp.stato === 'Pagata' ? '#10b981' : exp.stato === 'In attesa' ? '#f59e0b' : '#ef4444',
              color: 'white'
            }}
          >
            {exp.stato || 'N/D'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>💰 Importo</p>
            <p style={{ fontWeight: '600', color: '#ef4444', fontSize: '1.125rem', margin: 0 }}>
              -{exp.importo != null ? `€${parseFloat(exp.importo).toFixed(2)}` : 'N/D'}
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>🏢 Azienda</p>
            <p style={{ fontWeight: '500', margin: 0 }}>{exp.azienda || 'N/D'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomeCard = (inc) => (
    <div key={inc.id} className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ color: '#10b981', marginBottom: '0.25rem' }}>
              💰 Incasso #{inc.id}
            </h4>
            {inc.data_incasso && (
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                📅 {new Date(inc.data_incasso).toLocaleDateString("it-IT")}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>💎 Importo</p>
            <p style={{ fontWeight: '600', color: '#10b981', fontSize: '1.125rem', margin: 0 }}>
              +{inc.importo != null ? `€${parseFloat(inc.importo).toFixed(2)}` : 'N/D'}
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>💳 Metodo</p>
            <p style={{ fontWeight: '500', margin: 0 }}>{inc.metodo_incasso || 'N/D'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // No company state
  if (!company) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Hero Section senza azienda */}
          <div 
            className="card" 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center',
              padding: '4rem 2rem',
              marginBottom: '3rem'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💸</div>
            <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>ExpenseAI</h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>
              L'assistente intelligente per la gestione di spese e incassi
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>
                🎙️ Registrazione vocale
              </span>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>
                🤖 AI-Powered
              </span>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>
                📊 Analytics Real-time
              </span>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.9)', 
              color: '#111827', 
              padding: '1rem 2rem', 
              borderRadius: '9999px',
              display: 'inline-block',
              fontWeight: '600'
            }}>
              ⚠️ Seleziona un'azienda dal menu in alto per iniziare
            </div>
          </div>

          {/* Features Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎙️</div>
              <h3>Registrazione Vocale</h3>
              <p style={{ color: '#6b7280' }}>Parla naturalmente per registrare spese e incassi</p>
            </div>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3>Dashboard Avanzata</h3>
              <p style={{ color: '#6b7280' }}>Analytics e statistiche in tempo reale</p>
            </div>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3>AI Intelligente</h3>
              <p style={{ color: '#6b7280' }}>Riconoscimento automatico di categorie e importi</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem 2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>💸 ExpenseAI</h1>
        <h2 style={{ fontSize: '1.5rem', color: 'white', opacity: 0.9, marginBottom: '1rem' }}>{company.nome}</h2>
        <p style={{ fontSize: '1.125rem', opacity: 0.75, marginBottom: '2rem' }}>
          Il tuo assistente AI per gestire spese e incassi con la voce
        </p>

        {/* Quick Stats */}
        {quickStats.expenses && quickStats.incomes && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.2)', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '9999px'
            }}>
              <strong>€{parseFloat(quickStats.expenses.totale || 0).toLocaleString()}</strong>
              <span style={{ marginLeft: '0.5rem', opacity: 0.75, fontSize: '0.875rem' }}>Spese</span>
            </div>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '9999px'
            }}>
              <strong>€{parseFloat(quickStats.incomes.totale || 0).toLocaleString()}</strong>
              <span style={{ marginLeft: '0.5rem', opacity: 0.75, fontSize: '0.875rem' }}>Incassi</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Sezione Registrazione */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '16px 16px 0 0'
          }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>🎙️ Centro di Registrazione</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Parla naturalmente per registrare spese e incassi</p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <AudioRecorder 
              company={company}
              onAdd={(item) => {
                if (item.numero_fattura) {
                  setLatestExpenses(prev => [item, ...prev.slice(0, 2)]);
                } else {
                  setLatestIncomes(prev => [item, ...prev.slice(0, 2)]);
                }
              }}
            />

            {/* Suggerimenti */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ background: '#f9fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>💡 Esempio Spesa</div>
                <div style={{ fontSize: '0.875rem' }}>"Spesa di oggi 50 euro contanti per benzina"</div>
              </div>
              <div style={{ background: '#f9fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>💡 Esempio Incasso</div>
                <div style={{ fontSize: '0.875rem' }}>"Incasso di ieri 200 euro POS"</div>
              </div>
              <div style={{ background: '#f9fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>🤖 AI Tip</div>
                <div style={{ fontSize: '0.875rem' }}>Parla chiaramente per risultati migliori</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <Link to="/spese" className="card" style={{ padding: '2rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧾</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Gestisci Spese</h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>Visualizza e modifica tutte le spese</p>
            <span style={{ 
              background: '#6366f1', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px',
              fontSize: '0.875rem'
            }}>
              {latestExpenses.length} recenti
            </span>
          </Link>
          <Link to="/incassi" className="card" style={{ padding: '2rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Gestisci Incassi</h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>Visualizza e modifica tutti gli incassi</p>
            <span style={{ 
              background: '#10b981', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px',
              fontSize: '0.875rem'
            }}>
              {latestIncomes.length} recenti
            </span>
          </Link>
          <Link to="/dashboard" className="card" style={{ padding: '2rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Analytics</h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>Dashboard con statistiche avanzate</p>
            <span style={{ 
              background: '#06b6d4', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px',
              fontSize: '0.875rem'
            }}>
              Live
            </span>
          </Link>
        </div>

        {/* Ultimi Incassi */}
        {latestIncomes.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem 1.5rem 0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>💰 Ultimi Incassi</h3>
              <Link to="/incassi" className="btn" style={{ 
                background: '#10b981', 
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                borderRadius: '9999px'
              }}>
                Vedi tutti
              </Link>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              {latestIncomes.map(renderIncomeCard)}
            </div>
          </div>
        )}

        {/* Ultime Spese */}
        {latestExpenses.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem 1.5rem 0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>🧾 Ultime Spese</h3>
              <Link to="/spese" className="btn" style={{ 
                background: '#6366f1', 
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                borderRadius: '9999px'
              }}>
                Vedi tutte
              </Link>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              {latestExpenses.map(renderExpenseCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;