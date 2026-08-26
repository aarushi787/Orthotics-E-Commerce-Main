// Runtime protector: when the build sets PUBLIC_SITE_READONLY, remove any
// form/input elements from the rendered DOM to ensure the public SPA is
// read-only for Google review.
const READONLY = (() => {
  try {
    // Vite-style env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PUBLIC_SITE_READONLY === 'true') return true;
  } catch {}
  try {
    if (process && (process as any).env && (process as any).env.PUBLIC_SITE_READONLY === 'true') return true;
  } catch {}
  try {
    // Allow manual toggle via window for local testing
    // @ts-ignore
    if (typeof window !== 'undefined' && (window as any).__PUBLIC_SITE_READONLY === true) return true;
  } catch {}
  return false;
})();

if (READONLY && typeof document !== 'undefined') {
  const removeSelector = 'form,input,textarea,select,button[type="submit"],button[role="form"]';

  const removeExisting = () => {
    try {
      document.querySelectorAll(removeSelector).forEach((el) => {
        // Remove the element from DOM
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
    } catch (e) {
      // swallow errors
      // eslint-disable-next-line no-console
      console.warn('readonly-protector: removal error', e);
    }
  };

  // Remove anything already on the page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeExisting, { once: true });
  } else {
    removeExisting();
  }

  // Observe future additions and remove sensitive elements immediately
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        removeExisting();
      }
    }
  });

  try {
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
  } catch (e) {
    // ignore
  }

  // Provide a debug flag on window to quickly toggle during testing
  try {
    // @ts-ignore
    if (typeof window !== 'undefined') (window as any).__PUBLIC_SITE_READONLY = true;
  } catch {}
}

export {};
