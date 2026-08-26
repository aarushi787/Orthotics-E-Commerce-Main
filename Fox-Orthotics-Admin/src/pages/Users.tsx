import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: {
    toDate: () => Date;
  };
  orders?: number;
  totalSpent?: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as User));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Users Management</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-brand-teal-500">{users.length}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.createdAt?.toDate?.().getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length}
          </div>
          <div className="text-sm text-gray-600">Last 30 Days</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.orders && u.orders > 0).length}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Orders</th>
                <th className="px-6 py-3 text-left font-semibold">Total Spent</th>
                <th className="px-6 py-3 text-left font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.displayName || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-brand-teal-*100 text-brand-teal-*700 rounded-full text-sm font-semibold">
                        {user.orders || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">₹{user.totalSpent || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.createdAt?.toDate?.().toLocaleDateString() || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}
