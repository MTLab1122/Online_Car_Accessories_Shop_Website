import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useOnlineStatus from '../../hooks/useOnlineStatus';

export const OfflineIndicator = () => {
  const { isOnline, wasOffline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-auto"
        >
          <div className="p-4 rounded-2xl bg-autox-surface/95 border border-autox-orange/40 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-autox-orange/20 border border-autox-orange/40 flex items-center justify-center text-autox-orange flex-shrink-0 animate-pulse">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold block uppercase tracking-wider">
                  Telemetry Offline
                </span>
                <span className="text-autox-muted text-[11px]">
                  Viewing cached catalog equipment
                </span>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg bg-autox-card hover:bg-autox-cardHover border border-autox-border text-white text-[11px] uppercase transition-colors"
              title="Retry link"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-auto"
        >
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 backdrop-blur-md shadow-2xl flex items-center gap-3 text-xs font-mono">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block uppercase tracking-wider">
                Telemetry Restored
              </span>
              <span className="text-emerald-300 text-[11px]">
                Live catalog data synchronized
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
