// src/components/LogoutScreen.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Dopo 2 secondi, vai al login
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh', background: 'linear-gradient(135deg, #007bff, #0056b3)' }}>
      <div className="text-center text-white">
        <div className="mb-4">
          <div className="display-1">👋</div>
        </div>
        <h2 className="mb-3">Arrivederci!</h2>
        <p className="lead mb-4">Logout completato con successo</p>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Reindirizzamento...</span>
        </div>
        <p className="mt-3">
          <small>Reindirizzamento al login...</small>
        </p>
      </div>
    </div>
  );
}