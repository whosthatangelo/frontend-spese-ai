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
    <div className="container py-5">
      <h2 className="text-center mb-4">🧾 Gestione Spese</h2>

      <div className="row g-4">
        <div className="col-md-6">
          <AudioRecorder onAdd={aggiungiSpesa} />
        </div>

        <div className="col-md-6">
          <AddExpenseForm onAdd={aggiungiSpesa} />
        </div>
      </div>

      <hr className="my-5" />

      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default Spese;
