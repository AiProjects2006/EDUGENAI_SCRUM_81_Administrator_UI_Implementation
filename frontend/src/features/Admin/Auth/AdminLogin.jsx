import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import './AdminAuth.css';

const STUDENT_PORTAL_URL = import.meta.env.VITE_STUDENT_PORTAL_URL || 'http://localhost:5173';
const CREATOR_PORTAL_URL = import.meta.env.VITE_CREATOR_PORTAL_URL || 'http://localhost:5175';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAdminAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickFill = () => {
    setUsernameOrEmail('admin');
    setPassword('Admin@123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameOrEmail.trim() || !password) {
      setErrorMessage('Please enter both your administrator username/email and password.');
      return;
    }

    try {
      await login({
        usernameOrEmail: usernameOrEmail.trim(),
        password
      });
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-container">
        <div className="admin-brand-header">
          <div className="admin-logo-icon">
            <ShieldCheck size={30} />
          </div>
          <div className="admin-brand-badge">Admin Console</div>
          <h1 className="admin-title">Administrator Access</h1>
          <p className="admin-subtitle">
            Sign in with authorized administrative credentials to manage the platform.
          </p>
        </div>

        <div className="admin-quickfill-bar">
          <span>Demo Account: <strong>admin</strong> / <strong>Admin@123</strong></span>
          <button type="button" className="btn-admin-quickfill" onClick={handleQuickFill}>
            Quick Fill
          </button>
        </div>

        {errorMessage && (
          <div className="admin-auth-alert error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="input-field-group">
            <label className="input-label" htmlFor="adminUsername">
              Username or Email
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <User size={18} />
              </span>
              <input
                id="adminUsername"
                type="text"
                className="admin-input"
                placeholder="admin or admin@edugenai.com"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                autoComplete="username"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="input-field-group">
            <label className="input-label" htmlFor="adminPassword">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <Lock size={18} />
              </span>
              <input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-admin-primary"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (
              <>
                Sign In to Console <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="admin-auth-footer">
          <div className="admin-portal-divider">
            <span>Or switch to user portals</span>
          </div>

          <div className="admin-portal-links">
            <a href={`${STUDENT_PORTAL_URL}`} className="admin-portal-pill">
              🎓 Student Portal
            </a>
            <a href={`${CREATOR_PORTAL_URL}/login`} className="admin-portal-pill">
              🎨 Creator Studio
            </a>
          </div>
        </div>
      </div>

      <div className="admin-security-badge">
        <ShieldCheck size={15} />
        <span>Secured via Keycloak OIDC direct access & role verification</span>
      </div>
    </div>
  );
}

