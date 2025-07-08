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
    (parseFloat(incomeStats.totale) - parseFloat(stats.totale)) : 0;

  const profitMargin = incomeStats && stats && parseFloat(incomeStats.totale) > 0 ? 
    ((parseFloat(incomeStats.totale) - parseFloat(stats.totale)) / parseFloat(incomeStats.totale) * 100) : 0;

  const recentActivity = [...(expenses || []), ...(incomes || [])]
    .sort((a, b) => new Date(b.data_creazione || b.data_incasso) - new Date(a.data_creazione || a.data_incasso))
    .slice(0, 5);

  if (!company) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-lg p-5" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
          <div className="mb-4">
            <div className="display-1 mb-3">🏢</div>
            <h2 className="text-muted">Seleziona un'azienda</h2>
            <p className="lead text-muted">Scegli un'azienda dal selettore in alto per visualizzare analytics avanzate.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header con Gradient Animato */}
      <section
        className="py-5 text-white mb-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px",
          margin: "0 auto",
          maxWidth: "1200px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
        }}
      >
        <div className="position-absolute top-0 end-0 p-3">
          <select 
            className="form-select form-select-sm bg-white bg-opacity-20 text-white border-0"
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Ultima settimana</option>
            <option value="month">Ultimo mese</option>
            <option value="quarter">Ultimo trimestre</option>
            <option value="year">Ultimo anno</option>
          </select>
        </div>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">📊 Business Analytics</h1>
          <h2 className="h4 mb-2">{company.nome}</h2>
          <p className="lead opacity-90">Dashboard avanzata con insights in tempo reale</p>
        </div>
      </section>

      <div className="container mb-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
            <p className="lead">⚡ Caricamento analytics...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards Avanzate */}
            <div className="row g-4 mb-5">
              {[
                {
                  title: 'Ricavi Totali',
                  value: incomeStats ? `€${parseFloat(incomeStats.totale).toLocaleString()}` : '€0',
                  icon: '💰',
                  trend: '+12%',
                  bg: 'linear-gradient(135deg, #667eea, #764ba2)',
                  subtitle: `${incomeStats?.numero || 0} transazioni`
                },
                {
                  title: 'Spese Totali', 
                  value: stats ? `€${parseFloat(stats.totale).toLocaleString()}` : '€0',
                  icon: '📊',
                  trend: '+8%',
                  bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  subtitle: `${stats?.numero || 0} fatture`
                },
                {
                  title: 'Profitto Netto',
                  value: `€${profit.toLocaleString()}`,
                  icon: profit >= 0 ? '📈' : '📉',
                  trend: `${profit >= 0 ? '+' : ''}${profitMargin.toFixed(1)}%`,
                  bg: profit >= 0 ? 
                    'linear-gradient(135deg, #4facfe, #00f2fe)' : 
                    'linear-gradient(135deg, #fa709a, #fee140)',
                  subtitle: 'Margine di profitto'
                }
              ].map((card, idx) => (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div 
                    className="card border-0 text-white shadow-lg h-100 position-relative overflow-hidden"
                    style={{ 
                      background: card.bg,
                      borderRadius: '20px',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="opacity-90 mb-1">{card.title}</h6>
                          <h3 className="fw-bold mb-0">{card.value}</h3>
                        </div>
                        <div className="display-6">{card.icon}</div>
                      </div>
                      <div className="d-flex justify-content-between align-items-end">
                        <small className="opacity-75">{card.subtitle}</small>
                        <span className="badge bg-white bg-opacity-20 rounded-pill">
                          {card.trend}
                        </span>
                      </div>
                    </div>
                    <div 
                      className="position-absolute bottom-0 start-0 w-100 opacity-10"
                      style={{ height: '40px', background: 'white' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistiche Dettagliate */}
            <div className="row g-4 mb-5">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-header bg-transparent border-0 pt-4 px-4">
                    <h5 className="mb-0">📈 Andamento Finanziario</h5>
                  </div>
                  <div className="card-body p-4">
                    <ExpensesChart expenses={expenses} />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-header bg-transparent border-0 pt-4 px-4">
                    <h5 className="mb-0">⚡ Attività Recenti</h5>
                  </div>
                  <div className="card-body p-4">
                    {recentActivity.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {recentActivity.map((item, idx) => (
                          <div key={idx} className="list-group-item border-0 px-0 py-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  {item.numero_fattura ? '🧾' : '💰'}
                                </div>
                                <div>
                                  <div className="fw-medium">
                                    {item.numero_fattura ? 'Spesa' : 'Incasso'}
                                  </div>
                                  <small className="text-muted">
                                    {new Date(item.data_creazione || item.data_incasso).toLocaleDateString('it-IT')}
                                  </small>
                                </div>
                              </div>
                              <span className={`fw-bold ${item.numero_fattura ? 'text-danger' : 'text-success'}`}>
                                {item.numero_fattura ? '-' : '+'}€{parseFloat(item.importo || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted">
                        <div className="display-6 mb-2">📋</div>
                        <p>Nessuna attività recente</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Rapidi */}
            <div className="row g-4">
              <div className="col-md-3">
                <div className="card border-0 bg-light rounded-4 text-center p-3">
                  <div className="display-6 mb-2">💳</div>
                  <h6>Metodo Preferito</h6>
                  <p className="text-muted mb-0">POS</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-light rounded-4 text-center p-3">
                  <div className="display-6 mb-2">📅</div>
                  <h6>Media Giornaliera</h6>
                  <p className="text-muted mb-0">€{stats?.media_per_giorno || 0}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-light rounded-4 text-center p-3">
                  <div className="display-6 mb-2">🎯</div>
                  <h6>Obiettivo Mensile</h6>
                  <p className="text-muted mb-0">85% raggiunto</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 bg-light rounded-4 text-center p-3">
                  <div className="display-6 mb-2">⭐</div>
                  <h6>Score Finanziario</h6>
                  <p className="text-success mb-0 fw-bold">Eccellente</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;