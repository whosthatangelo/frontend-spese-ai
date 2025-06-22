function Home() {
  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold">💸 ExpenseAI</h1>
        <p className="lead">
          Registra le tue spese con la voce. Semplice, veloce e intelligente.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="p-4 bg-white shadow rounded">
            <h2 className="h4">🚀 Benvenuto!</h2>
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
  );
}

export default Home;
