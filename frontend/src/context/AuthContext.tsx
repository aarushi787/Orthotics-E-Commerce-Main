// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseClient";
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  User as FirebaseUser
} from "firebase/auth";

type AuthContextType = {
  idToken: string | null;
  user: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const un = auth.onIdTokenChanged(async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });
    return () => un();
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken(true);
    setUser(cred.user);
    setIdToken(token);
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setIdToken(null);
  };

  const refreshToken = async () => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken(true);
    setIdToken(token);
  };

  return (
    <AuthContext.Provider value={{ idToken, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
