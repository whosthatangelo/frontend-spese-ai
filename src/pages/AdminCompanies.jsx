// src/pages/AdminCompanies.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ nome: '', admin_email: '' });
  const [createLoading, setCreateLoading] = useState(false);

  const { userId, apiBase } = useUserCompany();

  // Carica tutte le companies
  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${apiBase}/admin/companies`, {
        headers: { 'x-user-id': userId }
      });

      setCompanies(response.data);
    } catch (err) {
      console.error('❌ Errore caricamento companies:', err);
      setError(err.response?.data?.error || 'Errore caricamento companies');
    } finally {
      setLoading(false);
    }
  };

  // Crea nuova company
  const handleCreateCompany = async (e) => {
    e.preventDefault();

    if (!newCompany.nome || !newCompany.admin_email) {
      alert('Nome azienda e email admin sono richiesti');
      return;
    }

    try {
      setCreateLoading(true);

      await axios.post(`${apiBase}/admin/companies`, newCompany, {
        headers: { 'x-user-id': userId }
      });

      // Reset form
      setNewCompany({ nome: '', admin_email: '' });
      setShowCreateForm(false);

      // Ricarica la lista
      await loadCompanies();

      alert('Azienda creata con successo!');
    } catch (err) {
      console.error('❌ Errore creazione company:', err);
      alert(err.response?.data?.error || 'Errore durante la creazione');
    } finally {
      setCreateLoading(false);
    }
  };

  // Carica companies al mount
  useEffect(() => {
    loadCompanies();
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p className="mt-3">Caricamento aziende...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">🏢 Gestione Aziende</h1>
              <p className="text-muted mb-0">Amministrazione globale delle aziende del sistema</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <i className="fas fa-plus me-2"></i>
              Nuova Azienda
            </button>
          </div>
        </div>
      </div>

      {/* Form creazione azienda */}
      {showCreateForm && (
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Crea Nuova Azienda</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleCreateCompany}>
                  <div className="mb-3">
                    <label className="form-label">Nome Azienda *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCompany.nome}
                      onChange={(e) => setNewCompany({...newCompany, nome: e.target.value})}
                      placeholder="Es: Acme Corporation"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Admin Azienda *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newCompany.admin_email}
                      onChange={(e) => setNewCompany({...newCompany, admin_email: e.target.value})}
                      placeholder="admin@azienda.com"
                      required
                    />
                    <div className="form-text">
                      L'utente deve già esistere nel sistema (aver fatto login con Google)
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={createLoading}
                    >
                      {createLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creazione...
                        </>
                      ) : (
                        'Crea Azienda'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Annulla
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Errore */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Errore:</strong> {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={loadCompanies}
          >
            Riprova
          </button>
        </div>
      )}

      {/* Lista companies */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Aziende Registrate ({companies.length})</h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={loadCompanies}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Aggiorna
              </button>
            </div>
            <div className="card-body p-0">
              {companies.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <i className="fas fa-building fa-3x mb-3"></i>
                    <h5>Nessuna azienda trovata</h5>
                    <p>Crea la prima azienda per iniziare</p>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nome Azienda</th>
                        <th>Admin</th>
                        <th>Utenti</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((company) => (
                        <tr key={company.id}>
                          <td>
                            <span className="badge bg-secondary">{company.id}</span>
                          </td>
                          <td>
                            <strong>{company.nome}</strong>
                          </td>
                          <td>
                            {company.admin_name ? (
                              <div>
                                <div><strong>{company.admin_name}</strong></div>
                                <small className="text-muted">{company.admin_email}</small>
                              </div>
                            ) : (
                              <span className="text-warning">Nessun admin</span>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-primary">
                              {company.user_count || 0} utenti
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-info"
                                title="Visualizza dettagli"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                title="Modifica azienda"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="row mt-4">
        <div className="col">
          <div className="card bg-light">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <h4 className="text-primary">{companies.length}</h4>
                  <small className="text-muted">Aziende Totali</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-success">
                    {companies.reduce((acc, c) => acc + (parseInt(c.user_count) || 0), 0)}
                  </h4>
                  <small className="text-muted">Utenti Totali</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-info">
                    {companies.filter(c => c.admin_email).length}
                  </h4>
                  <small className="text-muted">Con Admin</small>
                </div>
                <div className="col-md-3">
                  <h4 className="text-warning">
                    {companies.filter(c => !c.admin_email).length}
                  </h4>
                  <small className="text-muted">Senza Admin</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}