// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { auth, googleProvider } from '../firebase/config';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUserId } = useUserCompany();

  // Login con email (metodo esistente)
  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/login', { email });
      const userId = res.data.userId;
      localStorage.setItem('userId', userId);
      setUserId(userId);
      navigate('/');
    } catch (err) {
      console.error('Errore login:', err);
      setError(err.response?.data?.error || 'Errore durante il login.');
    } finally {
      setLoading(false);
    }
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      // Autenticazione con Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Prepara i dati utente per il backend
      const userData = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      };

      // Invia i dati al backend
      const res = await axios.post(import.meta.env.VITE_API_URL + '/auth/google', userData);
      const userId = res.data.userId;

      // Salva nel localStorage e context
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName);
      localStorage.setItem('userPhoto', user.photoURL);

      setUserId(userId);
      navigate('/');
    } catch (err) {
      console.error('Errore Google login:', err);
      setError(err.message || 'Errore durante il login con Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="container py-5 text-center">
      <h2 className="mb-4">🔐 Accedi all'app spese</h2>

      {/* Login con Google */}
      <div className="mb-4">
        <button 
          className="btn btn-danger d-flex align-items-center justify-content-center mx-auto mb-3"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{ minWidth: '200px' }}
        >
          {googleLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Accesso...
            </>
          ) : (
            <>
              <svg className="me-2" width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Accedi con Google
            </>
          )}
        </button>
      </div>

      {/* Divisore */}
      <div className="text-muted mb-3">
        <hr className="d-inline-block" style={{ width: '100px' }} />
        <span className="mx-3">oppure</span>
        <hr className="d-inline-block" style={{ width: '100px' }} />
      </div>

      {/* Login con email esistente */}
      <div>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          className="btn btn-primary" 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? 'Accesso...' : 'Entra'}
        </button>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}