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

  async function handleDelete(id) {
    if (confirm('Sei sicuro di voler eliminare questa spesa?')) {
      await deleteExpense(id);
      loadExpenses(); // ricarica elenco
    }
  }

  if (loading) return <p>⏳ Caricamento spese...</p>;
  if (expenses.length === 0) return <p>📭 Nessuna spesa registrata.</p>;

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Data</th>
            <th>Prodotto</th>
            <th>Luogo</th>
            <th>Importo (€)</th>
            <th>Quantità</th>
            <th>Unità</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.data}</td>
              <td>{exp.prodotto}</td>
              <td>{exp.luogo}</td>
              <td>{exp.importo}</td>
              <td>{exp.quantita || '-'}</td>
              <td>{exp.unita_misura || '-'}</td>
              <td>
                {/* Modifica in futuro */}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
