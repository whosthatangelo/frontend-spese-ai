// src/pages/Spese.jsx
import { useState } from 'react';
import { addExpense } from '../api';
import AudioRecorder from '../components/AudioRecorder';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';

function Spese() {
  const [listKey, setListKey] = useState(0); // per forzare il remount di ExpenseList

  /*  📌 Quando salviamo una nuova spesa, aumentiamo listKey in modo che
      ExpenseList si rimonti e ricarichi i dati automaticamente */
  async function aggiungiSpesa(spesa) {
    await addExpense(spesa);
    setListKey(prev => prev + 1);
  }

  return (
    <div>
      {/* HERO */}
      <section
        className="py-5 text-center text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
          borderRadius: "20px",
          margin: "0 auto",
          maxWidth: "960px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="container">
          <h1 className="display-6 fw-bold">📊 Tracciamento Spese</h1>
          <p className="lead">
            Registra, gestisci e visualizza tutte le tue spese in modo semplice e smart.
          </p>
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
                <AudioRecorder onAdd={() => setListKey(prev => prev + 1)} />
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
        <ExpenseList key={listKey} />
      </div>
    </div>
  );
}

export default Spese;
