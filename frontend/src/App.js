import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "./components/ui/sonner";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <div className="App min-h-screen bg-[#F6EFE4] text-[#3B2412]">
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/katalog" element={<ProductsPage />} />
              <Route path="/katalog/:categoryId" element={<ProductsPage />} />
              <Route path="/keranjang" element={<CartPage />} />
              <Route path="/kontak" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
