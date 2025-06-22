// src/components/ExpenseList.jsx
import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>⏳ Caricamento spese...</p>;
  if (expenses.length === 0) return <p>📭 Nessuna spesa registrata.</p>;

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Fattura</th>
            <th>Data</th>
            <th>Azienda</th>
            <th>Importo</th>
            <th>Valuta</th>
            <th>Pagamento</th>
            <th>Documento</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.numero_fattura}>
              <td>{exp.numero_fattura}</td>
              <td>{exp.data_fattura}</td>
              <td>{exp.azienda}</td>
              <td>{exp.importo}</td>
              <td>{exp.valuta}</td>
              <td>{exp.tipo_pagamento}</td>
              <td>{exp.tipo_documento}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.numero_fattura)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
