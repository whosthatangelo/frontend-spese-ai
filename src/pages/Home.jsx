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
  const [isRecording, setIsRecording] = useState(false);

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
    <div className="col-12 mb-3" key={exp.id}>
      <div className="card hover-card">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                <span className="text-primary">🧾</span>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-primary">
                  Fattura #{exp.numero_fattura || 'N/D'}
                </h6>
                {exp.data_fattura && (
                  <small className="text-muted">
                    📅 {new Date(exp.data_fattura).toLocaleDateString("it-IT")}
                  </small>
                )}
              </div>
            </div>
            <span className={`badge rounded-pill px-3 py-2 ${
              exp.stato === 'Pagata' ? 'bg-success' :
              exp.stato === 'In attesa' ? 'bg-warning' :
              exp.stato === 'Annullata' ? 'bg-danger' : 'bg-secondary'
            }`}>
              {exp.stato || 'N/D'}
            </span>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <small className="text-muted">💰 Importo</small>
                </div>
              </div>
              <div className="fw-bold text-danger fs-6">
                -{exp.importo != null ? `€${parseFloat(exp.importo).toFixed(2)}` : 'N/D'}
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <small className="text-muted">🏢 {exp.azienda || 'N/D'}</small>
                </div>
              </div>
              <div className="small text-muted">
                {exp.metodo_pagamento || 'Metodo N/D'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomeCard = (inc) => (
    <div className="col-12 mb-3" key={inc.id}>
      <div className="card hover-card">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <span className="text-success">💰</span>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-success">
                  Incasso #{inc.id}
                </h6>
                {inc.data_incasso && (
                  <small className="text-muted">
                    📅 {new Date(inc.data_incasso).toLocaleDateString("it-IT")}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <small className="text-muted">💎 Importo</small>
                </div>
              </div>
              <div className="fw-bold text-success fs-6">
                +{inc.importo != null ? `€${parseFloat(inc.importo).toFixed(2)}` : 'N/D'}
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <small className="text-muted">💳 Metodo</small>
                </div>
              </div>
              <div className="small text-muted">
                {inc.metodo_incasso || 'N/D'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // No company state
  if (!company) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Hero Section senza azienda */}
            <section
              className="py-5 text-white mb-5 position-relative overflow-hidden card-lg"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              <div className="position-absolute top-0 end-0 opacity-10">
                <div style={{ fontSize: '8rem', transform: 'rotate(15deg)' }}>🤖</div>
              </div>
              <div className="container text-center position-relative">
                <div className="display-1 mb-4">💸</div>
                <h1 className="display-4 fw-bold mb-4">ExpenseAI</h1>
                <p className="lead mb-4 opacity-90">
                  L'assistente intelligente per la gestione di spese e incassi
                </p>
                <div className="row g-3 justify-content-center mb-4">
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>🎙️ Registrazione vocale</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>🤖 AI-Powered</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>📊 Analytics Real-time</span>
                    </div>
                  </div>
                </div>
                <div className="alert alert-warning d-inline-block bg-white bg-opacity-90 text-dark border-0 rounded-pill px-4 py-3">
                  <strong>⚠️ Seleziona un'azienda</strong> dal menu in alto per iniziare
                </div>
              </div>
            </section>

            {/* Features Preview */}
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card text-center p-4 h-100 hover-card">
                  <div className="display-6 mb-3">🎙️</div>
                  <h5>Registrazione Vocale</h5>
                  <p className="text-muted">Parla naturalmente per registrare spese e incassi</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center p-4 h-100 hover-card">
                  <div className="display-6 mb-3">📊</div>
                  <h5>Dashboard Avanzata</h5>
                  <p className="text-muted">Analytics e statistiche in tempo reale</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center p-4 h-100 hover-card">
                  <div className="display-6 mb-3">🤖</div>
                  <h5>AI Intelligente</h5>
                  <p className="text-muted">Riconoscimento automatico di categorie e importi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section Potenziata */}
      <section
        className="py-5 text-white mb-5 position-relative overflow-hidden card-lg"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* Decorazioni animate */}
        <div className="position-absolute top-0 end-0 opacity-10">
          <div style={{ fontSize: '6rem', transform: 'rotate(15deg)', animation: 'float 6s ease-in-out infinite' }}>🚀</div>
        </div>
        <div className="position-absolute bottom-0 start-0 opacity-05">
          <div style={{ fontSize: '8rem', transform: 'rotate(-15deg)' }}>💡</div>
        </div>

        <div className="container text-center position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">💸 ExpenseAI</h1>
              <h2 className="h4 mb-3 opacity-90">{company.nome}</h2>
              <p className="lead mb-4 opacity-75">
                Il tuo assistente AI per gestire spese e incassi con la voce
              </p>

              {/* Quick Stats */}
              {quickStats.expenses && quickStats.incomes && (
                <div className="row g-3 justify-content-center">
                  <div className="col-auto">
                    <div className="bg-danger bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>€{parseFloat(quickStats.expenses.totale || 0).toLocaleString()}</strong>
                      <small className="ms-2 opacity-75">Spese</small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-success bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>€{parseFloat(quickStats.incomes.totale || 0).toLocaleString()}</strong>
                      <small className="ms-2 opacity-75">Incassi</small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>{((quickStats.expenses.numero || 0) + (quickStats.incomes.numero || 0))}</strong>
                      <small className="ms-2 opacity-75">Totali</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="display-1 mb-3">🎙️</div>
                <p className="opacity-75">Parla e registra automaticamente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">

            {/* Sezione Registrazione Potenziata */}
            <div className="card mb-5 overflow-hidden">
              <div className="card-header bg-gradient-primary text-white py-4">
                <div className="row align-items-center">
                  <div className="col">
                    <h3 className="mb-1 text-white">🎙️ Centro di Registrazione</h3>
                    <p className="mb-0 opacity-90">Parla naturalmente per registrare spese e incassi</p>
                  </div>
                  <div className="col-auto">
                    <div className={`badge rounded-pill px-3 py-2 ${isRecording ? 'bg-danger' : 'bg-success bg-opacity-20'}`}>
                      {isRecording ? '🔴 Registrando...' : '✅ Pronto'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                <AudioRecorder 
                  company={company}
                  onRecordingChange={setIsRecording}
                  onAdd={(item) => {
                    if (item.numero_fattura) {
                      setLatestExpenses(prev => [item, ...prev.slice(0, 2)]);
                    } else {
                      setLatestIncomes(prev => [item, ...prev.slice(0, 2)]);
                    }
                  }}
                />

                {/* Suggerimenti AI */}
                <div className="row g-3 mt-3">
                  <div className="col-md-4">
                    <div className="card bg-light rounded-3 p-3 text-center">
                      <div className="small text-muted mb-1">💡 Esempio Spesa</div>
                      <div className="small">"Spesa di oggi 50 euro contanti per benzina"</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light rounded-3 p-3 text-center">
                      <div className="small text-muted mb-1">💡 Esempio Incasso</div>
                      <div className="small">"Incasso di ieri 200 euro POS"</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light rounded-3 p-3 text-center">
                      <div className="small text-muted mb-1">🤖 AI Tip</div>
                      <div className="small">Parla chiaramente per risultati migliori</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Quick Access */}
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <Link to="/spese" className="card text-decoration-none h-100 hover-card">
                  <div className="card-body text-center p-4">
                    <div className="display-6 mb-3">🧾</div>
                    <h5 className="text-dark">Gestisci Spese</h5>
                    <p className="text-muted small mb-3">Visualizza e modifica tutte le spese</p>
                    <span className="badge bg-primary rounded-pill">{latestExpenses.length} recenti</span>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/incassi" className="card text-decoration-none h-100 hover-card">
                  <div className="card-body text-center p-4">
                    <div className="display-6 mb-3">💰</div>
                    <h5 className="text-dark">Gestisci Incassi</h5>
                    <p className="text-muted small mb-3">Visualizza e modifica tutti gli incassi</p>
                    <span className="badge bg-success rounded-pill">{latestIncomes.length} recenti</span>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/dashboard" className="card text-decoration-none h-100 hover-card">
                  <div className="card-body text-center p-4">
                    <div className="display-6 mb-3">📊</div>
                    <h5 className="text-dark">Analytics</h5>
                    <p className="text-muted small mb-3">Dashboard con statistiche avanzate</p>
                    <span className="badge bg-info rounded-pill">Live</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Ultimi Incassi */}
            {latestIncomes.length > 0 && (
              <div className="card mb-4">
                <div className="card-header bg-transparent pt-4 px-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">💰 Ultimi Incassi</h5>
                    <Link to="/incassi" className="btn btn-sm btn-outline-success rounded-pill">
                      Vedi tutti
                    </Link>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {latestIncomes.map(renderIncomeCard)}
                  </div>
                </div>
              </div>
            )}

            {/* Ultime Spese */}
            {latestExpenses.length > 0 && (
              <div className="card mb-4">
                <div className="card-header bg-transparent pt-4 px-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">🧾 Ultime Spese</h5>
                    <Link to="/spese" className="btn btn-sm btn-outline-primary rounded-pill">
                      Vedi tutte
                    </Link>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {latestExpenses.map(renderExpenseCard)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;