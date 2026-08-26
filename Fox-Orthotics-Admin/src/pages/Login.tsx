import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const adminRef = doc(db, "admins", uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
        setError("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🦾</div>
          <h1 className="login-title">Fox</h1>
          <p className="login-subtitle">Admin Dashboard</p>
        </div>

        <form onSubmit={loginAdmin}>
          <div className="login-form-group">
            <label className="login-label">Email Address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-password-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}
        </form>

        <div className="login-footer">
          © 2025 Fox Admin. All rights reserved.
        </div>
      </div>
    </div>
  );
}
