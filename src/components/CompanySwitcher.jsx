// src/components/CompanySwitcher.jsx
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function CompanySwitcher() {
  const { companies, currentCompany, setCurrentCompany } = useUserCompany();

  return (
    <select
      className="form-select form-select-sm me-3"
      value={currentCompany || ''}
      onChange={e => setCurrentCompany(parseInt(e.target.value))} // Converte a numero
    >
      {companies.map(c =>
        <option key={c.id} value={c.id}>{c.nome}</option>
      )}
    </select>
  );
}