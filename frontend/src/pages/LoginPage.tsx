import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setRole, setToken } from "../api/client";
import { usersApi } from "../api/users";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await login(email, password);
      setToken(token.access_token);
      const me = await usersApi.me();
      setRole(me.role);
      navigate(`/dashboard/${me.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-card-header">
          <img src="/logo_muttaqin.png" alt="Logo TAAM Al Muttaqin" className="auth-card-logo" />
          <h1>Masuk</h1>
          <p className="section-desc">Taman Asuh Anak Muslim (TAAM) Al Muttaqin</p>
        </div>
        <form onSubmit={handleSubmit} className="stack">
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="input"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="input"
              type="password"
              placeholder="Kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
          {error && <p className="message message-error">{error}</p>}
        </form>
        <p className="section-desc auth-card-footer">
          <Link to="/">&larr; Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  );
}
