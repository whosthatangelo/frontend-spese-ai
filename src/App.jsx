import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import axios from 'axios';
import Home from './pages/Home';
import Spese from './pages/Spese';
import Incassi from './pages/Incassi';
import Dashboard from './pages/Dashboard';
// 🆕 Nuove pagine admin
import AdminCompanies from './pages/AdminCompanies';
import AdminUsers from './pages/AdminUsers';
import LogoutScreen from './components/LogoutScreen';
import CompanySwitcher from './components/CompanySwitcher';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { useUserCompany } from './contexts/UserCompanyContext';
import './App.css';
import './components/Navbar.css';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    setUserId, 
    setCurrentCompany, 
    company, 
    userRole,
    isSuperAdmin, 
    isAdminAzienda, 
    isManager,
    permissionsLoading 
  } = useUserCompany();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutScreen, setShowLogoutScreen] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  // Forza re-render quando showLogoutScreen cambia
  useEffect(() => {
    if (showLogoutScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showLogoutScreen]);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (confirm('Sei sicuro di voler uscire?')) {
      setForceRender(prev => prev + 1);
      setShowLogoutScreen(true);
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        await signOut(auth);
        localStorage.clear();
        setUserId(null);
        setCurrentCompany(null);

        setTimeout(() => {
          setShowLogoutScreen(false);
          navigate('/login');
        }, 3000);

      } catch (error) {
        console.error('❌ Errore durante il logout:', error);
        setTimeout(() => {
          setShowLogoutScreen(false);
          navigate('/login');
        }, 2000);
      }
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Home';
      case '/spese': return 'Spese';
      case '/incassi': return 'Incassi';
      case '/dashboard': return 'Dashboard';
      case '/admin/companies': return 'Gestione Aziende';
      case '/admin/users': return 'Gestione Utenti';
      default: return 'ExpenseAI';
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // 🆕 Determina quali voci di menu mostrare in base al ruolo
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/', icon: '🏠', text: 'Home', roles: ['super_admin', 'admin_azienda', 'manager', 'user', 'guest'] },
      { path: '/spese', icon: '🧾', text: 'Spese', roles: ['super_admin', 'admin_azienda', 'manager', 'user'] },
      { path: '/incassi', icon: '💰', text: 'Incassi', roles: ['super_admin', 'admin_azienda', 'manager', 'user'] },
      { path: '/dashboard', icon: '📊', text: 'Dashboard', roles: ['super_admin', 'admin_azienda', 'manager'] }
    ];

    const adminItems = [
      { path: '/admin/companies', icon: '🏢', text: 'Aziende', roles: ['super_admin'] },
      { path: '/admin/users', icon: '👥', text: 'Utenti', roles: ['super_admin', 'admin_azienda'] }
    ];

    const allItems = [...baseItems, ...adminItems];

    return allItems.filter(item => 
      !userRole || item.roles.includes(userRole)
    );
  };

  // Se è in corso il logout, mostra la schermata di saluto
  if (showLogoutScreen) {
    return <LogoutScreen />;
  }

  // Loading dei permessi
  if (permissionsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento permessi...</span>
        </div>
      </div>
    );
  }

  const navigationItems = getNavigationItems();

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
              {/* 🆕 Badge ruolo */}
              {userRole && (
                <>
                  <span className="breadcrumb-separator">/</span>
                  <span className={`breadcrumb-role role-${userRole}`}>
                    {userRole === 'super_admin' && '🔒 Super Admin'}
                    {userRole === 'admin_azienda' && '👔 Admin'}
                    {userRole === 'manager' && '📋 Manager'}
                    {userRole === 'user' && '👤 User'}
                    {userRole === 'guest' && '👁️ Guest'}
                  </span>
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

            {/* 🆕 Desktop Navigation Dinamica */}
            <div className="navbar-nav d-none d-lg-flex">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`} 
                  to={item.path}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.text}</span>
                </Link>
              ))}
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

            {/* 🆕 Mobile Navigation Dinamica */}
            <div className="mobile-nav">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  className={`mobile-nav-link ${isActiveRoute(item.path) ? 'active' : ''}`} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-text">{item.text}</span>
                  <span className="mobile-nav-arrow">→</span>
                </Link>
              ))}
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
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spese" element={<Spese />} />
            <Route path="/incassi" element={<Incassi />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 🆕 Route protette per admin */}
            <Route 
              path="/admin/companies" 
              element={
                <ProtectedRoute requireRole="super_admin">
                  <AdminCompanies />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireRole="admin_azienda">
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}