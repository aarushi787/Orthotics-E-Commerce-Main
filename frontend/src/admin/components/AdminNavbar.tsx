import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  return (
    <nav className="w-full bg-black text-white p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Fox — Admin</h2>
      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded text-white"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
