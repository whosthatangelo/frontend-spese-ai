import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import Home from './pages/Home';
import Spese from './pages/Spese';
import Incassi from './pages/Incassi';
import Dashboard from './pages/Dashboard';
import LogoutScreen from './components/LogoutScreen';
import CompanySwitcher from './components/CompanySwitcher';
import { useUserCompany } from './contexts/UserCompanyContext';
import './App.css';
import './components/Navbar.css';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserId, setCompanyId, company } = useUserCompany();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutScreen, setShowLogoutScreen] = useState(false);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    console.log('🔄 handleLogout chiamato!'); // DEBUG

    // Temporaneamente saltiamo il confirm per testare
    // if (confirm('Sei sicuro di voler uscire?')) {
    if (true) { // TEST - sempre true
      console.log('🔄 Utente ha confermato logout'); // DEBUG

      try {
        // Prima mostra la schermata di saluto
        console.log('🔄 Mostrando schermata di saluto'); // DEBUG
        setShowLogoutScreen(true);

        // Logout da Firebase - proviamo con try/catch separato
        try {
          console.log('🔄 Tentativo signOut Firebase'); // DEBUG
          await signOut(auth);
          console.log('✅ signOut Firebase completato'); // DEBUG
        } catch (firebaseError) {
          console.error('❌ Errore Firebase signOut:', firebaseError); // DEBUG
          // Continua comunque con la pulizia
        }

        // Pulisci localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('companyId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhoto');

        // Pulisci context
        setUserId(null);
        setCompanyId(null);

        console.log('✅ Logout completato');

        // Dopo 2.5 secondi, vai al login
        setTimeout(() => {
          navigate('/login');
        }, 2500);

      } catch (error) {
        console.error('❌ Errore durante il logout:', error);
        // Anche se Firebase fallisce, pulisci comunque
        localStorage.clear();
        setUserId(null);
        setCompanyId(null);
        setShowLogoutScreen(true);

        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Home';
      case '/spese': return 'Spese';
      case '/incassi': return 'Incassi';
      case '/dashboard': return 'Dashboard';
      default: return 'ExpenseAI';
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Se è in corso il logout, mostra la schermata di saluto
  if (showLogoutScreen) {
    return <LogoutScreen />;
  }

  return (
    <div className="app-container">
      {/* Enterprise Navbar */}
      <nav className={`navbar-enterprise ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">

          {/* Left Section: Logo + Breadcrumb */}
          <div className="navbar-left">
            <Link className="navbar-logo" to="/">
              <div className="logo-icon">💸</div>
              <div className="logo-text">
                <div className="logo-primary">ExpenseAI</div>
                <div className="logo-secondary">Enterprise</div>
              </div>
            </Link>

            {/* Breadcrumb */}
            <div className="navbar-breadcrumb d-none d-lg-flex">
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{getPageTitle()}</span>
              {company && (
                <>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-company">{company.nome}</span>
                </>
              )}
            </div>
          </div>

          {/* Center Section: Company Switcher */}
          <div className="navbar-center d-none d-md-block">
            <CompanySwitcher />
          </div>

          {/* Right Section: Navigation + Actions */}
          <div className="navbar-right">

            {/* Desktop Navigation */}
            <div className="navbar-nav d-none d-lg-flex">
              <Link 
                className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`} 
                to="/"
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </Link>
              <Link 
                className={`nav-link ${isActiveRoute('/spese') ? 'active' : ''}`} 
                to="/spese"
              >
                <span className="nav-icon">🧾</span>
                <span className="nav-text">Spese</span>
              </Link>
              <Link 
                className={`nav-link ${isActiveRoute('/incassi') ? 'active' : ''}`} 
                to="/incassi"
              >
                <span className="nav-icon">💰</span>
                <span className="nav-text">Incassi</span>
              </Link>
              <Link 
                className={`nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`} 
                to="/dashboard"
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </Link>
            </div>

            {/* Actions: Solo Logout */}
            <div className="navbar-actions">
              <button 
                className="btn-logout"
                onClick={handleLogout}
                title="Esci dall'applicazione"
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text d-none d-md-inline">Esci</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle d-lg-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu d-lg-none ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">

            {/* Mobile Company Switcher */}
            <div className="mobile-company-switcher">
              <CompanySwitcher />
            </div>

            {/* Mobile Navigation */}
            <div className="mobile-nav">
              <Link 
                className={`mobile-nav-link ${isActiveRoute('/') ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">🏠</span>
                <span className="mobile-nav-text">Home</span>
                <span className="mobile-nav-arrow">→</span>
              </Link>
              <Link 
                className={`mobile-nav-link ${isActiveRoute('/spese') ? 'active' : ''}`} 
                to="/spese"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">🧾</span>
                <span className="mobile-nav-text">Spese</span>
                <span className="mobile-nav-arrow">→</span>
              </Link>
              <Link 
                className={`mobile-nav-link ${isActiveRoute('/incassi') ? 'active' : ''}`} 
                to="/incassi"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">💰</span>
                <span className="mobile-nav-text">Incassi</span>
                <span className="mobile-nav-arrow">→</span>
              </Link>
              <Link 
                className={`mobile-nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`} 
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">📊</span>
                <span className="mobile-nav-text">Dashboard</span>
                <span className="mobile-nav-arrow">→</span>
              </Link>
            </div>

            {/* Mobile Logout */}
            <div className="mobile-actions">
              <button 
                className="mobile-action-btn mobile-logout"
                onClick={handleLogout}
              >
                <span className="action-icon">🚪</span>
                <span className="action-text">Esci</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spese" element={<Spese />} />
          <Route path="/incassi" element={<Incassi />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}