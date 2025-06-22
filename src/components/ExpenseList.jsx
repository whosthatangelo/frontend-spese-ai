// src/components/ExpenseList.jsx
import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense, updateExpense } from '../api';

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
      loadExpenses();
    }
  }

  async function handleEdit(expense) {
    const nuovoImporto = prompt('Inserisci nuovo importo (€):', expense.importo);
    if (nuovoImporto && !isNaN(nuovoImporto)) {
      const updated = { ...expense, importo: parseFloat(nuovoImporto) };
      await updateExpense(expense.id, updated);
      loadExpenses();
    } else if (nuovoImporto !== null) {
      alert('Valore non valido.');
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
              <td>{exp.data_fattura}</td>
              <td>{exp.prodotto || '-'}</td>
              <td>{exp.azienda || '-'}</td>
              <td>{exp.importo}</td>
              <td>{exp.quantita || '-'}</td>
              <td>{exp.unita_misura || '-'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(exp)}>✏️</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
