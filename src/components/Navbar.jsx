import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-3 mb-4"
      style={{ borderBottom: '1px solid #eee' }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand fw-bold fs-4">💸 ExpenseAI</Link>
        <div className="d-flex gap-3 align-items-center">
          <Link to="/spese" className="btn btn-outline-primary btn-sm">Spese</Link>
          <Link to="/incassi" className="btn btn-outline-success btn-sm">Incassi</Link>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
