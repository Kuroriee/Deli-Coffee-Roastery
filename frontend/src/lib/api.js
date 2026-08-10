import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export default api;

// helpers
export const publicApi = {
  categories: () => api.get("/categories").then((r) => r.data),
  products: (category) =>
    api.get("/products", { params: category ? { category } : {} }).then((r) => r.data),
  houseBlendRatios: () => api.get("/house-blend/ratios").then((r) => r.data),
  shippingZones: () => api.get("/shipping-zones").then((r) => r.data),
  testimonials: () => api.get("/testimonials").then((r) => r.data),
  settings: () => api.get("/settings").then((r) => r.data),
  googleReviews: () => api.get("/google-reviews").then((r) => r.data),
  createOrder: (data) => api.post("/orders", data).then((r) => r.data),
};

export const adminApi = {
  // categories
  saveCategory: (data) => api.post("/admin/categories", data).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data),
  // products
  listProducts: () => api.get("/admin/products").then((r) => r.data),
  saveProduct: (data) => api.post("/admin/products", data).then((r) => r.data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`).then((r) => r.data),
  bulkAssignImages: (assignments) =>
    api.post("/admin/products/bulk-images", { assignments }).then((r) => r.data),
  // house blend
  saveRatios: (ratios) =>
    api.put("/admin/house-blend/ratios", { ratios }).then((r) => r.data),
  // shipping
  saveZone: (data) => api.post("/admin/shipping-zones", data).then((r) => r.data),
  deleteZone: (id) => api.delete(`/admin/shipping-zones/${id}`).then((r) => r.data),
  // testimonials
  listTestimonials: () => api.get("/admin/testimonials").then((r) => r.data),
  saveTestimonial: (data) => api.post("/admin/testimonials", data).then((r) => r.data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`).then((r) => r.data),
  // settings
  saveSettings: (data) => api.put("/admin/settings", data).then((r) => r.data),
  // orders
  listOrders: (status) =>
    api.get("/admin/orders", { params: status ? { status } : {} }).then((r) => r.data),
  updateOrderStatus: (id, status) =>
    api.patch(`/admin/orders/${id}`, { status }).then((r) => r.data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`).then((r) => r.data),
};

export const authApi = {
  me: () => api.get("/auth/me").then((r) => r.data),
  session: (session_id) =>
    api.post("/auth/session", { session_id }).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
};
