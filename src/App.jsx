import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Spese from './pages/Spese';
import Incassi from './pages/Incassi';
import Dashboard from './pages/Dashboard';
import CompanySwitcher from './components/CompanySwitcher';
import { useUserCompany } from './contexts/UserCompanyContext';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const { setUserId, setCompanyId, company } = useUserCompany();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('companyId');
    setUserId(null);
    setCompanyId(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm rounded-bottom px-3">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">💸 ExpenseAI</Link>
          <div className="d-flex align-items-center me-3">
            <CompanySwitcher />
            {company && <span className="text-light ms-2">[{company.nome}]</span>}
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">🏠 Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/spese">🧾 Spese</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/incassi">💰 Incassi</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">📊 Dashboard</Link>
              </li>
              <li className="nav-item ms-3">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spese" element={<Spese />} />
          <Route path="/incassi" element={<Incassi />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}
