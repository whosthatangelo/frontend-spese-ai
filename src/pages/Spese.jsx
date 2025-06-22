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
        borderBottom: "5px solid #ffffff",
        boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
      }}>
        <div className="container">
          <h1 className="display-4 fw-bold">💡 Expense Tracker AI</h1>
          <p className="lead">Parla, scrivi, analizza: controlla le tue spese con stile.</p>
        </div>
      </section>

      {/* Inserimento spese */}
      <div className="container my-5">
        <div className="row g-4 align-items-stretch">
          <div className="col-md-6">
            <div className="card border-0 shadow-lg h-100 animate__animated animate__fadeInLeft">
              <div className="card-body">
                <h5 className="card-title mb-3">🎙️ Inserimento Vocale</h5>
                <AudioRecorder onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-lg h-100 animate__animated animate__fadeInRight">
              <div className="card-body">
                <h5 className="card-title mb-3">📝 Inserimento Manuale</h5>
                <AddExpenseForm onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-5" />

        {/* Lista spese */}
        <div className="row">
          <div className="col">
            <h4 className="mb-4 text-center text-primary">📜 Elenco Completo delle Spese</h4>
            <div className="animate__animated animate__fadeInUp">
              <ExpenseList expenses={expenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spese;
