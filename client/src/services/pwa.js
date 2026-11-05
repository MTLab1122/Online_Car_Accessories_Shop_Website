/**
 * AUTOX — Progressive Web App Client Registration & Lifecycle Manager
 */

let deferredPrompt = null;
let updateCallback = null;

export const registerServiceWorker = ({ onUpdate } = {}) => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  updateCallback = onUpdate;

  window.addEventListener('load', async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const swPath = `${baseUrl.replace(/\/$/, '')}/sw.js`;
      const registration = await navigator.serviceWorker.register(swPath, { scope: baseUrl });
      console.log('[AUTOX PWA] Service Worker registered successfully. Scope:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[AUTOX PWA] New update is available.');
            if (updateCallback) {
              updateCallback(registration);
            }
          }
        });
      });
    } catch (err) {
      console.warn('[AUTOX PWA] Service Worker registration failed:', err);
    }
  });

  // Capture install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('autox:pwa-installable'));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    console.log('[AUTOX PWA] Application successfully installed.');
  });
};

export const promptPWAInstall = async () => {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === 'accepted';
};

export const isPWAInstallable = () => {
  return !!deferredPrompt;
};

export const skipWaitingAndReload = (registration) => {
  if (registration && registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
  window.location.reload();
};
