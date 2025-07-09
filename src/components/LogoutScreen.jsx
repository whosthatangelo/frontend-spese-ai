// src/components/LogoutScreen.jsx
export default function LogoutScreen() {
  console.log('🔄 LogoutScreen component rendered'); // DEBUG

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