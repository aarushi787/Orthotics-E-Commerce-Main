import React, { useEffect } from 'react';

declare global {
  interface Window { 
    grecaptcha?: any;
    VITE_RECAPTCHA_SITE_KEY?: string;
  }
}

declare const VITE_RECAPTCHA_SITE_KEY: string;

const SITE_KEY = VITE_RECAPTCHA_SITE_KEY || '';

const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
  if (document.querySelector(`script[src="${src}"]`)) return resolve();
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  s.defer = true;
  s.onload = () => resolve();
  s.onerror = () => reject(new Error('Failed to load recaptcha'));
  document.head.appendChild(s);
});

export async function getRecaptchaToken(action = 'submit') {
  if (!SITE_KEY) return null;
  if (typeof window === 'undefined') return null;

  if (!window.grecaptcha) {
    await loadScript(`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`);
  }

  if (!window.grecaptcha) return null;

  try {
    return await window.grecaptcha.execute(SITE_KEY, { action });
  } catch (e) {
    return null;
  }
}

const ReCaptchaPlaceholder: React.FC = () => {
  useEffect(() => {
    if (!SITE_KEY) return;
    // pre-load grecaptcha
    loadScript(`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`).catch(() => {});
  }, []);

  return null;
};

export default ReCaptchaPlaceholder;
