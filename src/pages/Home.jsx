// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import { getLatestExpenses, getLatestIncomes } from '../api';
import { useUserCompany } from '../contexts/UserCompanyContext';

function Home() {
  const { company } = useUserCompany();
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [latestIncomes, setLatestIncomes] = useState([]);

  useEffect(() => {
    if (!company) return;  // aspettiamo che l'utente selezioni l'azienda
    async function fetchData() {
      try {
        const [expenses, incomes] = await Promise.all([
          getLatestExpenses(),
          getLatestIncomes()
        ]);
        setLatestExpenses(expenses);
        setLatestIncomes(incomes);
      } catch (err) {
        console.error('Errore nel caricamento degli ultimi documenti:', err);
      }
    }
    fetchData();
  }, [company]);

  if (!company) {
    return (
      <div className="container py-5 text-center">
        <h2>🏢 Seleziona un’azienda</h2>
        <p>Per favore scegli un’azienda dal menu in alto per visualizzare la dashboard.</p>
      </div>
    );
  }

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
            <span className={`badge fs-6 px-3 py-2 bg-${
              exp.stato === 'Pagata' ? 'success'
              : exp.stato === 'In attesa' ? 'warning'
              : exp.stato === 'Annullata' ? 'danger'
              : 'secondary'
            }`}>
              {exp.stato || 'N/D'}
            </span>
          </div>

          {/* Griglia dettagli */}
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
                    {exp.importo != null
                      ? `${parseFloat(exp.importo).toFixed(2)} ${exp.valuta || 'EUR'}`
                      : 'N/D'}
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
                  <small className="text-muted d-block">Documento</small>
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
                  <small className="text-muted d-block">Pagamento</small>
                  <strong className="fs-6">{exp.tipo_pagamento || 'N/D'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Informazioni aggiuntive */}
          <div className="row g-2">
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
                    <small className="text-muted d-block">Metodo</small>
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
          {/* Header incasso */}
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <h5 className="card-title mb-1 fw-bold text-success">
                📥 Incasso #{inc.id}
              </h5>
              {inc.data_incasso && (
                <small className="text-muted">
                  🗓️ {new Date(inc.data_incasso).toLocaleDateString("it-IT")}
                </small>
              )}
            </div>
          </div>
          <div className="row g-3">
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
                    {inc.importo != null
                      ? `${parseFloat(inc.importo).toFixed(2)} ${inc.valuta || 'EUR'}`
                      : 'N/D'}
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
                  <small className="text-muted d-block">Metodo</small>
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
          maxWidth: "960px",
          margin: "0 auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold">💸 ExpenseAI — {company.nome}</h1>
          <p className="lead">
            Registra le tue spese o incassi con la voce, veloce e intelligente.
          </p>
        </div>
      </section>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Registrazione vocale */}
            <div className="p-4 bg-white shadow rounded-4 mb-4">
              <h2 className="h4 mb-3 fw-semibold">🎙️ Registra Spesa o Incasso</h2>
              <AudioRecorder onProcessed={() => {
                // ricarica gli ultimi
                getLatestExpenses().then(setLatestExpenses);
                getLatestIncomes().then(setLatestIncomes);
              }} />
            </div>

            {/* Ultimi 3 Incassi */}
            {latestIncomes.length > 0 && (
              <div className="p-4 bg-white shadow rounded-4 mb-4">
                <h2 className="h5 mb-3 fw-semibold">🟢 Ultimi 3 Incassi</h2>
                <div className="row g-3">
                  {latestIncomes.map(renderIncomeCard)}
                </div>
              </div>
            )}

            {/* Ultime 3 Spese */}
            {latestExpenses.length > 0 && (
              <div className="p-4 bg-white shadow rounded-4 mb-4">
                <h2 className="h5 mb-3 fw-semibold">🔴 Ultime 3 Spese</h2>
                <div className="row g-3">
                  {latestExpenses.map(renderExpenseCard)}
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
