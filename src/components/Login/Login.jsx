import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Login.css';

const Login = () => {
  const { login, goToHome } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    const ok = await login(form.email, form.password);
    if (!ok) setError('Invalid credentials. Please try again.');
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-logo-wrap animate-fadeIn">
            <img src="/logo.png" alt="Future Focus Classes Logo" className="login-logo" />
          </div>
          <h1 className="login-brand animate-fadeIn delay-1">Future Focus Classes</h1>
          <p className="login-tagline animate-fadeIn delay-2">तमसो माँ ज्योतिर्गमय</p>
          <p className="login-tagline-en animate-fadeIn delay-2">From Darkness to Light</p>

          <div className="login-features animate-fadeIn delay-3">
            {[
              { icon: '📚', text: 'Access class materials & notes' },
              { icon: '📝', text: 'Take practice & proctored tests' },
              { icon: '🎥', text: 'Watch recorded lectures' },
              { icon: '📊', text: 'Track your progress & attendance' },
            ].map((f, i) => (
              <div key={i} className="login-feature-item">
                <span className="login-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-form-card animate-scaleIn">
          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your student portal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-email">Email / Roll Number</label>
              <div className="input-icon-wrap">
                <span className="input-icon">✉️</span>
                <input
                  id="login-email"
                  type="text"
                  name="email"
                  className="input"
                  placeholder="Enter your email or roll number"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  className="input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="login-forgot">
              <button type="button" className="btn-ghost" style={{ fontSize: '13px', padding: '0' }}>
                Forgot password?
              </button>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', marginTop: '8px', height: '48px' }}
              disabled={loading}
            >
              {loading ? <span className="login-spinner" /> : '🚀 Sign In to Portal'}
            </button>
          </form>

          <div className="login-demo-hint">
            <p>🎓 Demo: Enter any email & password to login</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={goToHome}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: '13px', cursor: 'pointer', textDecoration: 'underline'
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
