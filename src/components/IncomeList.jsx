// src/components/IncomeListClean.jsx
import { useEffect, useState } from 'react';
import { getIncomes, deleteIncome } from '../api';
import EditIncomeModal from './EditIncomeModal';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function IncomeListClean({ filterPeriod, sortBy, onUpdate }) {
  const { company } = useUserCompany();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  useEffect(() => {
    if (company) loadIncomes();
  }, [company]);

  async function loadIncomes() {
    setLoading(true);
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (err) {
      console.error('❌ Errore caricamento incassi:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Sei sicuro di voler eliminare questo incasso?')) return;
    try {
      await deleteIncome(id);
      await loadIncomes();
      if (onUpdate) onUpdate(); // Aggiorna statistiche nella pagina padre
    } catch (err) {
      console.error('❌ Errore eliminazione:', err);
      alert('Errore durante l\'eliminazione. Controlla la console.');
    }
  }

  function handleEdit(income) {
    setSelectedIncome(income);
  }

  function handleModalClose() {
    setSelectedIncome(null);
    loadIncomes();
    if (onUpdate) onUpdate(); // Aggiorna statistiche dopo modifica
  }

  // Applica filtri ricevuti dalla pagina padre
  const filtered = incomes.filter(inc => {
    if (filterPeriod === 'all') return true;

    const incDate = new Date(inc.data_incasso);
    const today = new Date();

    switch (filterPeriod) {
      case 'today':
        return incDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return incDate >= weekAgo;
      case 'month':
        return incDate.getMonth() === today.getMonth() && 
               incDate.getFullYear() === today.getFullYear();
      case 'year':
        return incDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  });

  // Applica ordinamento ricevuto dalla pagina padre
  const sorted = filtered.slice().sort((a, b) => {
    switch (sortBy) {
      case 'date_asc':
        return new Date(a.data_incasso) - new Date(b.data_incasso);
      case 'date_desc':
        return new Date(b.data_incasso) - new Date(a.data_incasso);
      case 'amount_asc':
        return parseFloat(a.importo) - parseFloat(b.importo);
      case 'amount_desc':
        return parseFloat(b.importo) - parseFloat(a.importo);
      default:
        return new Date(b.data_incasso) - new Date(a.data_incasso);
    }
  });

  // Render della singola card - STESSO STILE DELLA HOME
  const renderIncomeCard = (inc) => (
    <div className="col-12 mb-3" key={inc.id}>
      <div className="card hover-card">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2" style={{ width: '40px', height: '40px' }}>
                <span className="text-success">💰</span>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-success" style={{ fontSize: '0.9rem' }}>
                  Incasso #{inc.id}
                </h6>
                {inc.data_incasso && (
                  <small className="text-muted">
                    📅 {new Date(inc.data_incasso).toLocaleDateString("it-IT")}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <small className="text-muted">💎 Importo</small>
              <div className="fw-bold text-success" style={{ fontSize: '0.9rem' }}>
                +{inc.importo != null ? `€${parseFloat(inc.importo).toFixed(2)}` : 'N/D'}
              </div>
            </div>
            <div className="col-6">
              <small className="text-muted">💳 Metodo</small>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {inc.metodo_incasso || 'N/D'}
              </div>
            </div>
          </div>

          {/* Informazioni aggiuntive se presenti */}
          {(inc.valuta && inc.valuta !== 'EUR') && (
            <div className="row g-2 mt-2">
              <div className="col-6">
                <small className="text-muted">💱 Valuta</small>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {inc.valuta}
                </div>
              </div>
            </div>
          )}

          {/* Pulsanti azione */}
          <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
            <button
              className="btn btn-outline-success btn-sm rounded-pill"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleEdit(inc)}
            >
              ✏️ Modifica
            </button>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleDelete(inc.id)}
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
        <div className="spinner-border text-success" role="status" />
        <p className="mt-3">Caricamento incassi...</p>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
        <p className="text-muted mb-3">
          {filterPeriod === 'all' ? 
            'Nessun incasso registrato.' : 
            `Nessun incasso trovato per il periodo selezionato.`
          }
        </p>
        {filterPeriod !== 'all' && (
          <small className="text-muted">
            Prova a cambiare il filtro periodo per vedere altri incassi.
          </small>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="row g-2">
        {sorted.map(renderIncomeCard)}
      </div>

      {selectedIncome && (
        <EditIncomeModal
          income={selectedIncome}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}