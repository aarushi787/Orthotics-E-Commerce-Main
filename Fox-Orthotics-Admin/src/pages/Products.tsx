import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number;
  category: string;
  stock: number;
  imageUrls: string[];
  description: string;
  material: string;
  sizes: string[];
  rating: number;
  inStock: boolean;
  createdAt?: any;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [reviews, setReviews] = useState<any[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Fetch reviews for the selected product
  useEffect(() => {
    if (selectedProduct) {
      const fetchReviews = async () => {
        try {
          const q = query(
            collection(db, "reviews"),
            where("productId", "==", selectedProduct.id),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          const reviewData = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
          }));
          setReviews(reviewData);
        } catch (err) {
          console.error("Error fetching reviews:", err);
          setReviews([]);
        }
      };
      fetchReviews();
      setMainImageIndex(0);
    }
  }, [selectedProduct]);

  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    sku: "",
    price: 0,
    originalPrice: 0,
    category: "",
    stock: 0,
    imageUrls: [],
    description: "",
    material: "",
    sizes: [],
    rating: 0,
    inStock: true,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), {
          ...formData,
          updatedAt: new Date(),
        });
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), {
          ...formData,
          createdAt: new Date(),
        });
        alert("Product created successfully!");
      }
      setFormData({
        id: "",
        name: "",
        sku: "",
        price: 0,
        originalPrice: 0,
        category: "",
        stock: 0,
        imageUrls: [],
        description: "",
        material: "",
        sizes: [],
        rating: 0,
        inStock: true,
      });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Products Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              id: "",
              name: "",
              sku: "",
              price: 0,
              originalPrice: 0,
              category: "",
              stock: 0,
              imageUrls: [],
              description: "",
              material: "",
              sizes: [],
              rating: 0,
              inStock: true,
            });
          }}
          className="px-4 py-2 bg-brand-teal-500 text-white rounded hover:bg-brand-teal-600"
        >
          {showForm ? "Cancel" : "Add New Product"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-blue-200">
          <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Orthotic Insole"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">SKU *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                className="w-full p-2 border rounded"
                placeholder="e.g., MDL-101"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                placeholder="999"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                placeholder="1299"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Foot Care & Orthotics"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Gel, Memory Foam"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Rating</label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                min="0"
                max="5"
                step="0.1"
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Detailed product description..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Image URLs (comma-separated)</label>
              <textarea
                value={formData.imageUrls.join(", ")}
                onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value.split(",").map(s => s.trim()) })}
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="images/mdl-101.jpg, images/mdl-101-2.jpg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Sizes (comma-separated)</label>
              <input
                type="text"
                value={formData.sizes.join(", ")}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(",").map(s => s.trim()) })}
                className="w-full p-2 border rounded"
                placeholder="S, M, L, XL"
              />
            </div>
            <div className="col-span-2 flex gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-semibold">In Stock</span>
              </label>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
            aria-label="Search products"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded"
            aria-label="Filter by category"
            title="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={String(cat)} value={String(cat)}>
                {String(cat)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Image</th>
                <th className="px-6 py-3 text-left font-semibold">SKU</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Stock</th>
                <th className="px-6 py-3 text-left font-semibold">Rating</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                pagedProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.imageUrls && product.imageUrls.length ? (
                          // try to display image; if relative path, use it directly
                          <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-xs text-gray-500">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{product.sku}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.category || "-"}</td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">⭐ {product.rating || 0}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-brand-teal-*500 text-white rounded text-sm hover:bg-brand-teal-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
                      >
                        Quick View
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      {filteredProducts.length > pageSize && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >Prev</button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gray-100 rounded overflow-hidden">
                  {selectedProduct.imageUrls && selectedProduct.imageUrls.length ? (
                    <img src={selectedProduct.imageUrls[mainImageIndex]} alt={selectedProduct.name} className="w-full h-64 object-contain bg-white cursor-pointer hover:opacity-90 transition" />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
                {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {selectedProduct.imageUrls.map((u, i) => (
                      <img 
                        key={i} 
                        src={u} 
                        alt={`thumb-${i}`} 
                        onClick={() => setMainImageIndex(i)}
                        className={`w-16 h-12 object-cover rounded cursor-pointer ${i === mainImageIndex ? 'ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100'} transition`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-2xl font-bold">₹{selectedProduct.price}</div>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <div className="text-sm line-through text-gray-500">₹{selectedProduct.originalPrice}</div>
                  )}
                  <div className="ml-auto text-sm text-gray-600">SKU: {selectedProduct.sku}</div>
                </div>
                <div className="mb-4 text-sm text-gray-700">{selectedProduct.description}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Specifications</h4>
                    <ul className="text-sm text-gray-700 mt-2">
                      <li><strong>Material:</strong> {selectedProduct.material || '-'}</li>
                      <li><strong>Sizes:</strong> {(selectedProduct.sizes || []).join(', ') || '-'}</li>
                      <li><strong>Category:</strong> {selectedProduct.category || '-'}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Key Features</h4>
                    <ul className="text-sm text-gray-700 mt-2">
                      <li>• Comfortable</li>
                      <li>• Durable material</li>
                      <li>• Easy to clean</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold">Customer Reviews</h4>
                  <div className="mt-2 space-y-3 max-h-48 overflow-y-auto">
                    {reviews.length === 0 ? (
                      <div className="p-3 border rounded text-sm text-gray-600">No reviews yet.</div>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="p-3 border rounded text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{r.name || 'Anonymous'}</span>
                            <span className="text-xs text-gray-500">{r.rating || 0}★</span>
                          </div>
                          <p className="text-gray-700">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
              <button onClick={() => { setSelectedProduct(null); handleEdit(selectedProduct); }} className="px-4 py-2 bg-brand-teal-500 text-white rounded">Edit</button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        Total: {filteredProducts.length} products
      </div>
    </div>
  );
}
