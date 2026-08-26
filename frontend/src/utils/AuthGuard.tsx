import React from 'react';

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

const isAuthenticated = () => {
  // Minimal client-side check. Replace with real token/session check.
  try {
    const t = localStorage.getItem('authToken');
    return !!t;
  } catch (e) {
    return false;
  }
};

const AuthGuard: React.FC<Props> = ({ children, redirectTo = '#/login' }) => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') window.location.hash = redirectTo.replace('#', '');
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
