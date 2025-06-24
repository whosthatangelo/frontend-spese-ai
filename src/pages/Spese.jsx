import { useState } from 'react';
import ExpenseList from '../components/ExpenseList';

function Spese() {
  const [listKey, setListKey] = useState(0);

  return (
    <>
      <section
        className="py-5 text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
          borderRadius: "20px",
          margin: "0 auto",
          maxWidth: "960px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold">📊 Tracciamento Spese</h1>
          <p className="lead">
            Registra, gestisci e visualizza tutte le tue spese in modo semplice e smart.
          </p>
        </div>
      </section>

      <div className="container mb-5">
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <ExpenseList key={listKey} />
        </div>
      </div>
    </>
  );
}

export default Spese;
