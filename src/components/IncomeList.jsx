// src/components/IncomeList.jsx
import React, { useEffect, useState } from 'react';
import { getIncomes, deleteIncome } from '../api';
import EditIncomeModal from './EditIncomeModal';

export default function IncomeList({ onAction }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncome, setSelectedIncome] = useState(null);

  // Carica gli incassi dal backend
  const loadIncomes = async () => {
    setLoading(true);
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (err) {
      console.error('❌ Errore caricamento incassi:', err);
      alert('Errore nel caricamento degli incassi. Controlla la console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, []);

  // Elimina un incasso e ricarica la lista
  const handleDelete = async (id) => {
    if (!confirm(`Sei sicuro di voler eliminare l'incasso con ID ${id}?`)) {
      return;
    }
    try {
      await deleteIncome(id);
      await loadIncomes();
      if (onAction) onAction();
    } catch (err) {
      console.error('❌ Errore durante eliminazione incasso:', err);
      alert('Errore durante l\'eliminazione. Controlla la console.');
    }
  };

  // Chiusura della modal di modifica: ricarica e notifica il parent
  const handleModalClose = async () => {
    setSelectedIncome(null);
    await loadIncomes();
    if (onAction) onAction();
  };

  // Calcola il totale
  const totale = incomes.reduce(
    (acc, inc) => acc + parseFloat(inc.importo || 0),
    0
  );

  return (
    <div className="my-4">
      <h3 className="text-center mb-4 fw-semibold">📥 Elenco Incassi</h3>

      <div className="text-center mb-4">
        <h5 className="fw-bold">💰 Totale Incassi</h5>
        <p className="mb-1">
          Totale: <strong>{totale.toFixed(2)} EUR</strong>
        </p>
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
          {incomes.map((inc) => (
            <div className="col-12" key={inc.id}>
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <div>
                      <h5 className="card-title mb-1 fw-bold text-success">
                        📥 Incasso #{inc.id || 'N/D'}
                      </h5>
                      {inc.data_incasso && (
                        <small className="text-muted">
                          🗓️ {new Date(inc.data_incasso).toLocaleDateString('it-IT')}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Dati principali */}
                  <div className="row g-3 mb-3">
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
                            {inc.importo
                              ? `${parseFloat(inc.importo).toFixed(2)} ${inc.valuta || 'EUR'}`
                              : 'N/D'}
                          </strong>
                        </div>
                      </div>
                    </div>

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

                  {/* Meta info */}
                  {(inc.data_creazione || inc.utente_id || inc.id) && (
                    <div className="mb-3 p-3 bg-light rounded-3">
                      {inc.id && (
                        <>
                          <small className="text-muted d-block mb-1">🆔 Record ID</small>
                          <p className="mb-2 fs-6">{inc.id}</p>
                        </>
                      )}
                      {inc.data_creazione && (
                        <>
                          <small className="text-muted d-block mb-1">📅 Load Timestamp</small>
                          <p className="mb-2 fs-6">
                            {new Date(inc.data_creazione).toLocaleDateString('it-IT')} alle{' '}
                            {new Date(inc.data_creazione).toLocaleTimeString('it-IT')}
                          </p>
                        </>
                      )}
                      {inc.utente_id && (
                        <>
                          <small className="text-muted d-block mb-1">👤 Load User</small>
                          <p className="mb-0 fs-6">{inc.utente_id}</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Azioni */}
                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button
                      className="btn btn-outline-primary btn-sm px-3"
                      onClick={() => setSelectedIncome(inc)}
                      title="Modifica incasso"
                    >
                      ✏️ Modifica
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={() => handleDelete(inc.id)}
                      title="Elimina incasso"
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

      {selectedIncome && (
        <EditIncomeModal income={selectedIncome} onClose={handleModalClose} />
      )}
    </div>
  );
}
