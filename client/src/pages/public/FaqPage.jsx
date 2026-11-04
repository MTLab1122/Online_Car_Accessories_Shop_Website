import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Do you deliver car accessories nationwide across Pakistan?',
      a: 'Yes. We deliver via tracked air and road express couriers to all major cities including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and remote districts across Pakistan. Orders over PKR 5,000 enjoy complimentary free delivery.'
    },
    {
      q: 'How does the 3D Virtual Showroom and Model Viewer work?',
      a: 'Our web application utilizes Three.js and React Three Fiber WebGL shaders directly in your browser. You can rotate items 360 degrees, inspect aero curves and carbon weave finishes, and test studio lighting presets without installing plugins.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash On Delivery (COD) across Pakistan, where you inspect the package and pay the courier directly. For demonstration purposes, we also feature a Simulated Card payment engine.'
    },
    {
      q: 'Are your carbon fiber components genuine dry carbon or wet carbon?',
      a: 'All items marked as Dry Carbon Fiber are vacuum autoclave-cured 3K Toray carbon fiber, ensuring minimal weight (under 3kg for track wings) and extreme structural rigidity without resin yellowing.'
    },
    {
      q: 'What is your return and replacement policy?',
      a: 'We provide a 7-day hassle-free return window for uninstalled, unopened items in original packaging if you discover any dimensional incompatibility with your vehicle.'
    }
  ];

  return (
    <div className="min-h-screen bg-autox-bg py-16 text-autox-silver">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1 uppercase">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-autox-border overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 font-display font-bold text-base text-white hover:text-autox-orange transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-autox-orange transition-transform duration-200 flex-shrink-0 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-autox-muted leading-relaxed border-t border-autox-border/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="glass-card p-8 rounded-2xl border border-autox-border text-center">
          <HelpCircle className="w-8 h-8 text-autox-orange mx-auto mb-2" />
          <h3 className="font-display font-bold text-white text-lg">Still have technical queries?</h3>
          <p className="text-xs text-autox-muted mt-1 mb-4">
            Our engineering team is available for vehicle chassis compatibility consults.
          </p>
          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider inline-block shadow-glow"
          >
            Contact Engineering Desk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
