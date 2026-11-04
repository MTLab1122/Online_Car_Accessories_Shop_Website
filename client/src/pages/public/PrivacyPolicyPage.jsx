import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-autox-bg py-16 text-autox-silver">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Data Governance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1 uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-autox-muted mt-2">Effective Date: November 2026</p>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-autox-border space-y-6 text-xs sm:text-sm text-autox-silver leading-relaxed">
          <p>
            AUTOX Technologies Inc. ("AUTOX", "we", "our") respects the confidential telemetry and personal records of all vehicle owners registered on our platform in Pakistan. This document articulates our data privacy policies.
          </p>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            1. Information Collection
          </h3>
          <p>
            We collect personal identification records necessary for dispatch fulfillment: full name, shipping address within Pakistan, mobile contact number, and encrypted authentication tokens. We do not store unencrypted credit card credentials on our servers.
          </p>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            2. Cookie Telemetry & Security
          </h3>
          <p>
            Authentication sessions utilize HTTP-only, secure same-site cookies to safeguard customer sessions against cross-site scripting (XSS) and unauthorized token duplication.
          </p>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            3. Third-Party Disclosures
          </h3>
          <p>
            Customer shipping details are shared strictly with contracted courier services for nationwide parcel delivery in Pakistan. Your records are never sold, leased, or rented to external advertising agencies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

