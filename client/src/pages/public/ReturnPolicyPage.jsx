import React from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';
import SEO from '../../components/common/SEO';

const ReturnPolicyPage = () => {
  return (
    <div className="min-h-screen bg-autox-bg py-16 text-autox-silver">
      <SEO
        title="Return & Refund Policy | AUTOX Pakistan"
        description="Learn about the 7-day return and refund window for automotive accessories at AUTOX. Requirements, fitment returns, and refund processing."
        canonical="https://autox.pk/return-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Customer Assurance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1 uppercase">
            Return & Refund Policy
          </h1>
          <p className="text-xs font-mono text-autox-muted mt-2">7-Day Inspection Window</p>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-autox-border space-y-6 text-xs sm:text-sm text-autox-silver leading-relaxed">
          <p>
            At AUTOX, customer satisfaction and chassis compatibility are top priorities. If you receive an accessory that does not match your vehicle specifications, you may initiate a return within 7 calendar days of physical delivery.
          </p>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            Eligibility Requirements
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>Item must be unmounted, unpainted, and uninstalled.</li>
            <li>Original manufacturer seals, protective films, and hardware kits must be complete.</li>
            <li>Carbon fiber wings and diffusers must have zero scratches or drilled mounting holes.</li>
          </ul>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            Refund Processing
          </h3>
          <p>
            Once inspected at our Islamabad operations hub, refunds for eligible returns are processed within 3 business days via bank transfer or original payment method.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;

