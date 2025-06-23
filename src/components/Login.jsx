import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    if (!email) return alert("Inserisci un'email");

    try {
      const res = await axios.post('/api/login', { email });
      const { userId } = res.data;
      localStorage.setItem('userId', userId);
      onLogin(userId);
    } catch (err) {
      alert('Errore login');
    }
  };

  return (
    <div className="text-center mt-5">
      <h2>🔐 Login</h2>
      <input
        type="email"
        placeholder="Inserisci la tua email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-control my-2"
      />
      <button className="btn btn-primary" onClick={handleLogin}>
        Entra
      </button>
    </div>
  );
}
