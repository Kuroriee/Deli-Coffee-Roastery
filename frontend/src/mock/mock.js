// Mock data untuk Deli Coffee Roastery Co.

export const brand = {
  name: "Deli Coffee",
  fullName: "Deli Coffee Roastery Co.",
  location: "Medan, Sumatera Utara",
  tagline: "Kopi Nusantara, Dipanggang di Kota Medan",
  subTagline: "Biji arabika & robusta pilihan, roasting harian oleh tangan lokal.",
  instagram: "delicoffee.roastery",
  instagramUrl: "https://www.instagram.com/delicoffee.roastery",
  address: "Gg. Sedar, Binjai, Kec. Medan Denai, Kota Medan, Sumatera Utara 20228",
  plusCode: "HPF9+GX Binjai, Kota Medan",
  openingHour: 9, // 09.00 WIB
  closingHour: 21, // asumsi tutup 21.00
  rating: 4.9,
  reviewCount: 18,
  admins: [
    { name: "Deni", phone: "081263680926", display: "0812-6368-0926" },
    { name: "Surya Darma", phone: "081396041308", display: "0813-9604-1308" }
  ]
};

// Format Rupiah helper juga dipakai di UI
export const formatRupiah = (n) =>
  "Rp" + Number(n).toLocaleString("id-ID");

// Kategori
export const categories = [
  {
    id: "arabica-specialty",
    name: "Arabica Specialty Process",
    short: "Specialty",
    description:
      "Proses eksperimental — Wine, Honey, Natural, Peaberry, hingga Luwak. Karakter rasa kompleks untuk pecinta specialty coffee.",
    image:
      "https://images.unsplash.com/photo-1524350876685-274059332603?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiYWdzfGVufDB8fHx8MTc4NjMwMDQ3OHww&ixlib=rb-4.1.0&q=85"
  },
  {
    id: "arabica-premium",
    name: "Arabica Premium",
    short: "Premium",
    description:
      "Gayo, Lintong, Mandheling — pilihan kelas Specialty & Premium. Body seimbang, acidity bersih, khas dataran tinggi Sumatera.",
    image:
      "https://images.unsplash.com/photo-1562051036-e0eea191d42f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBiYWdzfGVufDB8fHx8MTc4NjMwMDQ3OHww&ixlib=rb-4.1.0&q=85"
  },
  {
    id: "robusta",
    name: "Robusta",
    short: "Robusta",
    description:
      "Bold, pekat, dan berkarakter. Cocok untuk espresso, susu, maupun kopi tubruk harian.",
    image:
      "https://images.unsplash.com/photo-1512372388054-a322888e67a6"
  },
  {
    id: "house-blend",
    name: "House Blend Arabica + Robusta",
    short: "House Blend",
    description:
      "Racikan andalan Deli Coffee — pilih rasio arabika : robusta sesuai selera Anda.",
    image:
      "https://images.unsplash.com/photo-1598825659313-7264573d08db"
  }
];

// Produk
export const products = [
  // Arabica Specialty Process
  { id: "as-wine", category: "arabica-specialty", name: "Arabica Wine Process", process: "Wine", price: 400000, badge: "Premium", desc: "Fermentasi panjang, aroma buah anggur, body sirupy." },
  { id: "as-luwak", category: "arabica-specialty", name: "Arabica Luwak", process: "Luwak", price: 450000, badge: "Eksklusif", desc: "Klasik Nusantara, halus, low acidity, aftertaste manis." },
  { id: "as-peaberry", category: "arabica-specialty", name: "Arabica Peaberry", process: "Peaberry", price: 300000, desc: "Biji bundar tunggal, konsentrat rasa lebih intens." },
  { id: "as-honey", category: "arabica-specialty", name: "Arabica Honey Process", process: "Honey", price: 300000, desc: "Manis madu, body medium, acidity lembut." },
  { id: "as-natural", category: "arabica-specialty", name: "Arabica Natural Process", process: "Natural", price: 300000, desc: "Fruity, floral, dijemur bersama ceri kopinya." },

  // Arabica Premium (dulu Semi Washed)
  { id: "aw-gayo-sp", category: "arabica-premium", name: "Gayo Specialty", process: "Gayo", price: 250000, region: "Gayo", desc: "Aceh Tengah — herbal, earthy, aftertaste panjang." },
  { id: "aw-lintong-sp", category: "arabica-premium", name: "Lintong Specialty", process: "Lintong", price: 250000, region: "Lintong", desc: "Sumatera Utara — spicy, cokelat, body tebal." },
  { id: "aw-mandheling-sp", category: "arabica-premium", name: "Mandheling Specialty", process: "Mandheling", price: 250000, region: "Mandheling", desc: "Bold, earthy, hint tembakau dan kayu manis." },
  { id: "aw-gayo-pr", category: "arabica-premium", name: "Gayo Premium", process: "Gayo", price: 180000, region: "Gayo", desc: "Karakter Gayo dengan harga bersahabat." },
  { id: "aw-lintong-pr", category: "arabica-premium", name: "Lintong Premium", process: "Lintong", price: 180000, region: "Lintong", desc: "Kopi rumahan berkualitas dari Lintong." },
  { id: "aw-mandheling-pr", category: "arabica-premium", name: "Mandheling Premium", process: "Mandheling", price: 180000, region: "Mandheling", desc: "Rasa Mandheling klasik untuk sehari-hari." },

  // Robusta
  { id: "ro-medium", category: "robusta", name: "Robusta Medium", process: "Medium Roast", price: 120000, desc: "Body tebal, pahit seimbang, cocok untuk susu." },
  { id: "ro-medark", category: "robusta", name: "Robusta Medium to Dark", process: "Medium–Dark", price: 120000, desc: "Roasting lebih dalam, karakter cokelat pekat." },
  { id: "ro-caramel", category: "robusta", name: "Robusta Caramel", process: "Caramel", price: 120000, desc: "Aksen karamel manis, favorit untuk latte." }
];

// House Blend – harga per rasio (arabica/robusta)
export const houseBlend = {
  id: "hb-arabica-robusta",
  category: "house-blend",
  name: "House Blend Arabica + Robusta",
  desc: "Racikan seimbang antara acidity arabika dan body robusta. Pilih rasio favorit Anda.",
  ratios: [
    { label: "30 / 70", value: "30/70", price: 140000, note: "Robusta dominan — bold & pekat" },
    { label: "40 / 60", value: "40/60", price: 145000, note: "Cenderung robusta, tetap smooth" },
    { label: "50 / 50", value: "50/50", price: 150000, note: "Balance klasik — all-day drinker" },
    { label: "60 / 40", value: "60/40", price: 155000, note: "Arabika lebih dominan, lebih floral" },
    { label: "70 / 30", value: "70/30", price: 160000, note: "Arabika kuat, acidity cerah" }
  ]
};

// Testimoni singkat (mock)
export const testimonials = [
  {
    name: "Rina P.",
    city: "Medan",
    text: "Gayo Specialty-nya juara. Aromanya kebuka pas diseduh, aftertaste-nya bersih. Pengiriman cepat, packaging rapi.",
    rating: 5
  },
  {
    name: "Andre K.",
    city: "Binjai",
    text: "Robusta Caramel jadi favorit di kedai kami. Konsistensi roasting-nya stabil dari batch ke batch.",
    rating: 5
  },
  {
    name: "Yosephin S.",
    city: "Deli Serdang",
    text: "Order via WhatsApp gampang banget, langsung dijawab. House Blend 60/40 pas buat sehari-hari.",
    rating: 5
  },
  {
    name: "Bang Ijal",
    city: "Medan",
    text: "Luwak-nya beneran halus, low acidity. Worth it buat sesekali treat diri sendiri.",
    rating: 5
  }
];

// Hero images
export const heroImages = {
  main: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=srgb&fm=jpg&q=85",
  roasting: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?crop=entropy&cs=srgb&fm=jpg&q=85",
  brewing: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?crop=entropy&cs=srgb&fm=jpg&q=85",
  green: "https://images.unsplash.com/photo-1515694590185-73647ba02c10?crop=entropy&cs=srgb&fm=jpg&q=85",
  hero: "https://images.unsplash.com/photo-1607681034540-2c46cc71896d?crop=entropy&cs=srgb&fm=jpg&q=85"
};

// Helpers — bikin pesan WhatsApp
export const buildWhatsAppLink = (phone, message) => {
  const p = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
};

export const buildProductMessage = (product, qty = 1, extra = "") => {
  const lines = [
    "Halo Deli Coffee, saya ingin memesan:",
    "",
    `• Produk : ${product.name}${product.process ? ` (${product.process})` : ""}`,
    `• Jumlah : ${qty} kg`,
    `• Harga  : ${formatRupiah(product.price)}/kg`,
    extra ? `• Catatan: ${extra}` : null,
    "",
    `Estimasi total: ${formatRupiah(product.price * qty)}.`,
    "Mohon info ketersediaan & pengirimannya. Terima kasih!"
  ].filter(Boolean);
  return lines.join("\n");
};

export const buildCartMessage = (items) => {
  if (!items.length) return "";
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const body = items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.name}${i.variant ? ` — ${i.variant}` : ""} × ${i.qty} kg  (${formatRupiah(
          i.price
        )}/kg)`
    )
    .join("\n");
  return [
    "Halo Deli Coffee, saya ingin memesan beberapa produk:",
    "",
    body,
    "",
    `Estimasi total: ${formatRupiah(total)}.`,
    "Mohon info ketersediaan & ongkos kirim. Terima kasih!"
  ].join("\n");
};
