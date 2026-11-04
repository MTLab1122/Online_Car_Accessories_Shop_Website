import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await authService.resetPassword({ token, password });
      toast.success(res.message || 'Password reset successfully!');
      navigate('/account');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired password reset token.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-autox-bg flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-autox-border shadow-2xl relative overflow-hidden">
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
            New Password
          </h2>
          <p className="text-xs text-autox-muted mt-1 font-mono">
            Enter and verify your new account security credentials
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
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-autox-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
          >
            <span>{submitting ? 'Updating Password...' : 'Save New Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

