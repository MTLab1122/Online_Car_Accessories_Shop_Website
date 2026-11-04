import React from 'react';
import { PackageOpen, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from './Buttons';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Items Found',
  description = 'There are currently no items matching your criteria in this sector.',
  actionLabel = 'Explore Collection',
  actionTo = '/shop',
  onAction,
  className = ''
}) => {
  return (
    <div className={`p-8 sm:p-14 rounded-2xl bg-autox-surface/90 border border-autox-border text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-autox-card border border-autox-border flex items-center justify-center text-autox-orange mb-5 shadow-glow-sm">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase tracking-wide mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-autox-muted leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {onAction ? (
        <PrimaryButton onClick={onAction} icon={ArrowRight}>
          {actionLabel}
        </PrimaryButton>
      ) : actionTo ? (
        <Link to={actionTo}>
          <PrimaryButton icon={ArrowRight}>
            {actionLabel}
          </PrimaryButton>
        </Link>
      ) : null}
    </div>
  );
};

export const ErrorState = ({
  title = 'Telemetry Transmission Error',
  description = 'Could not establish connection with backend telemetry services. Please retry.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`p-8 sm:p-12 rounded-2xl bg-autox-surface/90 border border-red-900/40 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-800/40 flex items-center justify-center text-red-400 mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide mb-1.5">
        {title}
      </h3>

      <p className="text-xs text-autox-muted leading-relaxed mb-6">
        {description}
      </p>

      {onRetry && (
        <SecondaryButton onClick={onRetry} icon={RefreshCw}>
          Retry Connection
        </SecondaryButton>
      )}
    </div>
  );
};

export default EmptyState;
