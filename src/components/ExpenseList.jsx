// src/components/ExpenseList.jsx
import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';
import EditExpenseModal from './EditExpenseModal';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoading(true);
    const data = await getExpenses();
    setExpenses(data);
    setLoading(false);
  }

  async function handleDelete(numero_fattura) {
    if (confirm(`Sei sicuro di voler eliminare la fattura ${numero_fattura}?`)) {
      await deleteExpense(numero_fattura);
      loadExpenses();
    }
  }

  function handleEdit(expense) {
    setSelectedExpense(expense);
  }

  function handleModalClose() {
    setSelectedExpense(null);
    loadExpenses();
  }

  return (
    <div className="my-4">
      <h3 className="text-center mb-4 fw-semibold">📑 Elenco Completo delle Spese</h3>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Caricamento spese...</p>
        </div>
      ) : expenses.length === 0 ? (
        <p className="text-center text-muted">📭 Nessuna spesa registrata.</p>
      ) : (
        <div className="row g-3">
          {expenses.map(exp => (
            <div className="col-12" key={exp.numero_fattura}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-1">📄 {exp.numero_fattura}</h5>
                  <p className="card-subtitle mb-2 text-muted">{exp.data_fattura} • {exp.azienda}</p>
                  <p className="mb-2 fw-semibold">💶 {parseFloat(exp.importo).toFixed(2)} {exp.valuta}</p>
                  <p className="mb-1">🧾 {exp.tipo_documento} | 💳 {exp.tipo_pagamento}</p>
                  <p className="mb-2">📌 Stato: <strong>{exp.stato || "N/D"}</strong></p>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => handleEdit(exp)}
                      title="Modifica"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(exp.numero_fattura)}
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


      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
