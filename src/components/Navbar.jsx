import { useNavigate } from 'react-router-dom';

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
        <span className="navbar-brand fw-bold fs-4">💸 ExpenseAI</span>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
