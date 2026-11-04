import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';

export const ProductCarousel = ({
  products = [],
  onQuickView,
  title,
  subtitle
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
                {subtitle}
              </span>
            )}
            {title && (
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1 uppercase">
                {title}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-2.5 rounded-xl bg-autox-surface border border-autox-border hover:border-autox-orange/60 text-autox-silver hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-2.5 rounded-xl bg-autox-surface border border-autox-border hover:border-autox-orange/60 text-autox-silver hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="min-w-[280px] sm:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
