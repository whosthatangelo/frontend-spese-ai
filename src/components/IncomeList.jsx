import { useEffect, useState } from 'react';
import { getIncomes, deleteIncome } from '../api';
import EditIncomeModal from './EditIncomeModal';

export default function IncomeList() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncome, setSelectedIncome] = useState(null);

  useEffect(() => {
    loadIncomes();
  }, []);

  async function loadIncomes() {
    setLoading(true);
    const data = await getIncomes();
    setIncomes(data);
    setLoading(false);
  }

  async function handleDelete(numero_fattura) {
    if (confirm(`Sei sicuro di voler eliminare l'incasso ${numero_fattura}?`)) {
      await deleteIncome(numero_fattura);
      loadIncomes();
    }
  }

  const totale = incomes.reduce(
    (acc, inc) => acc + parseFloat(inc.importo || 0),
    0
  );

  return (
    <div className="my-4">
      <h3 className="text-center mb-4 fw-semibold">📥 Elenco Incassi</h3>

      <div className="text-center mb-4">
        <h5 className="fw-bold">💰 Totale Incassi</h5>
        <p className="mb-1">Totale: <strong>{totale.toFixed(2)} EUR</strong></p>
        <p className="text-muted">📄 Documenti: {incomes.length}</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Caricamento incassi...</p>
        </div>
      ) : incomes.length === 0 ? (
        <p className="text-center text-muted">📭 Nessun incasso registrato.</p>
      ) : (
        <div className="row g-3">
          {incomes.map(inc => (
            <div className="col-12" key={inc.numero_fattura}>
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">📄 Incasso {inc.numero_fattura}</h5>
                    <span className="badge bg-success">✅</span>
                  </div>

                  {inc.data_fattura && (
                    <p className="text-muted mb-1">
                      🗓️ Data: {new Date(inc.data_fattura).toLocaleDateString("it-IT")}
                    </p>
                  )}

                  {inc.azienda && (
                    <p className="mb-1">🏢 Azienda: <strong>{inc.azienda}</strong></p>
                  )}

                  {inc.importo && (
                    <p className="mb-1">💶 Importo: <strong>{parseFloat(inc.importo).toFixed(2)} {inc.valuta}</strong></p>
                  )}

                  {(inc.tipo_documento || inc.tipo_pagamento) && (
                    <p className="mb-1">
                      📎 {inc.tipo_documento || "Documento N/D"} — 💳 {inc.tipo_pagamento || "Pagamento N/D"}
                    </p>
                  )}

                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => setSelectedIncome(inc)}
                      title="Modifica"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(inc.numero_fattura)}
                      title="Elimina"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIncome && (
        <EditIncomeModal
          income={selectedIncome}
          onClose={() => {
            setSelectedIncome(null);
            loadIncomes();
          }}
        />
      )}
    </div>
  );
}
