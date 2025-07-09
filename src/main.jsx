// src/main.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import './index.css';
import App from './App';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { UserCompanyProvider } from './contexts/UserCompanyContext';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔄 Auth state changed:', user ? 'Logged in' : 'Logged out');

      if (user) {
        // Utente loggato con Firebase
        setIsAuthenticated(true);

        // Verifica se abbiamo userId nel localStorage
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
          console.warn('⚠️ Utente Firebase autenticato ma manca userId nel localStorage');
        }
      } else {
        // Utente non loggato
        setIsAuthenticated(false);

        // Pulisci localStorage se Firebase dice che non è loggato
        localStorage.removeItem('userId');
        localStorage.removeItem('companyId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhoto');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  // Se non autenticato, mostra login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Se autenticato, mostra l'app
  return children;
}

function RootRouter() {
  return (
    <Router>
      <UserCompanyProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserCompanyProvider>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
);