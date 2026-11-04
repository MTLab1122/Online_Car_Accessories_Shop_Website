import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-autox-card rounded-2xl border border-autox-border overflow-hidden animate-pulse flex flex-col justify-between">
      <div className="aspect-[4/3] bg-autox-dark/80" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-autox-border/60 rounded" />
          <div className="h-3 w-20 bg-autox-border/60 rounded" />
        </div>
        <div className="h-5 w-4/5 bg-autox-border rounded" />
        <div className="h-3 w-24 bg-autox-border/60 rounded" />
        <div className="pt-3 border-t border-autox-border/60 flex justify-between items-center">
          <div className="h-6 w-28 bg-autox-border rounded" />
          <div className="h-8 w-20 bg-autox-border rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-autox-dark rounded-xl border border-autox-border/40" />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
