// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/login', { email });
      const userId = response.data.userId;
      localStorage.setItem('userId', userId);
      onLogin(userId);
      navigate('/'); // ✅ redirect manuale alla home dopo login
    } catch (err) {
      console.error('Errore login:', err);
      setError(err.response?.data?.error || 'Errore durante il login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 text-center">
      <h2 className="mb-4">🔐 Accedi all'app spese</h2>
      <input
        type="email"
        className="form-control mb-3"
        placeholder="Inserisci la tua email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
        {loading ? 'Accesso...' : 'Entra'}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
