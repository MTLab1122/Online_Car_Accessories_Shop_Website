import React from 'react';
import { motion } from 'framer-motion';

export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-7 py-3.5 text-sm sm:text-base'
  };

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wider rounded-lg bg-autox-orange text-white transition-all shadow-glow hover:shadow-glow-lg hover:bg-autox-orangeHover active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-autox-orange focus:ring-offset-2 focus:ring-offset-autox-bg ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};

export const SecondaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon: Icon,
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3.5 text-sm sm:text-base'
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-display font-medium uppercase tracking-wider rounded-lg bg-autox-surface border border-autox-border text-autox-text hover:text-white hover:border-autox-orange/60 hover:bg-autox-card transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-autox-orange/50 focus:ring-offset-2 focus:ring-offset-autox-bg ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 text-autox-orange flex-shrink-0" />}
      <span>{children}</span>
    </motion.button>
  );
};

export const IconButton = ({
  icon: Icon,
  onClick,
  title,
  ariaLabel,
  active = false,
  className = '',
  badge = null,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      className={`relative min-w-[42px] min-h-[42px] flex items-center justify-center p-2.5 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-autox-orange focus:ring-offset-2 focus:ring-offset-autox-bg ${
        active
          ? 'bg-autox-orange/15 border-autox-orange text-autox-orange shadow-glow-sm'
          : 'bg-autox-card/60 border-autox-border text-autox-silver hover:text-white hover:border-autox-borderLight hover:bg-autox-card'
      } ${className}`}
      {...props}
    >
      <Icon className="w-4 h-4" />
      {badge !== null && badge !== undefined && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold bg-autox-orange text-white rounded-full flex items-center justify-center shadow-glow">
          {badge}
        </span>
      )}
    </button>
  );
};
