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
      {/* Hero Section */}
      <section className="py-5 text-center text-white" style={{
        background: "linear-gradient(135deg, #0d6efd, #6610f2)",
        borderBottom: "4px solid #dee2e6"
      }}>
        <div className="container">
          <h1 className="display-5 fw-bold">📊 Tracciamento Spese</h1>
          <p className="lead">Registra, gestisci e visualizza tutte le tue spese in modo semplice e smart</p>
        </div>
      </section>

      {/* Inserimento spese */}
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">🎙️ Registra Spesa Vocale</h5>
                <AudioRecorder onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">✍️ Aggiungi Spesa Manuale</h5>
                <AddExpenseForm onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-5" />

        {/* Lista spese */}
        <div className="row">
          <div className="col">
            <h4 className="mb-4 text-center">📜 Elenco Completo delle Spese</h4>
            <ExpenseList expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spese;
