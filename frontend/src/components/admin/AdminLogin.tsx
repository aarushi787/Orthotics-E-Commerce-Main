// import React, { useState } from "react";
// import api from "../../services/api";

// const AdminLogin: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       // Call backend admin login endpoint (adjust endpoint to match your backend)
//       const res = await api.apiAuth("/admin/login", "POST", { email, password });

//       // Expecting token + admin info in response; adapt to your backend shape
//       const token = res?.token || res?.accessToken;
//       if (!token) throw new Error(res?.message || "Login failed");

//       // Save token locally (you can replace with a context login)
//       localStorage.setItem("token", token);
//       localStorage.setItem("adminEmail", email);

//       // Redirect to admin dashboard (hash or path routing depends on your app)
//       window.location.href = "#/admin/dashboard";
//     } catch (err: any) {
//       console.error(err);
//       setError(err?.message || "Unable to login. Check credentials and try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm border">
//       <h3 className="text-xl font-bold mb-4">Admin Login</h3>

//       {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full border rounded-md px-3 py-2"
//             placeholder="admin@yourdomain.com"
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-gray-700 mb-1">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full border rounded-md px-3 py-2"
//             placeholder="••••••••"
//           />
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-brand-teal-500 text-white py-2 rounded-md font-semibold hover:opacity-95"
//           >
//             {loading ? "Signing in…" : "Sign in"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useState } from "react";
import api from "../../services/api";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.apiAuth("/admin/login", "POST", { email, password });

      const token = res?.token || res?.accessToken;
      if (!token) throw new Error(res?.message || "Login failed");

      localStorage.setItem("token", token);
      localStorage.setItem("adminEmail", email);

      window.location.href = "#/admin/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to login. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Sign in to your account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Admin login panel
        </p>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 transition outline-none"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 transition outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Remember me + Forgot password  */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>

            <button
              type="button"
              className="text-brand-teal-500 hover:underline"
            >
              Forgot your password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-teal-500 text-white py-3 rounded-lg font-semibold text-[15px] hover:bg-brand-teal-600 transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;