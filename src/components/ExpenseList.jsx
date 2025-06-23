// src/components/ExpenseList.jsx
import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';
import EditExpenseModal from './EditExpenseModal';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedAzienda, setSelectedAzienda] = useState("all");

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoading(true);
    const data = await getExpenses();
    setExpenses(data);
    setLoading(false);
  }

  async function handleDelete(numero_fattura) {
    if (confirm(`Sei sicuro di voler eliminare la fattura ${numero_fattura}?`)) {
      await deleteExpense(numero_fattura);
      loadExpenses();
    }
  }

  function handleEdit(expense) {
    setSelectedExpense(expense);
  }

  function handleModalClose() {
    setSelectedExpense(null);
    loadExpenses();
  }

  const aziendeUniche = [...new Set(expenses.map(e => e.azienda).filter(Boolean))];

  const filteredExpenses = expenses.filter(exp => {
    const monthMatch = selectedMonth === "all" || exp.data_fattura?.split("-")[1] === selectedMonth;
    const aziendaMatch = selectedAzienda === "all" || exp.azienda === selectedAzienda;
    return monthMatch && aziendaMatch;
  });

  return (
    <div className="my-4">
      <h3 className="text-center mb-3 fw-semibold">📑 Elenco Completo delle Spese</h3>

      <div className="mb-4 row justify-content-center g-2">
        <div className="col-auto">
          <label className="me-2 fw-semibold">📅 Mese:</label>
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">Tutti</option>
            <option value="01">Gennaio</option>
            <option value="02">Febbraio</option>
            <option value="03">Marzo</option>
            <option value="04">Aprile</option>
            <option value="05">Maggio</option>
            <option value="06">Giugno</option>
            <option value="07">Luglio</option>
            <option value="08">Agosto</option>
            <option value="09">Settembre</option>
            <option value="10">Ottobre</option>
            <option value="11">Novembre</option>
            <option value="12">Dicembre</option>
          </select>
        </div>

        <div className="col-auto">
          <label className="me-2 fw-semibold">🏢 Azienda:</label>
          <select
            className="form-select"
            value={selectedAzienda}
            onChange={(e) => setSelectedAzienda(e.target.value)}
          >
            <option value="all">Tutte</option>
            {aziendeUniche.map((az, i) => (
              <option key={i} value={az}>{az}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Caricamento spese...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <p className="text-center text-muted">📭 Nessuna spesa registrata.</p>
      ) : (
        <div className="row g-3">
          {filteredExpenses.map(exp => (
            <div className="col-12" key={exp.numero_fattura}>
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">📄 {exp.numero_fattura}</h5>
                    <span className={`badge bg-${exp.stato === 'Pagata' ? 'success' : exp.stato === 'In attesa' ? 'warning' : exp.stato === 'Annullata' ? 'danger' : 'secondary'}`}>
                      {exp.stato || "N/D"}
                    </span>
                  </div>
                  <p className="text-muted mb-1">🗓️ {exp.data_fattura}</p>
                  <p className="mb-1">🏢 <strong>{exp.azienda}</strong></p>
                  <p className="mb-1">💶 <strong>{parseFloat(exp.importo).toFixed(2)} {exp.valuta}</strong></p>
                  <p className="mb-1">📎 {exp.tipo_documento} — 💳 {exp.tipo_pagamento}</p>

                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => handleEdit(exp)}
                      title="Modifica"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(exp.numero_fattura)}
                      title="Elimina"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
