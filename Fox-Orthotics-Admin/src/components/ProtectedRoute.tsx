import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }: any) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setIsAdmin(false);

      try {
        const adminSnap = await getDoc(doc(db, "admins", user.uid));
        const isAdminUser = adminSnap.exists() && adminSnap.data().role === "admin";
        setIsAdmin(!!isAdminUser);
      } catch (e) {
        setIsAdmin(false);
      }
    });

    return () => unsub();
  }, []);

  if (isAdmin === null) return <p>Loading...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
