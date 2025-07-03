import { useEffect, useState } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import { getLatestExpenses, getLatestIncome } from '../api';

function Home() {
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [latestIncome, setLatestIncome] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [expenses, income] = await Promise.all([
        getLatestExpenses(),
        getLatestIncome()
      ]);
      setLatestExpenses(expenses);
      setLatestIncome(income);
    }
    fetchData();
  }, []);

  const renderCard = (item, type) => (
    <div className="card mb-3 shadow-sm border-0 rounded-4" key={item.id}>
      <div className="card-body">
        <h5 className="card-title">
          {type === 'expense' ? '📄 Fattura' : '💰 Incasso'} #{item.numero_fattura || item.id}
        </h5>
        <p className="mb-1">🗓️ {new Date(item.data_fattura || item.data_creazione).toLocaleDateString("it-IT")}</p>
        {item.azienda && <p className="mb-1">🏢 {item.azienda}</p>}
        <p className="mb-1">💶 {parseFloat(item.importo).toFixed(2)} {item.valuta || 'EUR'}</p>
        {item.tipo_pagamento && <p className="mb-0">💳 {item.tipo_pagamento}</p>}
      </div>
    </div>
  );

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
          <h1 className="display-5 fw-bold">💸 ExpenseAI</h1>
          <p className="lead">
            Registra le tue spese con la voce. Semplice, veloce e intelligente.
          </p>
        </div>
      </section>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="p-4 bg-white shadow rounded-4 mb-4">
              <h2 className="h4 mb-3 fw-semibold">🎙️ Registra Spesa o Incasso</h2>
              <AudioRecorder />
            </div>

            {/* Ultimi 3 Incassi */}
            {latestIncome.length > 0 && (
              <div className="p-4 bg-white shadow rounded-4 mb-4">
                <h2 className="h5 mb-3 fw-semibold">🟢 Ultimi 3 Incassi</h2>
                {latestIncome.map(item => renderCard(item, 'income'))}
              </div>
            )}

            {/* Ultime 3 Spese */}
            {latestExpenses.length > 0 && (
              <div className="p-4 bg-white shadow rounded-4 mb-4">
                <h2 className="h5 mb-3 fw-semibold">🔴 Ultime 3 Spese</h2>
                {latestExpenses.map(item => renderCard(item, 'expense'))}
              </div>
            )}

            <div className="p-4 bg-white shadow rounded-4">
              <h2 className="h4 mb-3 fw-semibold">🚀 Benvenuto!</h2>
              <p className="mb-3">
                Questa app ti permette di <strong>registrare, visualizzare, modificare</strong> e <strong>gestire</strong> tutte le tue spese direttamente dal tuo smartphone o computer.
                Grazie all'integrazione con l'intelligenza artificiale, puoi anche usare la tua voce per inserire le spese!
              </p>
              <ul className="list-unstyled">
                <li>🎙️ Inserisci spese vocali</li>
                <li>🧾 Gestisci fatture e documenti</li>
                <li>📊 Visualizza l’andamento delle spese</li>
                <li>🔐 Tutto sicuro e archiviato nel tuo database</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
