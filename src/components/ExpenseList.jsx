// src/components/ExpenseList.jsx
import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';
import EditExpenseModal from './EditExpenseModal';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function ExpenseList() {
  const { company } = useUserCompany();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [sortOption, setSortOption] = useState('data_desc');

  // Ricarica ogni volta che cambia l’azienda
  useEffect(() => {
    if (company) loadExpenses();
  }, [company]);

  async function loadExpenses() {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('❌ Errore caricamento spese:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Sei sicuro di voler eliminare questa fattura?')) return;
    try {
      await deleteExpense(id);
      await loadExpenses();
    } catch (err) {
      console.error('❌ Errore eliminazione:', err);
      alert('Errore durante l\'eliminazione. Controlla la console.');
    }
  }

  function handleEdit(expense) {
    setSelectedExpense(expense);
  }

  function handleModalClose() {
    setSelectedExpense(null);
    loadExpenses();
  }

  // Filtro per mese
  const filtered = expenses.filter(exp => {
    if (selectedMonth === 'all') return true;
    return exp.data_fattura?.split('-')[1] === selectedMonth;
  });

  // Ordinamento
  const sorted = filtered.slice().sort((a, b) => {
    if (sortOption === 'data_asc')  return new Date(a.data_fattura) - new Date(b.data_fattura);
    if (sortOption === 'data_desc') return new Date(b.data_fattura) - new Date(a.data_fattura);
    if (sortOption === 'importo_asc')  return parseFloat(a.importo) - parseFloat(b.importo);
    if (sortOption === 'importo_desc') return parseFloat(b.importo) - parseFloat(a.importo);
    return 0;
  });

  const totaleSpese = filtered.reduce((acc, s) => acc + parseFloat(s.importo || 0), 0);

  // Se non c’è azienda selezionata, chiedi di sceglierla
  if (!company) {
    return (
      <p className="text-center text-muted py-5">
        ❗ Seleziona prima un’azienda dal menu in alto
      </p>
    );
  }

  return (
    <div className="my-4">
      <h3 className="text-center mb-3 fw-semibold">
        📑 Spese per «{company.nome}»
      </h3>

      {/* Filtri */}
      <div className="mb-4 row justify-content-center g-2">
        <div className="col-auto">
          <select
            className="form-select"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option value="all">Tutti i mesi</option>
            {[...Array(12)].map((_, i) => {
              const m = String(i + 1).padStart(2, '0');
              return (
                <option key={m} value={m}>
                  {m}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="data_desc">Data ↓</option>
            <option value="data_asc">Data ↑</option>
            <option value="importo_desc">Importo ↓</option>
            <option value="importo_asc">Importo ↑</option>
          </select>
        </div>
      </div>

      {/* Mini–dashboard */}
      <div className="text-center mb-4">
        <h5 className="fw-bold">📊 Totale Spese</h5>
        <p className="mb-1">
          💸 {totaleSpese.toFixed(2)} EUR
        </p>
        <p className="text-muted">🧾 Documenti: {filtered.length}</p>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Caricamento spese...</p>
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-center text-muted">
          📭 Nessuna spesa registrata.
        </p>
      ) : (
        <div className="row g-3">
          {sorted.map(exp => (
            <div className="col-12" key={exp.id}>
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <div>
                      <h5 className="card-title mb-1 fw-bold text-primary">
                        📄 Fattura #{exp.numero_fattura || 'N/D'}
                      </h5>
                      {exp.data_fattura && (
                        <small className="text-muted">
                          🗓️{' '}
                          {new Date(exp.data_fattura).toLocaleDateString('it-IT')}
                        </small>
                      )}
                    </div>
                    <span
                      className={`badge fs-6 px-3 py-2 bg-${
                        exp.stato === 'Pagata'
                          ? 'success'
                          : exp.stato === 'In attesa'
                          ? 'warning'
                          : exp.stato === 'Annullata'
                          ? 'danger'
                          : 'secondary'
                      }`}
                    >
                      {exp.stato || 'N/D'}
                    </span>
                  </div>

                  {/* Griglia principale */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Azienda</small>
                      <strong className="fs-6">{exp.azienda}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Importo</small>
                      <strong className="fs-5 text-success">
                        {`${parseFloat(exp.importo).toFixed(2)} ${
                          exp.valuta || 'EUR'
                        }`}
                      </strong>
                    </div>
                  </div>

                  {/* Info aggiuntive */}
                  <div className="row g-2 mb-3">
                    {exp.banca && (
                      <div className="col-md-6">
                        <small className="text-muted d-block">Banca</small>
                        <strong className="fs-6">{exp.banca}</strong>
                      </div>
                    )}
                    {exp.metodo_pagamento && (
                      <div className="col-md-6">
                        <small className="text-muted d-block">
                          Metodo Pagamento
                        </small>
                        <strong className="fs-6">{exp.metodo_pagamento}</strong>
                      </div>
                    )}
                  </div>

                  {/* Azioni */}
                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(exp)}
                    >
                      ✏️ Modifica
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(exp.id)}
                    >
                      🗑️ Elimina
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
