import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-autox-bg py-16 text-autox-silver">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Platform Protocol
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1 uppercase">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-autox-muted mt-2">Effective Date: November 2026</p>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-autox-border space-y-6 text-xs sm:text-sm text-autox-silver leading-relaxed">
          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            1. Agreement to Terms
          </h3>
          <p>
            By accessing AUTOX, registering a pilot account, or ordering automotive accessories, you agree to be bound by these Terms of Service under the jurisdiction of the Islamic Republic of Pakistan.
          </p>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            2. Product Usage & Motorsport Disclaimer
          </h3>
          <p>
            High-performance aerodynamic wings, racing suspensions, and cat-back exhaust systems are intended for automotive enhancement. Professional installation by certified automotive mechanics is strongly advised.
          </p>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            3. Pricing & Currency
          </h3>
          <p>
            All listed product amounts are authoritative and denominated in Pakistani Rupees (PKR ₨). AUTOX reserves the right to adjust catalog pricing in response to global raw material and carbon fiber supply fluctuations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

