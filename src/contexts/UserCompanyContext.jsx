// src/contexts/UserCompanyContext.jsx - VERSIONE CORRETTA
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserCompanyContext = createContext();

export function UserCompanyProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId');
    console.log('🧠 userId iniziale dal localStorage:', stored);
    return stored;
  });

  const [companies, setCompanies] = useState([]);

  const [currentCompany, setCurrentCompany] = useState(() => {
    const stored = localStorage.getItem('companyId');
    console.log('🏢 companyId iniziale dal localStorage:', stored);
    return stored ? parseInt(stored) : null; // Converte a numero
  });

  // 🆕 Stati per i permessi
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL;

  // 🔄 Carico le aziende per l'utente loggato
  useEffect(() => {
    if (!userId) {
      console.warn('⚠️ userId non definito, salta chiamata alle aziende');
      return;
    }
    console.log(`📡 Fetch aziende per userId = ${userId}`);
    axios.get(`${apiBase}/companies`, {
      headers: { 'x-user-id': userId }
    })
    .then(res => {
      console.log('✅ Aziende ricevute dal backend:', res.data);
      setCompanies(res.data);
      if (res.data.length > 0 && !localStorage.getItem('companyId')) {
        const defaultCompanyId = res.data[0].id;
        console.log(`🎯 Nessuna azienda selezionata, imposto la prima: ${defaultCompanyId}`);
        setCurrentCompany(defaultCompanyId);
        localStorage.setItem('companyId', String(defaultCompanyId)); // Salva come stringa
      }
    })
    .catch(err => {
      console.error('❌ Errore nel caricamento aziende:', err);
    });
  }, [userId]);

  // 🆕 Carica i permessi dell'utente
  useEffect(() => {
    const loadPermissions = async () => {
      if (!userId || !currentCompany) {
        setUserRole(null);
        setPermissions(null);
        return;
      }

      try {
        setPermissionsLoading(true);

        const response = await axios.get(`${apiBase}/user/permissions`, {
          headers: {
            'x-user-id': userId,
            'x-company-id': currentCompany
          }
        });

        const { role, permissions: userPermissions } = response.data;

        setUserRole(role);
        setPermissions(userPermissions);

        console.log(`👤 Context - Ruolo: ${role}`, userPermissions);

      } catch (error) {
        console.error('❌ Errore caricamento permessi context:', error);
        setUserRole(null);
        setPermissions(null);
      } finally {
        setPermissionsLoading(false);
      }
    };

    loadPermissions();
  }, [userId, currentCompany, apiBase]);

  // 🧠 Salva il cambio azienda nel localStorage
  useEffect(() => {
    if (currentCompany) {
      console.log(`💾 Salvo companyId: ${currentCompany}`);
      localStorage.setItem('companyId', String(currentCompany)); // Salva come stringa
    }
  }, [currentCompany]);

  // 🎯 Trova l'oggetto azienda completo basato su currentCompany
  const company = companies.find(c => c.id === parseInt(currentCompany)) || null;

  console.log('🔍 Context Debug:', {
    userId,
    currentCompany,
    company,
    companiesCount: companies.length,
    userRole,
    hasPermissions: !!permissions
  });

  return (
    <UserCompanyContext.Provider value={{
      // Valori esistenti
      userId,
      setUserId,
      companies,
      currentCompany,
      setCurrentCompany,
      company, // oggetto azienda completo
      apiBase,

      // 🆕 Nuovi valori per permessi
      userRole,
      permissions,
      permissionsLoading,

      // 🆕 Utility come VALORI (non funzioni)
      isSuperAdmin: userRole === 'super_admin',
      isAdminAzienda: userRole === 'admin_azienda' || userRole === 'super_admin',
      isManager: userRole === 'manager' || userRole === 'admin_azienda' || userRole === 'super_admin',
      isUser: userRole === 'user',
      isGuest: userRole === 'guest',

      // 🆕 Funzioni di controllo
      checkRole: (role) => userRole === role,
      hasPermission: (resource, action) => {
        return permissions?.[resource]?.[action] === true;
      }
    }}>
      {children}
    </UserCompanyContext.Provider>
  );
}

export function useUserCompany() {
  return useContext(UserCompanyContext);
}