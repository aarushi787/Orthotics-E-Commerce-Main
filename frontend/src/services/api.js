// Use a relative API base by default so the hosted frontend can call `/api/...`
// and Firebase Hosting rewrites route to the function or backend.
export const API_BASE = import.meta.env.VITE_API_URL ?? "";

// Generic request handler
async function request(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    let err = "Server error";
    try {
      const body = await res.json();
      err = body?.message || err;
    } catch (_) {}
    throw new Error(err);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────────
// 📌 PUBLIC API CALLS
// ─────────────────────────────────────────────────────────────

export async function getProducts() {
  return request(`${API_BASE}/api/products`); // FIXED
}
export async function getProductImages(sku) {
  return request(`/api/products/${sku}/images`);
}

export async function getProductById(id) {
  return request(`${API_BASE}/api/products/${id}`);
}

// Razorpay + Orders
export async function createRazorpayOrder(amount, recaptchaToken = null) {
  return request(`${API_BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, recaptchaToken }),
  });
}

export async function createOrder(items, total, tax, shipping, address, paymentId, recaptchaToken = null) {
  return request(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, total, tax, shipping, address, paymentId, recaptchaToken }),
  });
}

export default { getProducts, getProductById, createRazorpayOrder, createOrder };
