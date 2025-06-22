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
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Fattura</th>
                <th>Data</th>
                <th>Azienda</th>
                <th>Importo (€)</th>
                <th>Valuta</th>
                <th>Pagamento</th>
                <th>Documento</th>
                <th className="text-center">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.numero_fattura}>
                  <td>{exp.numero_fattura}</td>
                  <td>{exp.data_fattura}</td>
                  <td>{exp.azienda}</td>
                  <td>{parseFloat(exp.importo).toFixed(2)}</td>
                  <td>{exp.valuta}</td>
                  <td>{exp.tipo_pagamento}</td>
                  <td>{exp.tipo_documento}</td>
                  <td className="text-center">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
