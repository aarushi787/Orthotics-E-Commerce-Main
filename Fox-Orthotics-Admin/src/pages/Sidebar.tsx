import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/admin', '');

  const menuItems = [
    { id: "dashboard", path: "/dashboard", label: "📊 Dashboard", icon: "📊" },
    { id: "products", path: "/dashboard/products", label: "📦 Products", icon: "📦" },
    { id: "orders", path: "/dashboard/orders", label: "📋 Orders", icon: "📋" },
    { id: "analytics", path: "/dashboard/analytics", label: "📈 Analytics", icon: "📈" },
    { id: "users", path: "/dashboard/users", label: "👥 Users", icon: "👥" },
    { id: "settings", path: "/dashboard/settings", label: "⚙️ Settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <span>🏥</span>
        <span>Fox</span>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            title={item.label}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label.replace(item.icon + ' ', '')}</span>
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="user-info">
          👤 {auth.currentUser?.email || 'Admin User'}
        </div>
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
