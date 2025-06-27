import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';
import EditExpenseModal from './EditExpenseModal';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedAzienda, setSelectedAzienda] = useState("all");
  const [sortOption, setSortOption] = useState("data_desc");

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
    const conferma = confirm(`Sei sicuro di voler eliminare la fattura ${numero_fattura}?`);
    if (!conferma) return;

    try {
      const res = await deleteExpense(numero_fattura);
      console.log("✅ Eliminazione completata:", res);
      await loadExpenses();
    } catch (err) {
      console.error("❌ Errore durante eliminazione:", err);
      alert("Errore durante l'eliminazione. Controlla la console.");
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

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortOption === "data_asc") {
      return new Date(a.data_fattura) - new Date(b.data_fattura);
    } else if (sortOption === "data_desc") {
      return new Date(b.data_fattura) - new Date(a.data_fattura);
    } else if (sortOption === "importo_asc") {
      return parseFloat(a.importo) - parseFloat(b.importo);
    } else if (sortOption === "importo_desc") {
      return parseFloat(b.importo) - parseFloat(a.importo);
    }
    return 0;
  });

  const totaleSpese = filteredExpenses.reduce(
    (acc, spesa) => acc + parseFloat(spesa.importo || 0),
    0
  );

  return (
    <div className="my-4">
      <h3 className="text-center mb-3 fw-semibold">📑 Elenco Completo delle Spese</h3>

      {/* Filtri */}
      <div className="mb-4 row justify-content-center g-2">
        <div className="col-auto">
          <label className="me-2 fw-semibold">📅 Mese:</label>
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">Tutti</option>
            {Array.from({ length: 12 }, (_, i) => {
              const value = String(i + 1).padStart(2, "0");
              const nome = new Date(0, i).toLocaleString("it-IT", { month: "long" });
              return <option key={value} value={value}>{nome}</option>;
            })}
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

        <div className="col-auto">
          <label className="me-2 fw-semibold">🧮 Ordina per:</label>
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="data_desc">📅 Data (più recente)</option>
            <option value="data_asc">📅 Data (più vecchia)</option>
            <option value="importo_desc">💰 Importo (alto → basso)</option>
            <option value="importo_asc">💰 Importo (basso → alto)</option>
          </select>
        </div>
      </div>

      {/* Mini dashboard */}
      <div className="text-center mb-4">
        <h5 className="fw-bold">📊 Totale Spese Filtrate</h5>
        <p className="mb-1">💸 Totale: <strong>{totaleSpese.toFixed(2)} EUR</strong></p>
        <p className="text-muted">🧾 Documenti: {filteredExpenses.length}</p>
      </div>

      {/* Elenco spese */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Caricamento spese...</p>
        </div>
      ) : sortedExpenses.length === 0 ? (
        <p className="text-center text-muted">📭 Nessuna spesa registrata.</p>
      ) : (
        <div className="row g-3">
          {sortedExpenses.map(exp => (
            <div className="col-12" key={exp.numero_fattura}>
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">📄 Fattura {exp.numero_fattura}</h5>
                    <span className={`badge bg-${exp.stato === 'Pagata' ? 'success' : exp.stato === 'In attesa' ? 'warning' : exp.stato === 'Annullata' ? 'danger' : 'secondary'}`}>
                      {exp.stato || "N/D"}
                    </span>
                  </div>

                  {exp.data_fattura && (
                    <p className="text-muted mb-1">
                      🗓️ Data: {new Date(exp.data_fattura).toLocaleDateString("it-IT")}
                    </p>
                  )}

                  {exp.azienda && (
                    <p className="mb-1">🏢 Azienda: <strong>{exp.azienda}</strong></p>
                  )}

                  {exp.importo && (
                    <p className="mb-1">💶 Importo: <strong>{parseFloat(exp.importo).toFixed(2)} {exp.valuta}</strong></p>
                  )}

                  {(exp.tipo_documento || exp.tipo_pagamento) && (
                    <p className="mb-1">
                      📎 {exp.tipo_documento || "Documento N/D"} — 💳 {exp.tipo_pagamento || "Pagamento N/D"}
                    </p>
                  )}

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
