// src/pages/AdminUsers.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role_name: 'user' });
  const [inviteLoading, setInviteLoading] = useState(false);

  const { userId, currentCompany, company, userRole, apiBase, isSuperAdmin } = useUserCompany();

  // Carica utenti dell'azienda
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${apiBase}/admin/users`, {
        headers: { 
          'x-user-id': userId,
          'x-company-id': currentCompany 
        }
      });

      setUsers(response.data);
    } catch (err) {
      console.error('❌ Errore caricamento utenti:', err);
      setError(err.response?.data?.error || 'Errore caricamento utenti');
    } finally {
      setLoading(false);
    }
  };

  // Carica ruoli disponibili
  const loadRoles = async () => {
    try {
      const response = await axios.get(`${apiBase}/admin/roles`, {
        headers: { 
          'x-user-id': userId,
          'x-company-id': currentCompany 
        }
      });

      setRoles(response.data);
    } catch (err) {
      console.error('❌ Errore caricamento ruoli:', err);
    }
  };

  // Invita nuovo utente
  const handleInviteUser = async (e) => {
    e.preventDefault();

    if (!inviteData.email || !inviteData.role_name) {
      alert('Email e ruolo sono richiesti');
      return;
    }

    try {
      setInviteLoading(true);

      await axios.post(`${apiBase}/admin/users/invite`, inviteData, {
        headers: { 
          'x-user-id': userId,
          'x-company-id': currentCompany 
        }
      });

      // Reset form
      setInviteData({ email: '', role_name: 'user' });
      setShowInviteForm(false);

      // Ricarica la lista
      await loadUsers();

      alert('Utente invitato con successo!');
    } catch (err) {
      console.error('❌ Errore invito utente:', err);
      alert(err.response?.data?.error || 'Errore durante l\'invito');
    } finally {
      setInviteLoading(false);
    }
  };

  // Cambia ruolo utente
  const handleChangeRole = async (targetUserId, newRole) => {
    if (!confirm(`Sicuro di voler cambiare il ruolo in "${newRole}"?`)) return;

    try {
      await axios.put(`${apiBase}/admin/users/${targetUserId}/role`, 
        { role_name: newRole },
        {
          headers: { 
            'x-user-id': userId,
            'x-company-id': currentCompany 
          }
        }
      );

      // Ricarica la lista
      await loadUsers();

      alert('Ruolo aggiornato con successo!');
    } catch (err) {
      console.error('❌ Errore cambio ruolo:', err);
      alert(err.response?.data?.error || 'Errore durante il cambio ruolo');
    }
  };

  // Carica dati al mount
  useEffect(() => {
    if (currentCompany) {
      loadUsers();
      loadRoles();
    }
  }, [currentCompany]);

  // Ottieni badge per ruolo
  const getRoleBadge = (roleName) => {
    const roleStyles = {
      'super_admin': 'bg-danger',
      'admin_azienda': 'bg-warning text-dark',
      'manager': 'bg-info',
      'user': 'bg-primary',
      'guest': 'bg-secondary'
    };

    return roleStyles[roleName] || 'bg-secondary';
  };

  // Ottieni ruoli che l'utente può assegnare
  const getAssignableRoles = () => {
    if (isSuperAdmin()) {
      return roles; // Super admin può assegnare tutti i ruoli
    }
    // Admin azienda non può assegnare super_admin
    return roles.filter(role => role.name !== 'super_admin');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p className="mt-3">Caricamento utenti...</p>
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
              <h1 className="mb-1">👥 Gestione Utenti</h1>
              <p className="text-muted mb-0">
                Utenti di <strong>{company?.nome || 'Azienda'}</strong>
                {userRole && (
                  <span className={`badge ${getRoleBadge(userRole)} ms-2`}>
                    Il tuo ruolo: {userRole}
                  </span>
                )}
              </p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowInviteForm(!showInviteForm)}
            >
              <i className="fas fa-user-plus me-2"></i>
              Invita Utente
            </button>
          </div>
        </div>
      </div>

      {/* Form invito utente */}
      {showInviteForm && (
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Invita Nuovo Utente</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleInviteUser}>
                  <div className="mb-3">
                    <label className="form-label">Email Utente *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                      placeholder="utente@email.com"
                      required
                    />
                    <div className="form-text">
                      L'utente deve già essere registrato nel sistema (aver fatto login con Google)
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ruolo *</label>
                    <select
                      className="form-select"
                      value={inviteData.role_name}
                      onChange={(e) => setInviteData({...inviteData, role_name: e.target.value})}
                      required
                    >
                      {getAssignableRoles().map(role => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={inviteLoading}
                    >
                      {inviteLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Invio...
                        </>
                      ) : (
                        'Invita Utente'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowInviteForm(false)}
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
            onClick={loadUsers}
          >
            Riprova
          </button>
        </div>
      )}

      {/* Lista utenti */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Utenti dell'Azienda ({users.length})</h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={loadUsers}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Aggiorna
              </button>
            </div>
            <div className="card-body p-0">
              {users.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <i className="fas fa-users fa-3x mb-3"></i>
                    <h5>Nessun utente trovato</h5>
                    <p>Invita il primo utente per iniziare</p>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Utente</th>
                        <th>Email</th>
                        <th>Ruolo</th>
                        <th>Ultimo Accesso</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {user.profile_picture && (
                                <img 
                                  src={user.profile_picture} 
                                  alt={user.name}
                                  className="rounded-circle me-2"
                                  width="32"
                                  height="32"
                                />
                              )}
                              <div>
                                <div><strong>{user.name || 'Nome non disponibile'}</strong></div>
                                <small className="text-muted">ID: {user.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${getRoleBadge(user.role_name)}`}>
                              {user.role_name}
                            </span>
                          </td>
                          <td>
                            {user.last_login ? (
                              <small>{new Date(user.last_login).toLocaleString('it-IT')}</small>
                            ) : (
                              <small className="text-muted">Mai</small>
                            )}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                              >
                                Azioni
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <h6 className="dropdown-header">Cambia Ruolo</h6>
                                </li>
                                {getAssignableRoles()
                                  .filter(role => role.name !== user.role_name)
                                  .map(role => (
                                    <li key={role.id}>
                                      <button 
                                        className="dropdown-item"
                                        onClick={() => handleChangeRole(user.id, role.name)}
                                      >
                                        → {role.name}
                                      </button>
                                    </li>
                                  ))
                                }
                              </ul>
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
                {roles.map(role => {
                  const count = users.filter(u => u.role_name === role.name).length;
                  return (
                    <div key={role.id} className="col-md-2 mb-2">
                      <h4 className="text-primary">{count}</h4>
                      <small className="text-muted">{role.name}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}