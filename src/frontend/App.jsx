import { useState } from 'react';
import logo from './assets/logo.svg';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [accessToken, setAccessToken] = useState(''); // State to store the access token
  const [refreshToken, setRefreshToken] = useState(''); // State to store the refresh token
  const [tokenDuration, setTokenDuration] = useState(''); // State to store token duration

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
      setAccessToken(data.accessToken); // Store the access token
      setRefreshToken(data.refreshToken); // Store the refresh token
      setTokenDuration('Access Token: 15 minutes, Refresh Token: 7 days'); // Set token duration message
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
      setAccessToken(''); // Clear the access token
      setRefreshToken(''); // Clear the refresh token
      setTokenDuration(''); // Clear the token duration message
      setMessage('Logged out successfully.');
    } else {
      const data = await response.json();
      setMessage(data.message || 'Logout failed.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>User Authentication</h1>
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
        <p>
          {message}
        </p>
        {accessToken && (
          <div>
            <p>{`Access Token: ${accessToken}`}</p>
            <p>{`Refresh Token: ${refreshToken}`}</p>
            <p>{tokenDuration}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        <button onClick={() => setIsLogin(!isLogin)}>
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
      </header>
    </div>
  );
};

export default App;
