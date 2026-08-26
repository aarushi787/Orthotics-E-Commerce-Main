// src/admin/pages/Dashboard.tsx (updated)
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import AdminNavbar from "../components/AdminNavbar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [users, setUsers] = useState(0);
  const [salesByDay, setSalesByDay] = useState<any[]>([]); // [{date: '2025-11-20', sales: 1200}, ...]

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), snap => setProducts(snap.size));
    const unsubOrders = onSnapshot(collection(db, "orders"), snap => {
      setOrders(snap.size);
      let total = 0;
      const byDay: Record<string, number> = {};
      snap.forEach(doc => {
        const data = doc.data() as any;
        const t = Number(data.total || 0);
        total += t;
        const d = new Date(data.createdAt || Date.now());
        const key = d.toISOString().slice(0,10);
        byDay[key] = (byDay[key] || 0) + t;
      });
      const series = Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).map(([date, sales]) => ({ date, sales }));
      setSalesByDay(series);
      setRevenue(total);
    });
    const unsubUsers = onSnapshot(collection(db, "users"), snap => setUsers(snap.size));

    return () => {
      unsubProducts(); unsubOrders(); unsubUsers();
    };
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Products</h4>
          <div className="text-2xl font-bold">{products}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Orders</h4>
          <div className="text-2xl font-bold">{orders}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Revenue</h4>
          <div className="text-2xl font-bold">₹{revenue}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Users</h4>
          <div className="text-2xl font-bold">{users}</div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow h-96">
          <h3 className="mb-3 font-semibold">Sales - Last days</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow h-96">
          <h3 className="mb-3 font-semibold">Sales by day (bar)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
