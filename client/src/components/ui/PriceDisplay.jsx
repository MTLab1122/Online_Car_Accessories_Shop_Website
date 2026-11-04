import React from 'react';

export const PriceDisplay = ({
  price,
  discountPercentage = 0,
  size = 'md',
  className = ''
}) => {
  const numericPrice = Number(price) || 0;
  const discountedPrice = discountPercentage > 0
    ? Math.round(numericPrice * (1 - discountPercentage / 100))
    : numericPrice;

  const sizeStyles = {
    sm: {
      current: 'text-sm font-bold',
      original: 'text-xs',
      currency: 'text-xs'
    },
    md: {
      current: 'text-base sm:text-lg font-bold',
      original: 'text-xs',
      currency: 'text-xs sm:text-sm'
    },
    lg: {
      current: 'text-2xl sm:text-3xl font-extrabold',
      original: 'text-sm sm:text-base',
      currency: 'text-base sm:text-lg'
    }
  }[size] || {
    current: 'text-lg font-bold',
    original: 'text-xs',
    currency: 'text-xs'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-1.5 font-display">
        <span className={`${sizeStyles.currency} font-mono text-autox-orange font-semibold`}>
          ₨
        </span>
        <span className={`${sizeStyles.current} text-white tracking-tight`}>
          {discountedPrice.toLocaleString()}
        </span>
        <span className="text-[10px] font-mono text-autox-muted uppercase">
          PKR
        </span>
      </div>

      {discountPercentage > 0 && (
        <div className="flex items-center gap-2">
          <span className={`${sizeStyles.original} font-mono text-autox-muted line-through`}>
            ₨ {numericPrice.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono font-bold text-autox-orange bg-autox-orange/15 px-1.5 py-0.5 rounded">
            -{discountPercentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;

