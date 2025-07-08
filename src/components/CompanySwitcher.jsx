// src/components/CompanySwitcher.jsx
import { useState } from 'react';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function CompanySwitcher() {
  const { companies, currentCompany, setCurrentCompany, company } = useUserCompany();
  const [isOpen, setIsOpen] = useState(false);

  const handleCompanyChange = (companyId) => {
    setCurrentCompany(parseInt(companyId));
    setIsOpen(false);
  };

  if (!companies || companies.length === 0) {
    return (
      <div className="company-switcher-loading">
        <div className="spinner-border spinner-border-sm text-light me-2"></div>
        <span className="text-light opacity-75">Caricamento...</span>
      </div>
    );
  }

  return (
    <div className="company-switcher-container">
      {/* Desktop Version */}
      <div className="d-none d-md-block">
        <div className="dropdown">
          <button
            className="btn company-switcher-btn dropdown-toggle"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <div className="d-flex align-items-center">
              <div className="company-icon me-2">
                <span className="company-emoji">🏢</span>
              </div>
              <div className="company-info">
                <div className="company-name">
                  {company?.nome || 'Seleziona Azienda'}
                </div>
                <div className="company-subtitle">
                  {companies.length} {companies.length === 1 ? 'azienda' : 'aziende'}
                </div>
              </div>
            </div>
          </button>

          {isOpen && (
            <div className="dropdown-menu dropdown-menu-end show company-dropdown">
              <div className="dropdown-header">
                <h6 className="mb-0">Seleziona Azienda</h6>
                <small className="text-muted">{companies.length} disponibili</small>
              </div>
              <div className="dropdown-divider"></div>
              {companies.map(c => (
                <button
                  key={c.id}
                  className={`dropdown-item company-option ${
                    currentCompany === c.id ? 'active' : ''
                  }`}
                  onClick={() => handleCompanyChange(c.id)}
                >
                  <div className="d-flex align-items-center">
                    <div className="company-avatar me-3">
                      {c.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="company-details">
                      <div className="company-name">{c.nome}</div>
                      <small className="company-id">ID: {c.id}</small>
                    </div>
                    {currentCompany === c.id && (
                      <div className="ms-auto">
                        <span className="badge bg-primary rounded-pill">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
              <div className="dropdown-divider"></div>
              <div className="dropdown-footer">
                <small className="text-muted px-3">
                  💡 Cambia azienda per visualizzare dati diversi
                </small>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="d-md-none">
        <select
          className="form-select form-select-sm company-select-mobile"
          value={currentCompany || ''}
          onChange={e => handleCompanyChange(e.target.value)}
        >
          <option value="">Seleziona...</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Overlay per chiudere dropdown */}
      {isOpen && (
        <div 
          className="dropdown-overlay" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}