// src/admin/AdminApp.tsx
import './admin.css';
import './admin.extra.css';
import { Routes,Route,Navigate } from "react-router-dom";
import React, { Suspense, lazy } from "react";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const Orders = lazy(() => import("./pages/Orders"));
const Reviews = lazy(() => import("./pages/Reviews"));

export default function AdminApp(){
  const admin=localStorage.getItem("admin");

  return (
    <Suspense fallback={<div>Loading admin…</div>}>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        
        <Route path="/dashboard" element={admin?<Dashboard/>:<Navigate to="/admin/login"/>}/>
        <Route path="/products"  element={admin?<Products/>:<Navigate to="/admin/login"/>}/>
        <Route path="/products/new" element={admin?<AddProduct/>:<Navigate to="/admin/login"/>}/>
        <Route path="/orders" element={admin?<Orders/>:<Navigate to="/admin/login"/>}/>
        <Route path="/reviews" element={admin?<Reviews/>:<Navigate to="/admin/login"/>}/>
      </Routes>
    </Suspense>
  );
}
