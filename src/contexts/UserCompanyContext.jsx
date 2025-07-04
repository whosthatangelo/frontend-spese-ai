// src/contexts/UserCompanyContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserCompanyContext = createContext();

export function UserCompanyProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(() => localStorage.getItem('companyId'));
  const apiBase = import.meta.env.VITE_API_URL;

  // 🔄 Ogni volta che userId cambia o si inizializza, carico le aziende
  useEffect(() => {
    if (!userId) return;

    axios.get(`${apiBase}/user/companies`, {
      headers: { 'x-user-id': userId }
    })
    .then(res => {
      setCompanies(res.data);

      // Se non c'è ancora company selezionata, la imposto alla prima disponibile
      if (res.data.length > 0 && !localStorage.getItem('companyId')) {
        const defaultCompanyId = res.data[0].id;
        setCurrentCompany(defaultCompanyId);
        localStorage.setItem('companyId', defaultCompanyId);
      }
    })
    .catch(err => {
      console.error('Errore nel caricamento aziende:', err);
    });
  }, [userId]);

  // 🧠 Ogni volta che currentCompany cambia, salvala
  useEffect(() => {
    if (currentCompany) {
      localStorage.setItem('companyId', currentCompany);
    }
  }, [currentCompany]);

  return (
    <UserCompanyContext.Provider value={{
      userId,
      setUserId,
      companies,
      currentCompany,
      setCurrentCompany,
      apiBase
    }}>
      {children}
    </UserCompanyContext.Provider>
  );
}

export function useUserCompany() {
  return useContext(UserCompanyContext);
}
