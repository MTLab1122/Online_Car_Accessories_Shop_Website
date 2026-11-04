import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      setSubscribing(true);
      const res = await api.post('/newsletter/subscribe', { email: newsletterEmail.trim() });
      toast.success(res.message || 'Subscribed successfully!');
      setNewsletterEmail('');
    } catch (err) {
      toast.error(err.message || 'Could not subscribe to newsletter.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="w-full bg-[#05070a] border-t border-autox-border pt-16 pb-8 text-autox-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-autox-border/60">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-autox-orange to-[#b33a10] flex items-center justify-center font-display font-extrabold text-xl text-white shadow-glow">
                X
              </span>
              <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                AUTO<span className="text-autox-orange">X</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm mb-6 text-autox-silver">
              "ENGINEERED FOR YOUR DRIVE."
              <br />
              Premium Accessories. Exceptional Performance. Unmatched Style.
              Pakistan’s premier high-performance automotive accessories destination with real-time telemetry, 3D interactive previewing, and nationwide express shipping.
            </p>

            <div className="flex flex-col gap-2.5 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-autox-silver">
                <MapPin className="w-4 h-4 text-autox-orange flex-shrink-0" />
                <span>Blue Area Sector G-7/1, Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5 text-autox-silver">
                <Phone className="w-4 h-4 text-autox-orange flex-shrink-0" />
                <span>+92 (300) 123-4567 • Mon - Sat 9am to 9pm</span>
              </div>
              <div className="flex items-center gap-2.5 text-autox-silver">
                <Mail className="w-4 h-4 text-autox-orange flex-shrink-0" />
                <span>support@autox.pk</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="hover:text-autox-orange transition-colors">
                  All Accessories
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-autox-orange transition-colors">
                  Product Categories
                </Link>
              </li>
              <li>
                <Link to="/showroom" className="hover:text-autox-orange transition-colors">
                  3D Virtual Showroom
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-autox-orange transition-colors">
                  About AUTOX
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-autox-orange transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-autox-orange transition-colors">
                  Frequently Asked
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Policies */}
          <div>
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4">
              Policies & Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shipping-policy" className="hover:text-autox-orange transition-colors">
                  Shipping & Delivery (PKR)
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-autox-orange transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-autox-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-autox-orange transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/account?tab=orders" className="hover:text-autox-orange transition-colors">
                  Track Consignment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4">
              VIP Garage Dispatch
            </h4>
            <p className="text-xs leading-relaxed mb-4">
              Get notified of carbon fiber aero restocks, flash coupons, and tuning track days.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-autox-dark border border-autox-border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                className="w-full py-2.5 rounded-lg bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>{subscribing ? 'Subscribing...' : 'Subscribe'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-autox-muted">
              <ShieldCheck className="w-4 h-4 text-autox-orange" />
              <span>Zero spam. Unsubscribe anytime.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© {new Date().getFullYear()} AUTOX Technologies Inc. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-center text-[11px] text-autox-muted">
            <span className="px-2.5 py-1 rounded bg-autox-card border border-autox-border text-autox-silver">
              Currency: Pakistani Rupees (PKR ₨)
            </span>
            <span className="text-autox-muted/80">
              * Simulated card transactions are for academic demonstration purposes only.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

