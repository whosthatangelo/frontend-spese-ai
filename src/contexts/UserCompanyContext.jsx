// src/contexts/UserCompanyContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserCompanyContext = createContext();

export function UserCompanyProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const apiBase = import.meta.env.VITE_API_URL;

  // Appena ho userId, prendo la lista di aziende
  useEffect(() => {
    if (!userId) return;
    axios.get(`${apiBase}/user/companies`, {
      headers: { 'x-user-id': userId }
    })
    .then(res => {
      setCompanies(res.data);
      // se non ne ho ancora scelta, faccio default alla prima
      if (res.data.length > 0 && !currentCompany) {
        setCurrentCompany(res.data[0].id);
      }
    })
    .catch(console.error);
  }, [userId]);

  // Persistiamo la scelta
  useEffect(() => {
    if (currentCompany) localStorage.setItem('companyId', currentCompany);
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
