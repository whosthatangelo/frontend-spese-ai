// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { auth, googleProvider } from '../firebase/config';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function Login() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUserId } = useUserCompany();

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
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body py-5">
              <h2 className="card-title mb-4">🔐 Accedi all'app spese</h2>
              <p className="text-muted mb-4">
                Utilizza il tuo account Google per accedere
              </p>

              <button 
                className="btn btn-danger btn-lg d-flex align-items-center justify-content-center mx-auto"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                style={{ minWidth: '250px' }}
              >
                {googleLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Accesso in corso...
                  </>
                ) : (
                  <>
                    <svg className="me-2" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Accedi con Google
                  </>
                )}
              </button>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}