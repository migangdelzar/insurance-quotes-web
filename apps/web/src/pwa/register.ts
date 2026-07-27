export function registerPwa(isProduction = import.meta.env.PROD): void {
  if (!isProduction || !('serviceWorker' in navigator)) {
    return;
  }

  void navigator.serviceWorker.register('/sw.js');
}
