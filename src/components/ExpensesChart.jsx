import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ExpensesChart({ expenses }) {
  const monthlyTotals = {};

  expenses.forEach((exp) => {
    if (!exp.data_fattura || !exp.importo) return;
    const date = new Date(exp.data_fattura);
    const month = date.toLocaleString('it-IT', { month: 'short' }).toLowerCase();

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += parseFloat(exp.importo);
  });

  const monthOrder = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  const labels = monthOrder.filter((m) => m in monthlyTotals);

  const data = {
    labels,
    datasets: [
      {
        label: 'Spese Mensili (€)',
        data: labels.map((m) => monthlyTotals[m].toFixed(2)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `€ ${parseFloat(ctx.raw).toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: value => `€ ${value}`
        }
      }
    }
  };

  return (
    <div className="mt-5 px-3">
      <h4 className="text-center mb-3">📈 Spese per Mese</h4>
      <Bar data={data} options={options} />
    </div>
  );
}
