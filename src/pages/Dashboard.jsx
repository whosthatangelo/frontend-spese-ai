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
  const [selectedPeriod, setSelectedPeriod] = useState('month');

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
    (parseFloat(incomeStats.totale || 0) - parseFloat(stats.totale || 0)) : 0;

  const profitMargin = incomeStats && stats && parseFloat(incomeStats.totale || 0) > 0 ? 
    ((parseFloat(incomeStats.totale || 0) - parseFloat(stats.totale || 0)) / parseFloat(incomeStats.totale || 0) * 100) : 0;

  const recentActivity = [...(expenses || []), ...(incomes || [])]
    .sort((a, b) => new Date(b.data_creazione || b.data_incasso || b.data_fattura) - new Date(a.data_creazione || a.data_incasso || a.data_fattura))
    .slice(0, 5);

  if (!company) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <section
              className="py-5 text-white mb-5 position-relative overflow-hidden card-lg"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              <div className="position-absolute top-0 end-0 opacity-10">
                <div style={{ 
                  fontSize: '8rem', 
                  transform: 'rotate(15deg)',
                  animation: 'float 6s ease-in-out infinite'
                }}>📊</div>
              </div>
              <div className="container text-center position-relative">
                <div className="display-1 mb-4">📊</div>
                <h1 className="display-4 fw-bold mb-4">Business Analytics</h1>
                <p className="lead mb-4 opacity-90">
                  Seleziona un'azienda dal menu in alto per visualizzare le analytics
                </p>
                <div className="row g-3 justify-content-center mb-4">
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>📈 Grafici avanzati</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>💰 KPI in tempo reale</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>🎯 Insights automatici</span>
                    </div>
                  </div>
                </div>
                <div className="alert alert-warning d-inline-block bg-white bg-opacity-90 text-dark border-0 rounded-pill px-4 py-3">
                  <strong>⚠️ Seleziona un'azienda</strong> dal menu in alto per iniziare
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Coerente con Home */}
      <section
        className="py-4 text-white mb-4 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          margin: "0 auto"
        }}
      >
        {/* Decorazioni animate */}
        <div className="position-absolute top-0 end-0 opacity-10">
          <div style={{ 
            fontSize: '4rem', 
            transform: 'rotate(15deg)', 
            animation: 'float 6s ease-in-out infinite' 
          }}>📊</div>
        </div>
        <div className="position-absolute bottom-0 start-0 opacity-05">
          <div style={{ 
            fontSize: '5rem', 
            transform: 'rotate(-15deg)',
            animation: 'float 8s ease-in-out infinite reverse'
          }}>📈</div>
        </div>

        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>📊 Business Analytics</h1>
              <h2 style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9 }}>{company.nome}</h2>
            </div>
            <div className="col-md-4 text-md-end">
              <select 
                className="form-select form-select-sm bg-white bg-opacity-20 text-white border-0"
                style={{ fontSize: '0.85rem', maxWidth: '150px', marginLeft: 'auto' }}
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value)}
              >
                <option value="week">Settimana</option>
                <option value="month">Mese</option>
                <option value="quarter">Trimestre</option>
                <option value="year">Anno</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-3">
        <div className="row justify-content-center">
          <div className="col-12">

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                <p className="lead">⚡ Caricamento analytics...</p>
              </div>
            ) : (
              <>
                {/* KPI Cards Compatte */}
                <div className="row g-3 mb-4">
                  <div className="col-lg-4 col-md-6">
                    <div className="card text-white border-0 hover-card" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="opacity-90">💰 Ricavi Totali</small>
                            <h4 className="mb-0 fw-bold">€{incomeStats ? parseFloat(incomeStats.totale || 0).toLocaleString() : '0'}</h4>
                          </div>
                          <div className="text-end">
                            <div className="badge bg-white bg-opacity-20 rounded-pill mb-1">+12%</div>
                            <small className="opacity-75 d-block">{incomeStats?.numero || 0} incassi</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="card text-white border-0 hover-card" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="opacity-90">🧾 Spese Totali</small>
                            <h4 className="mb-0 fw-bold">€{stats ? parseFloat(stats.totale || 0).toLocaleString() : '0'}</h4>
                          </div>
                          <div className="text-end">
                            <div className="badge bg-white bg-opacity-20 rounded-pill mb-1">+8%</div>
                            <small className="opacity-75 d-block">{stats?.numero || 0} fatture</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className={`card text-white border-0 hover-card`} style={{ 
                      background: profit >= 0 ? 
                        'linear-gradient(135deg, #4facfe, #00f2fe)' : 
                        'linear-gradient(135deg, #fa709a, #fee140)'
                    }}>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="opacity-90">{profit >= 0 ? '📈' : '📉'} Profitto Netto</small>
                            <h4 className="mb-0 fw-bold">€{profit.toLocaleString()}</h4>
                          </div>
                          <div className="text-end">
                            <div className="badge bg-white bg-opacity-20 rounded-pill mb-1">
                              {profitMargin.toFixed(1)}%
                            </div>
                            <small className="opacity-75 d-block">margine</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grafico e Attività */}
                <div className="row g-4 mb-4">
                  <div className="col-lg-8">
                    <div className="card hover-card">
                      <div className="card-header bg-transparent py-2 px-3">
                        <h6 className="mb-0">📈 Andamento Finanziario</h6>
                      </div>
                      <div className="card-body p-3">
                        <ExpensesChart expenses={expenses} />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="card hover-card h-100">
                      <div className="card-header bg-transparent py-2 px-3">
                        <h6 className="mb-0">⚡ Attività Recenti</h6>
                      </div>
                      <div className="card-body p-3">
                        {recentActivity.length > 0 ? (
                          <div className="space-y-3">
                            {recentActivity.map((item, idx) => (
                              <div key={idx} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <div className="d-flex align-items-center">
                                  <div className={`rounded-circle p-1 me-2 ${item.numero_fattura ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10'}`} style={{ width: '30px', height: '30px' }}>
                                    <span style={{ fontSize: '0.8rem' }}>{item.numero_fattura ? '🧾' : '💰'}</span>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                      {item.numero_fattura ? 'Spesa' : 'Incasso'}
                                    </div>
                                    <small className="text-muted">
                                      {new Date(item.data_creazione || item.data_incasso || item.data_fattura).toLocaleDateString('it-IT')}
                                    </small>
                                  </div>
                                </div>
                                <span className={`fw-bold ${item.numero_fattura ? 'text-danger' : 'text-success'}`} style={{ fontSize: '0.85rem' }}>
                                  {item.numero_fattura ? '-' : '+'}€{parseFloat(item.importo || 0).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted">
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>📋</div>
                            <p style={{ fontSize: '0.9rem' }}>Nessuna attività recente</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights Compatti */}
                <div className="row g-3">
                  <div className="col-lg-3 col-md-6">
                    <div className="card text-center p-3 hover-card">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
                      <h6 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Metodo Preferito</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>POS</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="card text-center p-3 hover-card">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                      <h6 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Media Giornaliera</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>€{stats?.media_per_giorno || 0}</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="card text-center p-3 hover-card">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                      <h6 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Obiettivo Mensile</h6>
                      <p className="text-warning mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>85% raggiunto</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="card text-center p-3 hover-card">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                      <h6 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Score Finanziario</h6>
                      <p className="text-success mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Eccellente</p>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* CSS per le animazioni */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(15deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }

        .hover-card {
          transition: all 0.3s ease;
        }

        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
      `}</style>
    </>
  );
}

export default Dashboard;