// Suppress MetaMask and other browser extension errors
export function setupErrorSuppression() {
  if (typeof window === 'undefined') return;

  // Store original methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // Check if error should be suppressed
  const shouldSuppress = (message: string) => {
    return (
      message.includes('MetaMask') ||
      message.includes('chrome-extension://') ||
      message.includes('Failed to connect to MetaMask') ||
      message.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      message.includes('Encountered two children with the same key') ||
      message.includes('recharts.js') ||
      message.includes('Keys should be unique so that components maintain their identity')
    );
  };

  // Override console.error
  console.error = (...args: any[]) => {
    const errorMessage = String(args[0] || '');
    if (shouldSuppress(errorMessage)) {
      return; // Suppress the error
    }
    originalError.apply(console, args);
  };

  // Override console.warn
  console.warn = (...args: any[]) => {
    const warnMessage = String(args[0] || '');
    if (shouldSuppress(warnMessage)) {
      return; // Suppress the warning
    }
    originalWarn.apply(console, args);
  };

  // Global error handler
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || event.error?.message || '';
    if (shouldSuppress(String(errorMessage))) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  }, true);

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = String(event.reason?.message || event.reason || '');
    if (shouldSuppress(errorMessage)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

// Auto-run on import
setupErrorSuppression();
