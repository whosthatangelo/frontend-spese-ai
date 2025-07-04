import { useEffect, useState } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import { getLatestExpenses, getLatestIncomes } from '../api';

function Home() {
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [latestIncomes, setLatestIncomes] = useState([]);


  useEffect(() => {
    async function fetchData() {
      const [expenses, income] = await Promise.all([
        getLatestExpenses(),
        getLatestIncomes()
      ]);
      setLatestExpenses(expenses);
      setLatestIncomes(income);
    }
    fetchData();
  }, []);

  const renderExpenseCard = (exp) => (
    <div className="col-12 mb-3" key={exp.id}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header con numero fattura e stato */}
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <h5 className="card-title mb-1 fw-bold text-primary">
                📄 Fattura #{exp.numero_fattura || 'N/D'}
              </h5>
              {exp.data_fattura && (
                <small className="text-muted">
                  🗓️ {new Date(exp.data_fattura).toLocaleDateString("it-IT")}
                </small>
              )}
            </div>
            <span className={`badge fs-6 px-3 py-2 bg-${exp.stato === 'Pagata' ? 'success' : exp.stato === 'In attesa' ? 'warning' : exp.stato === 'Annullata' ? 'danger' : 'secondary'}`}>
              {exp.stato || "N/D"}
            </span>
          </div>

          {/* Dettagli principali in griglia */}
          <div className="row g-3 mb-3">
            {/* Azienda */}
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-inline-flex">
                    <span className="text-primary">🏢</span>
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Azienda</small>
                  <strong className="fs-6">{exp.azienda || 'N/D'}</strong>
                </div>
              </div>
            </div>

            {/* Importo */}
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-flex">
                    <span className="text-success">💶</span>
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Importo</small>
                  <strong className="fs-5 text-success">
                    {exp.importo ? `${parseFloat(exp.importo).toFixed(2)} ${exp.valuta || 'EUR'}` : 'N/D'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Tipo documento */}
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-flex">
                    <span className="text-info">📎</span>
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Tipo Documento</small>
                  <strong className="fs-6">{exp.tipo_documento || 'N/D'}</strong>
                </div>
              </div>
            </div>

            {/* Tipo pagamento */}
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 d-inline-flex">
                    <span className="text-warning">💳</span>
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Tipo Pagamento</small>
                  <strong className="fs-6">{exp.tipo_pagamento || 'N/D'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Informazioni aggiuntive */}
          <div className="row g-2 mb-3">
            {exp.banca && (
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="bg-secondary bg-opacity-10 rounded-circle p-2 d-inline-flex">
                      <span className="text-secondary">🏦</span>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted d-block">Banca</small>
                    <strong className="fs-6">{exp.banca}</strong>
                  </div>
                </div>
              </div>
            )}
            {exp.metodo_pagamento && (
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="bg-dark bg-opacity-10 rounded-circle p-2 d-inline-flex">
                      <span className="text-dark">💸</span>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted d-block">Metodo Pagamento</small>
                    <strong className="fs-6">{exp.metodo_pagamento}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomeCard = (inc) => (
    <div className="col-12 mb-3" key={inc.id}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header con ID incasso */}
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <h5 className="card-title mb-1 fw-bold text-success">
                📥 Incasso #{inc.id || 'N/D'}
              </h5>
              {inc.data_incasso && (
                <small className="text-muted">
                  🗓️ {new Date(inc.data_incasso).toLocaleDateString("it-IT")}
                </small>
              )}
            </div>
          </div>

          {/* Dettagli principali in griglia */}
          <div className="row g-3 mb-3">
            {/* Importo */}
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2 d-inline-flex">
                    <span className="text-success">💰</span>
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Importo</small>
                  <strong className="fs-5 text-success">
                    {inc.importo ? `${parseFloat(inc.importo).toFixed(2)} ${inc.valuta || 'EUR'}` : 'N/D'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Metodo incasso */}
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-info bg-opacity-10 rounded-circle p-2 d-inline-flex">
                    <span className="text-info">💳</span>
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Metodo Incasso</small>
                  <strong className="fs-6">{inc.metodo_incasso || 'N/D'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section
        className="py-5 text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
          borderRadius: "20px",
          margin: "0 auto",
          maxWidth: "960px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold">💸 ExpenseAI</h1>
          <p className="lead">
            Registra le tue spese con la voce. Semplice, veloce e intelligente.
          </p>
        </div>
      </section>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="p-4 bg-white shadow rounded-4 mb-4">
              <h2 className="h4 mb-3 fw-semibold">🚀 Benvenuto!</h2>
              <p className="mb-3">
                Questa app ti permette di <strong>registrare, visualizzare, modificare</strong> e <strong>gestire</strong> tutte le tue spese direttamente dal tuo smartphone o computer.
                Grazie all'integrazione con l'intelligenza artificiale, puoi anche usare la tua voce per inserire le spese!
              </p>
              <ul className="list-unstyled">
                <li>🎙️ Inserisci spese vocali</li>
                <li>🧾 Gestisci fatture e documenti</li>
                <li>📊 Visualizza l'andamento delle spese</li>
                <li>🔐 Tutto sicuro e archiviato nel tuo database</li>
              </ul>
            </div>

            <div className="p-4 bg-white shadow rounded-4 mb-4">
              <h2 className="h4 mb-3 fw-semibold">🎙️ Registra Spesa o Incasso</h2>
              <AudioRecorder />
            </div>

            {/* Ultimi 3 Incassi */}
            {latestIncomes.length > 0 && (
              <div className="p-4 bg-white shadow rounded-4 mb-4">
                <h2 className="h5 mb-3 fw-semibold">🟢 Ultimi 3 Incassi</h2>
                <div className="row g-3">
                  {latestIncomes.map(item => renderIncomeCard(item))}
                </div>
              </div>
            )}

            {/* Ultime 3 Spese */}
            {latestExpenses.length > 0 && (
              <div className="p-4 bg-white shadow rounded-4 mb-4">
                <h2 className="h5 mb-3 fw-semibold">🔴 Ultime 3 Spese</h2>
                <div className="row g-3">
                  {latestExpenses.map(item => renderExpenseCard(item))}
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