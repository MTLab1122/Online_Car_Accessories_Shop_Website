import React from 'react';

export const StockIndicator = ({
  stock = 0,
  showCount = false,
  className = ''
}) => {
  const stockNum = Number(stock) || 0;

  if (stockNum <= 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-red-950/60 border border-red-800/40 text-red-400 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Sold Out
      </span>
    );
  }

  if (stockNum <= 4) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-amber-950/60 border border-amber-800/40 text-amber-300 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Only {stockNum} Left
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-emerald-950/50 border border-emerald-800/30 text-emerald-400 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      {showCount ? `${stockNum} In Stock` : 'In Stock (PKR)'}
    </span>
  );
};

export default StockIndicator;
