import { useCallback, useEffect, useMemo, useState } from "react";
import { publicApi } from "../lib/api";
import { toast } from "sonner";

const STORAGE_CUSTOMER = "deli_coffee_customer_v1";

/**
 * Custom hook: handles customer form state + order submission logic.
 * Keeps CartPage focused on layout.
 */
export const useCheckout = ({ items, zone, subtotal, shipping }) => {
  const [submitting, setSubmitting] = useState(false);

  const [customer, setCustomer] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOMER);
      return raw ? JSON.parse(raw) : { name: "", phone: "", note: "" };
    } catch (err) {
      console.warn("useCheckout: gagal baca customer info", err);
      return { name: "", phone: "", note: "" };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOMER, JSON.stringify(customer));
    } catch (err) {
      console.warn("useCheckout: gagal simpan customer info", err);
    }
  }, [customer]);

  const canSubmit = useMemo(
    () =>
      items.length > 0 &&
      customer.name.trim().length >= 2 &&
      customer.phone.trim().length >= 6,
    [items.length, customer.name, customer.phone]
  );

  const submitOrder = useCallback(
    async (admin) => {
      if (!canSubmit) {
        toast.error("Isi nama & nomor HP terlebih dahulu (min 2 & 6 karakter)");
        return;
      }
      setSubmitting(true);
      try {
        const res = await publicApi.createOrder({
          customer_name: customer.name.trim(),
          customer_phone: customer.phone.trim(),
          customer_note: customer.note?.trim() || "",
          items: items.map((i) => ({
            product_id: i.id,
            name: i.name,
            variant: i.variant || "",
            price: Number(i.price),
            qty: Number(i.qty),
          })),
          zone_id: zone?.id || "",
          zone_name: zone?.name || "",
          shipping_cost: shipping,
          admin_phone: admin.phone,
          admin_name: admin.name,
        });
        window.open(res.wa_url, "_blank", "noopener,noreferrer");
        toast.success("Pesanan dicatat. Membuka WhatsApp…");
      } catch (e) {
        toast.error(e?.response?.data?.detail || "Gagal membuat pesanan");
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, customer, items, zone, shipping]
  );

  return { customer, setCustomer, submitting, canSubmit, submitOrder };
};
