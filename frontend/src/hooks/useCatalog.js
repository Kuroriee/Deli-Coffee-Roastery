import { useEffect, useState } from "react";
import { publicApi } from "../lib/api";
import {
  brand as brandMock,
  testimonials as mockTestimonials,
  categories as mockCategories,
  products as mockProducts,
  houseBlend as mockHouseBlend,
} from "../mock/mock";

// Re-export the deterministic helpers that are used everywhere
export {
  buildWhatsAppLink,
  buildProductMessage,
  buildCartMessage,
  formatRupiah,
} from "../mock/mock";

const brandFromSettings = (s) => ({
  name: s.brand_name,
  fullName: s.full_name,
  location: "Medan, Sumatera Utara",
  tagline: s.tagline,
  subTagline: s.sub_tagline,
  instagram: s.instagram,
  instagramUrl: `https://www.instagram.com/${s.instagram}`,
  address: s.address,
  plusCode: s.plus_code,
  openingHour: s.opening_hour,
  closingHour: s.closing_hour,
  rating: s.rating,
  reviewCount: s.review_count,
  admins: s.admins || [],
});

export const useCatalog = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    categories: mockCategories,
    products: mockProducts,
    houseBlend: mockHouseBlend,
    zones: [],
    testimonials: mockTestimonials,
    settings: null,
    brand: brandMock,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cats, prods, ratios, zones, tsts, settings] = await Promise.all([
          publicApi.categories(),
          publicApi.products(),
          publicApi.houseBlendRatios(),
          publicApi.shippingZones(),
          publicApi.testimonials(),
          publicApi.settings(),
        ]);
        if (!mounted) return;
        setState({
          loading: false,
          error: null,
          categories: cats,
          products: prods,
          houseBlend: {
            ...mockHouseBlend,
            ratios: ratios.length ? ratios : mockHouseBlend.ratios,
          },
          zones,
          testimonials: tsts.length ? tsts : mockTestimonials,
          settings,
          brand: brandFromSettings(settings),
        });
      } catch (e) {
        console.warn("Fallback to mock:", e?.message);
        if (mounted) setState((s) => ({ ...s, loading: false, error: e }));
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
};
