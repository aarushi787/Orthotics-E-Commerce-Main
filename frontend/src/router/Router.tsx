import { BrowserRouter, Routes, Route } from "react-router-dom";
// ProductList component - using ProductListingPage instead
import ProductListingPage from "../components/ProductListingPage";
import CartPage from "../components/CartPage";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
