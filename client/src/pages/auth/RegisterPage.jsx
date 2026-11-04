import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      navigate('/account');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-autox-bg flex items-center justify-center p-4 py-16">
      <SEO title="Create Pilot Account | AUTOX" noindex={true} />
      <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-autox-border shadow-2xl relative overflow-hidden">
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
            Register Pilot Account
          </h2>
          <p className="text-xs text-autox-muted mt-1 font-mono">
            Join Pakistan's premier luxury automotive enthusiast community
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
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Daniyal Khan"
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="daniyal@example.pk"
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 0000000"
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 chars"
                  className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                Confirm *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat"
                  className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 mt-2 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
          >
            <span>{submitting ? 'Registering Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-autox-border/60 text-center text-xs text-autox-muted">
          <span>Already registered with AUTOX? </span>
          <Link to="/login" className="text-autox-orange font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

