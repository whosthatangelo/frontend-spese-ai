// src/components/InstallAppButton.jsx
import { useState, useEffect } from 'react';

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se l'app è già installata
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // Verifica per Safari iOS
      if (window.navigator.standalone) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // Listener per l'evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 PWA installabile rilevata');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listener per quando l'app viene installata
    const handleAppInstalled = () => {
      console.log('✅ PWA installata con successo');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Mostra il prompt di installazione
      deferredPrompt.prompt();

      // Attendi la risposta dell'utente
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ Utente ha accettato l\'installazione');
      } else {
        console.log('❌ Utente ha rifiutato l\'installazione');
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('❌ Errore durante l\'installazione:', error);
    }
  };

  // Istruzioni per iOS Safari (non supporta beforeinstallprompt)
  const showIOSInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.navigator.standalone;

    return isIOS && !isInStandaloneMode;
  };

  // Non mostrare nulla se l'app è già installata
  if (isInstalled) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* Pulsante per Chrome/Android */}
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="btn btn-success d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ minWidth: '250px' }}
        >
          <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Installa App
        </button>
      )}

      {/* Istruzioni per iOS Safari */}
      {showIOSInstructions() && (
        <div className="alert alert-info text-start">
          <h6 className="alert-heading mb-2">📱 Installa ExpenseAI</h6>
          <small>
            1. Tap sull'icona <strong>Condividi</strong> <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" /></svg>
            <br />
            2. Scorri e tap <strong>"Aggiungi alla schermata Home"</strong>
            <br />
            3. Tap <strong>"Aggiungi"</strong>
          </small>
        </div>
      )}
    </div>
  );
}