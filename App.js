import React, { useState } from "react";
import Home from "./Home"; // Connects your tracking catalog dashboard row
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Active profile context storage hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Default to login screen view

// Automatically swaps between 'localhost' or your local network IP depending on how you opened the app
const API_BASE = `http://${window.location.hostname}:5001`;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert(data.message);
      setIsLogin(true); // Switch to login screen after successful signup
      setPassword("");
    } catch (error) {
      console.error("Register error:", error);
      alert(error.message || "Cannot connect to backend server.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      alert("Login successful!");
      setUser(data.user); // Save complete user profile object to context state
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Cannot connect to backend server.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setIsLogin(true);
  };

  // If user is authenticated, render the main tracking workspace
  if (user) {
    return <Home loggedInUser={user} onLogout={handleLogout} />;
  }

  return (
    <div className="app-layout">
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#fff"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Tractor System</h2>

        {isLogin ? (
          /* TRADITIONAL EMAIL LOGIN FORM */
          <form onSubmit={handleLogin}>
            <p style={{ textAlign: "center" }}><strong>Log in to track your job tools</strong></p>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              required
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Secure Login
            </button>
            <p style={{ marginTop: "15px", textAlign: "center" }}>
              New user?{" "}
              <span
                onClick={() => { setIsLogin(false); setPassword(""); }}
                style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}
              >
                Register Here
              </span>
            </p>
          </form>
        ) : (
          /* TRADITIONAL EMAIL REGISTRATION FORM */
          <form onSubmit={handleRegister}>
            <p style={{ textAlign: "center" }}><strong>Create your driver profile</strong></p>
            <input
              type="email"
              placeholder="Enter a valid email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              required
            />
            <input
              type="password"
              placeholder="Create security password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              required
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Register Account
            </button>
            <p style={{ marginTop: "15px", textAlign: "center" }}>
              Already have an account?{" "}
              <span
                onClick={() => { setIsLogin(true); setPassword(""); }}
                style={{ color: "green", cursor: "pointer", fontWeight: "bold" }}
              >
                Login Here
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;