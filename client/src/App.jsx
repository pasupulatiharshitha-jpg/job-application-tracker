import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  // Read saved login from the browser (so refresh does not log out)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  function handleLogin(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Auth mode="login" onAuth={handleLogin} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Auth mode="register" onAuth={handleLogin} />}
      />
      <Route
        path="/"
        element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
