import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/api";
import "./LoginPage.scss";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await loginApi(username, password);
      login(data.token, data.username, data.role);
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid username or password";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="auth-form">
          <h1>Sign In</h1>
          <p className="auth-form__subtitle">Welcome back to Espresso Tracker</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary auth-form__btn"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-form__footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}