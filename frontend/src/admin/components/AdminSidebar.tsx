import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white fixed h-full">
      <div className="text-2xl font-bold px-6 py-4 border-b border-gray-700">
        FOX ADMIN
      </div>

      <nav className="mt-4 flex flex-col gap-2 px-4">
        <Link to="/admin" className="nav-item">📊 Dashboard</Link>
        <Link to="/admin/products" className="nav-item">🛍 Products</Link>
        <Link to="/admin/products/new" className="nav-item">➕ Add Product</Link>
        <Link to="/admin/orders" className="nav-item">📦 Orders</Link>
        <Link to="/admin/reviews" className="nav-item">⭐ Reviews</Link>
      </nav>
    </aside>
  );
}
