import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

// One page used for both Login and Register
function Auth({ mode, onAuth }) {
  const isLogin = mode === "login";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(url, form);
      onAuth(res.data); // saves token + user in App
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="muted">
          {isLogin
            ? "Login to see where each application stands."
            : "Track every application in one place."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="btn primary" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
        </form>

        <p className="muted switch">
          {isLogin ? "New here? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create account" : "Login"}</Link>
        </p>
      </div>
    </div>
  );
}

export default Auth;
