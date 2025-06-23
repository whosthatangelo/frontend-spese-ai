// src/Login.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/login', { email });
      const userId = response.data.userId;
      localStorage.setItem('userId', userId);
      onLogin(userId);
    } catch (err) {
      console.error('Errore login:', err);
      setError('Errore durante il login.');
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
