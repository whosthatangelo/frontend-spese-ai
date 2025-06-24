import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Spese from './pages/Spese';
import Dashboard from './pages/Dashboard';
import Incassi from './pages/Incassi'; // ⬅️ Nuovo import
import './App.css';

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm rounded-bottom px-3">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">💸 ExpenseAI</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">🏠 Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/spese">🧾 Spese</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/incassi">💰 Incassi</Link> {/* 👈 Aggiunto */}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">📊 Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spese" element={<Spese />} />
          <Route path="/incassi" element={<Incassi />} /> {/* 👈 Aggiunto */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}
