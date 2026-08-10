from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import uuid


def _now():
    return datetime.now(timezone.utc)


def _uid(prefix: str = "") -> str:
    return f"{prefix}{uuid.uuid4().hex[:12]}"


# ---------- USER / AUTH ----------
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    is_admin: bool = False
    created_at: datetime = Field(default_factory=_now)


# ---------- CATEGORY ----------
class Category(BaseModel):
    id: str
    name: str
    short: str
    description: str = ""
    image: str = ""
    sort_order: int = 0


class CategoryUpsert(BaseModel):
    id: Optional[str] = None
    name: str
    short: str
    description: str = ""
    image: str = ""
    sort_order: int = 0


# ---------- PRODUCT ----------
class Product(BaseModel):
    id: str = Field(default_factory=lambda: _uid("prd_"))
    category: str
    name: str
    process: Optional[str] = ""
    region: Optional[str] = ""
    price: int = 0
    badge: Optional[str] = ""
    desc: Optional[str] = ""
    image: Optional[str] = ""  # URL or data:image/... (base64)
    active: bool = True
    sort_order: int = 0


class ProductUpsert(BaseModel):
    id: Optional[str] = None
    category: str
    name: str
    process: Optional[str] = ""
    region: Optional[str] = ""
    price: int = 0
    badge: Optional[str] = ""
    desc: Optional[str] = ""
    image: Optional[str] = ""
    active: bool = True
    sort_order: int = 0


# ---------- HOUSE BLEND ----------
class HouseBlendRatio(BaseModel):
    value: str  # e.g. "50/50"
    label: str  # "50 / 50"
    price: int
    note: str = ""
    sort_order: int = 0


class HouseBlendRatiosPayload(BaseModel):
    ratios: List[HouseBlendRatio]


# ---------- SHIPPING ZONE ----------
class ShippingZone(BaseModel):
    id: str = Field(default_factory=lambda: _uid("shp_"))
    name: str
    description: str = ""
    cost: int = 0
    eta: str = ""  # e.g. "1–2 hari"
    sort_order: int = 0
    active: bool = True


class ShippingZoneUpsert(BaseModel):
    id: Optional[str] = None
    name: str
    description: str = ""
    cost: int = 0
    eta: str = ""
    sort_order: int = 0
    active: bool = True


# ---------- TESTIMONIAL ----------
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: _uid("tst_"))
    name: str
    city: str = ""
    text: str = ""
    rating: int = 5
    source: str = "manual"  # 'manual' | 'google'
    sort_order: int = 0
    active: bool = True


class TestimonialUpsert(BaseModel):
    id: Optional[str] = None
    name: str
    city: str = ""
    text: str = ""
    rating: int = 5
    source: str = "manual"
    sort_order: int = 0
    active: bool = True


# ---------- SETTINGS ----------
class Settings(BaseModel):
    brand_name: str = "Deli Coffee"
    full_name: str = "Deli Coffee Roastery Co."
    tagline: str = "Kopi Nusantara, Dipanggang di Kota Medan"
    sub_tagline: str = "Biji arabika & robusta pilihan, roasting harian oleh tangan lokal."
    instagram: str = "delicoffee.roastery"
    address: str = "Gg. Sedar, Binjai, Kec. Medan Denai, Kota Medan, Sumatera Utara 20228"
    plus_code: str = "HPF9+GX Binjai, Kota Medan"
    opening_hour: int = 9
    closing_hour: int = 21
    rating: float = 4.9
    review_count: int = 18
    admins: List[dict] = Field(default_factory=list)
    google_place_id: str = ""


# ---------- ORDER ----------
class OrderItem(BaseModel):
    product_id: Optional[str] = ""
    name: str
    variant: Optional[str] = ""
    price: int
    qty: int


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_note: Optional[str] = ""
    items: List[OrderItem]
    zone_id: Optional[str] = ""
    zone_name: Optional[str] = ""
    shipping_cost: int = 0
    admin_phone: str  # phone of admin the customer chose (WA target)
    admin_name: Optional[str] = ""


class Order(BaseModel):
    id: str = Field(default_factory=lambda: _uid("ord_"))
    customer_name: str
    customer_phone: str
    customer_note: Optional[str] = ""
    items: List[OrderItem]
    zone_id: Optional[str] = ""
    zone_name: Optional[str] = ""
    subtotal: int = 0
    shipping_cost: int = 0
    total: int = 0
    admin_phone: str = ""
    admin_name: Optional[str] = ""
    status: str = "new"  # new | fulfilled | cancelled
    created_at: datetime = Field(default_factory=_now)


class OrderStatusUpdate(BaseModel):
    status: str  # new | fulfilled | cancelled
