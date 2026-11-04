import React from 'react';
import { Truck, ShieldCheck, MapPin } from 'lucide-react';

const ShippingPolicyPage = () => {
  return (
    <div className="min-h-screen bg-autox-bg py-16 text-autox-silver">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Nationwide Logistics Protocol
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1 uppercase">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs font-mono text-autox-muted mt-2">Pakistani Rupees (PKR) Domestic Delivery</p>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-autox-border space-y-6 text-xs sm:text-sm text-autox-silver leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-autox-border">
            <div className="p-4 bg-autox-dark rounded-xl border border-autox-border">
              <span className="text-autox-orange font-bold font-mono text-xs uppercase block mb-1">
                Standard Shipping Fee
              </span>
              <span className="text-xl font-bold font-display text-white">PKR 250</span>
              <p className="text-[11px] text-autox-muted mt-1">Applies to orders under PKR 5,000</p>
            </div>

            <div className="p-4 bg-autox-dark rounded-xl border border-autox-orange/40">
              <span className="text-emerald-400 font-bold font-mono text-xs uppercase block mb-1">
                Complimentary Shipping
              </span>
              <span className="text-xl font-bold font-display text-white">FREE</span>
              <p className="text-[11px] text-autox-muted mt-1">Automatic on all orders exceeding PKR 5,000</p>
            </div>
          </div>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            Transit Timelines
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li><strong>Islamabad & Rawalpindi:</strong> 24 to 36 Operational Hours</li>
            <li><strong>Lahore, Faisalabad & Gujranwala:</strong> 36 to 48 Operational Hours</li>
            <li><strong>Karachi & Hyderabad:</strong> 48 to 72 Operational Hours</li>
            <li><strong>Peshawar, Quetta & Other Districts:</strong> 3 to 5 Business Days</li>
          </ul>

          <h3 className="font-display font-bold text-white text-base uppercase text-autox-orange">
            Reinforced Automotive Packaging
          </h3>
          <p>
            All carbon fiber splitters, spoilers, and delicate optical projector assemblies are packed within rigid impact-resistant honeycombed crates with internal polyethylene foam cushioning to guarantee zero in-transit damage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;

