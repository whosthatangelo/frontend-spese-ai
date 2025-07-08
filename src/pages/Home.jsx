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
  const [lastRegisteredItem, setLastRegisteredItem] = useState(null);

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

  // Calcolo del totale mensile (ultimi 30 giorni)
  const calculateMonthlyTotal = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Qui dovresti filtrare per gli ultimi 30 giorni, per ora uso i totali esistenti
    const monthlyExpenses = parseFloat(quickStats.expenses?.totale || 0);
    const monthlyIncomes = parseFloat(quickStats.incomes?.totale || 0);
    return monthlyExpenses + monthlyIncomes;
  };

  const renderExpenseCard = (exp) => (
    <div className="col-12 mb-3" key={exp.id}>
      <div className="card hover-card">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2" style={{ width: '40px', height: '40px' }}>
                <span className="text-primary">🧾</span>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                  Fattura #{exp.numero_fattura || 'N/D'}
                </h6>
                {exp.data_fattura && (
                  <small className="text-muted">
                    📅 {new Date(exp.data_fattura).toLocaleDateString("it-IT")}
                  </small>
                )}
              </div>
            </div>
            <span className={`badge rounded-pill px-2 py-1 ${
              exp.stato === 'Pagata' ? 'bg-success' :
              exp.stato === 'In attesa' ? 'bg-warning' :
              exp.stato === 'Annullata' ? 'bg-danger' : 'bg-secondary'
            }`} style={{ fontSize: '0.75rem' }}>
              {exp.stato || 'N/D'}
            </span>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <small className="text-muted">💰 Importo</small>
              <div className="fw-bold text-danger" style={{ fontSize: '0.9rem' }}>
                -{exp.importo != null ? `€${parseFloat(exp.importo).toFixed(2)}` : 'N/D'}
              </div>
            </div>
            <div className="col-6">
              <small className="text-muted">🏢 {exp.azienda || 'N/D'}</small>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
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
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2" style={{ width: '40px', height: '40px' }}>
                <span className="text-success">💰</span>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-success" style={{ fontSize: '0.9rem' }}>
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

          <div className="row g-2">
            <div className="col-6">
              <small className="text-muted">💎 Importo</small>
              <div className="fw-bold text-success" style={{ fontSize: '0.9rem' }}>
                +{inc.importo != null ? `€${parseFloat(inc.importo).toFixed(2)}` : 'N/D'}
              </div>
            </div>
            <div className="col-6">
              <small className="text-muted">💳 Metodo</small>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
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
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-12">
            <div 
              className="card card-lg p-4 text-white text-center"
              style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                minHeight: '60vh'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
              <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>ExpenseAI</h1>
              <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '2rem' }}>
                L'assistente intelligente per la gestione di spese e incassi
              </p>
              <div style={{ 
                background: 'rgba(255,255,255,0.9)', 
                color: '#111827', 
                padding: '1rem', 
                borderRadius: '12px',
                display: 'inline-block',
                fontWeight: '600'
              }}>
                ⚠️ Seleziona un'azienda dal menu in alto per iniziare
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Compatto */}
      <section
        className="py-3 text-white mb-3"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          margin: "0 auto"
        }}
      >
        <div className="container text-center">
          <h1 style={{ fontSize: '1.75rem', color: 'white', marginBottom: '0.5rem' }}>💸 ExpenseAI</h1>
          <h2 style={{ fontSize: '1rem', color: 'white', opacity: 0.9, marginBottom: '1rem' }}>{company.nome}</h2>

          {/* Quick Stats Ultimi 30 giorni */}
          {quickStats.expenses && quickStats.incomes && (
            <div className="row g-2 justify-content-center">
              <div className="col-4">
                <div className="bg-danger bg-opacity-20 rounded-pill px-2 py-1">
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    €{parseFloat(quickStats.expenses.totale || 0).toLocaleString()}
                  </div>
                  <small style={{ fontSize: '0.7rem', opacity: 0.75 }}>Spese mese</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-success bg-opacity-20 rounded-pill px-2 py-1">
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    €{parseFloat(quickStats.incomes.totale || 0).toLocaleString()}
                  </div>
                  <small style={{ fontSize: '0.7rem', opacity: 0.75 }}>Incassi mese</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-white bg-opacity-20 rounded-pill px-2 py-1">
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    {((quickStats.expenses.numero || 0) + (quickStats.incomes.numero || 0))}
                  </div>
                  <small style={{ fontSize: '0.7rem', opacity: 0.75 }}>Operazioni</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container pb-3">
        <div className="row justify-content-center">
          <div className="col-12">

            {/* Centro di Registrazione Compatto */}
            <div className="card mb-3">
              <div className="card-header bg-gradient-primary text-white py-3 text-center">
                <h3 className="mb-0 text-white" style={{ fontSize: '1.1rem' }}>🎙️ Registra Spesa o Incasso</h3>
              </div>
              <div className="card-body p-3 text-center">
                <AudioRecorder 
                  company={company}
                  onRecordingChange={setIsRecording}
                  onAdd={(item) => {
                    // Mostra l'elemento appena registrato
                    setLastRegisteredItem(item);

                    // Aggiorna le liste
                    if (item.numero_fattura) {
                      setLatestExpenses(prev => [item, ...prev.slice(0, 2)]);
                    } else {
                      setLatestIncomes(prev => [item, ...prev.slice(0, 2)]);
                    }

                    // Nascondi il messaggio dopo 5 secondi
                    setTimeout(() => {
                      setLastRegisteredItem(null);
                    }, 5000);
                  }}
                />
              </div>
            </div>

            {/* Box Elemento Appena Registrato */}
            {lastRegisteredItem && (
              <div className="card mb-3 border-success">
                <div className="card-header bg-success bg-opacity-10 py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-success">✅ Appena Registrato</h6>
                    <button 
                      className="btn-close btn-close-sm"
                      onClick={() => setLastRegisteredItem(null)}
                    ></button>
                  </div>
                </div>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className={`rounded-circle p-2 me-3 ${
                      lastRegisteredItem.numero_fattura ? 'bg-primary bg-opacity-10' : 'bg-success bg-opacity-10'
                    }`} style={{ width: '40px', height: '40px' }}>
                      <span className={lastRegisteredItem.numero_fattura ? 'text-primary' : 'text-success'}>
                        {lastRegisteredItem.numero_fattura ? '🧾' : '💰'}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">
                        {lastRegisteredItem.numero_fattura ? 'Spesa' : 'Incasso'} - 
                        €{parseFloat(lastRegisteredItem.importo || 0).toFixed(2)}
                      </div>
                      <small className="text-muted">
                        {lastRegisteredItem.metodo_pagamento || lastRegisteredItem.metodo_incasso || 'N/D'}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ultimi Incassi e Spese */}
            {latestIncomes.length > 0 && (
              <div className="card mb-3">
                <div className="card-header bg-transparent py-2 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">💰 Ultimi Incassi</h6>
                    <Link to="/incassi" className="btn btn-sm btn-outline-success rounded-pill" style={{ fontSize: '0.75rem' }}>
                      Tutti
                    </Link>
                  </div>
                </div>
                <div className="card-body p-3">
                  <div className="row g-2">
                    {latestIncomes.map(renderIncomeCard)}
                  </div>
                </div>
              </div>
            )}

            {latestExpenses.length > 0 && (
              <div className="card mb-3">
                <div className="card-header bg-transparent py-2 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">🧾 Ultime Spese</h6>
                    <Link to="/spese" className="btn btn-sm btn-outline-primary rounded-pill" style={{ fontSize: '0.75rem' }}>
                      Tutte
                    </Link>
                  </div>
                </div>
                <div className="card-body p-3">
                  <div className="row g-2">
                    {latestExpenses.map(renderExpenseCard)}
                  </div>
                </div>
              </div>
            )}

            {/* Menu Azioni - Compatto */}
            <div className="row g-3">
              <div className="col-4">
                <Link to="/spese" className="card text-decoration-none h-100 hover-card">
                  <div className="card-body text-center p-3">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧾</div>
                    <h6 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Spese</h6>
                    <span className="badge bg-primary rounded-pill" style={{ fontSize: '0.7rem' }}>
                      {latestExpenses.length}
                    </span>
                  </div>
                </Link>
              </div>
              <div className="col-4">
                <Link to="/incassi" className="card text-decoration-none h-100 hover-card">
                  <div className="card-body text-center p-3">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                    <h6 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Incassi</h6>
                    <span className="badge bg-success rounded-pill" style={{ fontSize: '0.7rem' }}>
                      {latestIncomes.length}
                    </span>
                  </div>
                </Link>
              </div>
              <div className="col-4">
                <Link to="/dashboard" className="card text-decoration-none h-100 hover-card">
                  <div className="card-body text-center p-3">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                    <h6 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Analytics</h6>
                    <span className="badge bg-info rounded-pill" style={{ fontSize: '0.7rem' }}>
                      Live
                    </span>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Home;