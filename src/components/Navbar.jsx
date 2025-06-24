// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light bg-light d-flex justify-content-between align-items-center px-4 py-3">
      <span className="navbar-brand mb-0 h1">📊 Spese AI</span>
      <button className="btn btn-outline-danger" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
