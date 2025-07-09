// src/components/ProtectedRoute.jsx
import { useUserPermissions } from '../hooks/useUserPermissions';

export default function ProtectedRoute({ 
  children, 
  requireRole = null, 
  requirePermission = null,
  fallback = null 
}) {
  const {
    isLoading,
    userRole,
    isSuperAdmin,
    isAdminAzienda,
    isManager,
    canDo
  } = useUserPermissions();

  // Mostra loading durante il caricamento dei permessi
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verifica permessi...</span>
        </div>
      </div>
    );
  }

  // Controllo per ruolo specifico
  if (requireRole) {
    const hasRequiredRole = () => {
      switch (requireRole) {
        case 'super_admin':
          return isSuperAdmin();
        case 'admin_azienda':
          return isSuperAdmin() || isAdminAzienda();
        case 'manager':
          return isSuperAdmin() || isAdminAzienda() || isManager();
        default:
          return false;
      }
    };

    if (!hasRequiredRole()) {
      return fallback || (
        <div className="container py-5 text-center">
          <div className="alert alert-warning">
            <h4>🚫 Accesso Negato</h4>
            <p>Non hai i permessi per accedere a questa sezione.</p>
            <p><strong>Ruolo richiesto:</strong> {requireRole}</p>
            <p><strong>Il tuo ruolo:</strong> {userRole || 'Nessuno'}</p>
          </div>
        </div>
      );
    }
  }

  // Controllo per permesso specifico
  if (requirePermission) {
    const { resource, action } = requirePermission;

    if (!canDo(resource, action)) {
      return fallback || (
        <div className="container py-5 text-center">
          <div className="alert alert-warning">
            <h4>🚫 Permesso Negato</h4>
            <p>Non hai il permesso per eseguire questa azione.</p>
            <p><strong>Permesso richiesto:</strong> {action} su {resource}</p>
            <p><strong>Il tuo ruolo:</strong> {userRole || 'Nessuno'}</p>
          </div>
        </div>
      );
    }
  }

  // Se tutti i controlli passano, mostra il contenuto
  return children;
}