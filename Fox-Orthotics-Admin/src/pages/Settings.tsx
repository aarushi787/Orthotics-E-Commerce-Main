import { useState } from "react";
import { auth } from "../firebase";
import { signOut, updatePassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    displayName: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderNotifications: true,
    productAlerts: true,
    weeklyReport: true,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      if (profileData.displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.displayName,
        });
      }
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      alert("Password updated successfully!");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Settings</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`p-4 rounded-lg font-semibold transition ${
            activeTab === "profile"
              ? "bg-brand-teal-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          👤 Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`p-4 rounded-lg font-semibold transition ${
            activeTab === "security"
              ? "bg-brand-teal-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          🔒 Security
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`p-4 rounded-lg font-semibold transition ${
            activeTab === "preferences"
              ? "bg-brand-teal-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          ⚙️ Preferences
        </button>
        <button
          onClick={handleLogout}
          className="p-4 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700"
        >
          🚪 Logout
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Profile Settings</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Display Name</label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Security Settings</h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { key: "emailNotifications", label: "Email Notifications" },
              { key: "orderNotifications", label: "Order Notifications" },
              { key: "productAlerts", label: "Product Alerts" },
              { key: "weeklyReport", label: "Weekly Report" },
            ].map((pref) => (
              <label key={pref.key} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[pref.key as keyof typeof preferences]}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [pref.key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mr-3"
                />
                <span className="font-semibold">{pref.label}</span>
              </label>
            ))}
            <button className="w-full px-4 py-2 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
