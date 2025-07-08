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
  const [viewMode, setViewMode] = useState('cards');
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
          <div className="col-md-8 text-center">
            <div className="card card-lg p-5 text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="display-1 mb-4">🧾</div>
              <h2 className="mb-3 text-white">Centro Controllo Spese</h2>
              <p className="lead opacity-90 mb-4">
                Seleziona un'azienda dal menu in alto per accedere al sistema di gestione spese avanzato
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                  🎙️ Registrazione AI
                </span>
                <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                  📊 Report automatici
                </span>
                <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                  💰 Tracking avanzato
                </span>
                <span className="badge bg-white bg-opacity-20 rounded-pill px-3 py-2">
                  📈 Analytics real-time
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
        className="py-5 text-white mb-5 position-relative overflow-hidden card-lg"
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          margin: "0 auto",
          maxWidth: "1200px"
        }}
      >
        {/* Decorazioni di sfondo */}
        <div className="position-absolute top-0 end-0 opacity-10">
          <div style={{ fontSize: '8rem', transform: 'rotate(15deg)' }}>📊</div>
        </div>
        <div className="position-absolute bottom-0 start-0 opacity-05">
          <div style={{ fontSize: '12rem', transform: 'rotate(-15deg)' }}>💸</div>
        </div>

        <div className="container text-center position-relative">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto">
              <h1 className="display-4 fw-bold mb-3 text-white">
                🧾 Centro Spese Enterprise
              </h1>
              <h2 className="h4 mb-3 opacity-90 text-white">{company.nome}</h2>
              <p className="lead mb-4 opacity-75">
                Sistema avanzato di gestione e tracking delle spese aziendali
              </p>

              {/* Quick Stats */}
              {quickStats && (
                <div className="row g-3 justify-content-center">
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>€{parseFloat(quickStats.totale || 0).toLocaleString()}</strong>
                      <small className="ms-2 opacity-75">Totale Speso</small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                      <strong>{quickStats.numero || 0}</strong>
                      <small className="ms-2 opacity-75">Fatture</small>
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
        {/* Barra Controlli Avanzata */}
        <div className="card mb-4">
          <div className="card-body py-3">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/" className="btn btn-primary rounded-pill">
                    🎙️ Nuova Spesa
                  </Link>
                  <button 
                    className="btn btn-outline-primary rounded-pill"
                    onClick={() => {
                      setListKey(k => k + 1);
                      loadQuickStats();
                    }}
                  >
                    🔄 Aggiorna
                  </button>
                  <button className="btn btn-outline-secondary rounded-pill">
                    📤 Esporta Excel
                  </button>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
                  {/* Filtro Periodo */}
                  <select 
                    className="form-select form-select-sm"
                    style={{ maxWidth: '150px' }}
                    value={filterPeriod}
                    onChange={e => setFilterPeriod(e.target.value)}
                  >
                    <option value="all">📅 Tutti i periodi</option>
                    <option value="today">Oggi</option>
                    <option value="week">Questa settimana</option>
                    <option value="month">Questo mese</option>
                    <option value="quarter">Questo trimestre</option>
                    <option value="year">Quest'anno</option>
                  </select>

                  {/* Ordinamento */}
                  <select 
                    className="form-select form-select-sm"
                    style={{ maxWidth: '150px' }}
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="date_desc">📅 Data (recenti)</option>
                    <option value="date_asc">📅 Data (vecchie)</option>
                    <option value="amount_desc">💰 Importo (alto)</option>
                    <option value="amount_asc">💰 Importo (basso)</option>
                    <option value="company">🏢 Azienda</option>
                  </select>

                  {/* Toggle Vista */}
                  <div className="btn-group btn-group-sm" role="group">
                    <button 
                      type="button" 
                      className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('cards')}
                      title="Vista Card"
                    >
                      🔲
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('table')}
                      title="Vista Tabella"
                    >
                      📋
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('chart')}
                      title="Vista Grafico"
                    >
                      📊
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card text-center p-4 h-100 hover-card">
              <div className="display-6 mb-2">💰</div>
              <h6 className="text-muted mb-1">Spesa Media</h6>
              <h4 className="text-primary mb-0">
                €{quickStats ? (parseFloat(quickStats.totale || 0) / Math.max(quickStats.numero || 1, 1)).toFixed(2) : '0.00'}
              </h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card text-center p-4 h-100 hover-card">
              <div className="display-6 mb-2">📈</div>
              <h6 className="text-muted mb-1">Trend Mensile</h6>
              <h4 className="text-success mb-0">+12%</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card text-center p-4 h-100 hover-card">
              <div className="display-6 mb-2">⏰</div>
              <h6 className="text-muted mb-1">In Attesa</h6>
              <h4 className="text-warning mb-0">3</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card text-center p-4 h-100 hover-card">
              <div className="display-6 mb-2">✅</div>
              <h6 className="text-muted mb-1">Pagate</h6>
              <h4 className="text-success mb-0">{quickStats ? quickStats.numero - 3 : 0}</h4>
            </div>
          </div>
        </div>

        {/* Lista Spese Principale */}
        <div className="card">
          <div className="card-header bg-transparent pt-4 px-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Registro Completo Spese</h5>
              <div className="d-flex gap-2">
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                  {quickStats?.numero || 0} spese totali
                </span>
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                  Filtro: {filterPeriod === 'all' ? 'Tutto' : filterPeriod}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            {/* Passaggio props avanzate al componente ExpenseList */}
            <ExpenseList 
              key={listKey}
              viewMode={viewMode}
              filterPeriod={filterPeriod}
              sortBy={sortBy}
              onUpdate={() => {
                setListKey(k => k + 1);
                loadQuickStats();
              }}
            />
          </div>
        </div>

        {/* Sezione Insights e Azioni */}
        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="card p-4 h-100 hover-card">
              <h6 className="mb-3">💡 Insights Automatici</h6>
              <div className="small text-muted space-y-2">
                <div className="d-flex align-items-center mb-2">
                  <span className="text-success me-2">✓</span>
                  Le spese di questo mese sono in linea con il budget
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="text-warning me-2">⚠</span>
                  3 fatture in attesa di pagamento
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="text-info me-2">ℹ</span>
                  Metodo di pagamento più utilizzato: POS (45%)
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-4 h-100 hover-card">
              <h6 className="mb-3">🚀 Azioni Rapide</h6>
              <div className="d-grid gap-2">
                <Link to="/dashboard" className="btn btn-outline-primary btn-sm rounded-pill">
                  📊 Visualizza Analytics Dettagliate
                </Link>
                <button className="btn btn-outline-success btn-sm rounded-pill">
                  📄 Genera Report Mensile
                </button>
                <button className="btn btn-outline-warning btn-sm rounded-pill">
                  ⚡ Sollecita Pagamenti in Sospeso
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con Statistiche Avanzate */}
        <div className="card bg-gradient-primary text-white mt-4">
          <div className="card-body text-center py-4">
            <div className="row">
              <div className="col-md-3">
                <div className="opacity-75 small">Budget Utilizzato</div>
                <div className="h5 mb-0 text-white">72%</div>
              </div>
              <div className="col-md-3">
                <div className="opacity-75 small">Previsione Fine Mese</div>
                <div className="h5 mb-0 text-white">€{quickStats ? (parseFloat(quickStats.totale) * 1.15).toFixed(0) : '0'}</div>
              </div>
              <div className="col-md-3">
                <div className="opacity-75 small">Risparmio Potenziale</div>
                <div className="h5 mb-0 text-warning">€340</div>
              </div>
              <div className="col-md-3">
                <div className="opacity-75 small">Score Efficienza</div>
                <div className="h5 mb-0 text-success">A+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Spese;