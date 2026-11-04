import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [devResetToken, setDevResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      const res = await authService.forgotPassword({ email });
      setSubmitted(true);
      if (res.data?.resetToken) {
        setDevResetToken(res.data.resetToken);
      }
      toast.success(res.message || 'Password reset link sent.');
    } catch (err) {
      toast.error(err.message || 'Could not process password reset.');
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
            Reset Password
          </h2>
          <p className="text-xs text-autox-muted mt-1 font-mono">
            Enter your account email to receive cryptographic password reset credentials
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-autox-silver leading-relaxed">
              If an account with that email exists, an authorized password reset instruction has been dispatched. Check your inbox and spam folder.
            </p>

            {devResetToken && (
              <div className="p-3 bg-autox-dark rounded-xl border border-autox-orange/40 text-left">
                <span className="text-[10px] font-mono text-autox-orange uppercase font-bold block mb-1">
                  Development Mode Direct Link:
                </span>
                <Link
                  to={`/reset-password/${devResetToken}`}
                  className="text-xs text-autox-silver hover:text-white underline break-all font-mono"
                >
                  Click to reset using token: {devResetToken.substring(0, 16)}...
                </Link>
              </div>
            )}

            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-autox-orange hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                Registered Email
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
            >
              <span>{submitting ? 'Dispatching...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-autox-muted hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

