// src/hooks/useUserPermissions.js - VERSIONE COMPLETA
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserCompany } from '../contexts/UserCompanyContext';

export function useUserPermissions() {
  const [permissions, setPermissions] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔧 FIX: Usa currentCompany invece di companyId
  const { userId, currentCompany } = useUserCompany();

  useEffect(() => {
    const fetchPermissions = async () => {
      // 🔧 FIX: Usa currentCompany
      if (!userId || !currentCompany) {
        setPermissions(null);
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/permissions`,
          {
            headers: {
              'x-user-id': userId,
              'x-company-id': currentCompany // 🔧 FIX: Usa currentCompany
            }
          }
        );

        const { role, permissions: userPermissions } = response.data;

        setUserRole(role);
        setPermissions(userPermissions);

        console.log(`👤 Hook - Ruolo utente: ${role}`, userPermissions);

      } catch (err) {
        console.error('❌ Errore caricamento permessi hook:', err);
        setError(err.response?.data?.error || 'Errore caricamento permessi');
        setPermissions(null);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [userId, currentCompany]); // 🔧 FIX: Dipendenza corretta

  // Utility functions per controllare i permessi
  const canDo = (resource, action) => {
    if (!permissions || !permissions[resource]) return false;
    return permissions[resource][action] === true;
  };

  const canRead = (resource) => canDo(resource, 'read');
  const canCreate = (resource) => canDo(resource, 'create');
  const canUpdate = (resource) => canDo(resource, 'update');
  const canDelete = (resource) => canDo(resource, 'delete');
  const canReadAll = (resource) => canDo(resource, 'read_all');
  const canAssignRoles = () => canDo('users', 'assign_roles');

  // Controlli specifici per ruoli
  const isSuperAdmin = () => userRole === 'super_admin';
  const isAdminAzienda = () => userRole === 'admin_azienda';
  const isManager = () => userRole === 'manager';
  const isUser = () => userRole === 'user';
  const isGuest = () => userRole === 'guest';

  // Controlla se può gestire companies
  const canManageCompanies = () => isSuperAdmin();

  // Controlla se può gestire utenti
  const canManageUsers = () => isSuperAdmin() || isAdminAzienda();

  // Controlla se può vedere tutte le spese/incassi dell'azienda
  const canViewAllExpenses = () => canReadAll('expenses');
  const canViewAllIncomes = () => canReadAll('incomes');

  // Controlla se può vedere analytics globali
  const canViewGlobalAnalytics = () => permissions?.analytics?.global === true;
  const canViewCompanyAnalytics = () => permissions?.analytics?.company === true;

  return {
    // Dati
    permissions,
    userRole,
    isLoading,
    error,

    // Funzioni di controllo generiche
    canDo,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canReadAll,
    canAssignRoles,

    // Controlli ruoli
    isSuperAdmin,
    isAdminAzienda,
    isManager,
    isUser,
    isGuest,

    // Controlli specifici
    canManageCompanies,
    canManageUsers,
    canViewAllExpenses,
    canViewAllIncomes,
    canViewGlobalAnalytics,
    canViewCompanyAnalytics
  };
}