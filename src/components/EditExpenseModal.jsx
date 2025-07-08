// src/components/EditExpenseModal.jsx
import { useState } from 'react';
import { updateExpense } from '../api';

export default function EditExpenseModal({ expense, onClose }) {
  const [formData, setFormData] = useState({ ...expense });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Opzioni per i dropdown (sincronizzate con il backend)
  const valutaOptions = [
    'EUR',
    'USD',
    'GBP'
  ];

  const metodoPagamentoOptions = [
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

  const tipoDocumentoOptions = [
    'Fattura',
    'Documento di Trasporto',
    'Ricevuta',
    'Scontrino',
    'Nota di Credito',
    'Preventivo',
    'Fattura Proforma'
  ];

  const tipoPagamentoOptions = [
    'Fine mese',
    'Immediato',
    '30 giorni',
    '60 giorni',
    '90 giorni',
    'A vista',
    'Alla consegna',
    'Anticipato',
    'Rateale'
  ];

  const statoOptions = [
    'Pagata',
    'In attesa',
    'Annullata'
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
      await updateExpense(formData.numero_fattura, formData);
      onClose();
    } catch (err) {
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
              <h5 className="modal-title">✏️ Modifica Spesa</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="row g-3">
                {/* Prima riga */}
                <div className="col-md-6">
                  <label className="form-label">📄 Numero Fattura</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="numero_fattura" 
                    value={formData.numero_fattura} 
                    disabled 
                  />
                  <small className="text-muted">Il numero fattura non può essere modificato</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">📅 Data Fattura</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    name="data_fattura" 
                    value={formData.data_fattura} 
                    onChange={handleChange} 
                  />
                </div>

                {/* Seconda riga */}
                <div className="col-md-6">
                  <label className="form-label">🏢 Azienda</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="azienda" 
                    value={formData.azienda || ''} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">💰 Importo</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    step="0.01" 
                    name="importo" 
                    value={formData.importo} 
                    onChange={handleChange} 
                  />
                </div>

                {/* Terza riga - Dropdown */}
                <div className="col-md-4">
                  <label className="form-label">💱 Valuta</label>
                  <select 
                    className="form-select" 
                    name="valuta" 
                    value={formData.valuta || ''} 
                    onChange={handleChange}
                  >
                    <option value="">Seleziona valuta...</option>
                    {valutaOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">💳 Metodo Pagamento</label>
                  <select 
                    className="form-select" 
                    name="metodo_pagamento" 
                    value={formData.metodo_pagamento || ''} 
                    onChange={handleChange}
                  >
                    <option value="">Seleziona metodo...</option>
                    {metodoPagamentoOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">⚡ Stato</label>
                  <select 
                    className="form-select" 
                    name="stato" 
                    value={formData.stato || ''} 
                    onChange={handleChange}
                  >
                    <option value="">Seleziona stato...</option>
                    {statoOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Quarta riga - Altri dropdown */}
                <div className="col-md-6">
                  <label className="form-label">📋 Tipo Documento</label>
                  <select 
                    className="form-select" 
                    name="tipo_documento" 
                    value={formData.tipo_documento || ''} 
                    onChange={handleChange}
                  >
                    <option value="">Seleziona tipo documento...</option>
                    {tipoDocumentoOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">📆 Tipo Pagamento</label>
                  <select 
                    className="form-select" 
                    name="tipo_pagamento" 
                    value={formData.tipo_pagamento || ''} 
                    onChange={handleChange}
                  >
                    <option value="">Seleziona tipo pagamento...</option>
                    {tipoPagamentoOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Quinta riga - Campo opzionale */}
                <div className="col-md-12">
                  <label className="form-label">🏦 Banca</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="banca" 
                    value={formData.banca || ''} 
                    onChange={handleChange} 
                    placeholder="Nome della banca (opzionale)"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                ❌ Annulla
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
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