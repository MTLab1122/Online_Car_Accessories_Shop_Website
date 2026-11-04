import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] bg-autox-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-autox-card border border-autox-border flex items-center justify-center text-autox-orange mb-6 shadow-glow">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-autox-orange">
        Error 404 • Navigation Telemetry Lost
      </span>
      <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white mt-2 mb-3 uppercase">
        Route Not Found
      </h1>
      <p className="text-xs sm:text-sm text-autox-muted max-w-md mx-auto mb-8 leading-relaxed">
        The performance telemetry endpoint or page you requested does not exist or has been relocated to another sector.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider shadow-glow transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cockpit Command</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

