import { useEffect, useState } from 'react';

function Incassi() {
  const [incassi, setIncassi] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/incomes`);
        const data = await res.json();
        setIncassi(data);
      } catch (err) {
        console.error('Errore nel recupero degli incassi:', err);
      }
    }

    fetchData();
  }, []);

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
          <h1 className="display-5 fw-bold">💰 Registro Incassi</h1>
          <p className="lead">
            Visualizza tutti gli incassi registrati tramite voce o altre modalità.
          </p>
        </div>
      </section>

      <div className="container mb-5">
        <div className="card shadow-sm border-0 rounded-4 p-4">
          {incassi.length === 0 ? (
            <p>Nessun incasso registrato.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Importo</th>
                    <th>Valuta</th>
                    <th>Metodo</th>
                  </tr>
                </thead>
                <tbody>
                  {incassi.map((incasso, idx) => (
                    <tr key={idx}>
                      <td>{incasso.data_incasso}</td>
                      <td>{parseFloat(incasso.importo).toFixed(2)}</td>
                      <td>{incasso.valuta}</td>
                      <td>{incasso.metodo_incasso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Incassi;
