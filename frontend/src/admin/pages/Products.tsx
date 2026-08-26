// src/admin/pages/Products.tsx  (excerpt showing filter UI)
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from "react-router-dom";

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    (async () => {
      try {
        const catSnap = await getDocs(collection(db, "categories"));
        setCategories(catSnap.docs.map(d => (d.data() as any).name));
      } catch (err) {
        // fallback: derive categories from products
      }
    })();

    return () => unsub();
  }, []);

  const filtered = filterCategory ? products.filter(p => p.category === filterCategory) : products;

  return (
    <div>
      <AdminNavbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="flex gap-2 items-center">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => navigate("/add-product")} className="bg-green-600 text-white px-4 py-2 rounded">+ Add</button>
          </div>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 border">
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2"> {/* actions */} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
