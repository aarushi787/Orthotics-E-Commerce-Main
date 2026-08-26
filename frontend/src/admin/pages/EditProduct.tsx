import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", String(id)));
      if (snap.exists()) {
        const data: any = snap.data();
        setTitle(data.title);
        setPrice(data.price);
        setImage(data.image);
      }
    };
    loadProduct();
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    let updatedImage = image;

    if (newImage) {
      const imgRef = ref(storage, `products/${newImage.name}`);
      await uploadBytes(imgRef, newImage);
      updatedImage = await getDownloadURL(imgRef);
    }

    await updateDoc(doc(db, "products", String(id)), {
      title,
      price,
      image: updatedImage,
    });

    alert("Product Updated!");
    navigate("/products");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

      <form onSubmit={handleUpdate} className="space-y-3">
        <input
          type="text"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <img src={image} className="h-20 mb-2" />

        <input
          type="file"
          className="border p-2 w-full"
          onChange={(e) => setNewImage(e.target.files?.[0])}
        />

        <button className="bg-brand-teal-500 text-white p-2 rounded w-full">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
