import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) return;

    try {
      setSubmitting(true);
      const userResult = await login({ email, password });
      const target = location.state?.from?.pathname || (userResult?.role === 'admin' ? '/admin' : '/account');
      navigate(target, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-autox-bg flex items-center justify-center p-4 py-16">
      <SEO title="Pilot Sign In | AUTOX" noindex={true} />
      <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-autox-border shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-autox-orange to-transparent" />

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-autox-orange to-[#b33a10] flex items-center justify-center font-display font-extrabold text-lg text-white shadow-glow">
              X
            </span>
            <span className="font-display font-extrabold text-2xl tracking-wider text-white">
              AUTO<span className="text-autox-orange">X</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wide">
            Access Cockpit
          </h2>
          <p className="text-xs text-autox-muted mt-1 font-mono">
            Sign in to manage orders, wishlist, and telemetry records
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.pk"
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase text-autox-muted">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-mono text-autox-orange hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 mt-2 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-autox-border/60 text-center text-xs text-autox-muted">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-autox-orange font-semibold hover:underline">
            Register Pilot Account
          </Link>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-4 p-3 rounded-xl bg-autox-dark/80 border border-autox-border/60 text-[11px] font-mono text-autox-muted space-y-1">
          <div className="text-white font-bold uppercase">Demo Credentials:</div>
          <div>Admin: admin@autox.pk / Admin@AutoX2026!</div>
          <div>Customer: hamza.tariq@example.pk / Password123!</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

