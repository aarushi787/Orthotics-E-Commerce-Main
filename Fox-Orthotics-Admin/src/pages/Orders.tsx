import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  createdAt: {
    toDate: () => Date;
  };
  address: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Order));
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) => !filterStatus || order.status === filterStatus
  );

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-brand-teal-*100 text-brand-teal-*700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Orders Management</h2>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-brand-teal-500">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          <div className="text-sm text-gray-600">Shipped</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <label htmlFor="status-filter" className="text-sm font-semibold mr-2">Filter by Status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Amount</th>
                <th className="px-6 py-3 text-left font-semibold">Items</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-sm">{order.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4">{order.customerName || "-"}</td>
                    <td className="px-6 py-4 text-sm">{order.email || "-"}</td>
                    <td className="px-6 py-4 font-semibold">₹{order.total}</td>
                    <td className="px-6 py-4 text-sm">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.createdAt?.toDate?.().toLocaleDateString() || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
