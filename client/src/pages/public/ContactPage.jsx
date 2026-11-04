import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/contact', formData);
      if (res.success) {
        setSubmitted(true);
        toast.success(res.message || 'Message transmitted to support desk.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to transmit message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-autox-bg py-16 text-autox-silver">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Customer Support Telemetry
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1 uppercase">
            Contact AUTOX Support
          </h1>
          <p className="text-xs sm:text-sm text-autox-muted mt-2 leading-relaxed">
            Have questions regarding bolt-on fitment, custom offsets, or express consignment tracking in Pakistan? Our certified technicians are on standby.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Contact Information */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-autox-border space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-autox-orange/20 text-autox-orange border border-autox-orange/40">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm uppercase">National Depot</h4>
                  <p className="text-xs text-autox-muted mt-0.5 leading-relaxed">
                    Plot 12-A, Blue Area Sector G-7/1, Islamabad, 44000, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-autox-orange/20 text-autox-orange border border-autox-orange/40">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm uppercase">Direct Helplines</h4>
                  <p className="text-xs text-autox-muted mt-0.5 leading-relaxed font-mono">
                    +92 (300) 123-4567<br />
                    +92 (51) 987-6543
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-autox-orange/20 text-autox-orange border border-autox-orange/40">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm uppercase">Electronic Inquiries</h4>
                  <p className="text-xs text-autox-muted mt-0.5 font-mono">
                    support@autox.pk<br />
                    orders@autox.pk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-autox-orange/20 text-autox-orange border border-autox-orange/40">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm uppercase">Operating Hours</h4>
                  <p className="text-xs text-autox-muted mt-0.5">
                    Monday – Saturday: 9:00 AM – 9:00 PM PKT
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-3xl border border-autox-border">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white uppercase">
                    Inquiry Transmitted
                  </h3>
                  <p className="text-xs sm:text-sm text-autox-silver max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your ticket has been logged into our support database. A technician will review your inquiry within 4 operational hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Submit Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Asad Farooq"
                        className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="asad@example.pk"
                        className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 321 0000000"
                        className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                        Subject Query *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Wheel Offset Compatibility"
                        className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                      Message Details *
                    </label>
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Specify your vehicle make, model, year, and equipment inquiry..."
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
                  >
                    <span>{submitting ? 'Transmitting Inquiries...' : 'Send Message to Support Desk'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

