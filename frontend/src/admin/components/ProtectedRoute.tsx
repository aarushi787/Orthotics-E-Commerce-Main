// src/admin/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute: React.FC<{ children: any }> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        // server-side check: admins collection
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        setAllowed(adminDoc.exists());
      } catch (err) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="p-6">Checking access…</div>;
  if (!allowed) return <Navigate to="/admin-login" replace />;
  return children;
};

export default ProtectedRoute;
