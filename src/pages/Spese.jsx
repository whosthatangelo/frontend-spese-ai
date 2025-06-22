// src/pages/Spese.jsx
import { useEffect, useState } from 'react';
import { getExpenses, addExpense } from '../api';

function Spese() {
  const [expenses, setExpenses] = useState([]);
  const [prodotto, setProdotto] = useState('');
  const [importo, setImporto] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prodotto || !importo) return;
    await addExpense({
      data: new Date().toISOString().split('T')[0],
      prodotto,
      luogo: 'Luogo demo',
      importo: parseFloat(importo),
      quantita: 1,
      unita_misura: 'pz',
      audio_url: ''
    });
    setProdotto('');
    setImporto('');
    loadExpenses();
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">📊 Tracciamento Spese</h2>
      <div className="row g-4">
        {/* Form */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">➕ Aggiungi Spesa</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Prodotto</label>
                  <input
                    value={prodotto}
                    onChange={e => setProdotto(e.target.value)}
                    placeholder="Es. Caffè"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Importo (€)</label>
                  <input
                    value={importo}
                    onChange={e => setImporto(e.target.value)}
                    placeholder="Es. 2.50"
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Salva Spesa
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Lista spese */}
        <div className="col-md-8">
          <h5 className="mb-3">📜 Elenco Spese</h5>
          {expenses.length === 0 ? (
            <p className="text-muted">📭 Nessuna spesa registrata.</p>
          ) : (
            <div className="row g-3">
              {expenses.map(exp => (
                <div className="col-md-6" key={exp.id}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <h6 className="card-title mb-1">{exp.prodotto}</h6>
                      <p className="mb-1 text-muted">
                        {exp.data} • {exp.importo} €
                      </p>
                      <span className="badge bg-secondary">Quantità: {exp.quantita || 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Spese;
