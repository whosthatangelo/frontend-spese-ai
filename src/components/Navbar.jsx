// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // creeremo uno stile dedicato

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="navbar-custom shadow-sm">
      <div className="container d-flex justify-content-between align-items-center py-2">
        <h5 className="mb-0 logo-text">💸 ExpenseAI</h5>
        <button className="btn btn-sm btn-outline-light logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
