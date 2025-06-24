// src/pages/Dashboard.jsx

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
          <h1 className="display-5 fw-bold">📊 Dashboard</h1>
          <p className="lead">Statistiche aggiornate sulle tue spese</p>
        </div>
      </section>

      <div className="container mb-5">
        {loading && <p className="text-center">⏳ Caricamento statistiche...</p>}

        {!loading && stats && (
          <>
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-white bg-primary shadow-sm h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">Totale Speso</h5>
                    <p className="display-6">{stats.totale} €</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-white bg-success shadow-sm h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">Numero Spese</h5>
                    <p className="display-6">{stats.numero}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-white bg-warning shadow-sm h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">Media Giornaliera</h5>
                    <p className="display-6">{stats.media_per_giorno} €</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-white bg-dark shadow-sm h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">Prodotto Top</h5>
                    <p className="display-6">{stats.top_prodotto}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 p-4 mb-5">
              <ExpensesChart expenses={expenses} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
