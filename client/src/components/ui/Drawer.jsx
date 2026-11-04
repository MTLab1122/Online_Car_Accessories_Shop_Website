import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  width = 'max-w-md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
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

  const slideVariants = {
    closed: { x: position === 'right' ? '100%' : '-100%', opacity: 0 },
    open: { x: '0%', opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={slideVariants}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className={`relative ml-auto w-full ${width} bg-autox-surface border-l border-autox-border h-full flex flex-col z-10 shadow-2xl`}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-autox-border flex items-center justify-between gap-4 flex-shrink-0">
              <div>
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs font-mono text-autox-muted mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="p-2 rounded-lg text-autox-muted hover:text-white hover:bg-autox-card border border-transparent hover:border-autox-border transition-colors focus:outline-none focus:ring-2 focus:ring-autox-orange"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;

