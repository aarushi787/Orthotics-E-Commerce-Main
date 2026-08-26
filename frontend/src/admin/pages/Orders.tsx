// src/admin/pages/Orders.tsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";
import AdminNavbar from "../components/AdminNavbar";

type Order = {
  id: string;
  customerName?: string;
  total?: number;
  status?: string;
  createdAt?: any;
  items?: any[];
  email?: string;
};

const STATUS_SEQUENCE = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });
    return () => unsub();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
    // Optionally: add a `history` array or `updatedAt` field on order
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>

        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border rounded p-4 flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{o.customerName || "—"}</div>
                <div className="text-sm text-gray-600">Order ID: {o.id}</div>
                <div className="mt-2">Total: ₹{o.total ?? 0}</div>
                <div className="text-sm text-gray-600">Email: {o.email}</div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-xs text-gray-500">Status</label>
                  <select
                    value={o.status || "Pending"}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border p-2 rounded"
                  >
                    {STATUS_SEQUENCE.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <button
                    className="bg-brand-teal-500 text-white px-3 py-2 rounded"
                    onClick={() => updateStatus(o.id, "Delivered")}
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
