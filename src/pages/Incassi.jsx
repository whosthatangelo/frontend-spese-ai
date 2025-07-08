// src/pages/Incassi.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IncomeList from '../components/IncomeList';
import { useUserCompany } from '../contexts/UserCompanyContext';
import { getIncomeStats } from '../api';

function Incassi() {
  const { company } = useUserCompany();
  const [listKey, setListKey] = useState(0);
  const [quickStats, setQuickStats] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // cards | table

  // Ricarica la lista quando cambia l'azienda
  useEffect(() => {
    if (company) {
      setListKey((k) => k + 1);
      loadQuickStats();
    }
  }, [company]);

  const loadQuickStats = async () => {
    try {
      const stats = await getIncomeStats();
      setQuickStats(stats);
    } catch (err) {
      console.error('Errore caricamento statistiche rapide:', err);
    }
  };

  // Se non è stata ancora selezionata un'azienda
  if (!company) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card border-0 shadow-lg p-5" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', borderRadius: '24px' }}>
              <div className="display-1 mb-4">💰</div>
              <h2 className="mb-3">Gestione Incassi</h2>
              <p className="lead opacity-90 mb-4">
                Seleziona un'azienda dal menu in alto per iniziare a gestire gli incassi
              </p>
              <div className="d-flex justify-content-center gap-3">
                <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                  ✨ Registrazione vocale
                </span>
                <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                  📊 Analytics avanzate
                </span>
                <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                  💳 Multi-metodo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Potenziato */}
      <section
        className="py-5 text-white mb-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          borderRadius: "24px",
          margin: "0 auto",
          maxWidth: "1200px",
          boxShadow: "0 20px 40px rgba(22, 163, 74, 0.3)"
        }}
      >
        {/* Decorazioni di sfondo */}
        <div className="position-absolute top-0 end-0 opacity-10">
          <div style={{ fontSize: '8rem', transform: 'rotate(15deg)' }}>💰</div>
        </div>
        <div className="position-absolute bottom-0 start-0 opacity-05">
          <div style={{ fontSize: '12rem', transform: 'rotate(-15deg)' }}>💎</div>
        </div>

        <div className="container text-center position-relative">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto">
              <h1 className="display-4 fw-bold mb-3">
                💰 Centro Incassi
              </h1>
              <h2 className="h4 mb-3 opacity-90">{company.nome}</h2>
              <p className="lead mb-4 opacity-75">
                Gestione intelligente degli incassi con analytics in tempo reale
              </p>

              {/* Quick Stats */}
              {quickStats && (
                <div className="row g-3 justify-content-center">
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>€{parseFloat(quickStats.totale || 0).toLocaleString()}</strong>
                      <small className="ms-2 opacity-75">Totale</small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>{quickStats.numero || 0}</strong>
                      <small className="ms-2 opacity-75">Incassi</small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>€{quickStats.media_per_giorno || 0}</strong>
                      <small className="ms-2 opacity-75">Media/giorno</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mb-5">
        {/* Barra Azioni */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body py-3">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="d-flex gap-3">
                  <Link to="/" className="btn btn-success rounded-pill">
                    🎙️ Nuovo Incasso
                  </Link>
                  <button 
                    className="btn btn-outline-success rounded-pill"
                    onClick={() => setListKey(k => k + 1)}
                  >
                    🔄 Aggiorna
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-2 justify-content-md-end">
                  {/* Filtro Periodo */}
                  <select 
                    className="form-select form-select-sm"
                    style={{ maxWidth: '150px' }}
                    value={filterPeriod}
                    onChange={e => setFilterPeriod(e.target.value)}
                  >
                    <option value="all">Tutti i periodi</option>
                    <option value="today">Oggi</option>
                    <option value="week">Questa settimana</option>
                    <option value="month">Questo mese</option>
                    <option value="quarter">Questo trimestre</option>
                  </select>

                  {/* Toggle Vista */}
                  <div className="btn-group btn-group-sm" role="group">
                    <button 
                      type="button" 
                      className={`btn ${viewMode === 'cards' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setViewMode('cards')}
                      title="Vista Card"
                    >
                      🔲
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${viewMode === 'table' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setViewMode('table')}
                      title="Vista Tabella"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista Incassi Potenziata */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📈 Registro Completo</h5>
              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                {quickStats?.numero || 0} incassi registrati
              </span>
            </div>
          </div>
          <div className="card-body p-4">
            <IncomeList
              key={listKey}
              onAction={() => {
                setListKey((k) => k + 1);
                loadQuickStats();
              }}
              viewMode={viewMode}
              filterPeriod={filterPeriod}
            />
          </div>
        </div>

        {/* Azioni Rapide */}
        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="card border-0 bg-light rounded-4 text-center p-4">
              <div className="display-6 mb-3">📊</div>
              <h6>Analisi Dettagliate</h6>
              <p className="text-muted small mb-3">Visualizza report e statistiche avanzate</p>
              <Link to="/dashboard" className="btn btn-sm btn-outline-success rounded-pill">
                Vai alla Dashboard
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light rounded-4 text-center p-4">
              <div className="display-6 mb-3">📤</div>
              <h6>Export Dati</h6>
              <p className="text-muted small mb-3">Scarica incassi in formato Excel/PDF</p>
              <button className="btn btn-sm btn-outline-success rounded-pill">
                Download
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light rounded-4 text-center p-4">
              <div className="display-6 mb-3">🔔</div>
              <h6>Notifiche</h6>
              <p className="text-muted small mb-3">Imposta alert per obiettivi mensili</p>
              <button className="btn btn-sm btn-outline-success rounded-pill">
                Configura
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Incassi;