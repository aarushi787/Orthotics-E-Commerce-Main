import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Sidebar from "./Sidebar";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnap = await getDocs(collection(db, "products"));
        const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
        const usersSnap = await getDocs(collection(db, "users"));

        const orders = ordersSnap.docs.map((doc) => doc.data());
        const products = productsSnap.docs.map((doc) => doc.data());

        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
        const lowStockProducts = products.filter((p: any) => (p.stock || 0) < 10).length;

        setStats({
          totalProducts: productsSnap.size,
          totalOrders: ordersSnap.size,
          totalRevenue,
          totalUsers: usersSnap.size,
          pendingOrders,
          lowStockProducts,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-header">
          <h1>Welcome to Admin Dashboard</h1>
          <p>Manage your e-commerce store efficiently</p>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="grid-4">
                <div className="card stat-card">
                  <div className="stat-value">{stats.totalProducts}</div>
                  <div className="stat-label">Total Products</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value">{stats.totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value warning">{stats.pendingOrders}</div>
                  <div className="stat-label">Pending Orders</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value danger">{stats.lowStockProducts}</div>
                  <div className="stat-label">Low Stock Items</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <h3>⚡ Quick Actions</h3>
                  <div>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard/products')}>
                      ➕ Add New Product
                    </button>
                    <button className="btn btn-success" onClick={() => navigate('/dashboard/orders')}>
                      📦 View All Orders
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard/analytics')}>
                      📊 View Analytics
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3>✨ Admin Features</h3>
                  <ul>
                    <li>
                      <span>✓</span> Product Management (CRUD)
                    </li>
                    <li>
                      <span>✓</span> Order Tracking
                    </li>
                    <li>
                      <span>✓</span> Analytics & Reports
                    </li>
                    <li>
                      <span>✓</span> User Management
                    </li>
                    <li>
                      <span>✓</span> Profile Settings
                    </li>
                    <li>
                      <span>✓</span> Real-time Notifications
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
