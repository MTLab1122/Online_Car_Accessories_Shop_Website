import React from 'react';
import { ShieldCheck, Cpu, Target, Flag, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '../../utils/schemaGenerator';

const AboutPage = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ]);
  const orgSchema = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-autox-bg py-16 text-autox-silver">
      <SEO
        title="About AUTOX | Pakistan's Premier High-Performance Accessories Destination"
        description="Learn about AUTOX Pakistan — our mission, 3D interactive showroom technology, verified quality assurance, and nationwide automotive accessories fulfillment."
        canonical="https://autox.pk/about"
        schema={[breadcrumbSchema, orgSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            The AUTOX Heritage
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white mt-2 uppercase">
            Engineered For Your Drive
          </h1>
          <p className="text-sm sm:text-base text-autox-muted mt-4 leading-relaxed">
            AUTOX was founded in Islamabad, Pakistan with a singular engineering directive: to bridge the gap between high-end motorsport telemetry, autoclave dry carbon fiber aerodynamics, and digital e-commerce realism.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl border border-autox-border">
            <Target className="w-8 h-8 text-autox-orange mb-4" />
            <h3 className="text-xl font-bold font-display text-white mb-2">Our Mission</h3>
            <p className="text-xs text-autox-muted leading-relaxed">
              To supply car enthusiasts across Pakistan with verified, track-tested performance accessories while establishing an uncompromising benchmark for online 3D visualization.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-autox-border">
            <Cpu className="w-8 h-8 text-autox-orange mb-4" />
            <h3 className="text-xl font-bold font-display text-white mb-2">3D Telemetry</h3>
            <p className="text-xs text-autox-muted leading-relaxed">
              We leverage browser-based WebGL shaders so pilots can inspect exact aero profiles, carbon weaves, and forged rim offsets prior to consignment shipment.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-autox-border">
            <ShieldCheck className="w-8 h-8 text-autox-orange mb-4" />
            <h3 className="text-xl font-bold font-display text-white mb-2">Uncompromising QA</h3>
            <p className="text-xs text-autox-muted leading-relaxed">
              Every harness, bi-LED projector, and valvetronic exhaust system is cataloged under authentic PKR valuation with nationwide tracked fulfillment.
            </p>
          </div>
        </div>

        {/* Technical Milestones */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-autox-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-display">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-autox-orange">10+</div>
              <p className="text-xs font-mono uppercase text-autox-muted mt-2">Equipment Divisions</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white">30+</div>
              <p className="text-xs font-mono uppercase text-autox-muted mt-2">Precision Components</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-autox-orange">100%</div>
              <p className="text-xs font-mono uppercase text-autox-muted mt-2">Local PKR Billing</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white">48hr</div>
              <p className="text-xs font-mono uppercase text-autox-muted mt-2">Express Dispatch</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            to="/shop"
            className="px-8 py-4 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all inline-block"
          >
            Explore Active Equipment Inventory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

