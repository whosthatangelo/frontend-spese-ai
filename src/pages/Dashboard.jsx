// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getStats, getIncomeStats, getExpenses, getIncomes } from '../api';
import ExpensesChart from '../components/ExpensesChart';
import { useUserCompany } from '../contexts/UserCompanyContext';

function Dashboard() {
  const { company } = useUserCompany();
  const [stats, setStats] = useState(null);
  const [incomeStats, setIncomeStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) {
      setStats(null);
      setIncomeStats(null);
      setExpenses([]);
      setIncomes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    async function loadData() {
      try {
        const [statsData, incomeData, expensesData, incomesData] = await Promise.all([
          getStats(),
          getIncomeStats(),
          getExpenses(),
          getIncomes()
        ]);
        setStats(statsData);
        setIncomeStats(incomeData);
        setExpenses(expensesData);
        setIncomes(incomesData);
      } catch (err) {
        console.error('Errore nel caricamento dei dati dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [company]);

  // Calcoli avanzati
  const profit = incomeStats && stats ? 
    (parseFloat(incomeStats.totale) - parseFloat(stats.totale)) : 0;

  const profitMargin = incomeStats && stats && parseFloat(incomeStats.totale) > 0 ? 
    ((parseFloat(incomeStats.totale) - parseFloat(stats.totale)) / parseFloat(incomeStats.totale) * 100) : 0;

  const recentActivity = [...(expenses || []), ...(incomes || [])]
    .sort((a, b) => new Date(b.data_creazione || b.data_incasso) - new Date(a.data_creazione || a.data_incasso))
    .slice(0, 5);

  if (!company) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div 
            className="card" 
            style={{ 
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: '4rem 2rem'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
            <h2 style={{ color: '#6b7280', marginBottom: '1rem' }}>Seleziona un'azienda</h2>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Scegli un'azienda dal selettore in alto per visualizzare analytics avanzate.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
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
        <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>📊 Business Analytics</h1>
        <h2 style={{ fontSize: '1.5rem', color: 'white', opacity: 0.9, marginBottom: '1rem' }}>{company.nome}</h2>
        <p style={{ fontSize: '1.125rem', opacity: 0.75 }}>
          Dashboard avanzata con insights in tempo reale
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '4px solid #f3f4f6', 
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '1.125rem' }}>⚡ Caricamento analytics...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards Principali */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Ricavi */}
            <div 
              className="card" 
              style={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: 'white', opacity: 0.9, marginBottom: '0.5rem' }}>Ricavi Totali</h4>
                  <h2 style={{ color: 'white', fontSize: '2rem', margin: 0 }}>
                    €{incomeStats ? parseFloat(incomeStats.totale).toLocaleString() : '0'}
                  </h2>
                </div>
                <div style={{ fontSize: '3rem' }}>💰</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ opacity: 0.75 }}>{incomeStats?.numero || 0} transazioni</small>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px',
                  fontSize: '0.875rem'
                }}>
                  +12%
                </span>
              </div>
            </div>

            {/* Spese */}
            <div 
              className="card" 
              style={{ 
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                color: 'white',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: 'white', opacity: 0.9, marginBottom: '0.5rem' }}>Spese Totali</h4>
                  <h2 style={{ color: 'white', fontSize: '2rem', margin: 0 }}>
                    €{stats ? parseFloat(stats.totale).toLocaleString() : '0'}
                  </h2>
                </div>
                <div style={{ fontSize: '3rem' }}>📊</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ opacity: 0.75 }}>{stats?.numero || 0} fatture</small>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px',
                  fontSize: '0.875rem'
                }}>
                  +8%
                </span>
              </div>
            </div>

            {/* Profitto */}
            <div 
              className="card" 
              style={{ 
                background: profit >= 0 ? 
                  'linear-gradient(135deg, #4facfe, #00f2fe)' : 
                  'linear-gradient(135deg, #fa709a, #fee140)',
                color: 'white',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: 'white', opacity: 0.9, marginBottom: '0.5rem' }}>Profitto Netto</h4>
                  <h2 style={{ color: 'white', fontSize: '2rem', margin: 0 }}>
                    €{profit.toLocaleString()}
                  </h2>
                </div>
                <div style={{ fontSize: '3rem' }}>{profit >= 0 ? '📈' : '📉'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ opacity: 0.75 }}>Margine di profitto</small>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px',
                  fontSize: '0.875rem'
                }}>
                  {profit >= 0 ? '+' : ''}{profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Sezione Principale: Chart + Attività Recenti */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Chart */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>📈 Andamento Finanziario</h3>
              <ExpensesChart expenses={expenses} />
            </div>

            {/* Attività Recenti */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>⚡ Attività Recenti</h3>
              {recentActivity.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentActivity.map((item, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: '#f9fafc',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>
                          {item.numero_fattura ? '🧾' : '💰'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                            {item.numero_fattura ? 'Spesa' : 'Incasso'}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                            {new Date(item.data_creazione || item.data_incasso).toLocaleDateString('it-IT')}
                          </div>
                        </div>
                      </div>
                      <span style={{ 
                        fontWeight: '600', 
                        color: item.numero_fattura ? '#ef4444' : '#10b981',
                        fontSize: '0.875rem'
                      }}>
                        {item.numero_fattura ? '-' : '+'}€{parseFloat(item.importo || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <p>Nessuna attività recente</p>
                </div>
              )}
            </div>
          </div>

          {/* Insights Rapidi */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h4>Metodo Preferito</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>POS</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <h4>Media Giornaliera</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>€{stats?.media_per_giorno || 0}</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h4>Obiettivo Mensile</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>85% raggiunto</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
              <h4>Score Finanziario</h4>
              <p style={{ color: '#10b981', fontWeight: '600', margin: 0 }}>Eccellente</p>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;