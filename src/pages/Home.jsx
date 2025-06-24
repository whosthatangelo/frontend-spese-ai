// src/pages/Home.jsx
import Navbar from '../components/Navbar';

function Home() {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5">💸 ExpenseAI</h1>
          <p className="lead text-muted">
            Registra le tue spese con la voce. Semplice, veloce e intelligente.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="p-5 rounded shadow-sm" style={{ backgroundColor: '#ffffff' }}>
              <h2 className="h5 fw-bold mb-3">🚀 Benvenuto!</h2>
              <p className="mb-3 text-muted">
                Questa app ti permette di <strong>registrare, visualizzare, modificare</strong> e <strong>gestire</strong> tutte le tue spese direttamente dal tuo smartphone o computer.
                Grazie all'intelligenza artificiale, puoi anche usare la tua voce!
              </p>
              <ul className="list-unstyled fs-6">
                <li className="mb-2">🎙️ Inserisci spese vocali</li>
                <li className="mb-2">🧾 Gestisci fatture e documenti</li>
                <li className="mb-2">📊 Visualizza l’andamento delle spese</li>
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
