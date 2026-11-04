import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { skipWaitingAndReload } from '../../services/pwa';

export const UpdateNotification = () => {
  const [waitingRegistration, setWaitingRegistration] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleUpdate = (e) => {
      setWaitingRegistration(e.detail?.registration || null);
    };

    window.addEventListener('autox:pwa-update-ready', handleUpdate);
    return () => window.removeEventListener('autox:pwa-update-ready', handleUpdate);
  }, []);

  if (!waitingRegistration || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        className="fixed top-20 right-6 z-50 max-w-sm pointer-events-auto"
      >
        <div className="p-4 rounded-2xl bg-autox-surface/95 border border-autox-orange/50 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-autox-orange/20 border border-autox-orange/40 flex items-center justify-center text-autox-orange flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block uppercase tracking-wider">
                Telemetry Update
              </span>
              <span className="text-autox-muted text-[11px]">
                New performance build ready
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => skipWaitingAndReload(waitingRegistration)}
              className="px-3 py-1.5 rounded-lg bg-autox-orange hover:bg-autox-orangeHover text-white text-[11px] font-bold uppercase transition-colors flex items-center gap-1 shadow-glow"
            >
              <span>Reload</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg text-autox-muted hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateNotification;
