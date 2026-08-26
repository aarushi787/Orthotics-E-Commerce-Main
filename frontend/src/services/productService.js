// src/services/productService.js
import { API_BASE, apiGet } from "./api";

export async function fetchProducts() {
  try {
    const data = await apiGet("/api/products"); 

    if (!data.success || !Array.isArray(data.products)) {
      console.error("Invalid response:", data);
      return [];
    }

    return data.products;
  } catch (err) {
    console.error("fetchProducts error:", err);
    return [];
  }
}

export async function fetchProductById(id) {
  try {
    const data = await apiGet(`/api/products/${id}`);

    if (!data.success) return null;

    return data.product;
  } catch (err) {
    console.error("fetchProductById error:", err);
    return null;
  }
}
