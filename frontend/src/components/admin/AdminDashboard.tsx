import React, { useEffect, useState } from "react";
import api from "../../services/api";

type Product = {
  id: number | string;
  name: string;
  sku?: string;
  price: number;
  imageUrls?: string[];
  stock?: number;
  [key: string]: any;
};

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      // If your backend exposes admin-only endpoint, use it. Otherwise use /products
      const res = token
        ? await api.apiAuth("/admin/products", "GET", null, token)
        : await api.apiGet("/products");
      // assume res is array
      setProducts(Array.isArray(res) ? res : res.products || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm("Delete this product?")) return;
    setActionLoading(String(id));
    try {
      await api.apiAuth(`/admin/products/${id}`, "DELETE", null, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to delete product");
    } finally {
      setActionLoading(null);
    }
  }

  // A simple create form for quick product creation
  async function handleCreateQuick() {
    const name = prompt("Product name");
    if (!name) return;
    const priceStr = prompt("Price (INR)");
    const price = priceStr ? parseFloat(priceStr) : 0;
    setActionLoading("create");
    try {
      const newProduct = await api.apiAuth(
        "/admin/products",
        "POST",
        { name, price },
        token
      );
      setProducts((prev) => [newProduct, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to create product");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Admin Dashboard</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="px-3 py-1 rounded-md border text-sm"
          >
            Refresh
          </button>
          <button
            onClick={handleCreateQuick}
            disabled={!!actionLoading}
            className="px-3 py-1 rounded-md bg-brand-teal-500 text-white text-sm"
          >
            {actionLoading === "create" ? "Creating…" : "Quick Add"}
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-sm text-gray-500">Loading products…</div>
      ) : (
        <div className="space-y-3">
          {products.length === 0 && <div className="text-sm text-gray-500">No products yet.</div>}
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-b pb-3">
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                {p.imageUrls?.[0] ? (
                  <img
                    src={p.imageUrls[0].startsWith('/') ? p.imageUrls[0] : `/${p.imageUrls[0]}`}
                    className="object-cover w-full h-full"
                    alt={p.name}
                    onError={(e:any) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.dataset.attempt === '1') { img.src = '/images/no-image.png'; return; }
                      const sku = (p.sku || '').toString().toUpperCase();
                      if (sku) {
                        img.dataset.attempt = '1';
                        img.src = `/images/${sku}/${sku}-1.jpg`;
                        return;
                      }
                      img.src = '/images/no-image.png';
                    }}
                  />
                ) : (
                  <span className="text-xs text-gray-500">No Image</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">SKU: {p.sku || "—"}</div>
                <div className="text-sm text-gray-700">₹{(p.price || 0).toFixed(2)}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => (window.location.href = `#/admin/products/edit/${p.id}`)}
                  className="px-3 py-1 rounded-md border text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-sm"
                >
                  {actionLoading === String(p.id) ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
