// src/pages/Spese.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExpenseList from '../components/ExpenseList';
import { useUserCompany } from '../contexts/UserCompanyContext';
import { getStats } from '../api';

function Spese() {
  const { company } = useUserCompany();
  const [listKey, setListKey] = useState(0);
  const [quickStats, setQuickStats] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Ricarica la lista ogni volta che cambio azienda
  useEffect(() => {
    if (company) {
      setListKey((k) => k + 1);
      loadQuickStats();
    }
  }, [company]);

  const loadQuickStats = async () => {
    try {
      const stats = await getStats();
      setQuickStats(stats);
    } catch (err) {
      console.error('Errore caricamento statistiche rapide:', err);
    }
  };

  // Se non è selezionata nessuna azienda
  if (!company) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <section
              className="py-5 text-white mb-5 position-relative overflow-hidden card-lg"
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              }}
            >
              <div className="position-absolute top-0 end-0 opacity-10">
                <div style={{ 
                  fontSize: '8rem', 
                  transform: 'rotate(15deg)',
                  animation: 'float 6s ease-in-out infinite'
                }}>🧾</div>
              </div>
              <div className="container text-center position-relative">
                <div className="display-1 mb-4">🧾</div>
                <h1 className="display-4 fw-bold mb-4">Gestione Spese</h1>
                <p className="lead mb-4 opacity-90">
                  Seleziona un'azienda dal menu in alto per gestire le spese
                </p>
                <div className="row g-3 justify-content-center mb-4">
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>🎙️ Registrazione vocale</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>✏️ Modifica facile</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <span>🔍 Filtri avanzati</span>
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
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          borderRadius: "16px",
          margin: "0 auto"
        }}
      >
        {/* Decorazioni animate come nella Home */}
        <div className="position-absolute top-0 end-0 opacity-10">
          <div style={{ 
            fontSize: '4rem', 
            transform: 'rotate(15deg)', 
            animation: 'float 6s ease-in-out infinite' 
          }}>🧾</div>
        </div>
        <div className="position-absolute bottom-0 start-0 opacity-05">
          <div style={{ 
            fontSize: '5rem', 
            transform: 'rotate(-15deg)',
            animation: 'float 8s ease-in-out infinite reverse'
          }}>💰</div>
        </div>

        <div className="container text-center position-relative">
          <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>🧾 Gestione Spese</h1>
          <h2 style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9, marginBottom: '1rem' }}>{company.nome}</h2>

          {/* Quick Stats reali - solo se abbiamo dati */}
          {quickStats && (
            <div className="row g-2 justify-content-center">
              <div className="col-4">
                <div className="bg-danger bg-opacity-20 rounded-pill px-3 py-2">
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                    €{parseFloat(quickStats.totale || 0).toLocaleString()}
                  </div>
                  <small style={{ fontSize: '0.75rem', opacity: 0.85 }}>Totale</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-warning bg-opacity-20 rounded-pill px-3 py-2">
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                    {quickStats.numero || 0}
                  </div>
                  <small style={{ fontSize: '0.75rem', opacity: 0.85 }}>Fatture</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-info bg-opacity-20 rounded-pill px-3 py-2">
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                    €{quickStats.numero > 0 ? (parseFloat(quickStats.totale || 0) / quickStats.numero).toFixed(0) : '0'}
                  </div>
                  <small style={{ fontSize: '0.75rem', opacity: 0.85 }}>Media</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container pb-3">
        <div className="row justify-content-center">
          <div className="col-12">

            {/* Barra Controlli Essenziali */}
            <div className="card mb-4">
              <div className="card-body p-3">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="d-flex gap-2 flex-wrap">
                      <Link to="/" className="btn btn-primary rounded-pill" style={{ fontSize: '0.9rem' }}>
                        🎙️ Nuova Spesa
                      </Link>
                      <button 
                        className="btn btn-outline-primary rounded-pill"
                        style={{ fontSize: '0.9rem' }}
                        onClick={() => {
                          setListKey(k => k + 1);
                          loadQuickStats();
                        }}
                      >
                        🔄 Aggiorna
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                      {/* Filtro Periodo */}
                      <select 
                        className="form-select form-select-sm"
                        style={{ maxWidth: '140px', fontSize: '0.85rem' }}
                        value={filterPeriod}
                        onChange={e => setFilterPeriod(e.target.value)}
                      >
                        <option value="all">📅 Tutti</option>
                        <option value="today">Oggi</option>
                        <option value="week">Settimana</option>
                        <option value="month">Mese</option>
                        <option value="year">Anno</option>
                      </select>

                      {/* Ordinamento */}
                      <select 
                        className="form-select form-select-sm"
                        style={{ maxWidth: '140px', fontSize: '0.85rem' }}
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                      >
                        <option value="date_desc">📅 Recenti</option>
                        <option value="date_asc">📅 Vecchie</option>
                        <option value="amount_desc">💰 Importo ↓</option>
                        <option value="amount_asc">💰 Importo ↑</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista Spese - Focus Principale */}
            <div className="card">
              <div className="card-header bg-transparent py-2 px-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">📋 Elenco Spese</h6>
                  {quickStats && (
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill" style={{ fontSize: '0.75rem' }}>
                      {quickStats.numero || 0} totali
                    </span>
                  )}
                </div>
              </div>
              <div className="card-body p-3">
                <ExpenseList 
                  key={listKey}
                  filterPeriod={filterPeriod}
                  sortBy={sortBy}
                  onUpdate={() => {
                    setListKey(k => k + 1);
                    loadQuickStats();
                  }}
                />
              </div>
            </div>

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
      `}</style>
    </>
  );
}

export default Spese;