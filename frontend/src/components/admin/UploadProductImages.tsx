import { useState } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function UploadProductImages() {
  const [sku, setSku] = useState("");
  const [color, setColor] = useState("default");
  const [files, setFiles] = useState<FileList | null>(null);

  const upload = async () => {
    if (!sku || !files) return alert("Missing SKU or files!");

    for (const file of Array.from(files)) {
      const uploadFile = file as File;
      const fileRef = ref(storage, `images/${sku}/${color}/${uploadFile.name}`);
      await uploadBytes(fileRef, uploadFile);
      const url = await getDownloadURL(fileRef);

      await updateDoc(doc(db, "products", sku), {
        [`images.${color}`]: arrayUnion(url),
        imageUrls: arrayUnion(url)
      });
    }

    alert("Uploaded Successfully!");
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4 border rounded-xl shadow">

      <input 
        placeholder="SKU e.g. MDL-101" 
        className="border p-2 w-full"
        onChange={e => setSku(e.target.value)}
      />

      <input 
        placeholder="Color (default / black / blue)" 
        className="border p-2 w-full"
        onChange={e => setColor(e.target.value)}
      />

      <input 
        type="file" 
        multiple 
        className="border p-2 w-full"
        onChange={e => setFiles(e.target.files)}
      />

      <button 
        onClick={upload} 
        className="bg-black text-white p-2 w-full rounded"
      >
        Upload Images
      </button>
    </div>
  );
}
