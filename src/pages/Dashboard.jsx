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
            <div className="row gy-4 mb-4">
              <div className="col-md-6 col-lg-3">
                <div className="card card-metric text-white bg-primary shadow-sm">
                  <div className="card-body text-center p-3">
                    <h6 className="fw-bold mb-1">Totale Speso</h6>
                    <p className="fs-4 m-0">{stats.totale} €</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card card-metric text-white bg-success shadow-sm">
                  <div className="card-body text-center p-3">
                    <h6 className="fw-bold mb-1">Numero Spese</h6>
                    <p className="fs-4 m-0">{stats.numero}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card card-metric text-white bg-warning shadow-sm">
                  <div className="card-body text-center p-3">
                    <h6 className="fw-bold mb-1">Media Giornaliera</h6>
                    <p className="fs-4 m-0">{stats.media_per_giorno} €</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="card card-metric text-white bg-dark shadow-sm">
                  <div className="card-body text-center p-3">
                    <h6 className="fw-bold mb-1">Prodotto Top</h6>
                    <p className="fs-4 m-0">{stats.top_prodotto}</p>
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
