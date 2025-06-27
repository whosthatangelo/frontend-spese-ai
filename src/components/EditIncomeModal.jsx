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
            <div className="modal-header">
              <h5 className="modal-title">Modifica Incasso</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Data Incasso</label>
                  <input
                    type="date"
                    className="form-control"
                    name="data_incasso"
                    value={formData.data_incasso}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Importo</label>
                  <input
                    type="number"
                    className="form-control"
                    name="importo"
                    step="0.01"
                    value={formData.importo}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Valuta</label>
                  <input
                    type="text"
                    className="form-control"
                    name="valuta"
                    value={formData.valuta}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Metodo Incasso</label>
                  <input
                    type="text"
                    className="form-control"
                    name="metodo_incasso"
                    value={formData.metodo_incasso}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
