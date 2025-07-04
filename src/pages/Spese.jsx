// src/pages/Spese.jsx
import { useState, useEffect } from 'react';
import ExpenseList from '../components/ExpenseList';
import { useUserCompany } from '../contexts/UserCompanyContext';

function Spese() {
  const { company } = useUserCompany();
  const [listKey, setListKey] = useState(0);

  // Ricarica la lista ogni volta che cambio azienda
  useEffect(() => {
    if (company) {
      setListKey((k) => k + 1);
    }
  }, [company]);

  // Se non è selezionata nessuna azienda
  if (!company) {
    return (
      <div className="container py-5 text-center">
        <h2>🏢 Seleziona un’azienda</h2>
        <p>Scegli un’azienda dal selettore in alto per iniziare a gestire le spese.</p>
      </div>
    );
  }

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
          <h1 className="display-5 fw-bold">🧾 Tracciamento Spese — {company.nome}</h1>
          <p className="lead">
            Registra, gestisci e visualizza tutte le tue spese per <strong>{company.nome}</strong>.
          </p>
        </div>
      </section>

      <div className="container mb-5">
        <div className="card shadow-sm border-0 rounded-4 p-4">
          {/* la key forza ri-render su cambio azienda */}
          <ExpenseList key={listKey} />
        </div>
      </div>
    </>
  );
}

export default Spese;
