import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import PriceDisplay from '../ui/PriceDisplay';

const POPULAR_SEARCHES = [
  'Carbon Wing',
  'Forged Wheels',
  'Matrix LED',
  '3D Floor Mats',
  '4K Dashcam',
  'Valvetronic Exhaust'
];

export const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products?search=${encodeURIComponent(query.trim())}&limit=6`);
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChipClick = (term) => {
    setQuery(term);
  };

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start p-4 sm:p-6 lg:p-12 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Search Card Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-4xl mx-auto bg-autox-surface border border-autox-border rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSubmit} className="relative flex items-center border-b border-autox-border px-6 py-5">
              <Search className="w-5 h-5 text-autox-orange flex-shrink-0 mr-4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search aero kits, forged wheels, dashcams, LED headlights..."
                className="w-full bg-transparent text-base sm:text-xl font-display text-white placeholder-autox-muted focus:outline-none"
              />
              {loading && (
                <div className="w-5 h-5 border-2 border-autox-orange border-t-transparent rounded-full animate-spin flex-shrink-0 mr-3" />
              )}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded text-autox-muted hover:text-white mr-2"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="p-2 rounded-xl text-autox-muted hover:text-white hover:bg-autox-card transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Suggestions & Quick Chips */}
            <div className="px-6 py-4 border-b border-autox-border/60 bg-autox-dark/50 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-autox-muted mr-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-autox-orange" />
                Popular:
              </span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleChipClick(term)}
                  className="px-3 py-1 rounded-lg bg-autox-card border border-autox-border text-xs font-mono text-autox-silver hover:text-white hover:border-autox-orange/60 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Results Display Area */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {query.trim() === '' ? (
                <div className="text-center py-12 text-autox-muted">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-40 text-autox-orange" />
                  <p className="text-xs font-mono uppercase tracking-widest">
                    Enter equipment name, SKU, or category to begin telemetry search
                  </p>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <h4 className="font-display font-bold text-lg text-white mb-2">
                    No matching accessories found for "{query}"
                  </h4>
                  <p className="text-xs text-autox-muted mb-6">
                    Try searching for broader keywords like 'spoiler', 'LED', or 'wheels'.
                  </p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-autox-orange text-white text-xs font-display font-bold uppercase tracking-wider shadow-glow"
                  >
                    Browse Entire Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-autox-muted pb-2 border-b border-autox-border/60">
                    <span>Matching Hardware Components ({results.length})</span>
                    <button
                      onClick={handleSubmit}
                      className="text-autox-orange hover:underline inline-flex items-center gap-1"
                    >
                      View all in Shop <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.map((product) => {
                      const image = product.images?.[0]
                        ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
                        : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80';

                      return (
                        <div
                          key={product._id}
                          onClick={() => handleSelectProduct(product.slug)}
                          className="p-3 rounded-xl bg-autox-card border border-autox-border hover:border-autox-orange/60 transition-all cursor-pointer flex gap-3.5 group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-autox-dark flex-shrink-0">
                            <img
                              src={image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-autox-orange font-semibold block">
                                {product.brand}
                              </span>
                              <h5 className="font-display font-bold text-xs text-white truncate group-hover:text-autox-orange transition-colors">
                                {product.name}
                              </h5>
                            </div>
                            <PriceDisplay
                              price={product.price}
                              discountPercentage={product.discountPercentage}
                              size="sm"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;

