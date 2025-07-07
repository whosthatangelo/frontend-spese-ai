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

  // 🧠 Salva il cambio azienda nel localStorage
  useEffect(() => {
    if (currentCompany) {
      console.log(`💾 Salvo companyId: ${currentCompany}`);
      localStorage.setItem('companyId', String(currentCompany)); // Salva come stringa
    }
  }, [currentCompany]);

  // 🎯 Trova l'oggetto azienda completo basato su currentCompany
  // Converte currentCompany da stringa (localStorage) a numero (PostgreSQL)
  const company = companies.find(c => c.id === parseInt(currentCompany)) || null;

  console.log('🔍 Context Debug:', {
    userId,
    currentCompany,
    company,
    companiesCount: companies.length
  });

  return (
    <UserCompanyContext.Provider value={{
      userId,
      setUserId,
      companies,
      currentCompany,
      setCurrentCompany,
      company, // 👈 AGGIUNTO: oggetto azienda completo
      apiBase
    }}>
      {children}
    </UserCompanyContext.Provider>
  );
}

export function useUserCompany() {
  return useContext(UserCompanyContext);
}