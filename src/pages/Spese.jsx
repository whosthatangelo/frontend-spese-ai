import { useEffect, useState } from 'react';
import { getExpenses, addExpense } from '../api';

function Spese() {
  const [expenses, setExpenses] = useState([]);
  const [prodotto, setProdotto] = useState("");
  const [importo, setImporto] = useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await addExpense({
      data: new Date().toISOString().split('T')[0],
      prodotto,
      luogo: "Luogo demo",
      importo: parseFloat(importo),
      quantita: 1,
      unita_misura: "pz",
      audio_url: ""
    });
    setProdotto("");
    setImporto("");
    loadExpenses();
  }

  return (
    <div className="container">
      <h2>📋 Spese</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input value={prodotto} onChange={e => setProdotto(e.target.value)} placeholder="Prodotto" />
        <input value={importo} onChange={e => setImporto(e.target.value)} placeholder="Importo" type="number" />
        <button type="submit">Aggiungi</button>
      </form>

      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.data} - <strong>{exp.prodotto}</strong> - {exp.importo} €
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Spese;
