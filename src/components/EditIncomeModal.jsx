// src/components/EditIncomeModal.jsx
import { useState } from 'react';
import { updateIncome } from '../api';

export default function EditIncomeModal({ income, onClose }) {
  const [formData, setFormData] = useState({
    id: income.id,
    data_incasso: income.data_incasso || '',
    importo: income.importo || '',
    valuta: income.valuta || 'EUR',
    metodo_incasso: income.metodo_incasso || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Opzioni per i dropdown (sincronizzate con il backend)
  const valutaOptions = [
    'EUR',
    'USD',
    'GBP'
  ];

  const metodoIncassoOptions = [
    'Contanti',
    'POS',
    'Carta di Credito',
    'Bonifico',
    'Assegno',
    'PayPal',
    'Satispay',
    'Revolut',
    'N26',
    'Postepay'
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateIncome(formData.id, formData);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Errore durante la modifica.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-success bg-opacity-10">
              <h5 className="modal-title text-success">
                ✏️ Modifica Incasso #{formData.id}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <span className="me-2">❌</span>
                  {error}
                </div>
              )}

              <div className="row g-3">
                {/* Prima riga */}
                <div className="col-md-6">
                  <label className="form-label">
                    📅 Data Incasso
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="data_incasso"
                    value={formData.data_incasso}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    💰 Importo
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="importo"
                      step="0.01"
                      min="0"
                      value={formData.importo}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                    <span className="input-group-text">€</span>
                  </div>
                </div>

                {/* Seconda riga - Dropdown */}
                <div className="col-md-6">
                  <label className="form-label">
                    💱 Valuta
                  </label>
                  <select
                    className="form-select"
                    name="valuta"
                    value={formData.valuta}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleziona valuta...</option>
                    {valutaOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    💳 Metodo Incasso
                  </label>
                  <select
                    className="form-select"
                    name="metodo_incasso"
                    value={formData.metodo_incasso}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleziona metodo...</option>
                    {metodoIncassoOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Informazioni aggiuntive */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2 text-muted">
                  📋 Informazioni Incasso
                </h6>
                <small className="text-muted">
                  <strong>ID:</strong> #{formData.id} <br/>
                  <strong>Ultima modifica:</strong> {new Date().toLocaleDateString('it-IT')}
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={onClose}
              >
                ❌ Annulla
              </button>
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Salvataggio...
                  </>
                ) : (
                  '💾 Salva Modifiche'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}