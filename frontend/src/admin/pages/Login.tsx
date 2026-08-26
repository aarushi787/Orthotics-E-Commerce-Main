// src/admin/pages/Login.tsx
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Check admin doc in Firestore
      const adminDoc = await getDoc(doc(db, "admins", uid));
      if (!adminDoc.exists()) {
        // Optional fallback: allow specific emails listed in config
        await signOut(auth);
        setError("Access denied. Your account is not an admin.");
        return;
      }

      // optional: you can check admin role field: adminDoc.data().role === 'superadmin'
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <input type="email" required placeholder="Email" className="w-full p-2 border mb-3" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" className="w-full p-2 border mb-4" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-brand-teal-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
