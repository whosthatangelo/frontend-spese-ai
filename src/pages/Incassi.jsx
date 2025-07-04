// src/pages/Incassi.jsx
import { useState, useEffect } from 'react';
import IncomeList from '../components/IncomeList';
import { useUserCompany } from '../contexts/UserCompanyContext';

function Incassi() {
  const { company } = useUserCompany();
  const [listKey, setListKey] = useState(0);

  // Ricarica la lista quando cambia l’azienda
  useEffect(() => {
    if (company) {
      setListKey((k) => k + 1);
    }
  }, [company]);

  // Se non è stata ancora selezionata un’azienda
  if (!company) {
    return (
      <div className="container py-5 text-center">
        <h2>🏢 Seleziona un’azienda</h2>
        <p>Scegli un’azienda dal selettore in alto per visualizzare e gestire gli incassi.</p>
      </div>
    );
  }

  return (
    <>
      <section
        className="py-5 text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          borderRadius: "20px",
          margin: "0 auto",
          maxWidth: "960px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="container text-center">
          <h1 className="display-5 fw-bold">
            💰 Registro Incassi — {company.nome}
          </h1>
          <p className="lead">
            Visualizza, modifica ed elimina gli incassi per <strong>{company.nome}</strong>.
          </p>
        </div>
      </section>

      <div className="container mb-5">
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <IncomeList
            key={listKey}
            onAction={() => setListKey((k) => k + 1)}
          />
        </div>
      </div>
    </>
  );
}

export default Incassi;
