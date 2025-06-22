// src/pages/Spese.jsx
import { useEffect, useState } from 'react';
import { getExpenses, addExpense } from '../api';
import AudioRecorder from '../components/AudioRecorder';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';

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

  return (
    <div>
      {/* Hero */}
      <section className="py-5 text-white" style={{
        background: "linear-gradient(135deg, #0d6efd, #6610f2)",
        borderBottom: "4px solid #dee2e6",
        borderRadius: "0 0 20px 20px"
      }}>
        <div className="container text-center">
          <h1 className="display-5 fw-bold">📊 Tracciamento Spese</h1>
          <p className="lead">Registra, gestisci e visualizza le tue spese in modo smart</p>
        </div>
      </section>

      {/* Inserimento spese */}
      <div className="container my-5">
        <div className="row gy-4 justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title">🎙️ Registra Spesa Vocale</h5>
                <AudioRecorder onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title">✍️ Inserisci Spesa Manualmente</h5>
                <AddExpenseForm onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-5" />

        {/* Lista spese */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="mb-4 text-center">📜 Elenco Spese</h4>
                <div className="row g-3">
                  {expenses.length === 0 ? (
                    <p className="text-muted text-center">📭 Nessuna spesa registrata.</p>
                  ) : (
                    expenses.map(exp => (
                      <div className="col-sm-6 col-lg-4" key={exp.id}>
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body">
                            <h6 className="card-title">{exp.prodotto}</h6>
                            <p className="mb-1"><strong>Data:</strong> {exp.data?.split('T')[0]}</p>
                            <p className="mb-1"><strong>Importo:</strong> {exp.importo} {exp.valuta || "€"}</p>
                            <p className="mb-1"><strong>Pagamento:</strong> {exp.tipo_pagamento}</p>
                            <p className="mb-1"><strong>Tipo Documento:</strong> {exp.tipo_documento}</p>
                            <span className="badge bg-secondary">Quantità: {exp.quantita || 1}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Spese;
