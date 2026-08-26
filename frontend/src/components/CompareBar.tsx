import React, { useEffect, useState } from "react";
import { Product } from "../types";

export default function CompareBar({ products }: { products:Product[] }) {
  const [list, setList] = useState<number[]>([]);

  useEffect(()=> {
    setList(JSON.parse(localStorage.getItem("compare") || "[]"));
  }, []);

  const items = products.filter(p => list.includes(p.id));

  if(items.length===0) return null;

  return (
    <div className="fixed bottom-3 right-3 bg-brand-teal-500 text-white shadow-xl px-5 py-3 rounded-xl cursor-pointer">
      Compare ({items.length})
    </div>
  );
}
