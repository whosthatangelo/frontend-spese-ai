import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';
import EditExpenseModal from './EditExpenseModal';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedAzienda, setSelectedAzienda] = useState("all");
  const [sortOption, setSortOption] = useState("data_desc");

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoading(true);
    const data = await getExpenses();
    setExpenses(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    const conferma = confirm(`Sei sicuro di voler eliminare questa fattura?`);
    if (!conferma) return;

    try {
      const res = await deleteExpense(id);
      console.log("✅ Eliminazione completata:", res);
      await loadExpenses();
    } catch (err) {
      console.error("❌ Errore durante eliminazione:", err);
      alert("Errore durante l'eliminazione. Controlla la console.");
    }
  }

  function handleEdit(expense) {
    setSelectedExpense(expense);
  }

  function handleModalClose() {
    setSelectedExpense(null);
    loadExpenses();
  }

  const aziendeUniche = [...new Set(expenses.map(e => e.azienda).filter(Boolean))];

  const filteredExpenses = expenses.filter(exp => {
    const monthMatch = selectedMonth === "all" || exp.data_fattura?.split("-")[1] === selectedMonth;
    const aziendaMatch = selectedAzienda === "all" || exp.azienda === selectedAzienda;
    return monthMatch && aziendaMatch;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortOption === "data_asc") {
      return new Date(a.data_fattura) - new Date(b.data_fattura);
    } else if (sortOption === "data_desc") {
      return new Date(b.data_fattura) - new Date(a.data_fattura);
    } else if (sortOption === "importo_asc") {
      return parseFloat(a.importo) - parseFloat(b.importo);
    } else if (sortOption === "importo_desc") {
      return parseFloat(b.importo) - parseFloat(a.importo);
    }
    return 0;
  });

  const totaleSpese = filteredExpenses.reduce(
    (acc, spesa) => acc + parseFloat(spesa.importo || 0),
    0
  );

  return (
    <div className="my-4">
      <h3 className="text-center mb-3 fw-semibold">📑 Elenco Completo delle Spese</h3>

      {/* Filtri */}
      <div className="mb-4 row justify-content-center g-2">
        {/* ...filtri invariati... */}
      </div>

      {/* Mini dashboard */}
      <div className="text-center mb-4">
        <h5 className="fw-bold">📊 Totale Spese Filtrate</h5>
        <p className="mb-1">💸 Totale: <strong>{totaleSpese.toFixed(2)} EUR</strong></p>
        <p className="text-muted">🧾 Documenti: {filteredExpenses.length}</p>
      </div>

      {/* Elenco spese */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Caricamento spese...</p>
        </div>
      ) : sortedExpenses.length === 0 ? (
        <p className="text-center text-muted">📭 Nessuna spesa registrata.</p>
      ) : (
        <div className="row g-3">
          {sortedExpenses.map(exp => (
            <div className="col-12" key={exp.id}>
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

                  {/* Descrizione e note rimosse - non sono nei campi effettivi */}

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

                    {(exp.data_creazione || exp.utente_id) && (
                      <div className="col-12">
                        <div className="p-3 bg-light rounded-3">
                          {exp.data_creazione && (
                            <>
                              <small className="text-muted d-block mb-1">📅 Data Creazione</small>
                              <p className="mb-2 fs-6">{new Date(exp.data_creazione).toLocaleDateString("it-IT")}</p>
                            </>
                          )}
                          {exp.utente_id && (
                            <>
                              <small className="text-muted d-block mb-1">👤 ID Utente</small>
                              <p className="mb-0 fs-6">{exp.utente_id}</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Pulsanti azione */}
                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button
                      className="btn btn-outline-primary btn-sm px-3"
                      onClick={() => handleEdit(exp)}
                      title="Modifica spesa"
                    >
                      ✏️ Modifica
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={() => handleDelete(exp.id)}
                      title="Elimina spesa"
                    >
                      🗑️ Elimina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}