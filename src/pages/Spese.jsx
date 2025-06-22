// src/pages/Spese.jsx
import { useEffect, useState } from 'react';
import { getExpenses, addExpense, deleteExpense } from '../api';
import AudioRecorder from '../components/AudioRecorder';
import AddExpenseForm from '../components/AddExpenseForm';

function Spese() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    caricaSpese();
  }, []);

  async function caricaSpese() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function aggiungiSpesa(spesa) {
    const nuova = await addExpense(spesa);
    setExpenses(prev => [...prev, nuova]);
  }

  async function eliminaSpesa(id) {
    if (confirm('Vuoi eliminare questa spesa?')) {
      await deleteExpense(id);
      caricaSpese();
    }
  }

  return (
    <div>
      {/* HERO */}
      <section className="text-white text-center py-5" style={{
        background: "linear-gradient(135deg, #0d6efd, #6610f2)",
        borderRadius: "0 0 20px 20px"
      }}>
        <div className="container">
          <h1 className="display-5 fw-bold">📊 Tracciamento Spese</h1>
          <p className="lead">Registra, gestisci e visualizza tutte le tue spese in modo semplice e smart</p>
        </div>
      </section>

      {/* CONTENUTO */}
      <div className="container my-5">
        {/* SEZIONE INSERIMENTO */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 d-flex justify-content-center">
            <div className="card shadow-sm border-0 w-100">
              <div className="card-body text-center">
                <h5 className="card-title">🎙️ Registra Spesa Vocale</h5>
                <AudioRecorder onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-center">
            <div className="card shadow-sm border-0 w-100">
              <div className="card-body">
                <h5 className="card-title text-center">✍️ Aggiungi Spesa Manuale</h5>
                <AddExpenseForm onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>
        </div>

        {/* LISTA SPESE */}
        <div className="mb-4">
          <h4 className="text-center mb-4">📜 Elenco Completo delle Spese</h4>
          <div className="row g-3">
            {expenses.length === 0 ? (
              <p className="text-muted text-center">📭 Nessuna spesa registrata.</p>
            ) : (
              expenses.map((exp) => (
                <div className="col-md-6" key={exp.id}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <h6 className="card-title">{exp.prodotto}</h6>
                      <p className="mb-1 text-muted">
                        {new Date(exp.data).toLocaleDateString()} • {exp.importo} {exp.valuta}
                      </p>
                      <p className="mb-2 small">Quantità: {exp.quantita || 1} • Pagamento: {exp.tipo_pagamento}</p>
                      <div className="d-flex justify-content-end">
                        <button className="btn btn-sm btn-warning me-2" onClick={() => alert('Modifica non ancora disponibile')}>
                          ✏️
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => eliminaSpesa(exp.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spese;
