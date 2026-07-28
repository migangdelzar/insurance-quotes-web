export function registerPwa(isProduction = import.meta.env.PROD): void {
  if (!isProduction || !('serviceWorker' in navigator)) {
    return;
  }

  void Promise.resolve(navigator.serviceWorker.register('/sw.js')).catch(
    () => undefined
  );
}
