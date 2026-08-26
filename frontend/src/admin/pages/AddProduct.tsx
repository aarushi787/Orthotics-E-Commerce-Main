// src/admin/pages/AddProduct.tsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const AddProduct: React.FC = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories collection (optional)
    (async () => {
      try {
        const col = collection(db, "categories");
        const snap = await getDocs(col);
        setCategories(snap.docs.map(d => (d.data() as any).name));
      } catch (err) {
        console.warn("Failed to load categories", err);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageURL = "";
    if (imageFile) {
      const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageURL = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "products"), {
      title,
      price: Number(price || 0),
      image: imageURL,
      category,
      createdAt: Date.now()
    });

    navigate("/products");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Add Product</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-md">
        <input value={title} onChange={e => setTitle(e.target.value)} required className="border p-2 w-full" placeholder="Title" />
        <input value={price} onChange={e => setPrice(e.target.value ? Number(e.target.value) : "")} type="number" className="border p-2 w-full" placeholder="Price" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 w-full">
          <option value="">-- Select Category --</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
          <option value="Other">Other</option>
        </select>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
