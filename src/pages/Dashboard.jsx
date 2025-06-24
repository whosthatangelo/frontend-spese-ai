import { useEffect, useState } from 'react';
import { getStats, getExpenses } from '../api';
import ExpensesChart from '../components/ExpensesChart';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [statsData, expensesData] = await Promise.all([
        getStats(),
        getExpenses(),
      ]);
      setStats(statsData);
      setExpenses(expensesData);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold">📊 Dashboard</h1>
          <p className="lead">Statistiche aggiornate sulle tue spese</p>
        </div>

        {loading && <p className="text-center">⏳ Caricamento statistiche...</p>}

        {!loading && stats && (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-6 col-lg-3">
                <div className="card text-white bg-primary shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Totale Speso</h5>
                    <p className="display-6">{stats.totale} €</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card text-white bg-success shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Numero Spese</h5>
                    <p className="display-6">{stats.numero}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card text-white bg-warning shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Media Giornaliera</h5>
                    <p className="display-6">{stats.media_per_giorno} €</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card text-white bg-dark shadow">
                  <div className="card-body text-center">
                    <h5 className="card-title">Prodotto Top</h5>
                    <p className="display-6">{stats.top_prodotto}</p>
                  </div>
                </div>
              </div>
            </div>

            <ExpensesChart expenses={expenses} />
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
