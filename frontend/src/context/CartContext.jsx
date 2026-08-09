import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "deli_coffee_cart_v1";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const key = item.variant ? `${item.id}::${item.variant}` : item.id;
      const idx = prev.findIndex(
        (p) => (p.variant ? `${p.id}::${p.variant}` : p.id) === key
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + (item.qty || 1) };
        return next;
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  const removeItem = (id, variant) => {
    setItems((prev) =>
      prev.filter(
        (p) => !(p.id === id && (variant ? p.variant === variant : !p.variant))
      )
    );
  };

  const updateQty = (id, variant, qty) => {
    setItems((prev) =>
      prev.map((p) => {
        if (p.id === id && (variant ? p.variant === variant : !p.variant)) {
          return { ...p, qty: Math.max(1, qty) };
        }
        return p;
      })
    );
  };

  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { total, count };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, ...totals }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
