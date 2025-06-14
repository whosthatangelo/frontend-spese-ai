// src/App.jsx
import { useEffect, useState } from 'react';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import AudioRecorder from './components/AudioRecorder';
import { getExpenses, addExpense } from './api';

export default function App() {
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
    <div className="container py-4">
      <h1 className="text-center mb-4">🧾 Gestione Spese</h1>

      <AudioRecorder onAdd={aggiungiSpesa} />
      <AddExpenseForm onAdd={aggiungiSpesa} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}
