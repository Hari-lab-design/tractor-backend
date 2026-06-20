import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false); // Toggles between Login and Register views
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Determine target endpoint based on state
    const endpoint = isRegistering ? 'register' : 'login';

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        if (isRegistering) {
          setMessage('Registration successful! Switching to login...');
          setTimeout(() => {
            setIsRegistering(false); // Automatically move them to login screen
            setMessage('');
          }, 2000);
        } else {
          onLoginSuccess(data.token);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to backend server. Make sure node server.js is running.');
    }
  };

  return (
    <div className="auth-container">
      <h2>🚜 Tractor System {isRegistering ? 'Registration' : 'Login'}</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', textAlign: 'left' }}>Email Address</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <label style={{ display: 'block', textAlign: 'left' }}>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit">
          {isRegistering ? 'Create Account' : 'Log In'}
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        {isRegistering ? 'Already have an account?' : "Don't have an account yet?"}{' '}
        <span 
          style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setMessage('');
          }}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </span>
      </p>
    </div>
  );
}