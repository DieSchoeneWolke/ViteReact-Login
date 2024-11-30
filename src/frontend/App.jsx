import { useState, useEffect, useCallback } from "react";
import logo from "./assets/logo.svg";
import "./App.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [tokenDuration, setTokenDuration] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState(null);

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem("accessToken");
    const storedRefreshToken = sessionStorage.getItem("refreshToken");
    const storedUsername = sessionStorage.getItem("username");
    const storedTokenExpiration = sessionStorage.getItem("tokenExpiration");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setTokenExpiration(new Date(storedTokenExpiration));
      setTokenDuration("Access Token: 15 minutes, Refresh Token: 7 days");
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const isTokenExpired = () => {
    return tokenExpiration && new Date() >= tokenExpiration;
  };

  const refreshAccessToken = async () => {
    const response = await fetch(`${apiUrl}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      const newExpiration = new Date();
      newExpiration.setMinutes(newExpiration.getMinutes() + 15);
      setTokenExpiration(newExpiration);
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("tokenExpiration", newExpiration.toISOString());
    } else {
      handleLogout();
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const url = `${apiUrl}/${isLogin ? "login" : "register"}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok && isLogin) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15);
        setTokenExpiration(expiration);
        setTokenDuration("Access Token: 15 minutes, Refresh Token: 7 days");
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("tokenExpiration", expiration.toISOString());
      }
    },
    [isLogin, username, password]
  );

  const handleLogout = useCallback(async () => {
    const response = await fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      setAccessToken("");
      setRefreshToken("");
      setTokenDuration("");
      setUsername("");
      setPassword("");
      setMessage("Logged out successfully.");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("tokenExpiration");
    } else {
      const data = await response.json();
      setMessage(data.message || "Logout failed.");
    }
  }, [username]);

  const showAccessToken = useCallback(() => {
    alert(`Access Token: ${accessToken}`);
  }, [accessToken]);

  const showRefreshToken = useCallback(() => {
    alert(`Refresh Token: ${refreshToken}`);
  }, [refreshToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        refreshAccessToken();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>User Authentication</h1>
        <p>{message}</p>
        <p>{tokenDuration}</p>
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
            <button type="submit">{isLogin ? "Login" : "Register"}</button>
          </form>
        )}
        {accessToken && (
          <div>
            <p>Welcome {username}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button onClick={showAccessToken}>Show Access Token</button>
              <button onClick={showRefreshToken}>Show Refresh Token</button>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        {!accessToken && (
          <button onClick={() => setIsLogin(!isLogin)}>Switch</button>
        )}
      </header>
    </div>
  );
};

export default App;
