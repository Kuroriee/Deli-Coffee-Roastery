import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AuthCallback from "./pages/AuthCallback";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminHouseBlend from "./pages/admin/AdminHouseBlend";
import AdminShipping from "./pages/admin/AdminShipping";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminBulkUpload from "./pages/admin/AdminBulkUpload";

// Callback intercept: if URL fragment contains session_id, render AuthCallback
const AppRouter = () => {
  const location = useLocation();
  if (location.hash && location.hash.includes("session_id=")) {
    return <AuthCallback />;
  }

  const isAdmin = location.pathname.startsWith("/admin");
  const isAuthArea = isAdmin || location.pathname === "/login";

  return (
    <>
      {!isAuthArea && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/katalog" element={<ProductsPage />} />
        <Route path="/katalog/:categoryId" element={<ProductsPage />} />
        <Route path="/keranjang" element={<CartPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pesanan" element={<AdminOrders />} />
          <Route path="produk" element={<AdminProducts />} />
          <Route path="foto" element={<AdminBulkUpload />} />
          <Route path="kategori" element={<AdminCategories />} />
          <Route path="house-blend" element={<AdminHouseBlend />} />
          <Route path="ongkir" element={<AdminShipping />} />
          <Route path="testimoni" element={<AdminTestimonials />} />
          <Route path="pengaturan" element={<AdminSettings />} />
        </Route>
      </Routes>
      {!isAuthArea && <Footer />}
    </>
  );
};

function App() {
  return (
    <div className="App min-h-screen bg-[#F6EFE4] text-[#3B2412]">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRouter />
            <Toaster position="bottom-right" />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
