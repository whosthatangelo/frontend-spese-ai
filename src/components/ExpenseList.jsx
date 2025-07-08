// src/components/ExpenseListClean.jsx
import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api';
import EditExpenseModal from './EditExpenseModal';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function ExpenseListClean({ filterPeriod, sortBy, onUpdate }) {
  const { company } = useUserCompany();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

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
      if (onUpdate) onUpdate(); // Aggiorna statistiche nella pagina padre
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
    if (onUpdate) onUpdate(); // Aggiorna statistiche dopo modifica
  }

  // Applica filtri ricevuti dalla pagina padre
  const filtered = expenses.filter(exp => {
    if (filterPeriod === 'all') return true;

    const expDate = new Date(exp.data_fattura);
    const today = new Date();

    switch (filterPeriod) {
      case 'today':
        return expDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return expDate >= weekAgo;
      case 'month':
        return expDate.getMonth() === today.getMonth() && 
               expDate.getFullYear() === today.getFullYear();
      case 'year':
        return expDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  });

  // Applica ordinamento ricevuto dalla pagina padre
  const sorted = filtered.slice().sort((a, b) => {
    switch (sortBy) {
      case 'date_asc':
        return new Date(a.data_fattura) - new Date(b.data_fattura);
      case 'date_desc':
        return new Date(b.data_fattura) - new Date(a.data_fattura);
      case 'amount_asc':
        return parseFloat(a.importo) - parseFloat(b.importo);
      case 'amount_desc':
        return parseFloat(b.importo) - parseFloat(a.importo);
      default:
        return new Date(b.data_fattura) - new Date(a.data_fattura);
    }
  });

  // Render della singola card - COMPLETA CON TUTTI I CAMPI
  const renderExpenseCard = (exp) => (
    <div className="col-12 mb-3" key={exp.id}>
      <div className="card hover-card">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2" style={{ width: '40px', height: '40px' }}>
                <span className="text-primary">🧾</span>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                  Fattura #{exp.numero_fattura || 'N/D'}
                </h6>
                {exp.data_fattura && (
                  <small className="text-muted">
                    📅 {new Date(exp.data_fattura).toLocaleDateString("it-IT")}
                  </small>
                )}
              </div>
            </div>
            <span className={`badge rounded-pill px-2 py-1 ${
              exp.stato === 'Pagata' ? 'bg-success' :
              exp.stato === 'In attesa' ? 'bg-warning' :
              exp.stato === 'Annullata' ? 'bg-danger' : 'bg-secondary'
            }`} style={{ fontSize: '0.75rem' }}>
              {exp.stato || 'N/D'}
            </span>
          </div>

          {/* Riga principale: Importo e Azienda */}
          <div className="row g-2 mb-2">
            <div className="col-6">
              <small className="text-muted">💰 Importo</small>
              <div className="fw-bold text-danger" style={{ fontSize: '0.9rem' }}>
                -{exp.importo != null ? `€${parseFloat(exp.importo).toFixed(2)}` : 'N/D'}
                {exp.valuta && exp.valuta !== 'EUR' && (
                  <small className="text-muted ms-1">({exp.valuta})</small>
                )}
              </div>
            </div>
            <div className="col-6">
              <small className="text-muted">🏢 Azienda</small>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {exp.azienda || 'N/D'}
              </div>
            </div>
          </div>

          {/* Riga secondaria: Metodo pagamento e Tipo documento */}
          <div className="row g-2 mb-2">
            <div className="col-6">
              <small className="text-muted">💳 Metodo Pagamento</small>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {exp.metodo_pagamento || 'N/D'}
              </div>
            </div>
            <div className="col-6">
              <small className="text-muted">📄 Tipo Documento</small>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {exp.tipo_documento || 'N/D'}
              </div>
            </div>
          </div>

          {/* Riga aggiuntive se presenti */}
          {(exp.banca || exp.tipo_pagamento) && (
            <div className="row g-2 mb-2">
              {exp.banca && (
                <div className="col-6">
                  <small className="text-muted">🏦 Banca</small>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {exp.banca}
                  </div>
                </div>
              )}
              {exp.tipo_pagamento && (
                <div className="col-6">
                  <small className="text-muted">⚡ Tipo Pagamento</small>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {exp.tipo_pagamento}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info creazione - sezione tecnica meno prominente */}
          {(exp.data_creazione || exp.utente_id || exp.azienda_id) && (
            <div className="border-top pt-2 mt-2" style={{ backgroundColor: '#f8f9fa', margin: '0.75rem -0.75rem -0.75rem -0.75rem', padding: '0.5rem 0.75rem' }}>
              <small className="text-muted mb-2 d-block">ℹ️ Info Tecniche</small>
              <div className="row g-2">
                {exp.data_creazione && (
                  <div className="col-md-4 col-6">
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>🕒 Creato</small>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {new Date(exp.data_creazione).toLocaleDateString("it-IT", { 
                        day: '2-digit', 
                        month: '2-digit',
                        year: '2-digit'
                      })} {new Date(exp.data_creazione).toLocaleTimeString("it-IT", { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                )}
                {exp.utente_id && (
                  <div className="col-md-4 col-6">
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>👤 User ID</small>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {exp.utente_id}
                    </div>
                  </div>
                )}
                {exp.azienda_id && (
                  <div className="col-md-4 col-6">
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>🏢 Company ID</small>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {exp.azienda_id}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pulsanti azione */}
          <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
            <button
              className="btn btn-outline-primary btn-sm rounded-pill"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleEdit(exp)}
            >
              ✏️ Modifica
            </button>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleDelete(exp.id)}
            >
              🗑️ Elimina
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!company) {
    return (
      <p className="text-center text-muted py-5">
        ❗ Seleziona prima un'azienda dal menu in alto
      </p>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Caricamento spese...</p>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
        <p className="text-muted mb-3">
          {filterPeriod === 'all' ? 
            'Nessuna spesa registrata.' : 
            `Nessuna spesa trovata per il periodo selezionato.`
          }
        </p>
        {filterPeriod !== 'all' && (
          <small className="text-muted">
            Prova a cambiare il filtro periodo per vedere altre spese.
          </small>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="row g-2">
        {sorted.map(renderExpenseCard)}
      </div>

      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}