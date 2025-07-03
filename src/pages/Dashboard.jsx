import { useEffect, useState } from 'react';
import { getStats, getIncomeStats, getExpenses } from '../api';
import ExpensesChart from '../components/ExpensesChart';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [incomeStats, setIncomeStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [statsData, incomeData, expensesData] = await Promise.all([
        getStats(),
        getIncomeStats(),
        getExpenses(),
      ]);
      setStats(statsData);
      setIncomeStats(incomeData);
      setExpenses(expensesData);
      setLoading(false);
    }
    loadData();
  }, []);

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
          <h1 className="display-5 fw-bold">📊 Dashboard</h1>
          <p className="lead">Statistiche aggiornate su spese e incassi</p>
        </div>
      </section>

      <div className="container mb-5">
        {loading ? (
          <p className="text-center">⏳ Caricamento statistiche...</p>
        ) : (
          <>
            <div className="row g-4 mb-4">
              {[
                {
                  title: 'Totale Speso',
                  value: `${stats.totale} €`,
                  bg: 'bg-primary'
                },
                {
                  title: 'Numero Spese',
                  value: stats.numero,
                  bg: 'bg-success'
                },
                {
                  title: 'Media Giornaliera Spese',
                  value: `${stats.media_per_giorno} €`,
                  bg: 'bg-warning'
                }
              ].map((card, idx) => (
                <div key={idx} className="col-sm-6 col-lg-4">
                  <div className={`card text-white ${card.bg} shadow-sm`} style={{ borderRadius: '16px' }}>
                    <div className="card-body text-center py-3 px-2">
                      <h6 className="mb-2" style={{ fontSize: '1rem' }}>{card.title}</h6>
                      <p className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>{card.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4 mb-5">
              {incomeStats && [
                {
                  title: 'Totale Incassato',
                  value: `${incomeStats.totale} €`,
                  bg: 'bg-info'
                },
                {
                  title: 'Numero Incassi',
                  value: incomeStats.numero,
                  bg: 'bg-secondary'
                },
                {
                  title: 'Media Giornaliera Incassi',
                  value: `${incomeStats.media_per_giorno} €`,
                  bg: 'bg-danger'
                }
              ].map((card, idx) => (
                <div key={`incasso-${idx}`} className="col-sm-6 col-lg-4">
                  <div className={`card text-white ${card.bg} shadow-sm`} style={{ borderRadius: '16px' }}>
                    <div className="card-body text-center py-3 px-2">
                      <h6 className="mb-2" style={{ fontSize: '1rem' }}>{card.title}</h6>
                      <p className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>{card.value}</p>
                    </div>
                  </div>
                </div>
              ))}
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
