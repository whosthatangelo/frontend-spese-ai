import { useState } from 'react';
import { addExpense } from '../api';
import AudioRecorder from '../components/AudioRecorder';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Navbar from '../components/Navbar';

function Spese() {
  const [listKey, setListKey] = useState(0);

  async function aggiungiSpesa(spesa) {
    await addExpense(spesa);
    setListKey(prev => prev + 1);
  }

  return (
    <>
      <Navbar />

      <section
        className="py-5 text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: "20px",
          margin: "0 auto",
          maxWidth: "960px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="container text-center">
          <h1 className="display-6 fw-bold text-white">📊 Tracciamento Spese</h1>
          <p className="lead text-light">
            Registra, gestisci e visualizza tutte le tue spese in modo semplice e smart.
          </p>
        </div>
      </section>

      <div className="container my-5">
        <div className="row g-4 mb-5">
          <div className="col-md-6 d-flex justify-content-center">
            <div className="card shadow-sm border-0 w-100 rounded-4">
              <div className="card-body text-center">
                <h5 className="card-title">🎙️ Registra Spesa Vocale</h5>
                <AudioRecorder onAdd={() => setListKey(prev => prev + 1)} />
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-center">
            <div className="card shadow-sm border-0 w-100 rounded-4">
              <div className="card-body">
                <h5 className="card-title text-center">✍️ Aggiungi Spesa Manuale</h5>
                <AddExpenseForm onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>
        </div>

        <ExpenseList key={listKey} />
      </div>
    </>
  );
}

export default Spese;
