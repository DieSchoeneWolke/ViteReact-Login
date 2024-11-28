import { useState } from 'react';
import logo from './assets/logo.svg';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [tokenDuration, setTokenDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:3001/auth/${isLogin ? 'login' : 'register'}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok && isLogin) {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setTokenDuration('Access Token: 15 minutes, Refresh Token: 7 days');
    }
  };

  const handleLogout = async () => {
    const response = await fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }), // Send the username to logout
    });

    if (response.ok) {
      setAccessToken('');
      setRefreshToken('');
      setTokenDuration('');
      setMessage('Logged out successfully.');
    } else {
      const data = await response.json();
      setMessage(data.message || 'Logout failed.');
    }
  };

  const showAccessToken = () => {
    alert(`Access Token: ${accessToken}`);
  };

  const showRefreshToken = () => {
    alert(`Refresh Token: ${refreshToken}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>User Authentication</h1>
        <p>{message}</p> {/* General message display */}
        <p>{tokenDuration}</p> {/* Token duration message display */}
        {!accessToken && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>
        )}
        {accessToken && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button onClick={showAccessToken}>Show Access Token</button>
              <button onClick={showRefreshToken}>Show Refresh Token</button>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        {!accessToken && (
          <button onClick={() => setIsLogin(!isLogin)}>
            Switch
          </button>
        )}
      </header>
    </div>
  );
};

export default App;
