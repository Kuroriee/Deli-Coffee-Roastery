"""Seed script for Deli Coffee — idempotent, populates initial data."""
import uuid
from datetime import datetime, timezone

CATEGORIES = [
    {"id": "arabica-specialty", "name": "Arabica Specialty Process", "short": "Specialty",
     "description": "Proses eksperimental — Wine, Honey, Natural, Peaberry, hingga Luwak. Karakter rasa kompleks untuk pecinta specialty coffee.",
     "image": "https://images.unsplash.com/photo-1524350876685-274059332603?crop=entropy&cs=srgb&fm=jpg&q=85",
     "sort_order": 1},
    {"id": "arabica-premium", "name": "Arabica Premium", "short": "Premium",
     "description": "Gayo, Lintong, Mandheling — pilihan kelas Specialty & Premium. Body seimbang, acidity bersih, khas dataran tinggi Sumatera.",
     "image": "https://images.unsplash.com/photo-1562051036-e0eea191d42f?crop=entropy&cs=srgb&fm=jpg&q=85",
     "sort_order": 2},
    {"id": "robusta", "name": "Robusta", "short": "Robusta",
     "description": "Bold, pekat, dan berkarakter. Cocok untuk espresso, susu, maupun kopi tubruk harian.",
     "image": "https://images.unsplash.com/photo-1512372388054-a322888e67a6",
     "sort_order": 3},
    {"id": "house-blend", "name": "House Blend Arabica + Robusta", "short": "House Blend",
     "description": "Racikan andalan Deli Coffee — pilih rasio arabika : robusta sesuai selera Anda.",
     "image": "https://images.unsplash.com/photo-1598825659313-7264573d08db",
     "sort_order": 4},
]

_IMG_SPEC = "https://images.unsplash.com/photo-1524350876685-274059332603?crop=entropy&cs=srgb&fm=jpg&q=85"
_IMG_PREM = "https://images.unsplash.com/photo-1562051036-e0eea191d42f?crop=entropy&cs=srgb&fm=jpg&q=85"
_IMG_ROBU = "https://images.unsplash.com/photo-1512372388054-a322888e67a6"

PRODUCTS = [
    {"id": "as-wine", "category": "arabica-specialty", "name": "Arabica Wine Process", "process": "Wine", "price": 400000, "badge": "Premium", "desc": "Fermentasi panjang, aroma buah anggur, body sirupy.", "image": "https://images.unsplash.com/photo-1675306408031-a9aad9f23308?crop=entropy&cs=srgb&fm=jpg&q=85", "sort_order": 1},
    {"id": "as-luwak", "category": "arabica-specialty", "name": "Arabica Luwak", "process": "Luwak", "price": 450000, "badge": "Eksklusif", "desc": "Klasik Nusantara, halus, low acidity, aftertaste manis.", "image": "https://images.unsplash.com/photo-1607681034540-2c46cc71896d?crop=entropy&cs=srgb&fm=jpg&q=85", "sort_order": 2},
    {"id": "as-peaberry", "category": "arabica-specialty", "name": "Arabica Peaberry", "process": "Peaberry", "price": 300000, "badge": "", "desc": "Biji bundar tunggal, konsentrat rasa lebih intens.", "image": _IMG_SPEC, "sort_order": 3},
    {"id": "as-honey", "category": "arabica-specialty", "name": "Arabica Honey Process", "process": "Honey", "price": 300000, "badge": "", "desc": "Manis madu, body medium, acidity lembut.", "image": _IMG_SPEC, "sort_order": 4},
    {"id": "as-natural", "category": "arabica-specialty", "name": "Arabica Natural Process", "process": "Natural", "price": 300000, "badge": "", "desc": "Fruity, floral, dijemur bersama ceri kopinya.", "image": _IMG_SPEC, "sort_order": 5},

    {"id": "aw-gayo-sp", "category": "arabica-premium", "name": "Gayo Specialty", "process": "Gayo", "region": "Gayo", "price": 250000, "badge": "", "desc": "Aceh Tengah — herbal, earthy, aftertaste panjang.", "image": _IMG_PREM, "sort_order": 1},
    {"id": "aw-lintong-sp", "category": "arabica-premium", "name": "Lintong Specialty", "process": "Lintong", "region": "Lintong", "price": 250000, "badge": "", "desc": "Sumatera Utara — spicy, cokelat, body tebal.", "image": _IMG_PREM, "sort_order": 2},
    {"id": "aw-mandheling-sp", "category": "arabica-premium", "name": "Mandheling Specialty", "process": "Mandheling", "region": "Mandheling", "price": 250000, "badge": "", "desc": "Bold, earthy, hint tembakau dan kayu manis.", "image": _IMG_PREM, "sort_order": 3},
    {"id": "aw-gayo-pr", "category": "arabica-premium", "name": "Gayo Premium", "process": "Gayo", "region": "Gayo", "price": 180000, "badge": "", "desc": "Karakter Gayo dengan harga bersahabat.", "image": _IMG_PREM, "sort_order": 4},
    {"id": "aw-lintong-pr", "category": "arabica-premium", "name": "Lintong Premium", "process": "Lintong", "region": "Lintong", "price": 180000, "badge": "", "desc": "Kopi rumahan berkualitas dari Lintong.", "image": _IMG_PREM, "sort_order": 5},
    {"id": "aw-mandheling-pr", "category": "arabica-premium", "name": "Mandheling Premium", "process": "Mandheling", "region": "Mandheling", "price": 180000, "badge": "", "desc": "Rasa Mandheling klasik untuk sehari-hari.", "image": _IMG_PREM, "sort_order": 6},

    {"id": "ro-medium", "category": "robusta", "name": "Robusta Medium", "process": "Medium Roast", "price": 120000, "badge": "", "desc": "Body tebal, pahit seimbang, cocok untuk susu.", "image": _IMG_ROBU, "sort_order": 1},
    {"id": "ro-medark", "category": "robusta", "name": "Robusta Medium to Dark", "process": "Medium–Dark", "price": 120000, "badge": "", "desc": "Roasting lebih dalam, karakter cokelat pekat.", "image": _IMG_ROBU, "sort_order": 2},
    {"id": "ro-caramel", "category": "robusta", "name": "Robusta Caramel", "process": "Caramel", "price": 120000, "badge": "", "desc": "Aksen karamel manis, favorit untuk latte.", "image": _IMG_ROBU, "sort_order": 3},
]

HOUSE_BLEND_RATIOS = [
    {"value": "30/70", "label": "30 / 70", "price": 140000, "note": "Robusta dominan — bold & pekat", "sort_order": 1},
    {"value": "40/60", "label": "40 / 60", "price": 145000, "note": "Cenderung robusta, tetap smooth", "sort_order": 2},
    {"value": "50/50", "label": "50 / 50", "price": 150000, "note": "Balance klasik — all-day drinker", "sort_order": 3},
    {"value": "60/40", "label": "60 / 40", "price": 155000, "note": "Arabika lebih dominan, lebih floral", "sort_order": 4},
    {"value": "70/30", "label": "70 / 30", "price": 160000, "note": "Arabika kuat, acidity cerah", "sort_order": 5},
]

SHIPPING_ZONES = [
    {"name": "Ambil di Tempat (Pickup)", "description": "Ambil langsung di roastery Medan Denai", "cost": 0, "eta": "Kapan saja setelah 09.00 WIB", "sort_order": 0, "active": True},
    {"name": "Medan Kota", "description": "Dalam kota Medan", "cost": 15000, "eta": "Same-day / next-day", "sort_order": 1, "active": True},
    {"name": "Deli Serdang / Binjai", "description": "Kawasan sekitar Medan", "cost": 20000, "eta": "1–2 hari", "sort_order": 2, "active": True},
    {"name": "Sumatera Utara (Luar Kota)", "description": "Kabupaten/kota lain di Sumut", "cost": 30000, "eta": "2–4 hari", "sort_order": 3, "active": True},
    {"name": "Pulau Sumatera (Luar Sumut)", "description": "Aceh, Riau, Sumbar, dst.", "cost": 45000, "eta": "3–5 hari", "sort_order": 4, "active": True},
    {"name": "Jawa & Bali", "description": "Estimasi standar JNE Reg", "cost": 55000, "eta": "4–6 hari", "sort_order": 5, "active": True},
    {"name": "Indonesia Timur", "description": "Kalimantan, Sulawesi, NTT, Papua, dst.", "cost": 90000, "eta": "5–9 hari", "sort_order": 6, "active": True},
]

TESTIMONIALS = [
    {"name": "Rina P.", "city": "Medan", "text": "Gayo Specialty-nya juara. Aromanya kebuka pas diseduh, aftertaste-nya bersih. Pengiriman cepat, packaging rapi.", "rating": 5, "source": "manual", "sort_order": 1, "active": True},
    {"name": "Andre K.", "city": "Binjai", "text": "Robusta Caramel jadi favorit di kedai kami. Konsistensi roasting-nya stabil dari batch ke batch.", "rating": 5, "source": "manual", "sort_order": 2, "active": True},
    {"name": "Yosephin S.", "city": "Deli Serdang", "text": "Order via WhatsApp gampang banget, langsung dijawab. House Blend 60/40 pas buat sehari-hari.", "rating": 5, "source": "manual", "sort_order": 3, "active": True},
    {"name": "Bang Ijal", "city": "Medan", "text": "Luwak-nya beneran halus, low acidity. Worth it buat sesekali treat diri sendiri.", "rating": 5, "source": "manual", "sort_order": 4, "active": True},
]

SETTINGS = {
    "brand_name": "Deli Coffee",
    "full_name": "Deli Coffee Roastery Co.",
    "tagline": "Kopi Nusantara, Dipanggang di Kota Medan",
    "sub_tagline": "Biji arabika & robusta pilihan, roasting harian oleh tangan lokal.",
    "instagram": "delicoffee.roastery",
    "address": "Gg. Sedar, Binjai, Kec. Medan Denai, Kota Medan, Sumatera Utara 20228",
    "plus_code": "HPF9+GX Binjai, Kota Medan",
    "opening_hour": 9,
    "closing_hour": 21,
    "rating": 4.9,
    "review_count": 18,
    "admins": [
        {"name": "Deni", "phone": "081263680926", "display": "0812-6368-0926"},
        {"name": "Surya Darma", "phone": "081396041308", "display": "0813-9604-1308"},
    ],
    "google_place_id": "",
}


async def seed_all(db):
    if await db.categories.count_documents({}) == 0:
        await db.categories.insert_many([{**c} for c in CATEGORIES])
    if await db.products.count_documents({}) == 0:
        docs = [{**p, "active": True} for p in PRODUCTS]
        await db.products.insert_many(docs)
    if await db.house_blend_ratios.count_documents({}) == 0:
        await db.house_blend_ratios.insert_many([{**r} for r in HOUSE_BLEND_RATIOS])
    if await db.shipping_zones.count_documents({}) == 0:
        docs = [{**z, "id": f"shp_{uuid.uuid4().hex[:12]}"} for z in SHIPPING_ZONES]
        await db.shipping_zones.insert_many(docs)
    if await db.testimonials.count_documents({}) == 0:
        docs = [{**t, "id": f"tst_{uuid.uuid4().hex[:12]}"} for t in TESTIMONIALS]
        await db.testimonials.insert_many(docs)
    if await db.settings.count_documents({}) == 0:
        await db.settings.insert_one({"_key": "main", **SETTINGS})
