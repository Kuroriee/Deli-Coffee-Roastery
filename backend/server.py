from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional

from models import (
    Category, CategoryUpsert,
    Product, ProductUpsert,
    HouseBlendRatio, HouseBlendRatiosPayload,
    ShippingZone, ShippingZoneUpsert,
    Testimonial, TestimonialUpsert,
    Settings,
)
from auth import (
    fetch_emergent_session, set_session_cookie, clear_session_cookie,
    current_user, require_admin, is_email_whitelisted, SESSION_DAYS,
)
from seed import seed_all


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Deli Coffee API")
api = APIRouter(prefix="/api")


# ---------------- STARTUP ----------------
@app.on_event("startup")
async def on_start():
    try:
        await seed_all(db)
    except Exception as e:
        logging.warning(f"Seed skipped: {e}")


# ---------------- AUTH ----------------
@api.post("/auth/session")
async def auth_session(payload: dict, response: Response):
    session_id = (payload or {}).get("session_id")
    if not session_id:
        raise HTTPException(400, "session_id wajib")
    data = await fetch_emergent_session(session_id)
    email = (data.get("email") or "").lower().strip()
    if not email:
        raise HTTPException(401, "Email tidak ditemukan")
    if not is_email_whitelisted(email):
        raise HTTPException(403, "Email Anda tidak terdaftar sebagai admin. Silakan hubungi tim Deli Coffee.")

    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": data.get("name") or existing.get("name", ""),
                "picture": data.get("picture") or existing.get("picture", ""),
                "is_admin": True,
            }},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": data.get("name") or email.split("@")[0],
            "picture": data.get("picture") or "",
            "is_admin": True,
            "created_at": datetime.now(timezone.utc),
        })

    session_token = data.get("session_token") or f"tok_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc),
    })
    set_session_cookie(response, session_token)
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return {"ok": True, "user": user}


@api.get("/auth/me")
async def auth_me(request: Request):
    user = await current_user(request, db)
    if not user:
        raise HTTPException(401, "Belum login")
    return user


@api.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    from auth import get_session_token_from_request
    token = await get_session_token_from_request(request)
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    clear_session_cookie(response)
    return {"ok": True}


# ---------------- CATEGORIES ----------------
@api.get("/categories", response_model=List[Category])
async def list_categories():
    docs = await db.categories.find({}, {"_id": 0}).sort("sort_order", 1).to_list(500)
    return docs


async def _admin_dep(request: Request):
    return await require_admin(request, db)


@api.post("/admin/categories", response_model=Category)
async def upsert_category(payload: CategoryUpsert, request: Request):
    await require_admin(request, db)
    cid = payload.id or payload.short.lower().replace(" ", "-").replace("/", "-")
    doc = payload.model_dump()
    doc["id"] = cid
    await db.categories.update_one({"id": cid}, {"$set": doc}, upsert=True)
    saved = await db.categories.find_one({"id": cid}, {"_id": 0})
    return saved


@api.delete("/admin/categories/{cid}")
async def delete_category(cid: str, request: Request):
    await require_admin(request, db)
    if await db.products.count_documents({"category": cid}) > 0:
        raise HTTPException(400, "Masih ada produk pada kategori ini")
    r = await db.categories.delete_one({"id": cid})
    return {"deleted": r.deleted_count}


# ---------------- PRODUCTS ----------------
@api.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, include_inactive: bool = False):
    q = {}
    if category:
        q["category"] = category
    if not include_inactive:
        q["active"] = {"$ne": False}
    docs = await db.products.find(q, {"_id": 0}).sort([("sort_order", 1), ("name", 1)]).to_list(1000)
    return docs


@api.get("/admin/products", response_model=List[Product])
async def list_products_admin(request: Request, category: Optional[str] = None):
    await require_admin(request, db)
    q = {}
    if category:
        q["category"] = category
    docs = await db.products.find(q, {"_id": 0}).sort([("sort_order", 1), ("name", 1)]).to_list(1000)
    return docs


@api.post("/admin/products", response_model=Product)
async def upsert_product(payload: ProductUpsert, request: Request):
    await require_admin(request, db)
    pid = payload.id or f"prd_{uuid.uuid4().hex[:12]}"
    doc = payload.model_dump()
    doc["id"] = pid
    await db.products.update_one({"id": pid}, {"$set": doc}, upsert=True)
    saved = await db.products.find_one({"id": pid}, {"_id": 0})
    return saved


@api.delete("/admin/products/{pid}")
async def delete_product(pid: str, request: Request):
    await require_admin(request, db)
    r = await db.products.delete_one({"id": pid})
    return {"deleted": r.deleted_count}


# ---------------- HOUSE BLEND ----------------
@api.get("/house-blend/ratios", response_model=List[HouseBlendRatio])
async def list_ratios():
    docs = await db.house_blend_ratios.find({}, {"_id": 0}).sort("sort_order", 1).to_list(50)
    return docs


@api.put("/admin/house-blend/ratios")
async def set_ratios(payload: HouseBlendRatiosPayload, request: Request):
    await require_admin(request, db)
    await db.house_blend_ratios.delete_many({})
    if payload.ratios:
        await db.house_blend_ratios.insert_many([r.model_dump() for r in payload.ratios])
    docs = await db.house_blend_ratios.find({}, {"_id": 0}).sort("sort_order", 1).to_list(50)
    return {"ratios": docs}


# ---------------- SHIPPING ZONES ----------------
@api.get("/shipping-zones", response_model=List[ShippingZone])
async def list_zones(include_inactive: bool = False):
    q = {} if include_inactive else {"active": {"$ne": False}}
    docs = await db.shipping_zones.find(q, {"_id": 0}).sort("sort_order", 1).to_list(200)
    return docs


@api.post("/admin/shipping-zones", response_model=ShippingZone)
async def upsert_zone(payload: ShippingZoneUpsert, request: Request):
    await require_admin(request, db)
    zid = payload.id or f"shp_{uuid.uuid4().hex[:12]}"
    doc = payload.model_dump()
    doc["id"] = zid
    await db.shipping_zones.update_one({"id": zid}, {"$set": doc}, upsert=True)
    saved = await db.shipping_zones.find_one({"id": zid}, {"_id": 0})
    return saved


@api.delete("/admin/shipping-zones/{zid}")
async def delete_zone(zid: str, request: Request):
    await require_admin(request, db)
    r = await db.shipping_zones.delete_one({"id": zid})
    return {"deleted": r.deleted_count}


# ---------------- TESTIMONIALS ----------------
@api.get("/testimonials", response_model=List[Testimonial])
async def list_testimonials():
    docs = await db.testimonials.find({"active": {"$ne": False}}, {"_id": 0}).sort("sort_order", 1).to_list(200)
    return docs


@api.get("/admin/testimonials", response_model=List[Testimonial])
async def list_testimonials_admin(request: Request):
    await require_admin(request, db)
    docs = await db.testimonials.find({}, {"_id": 0}).sort("sort_order", 1).to_list(500)
    return docs


@api.post("/admin/testimonials", response_model=Testimonial)
async def upsert_testimonial(payload: TestimonialUpsert, request: Request):
    await require_admin(request, db)
    tid = payload.id or f"tst_{uuid.uuid4().hex[:12]}"
    doc = payload.model_dump()
    doc["id"] = tid
    await db.testimonials.update_one({"id": tid}, {"$set": doc}, upsert=True)
    saved = await db.testimonials.find_one({"id": tid}, {"_id": 0})
    return saved


@api.delete("/admin/testimonials/{tid}")
async def delete_testimonial(tid: str, request: Request):
    await require_admin(request, db)
    r = await db.testimonials.delete_one({"id": tid})
    return {"deleted": r.deleted_count}


# ---------------- SETTINGS ----------------
@api.get("/settings", response_model=Settings)
async def get_settings():
    doc = await db.settings.find_one({"_key": "main"}, {"_id": 0, "_key": 0})
    if not doc:
        return Settings()
    # ensure defaults
    base = Settings().model_dump()
    base.update({k: v for k, v in doc.items() if v is not None})
    return base


@api.put("/admin/settings", response_model=Settings)
async def update_settings(payload: Settings, request: Request):
    await require_admin(request, db)
    data = payload.model_dump()
    data["_key"] = "main"
    await db.settings.update_one({"_key": "main"}, {"$set": data}, upsert=True)
    return payload


# ---------------- GOOGLE PLACES (optional) ----------------
@api.get("/google-reviews")
async def google_reviews():
    api_key = os.environ.get("GOOGLE_PLACES_API_KEY", "").strip()
    if not api_key:
        return {"available": False, "reason": "GOOGLE_PLACES_API_KEY belum diset"}
    settings = await db.settings.find_one({"_key": "main"}, {"_id": 0}) or {}
    place_id = (settings.get("google_place_id") or "").strip()
    if not place_id:
        return {"available": False, "reason": "google_place_id belum diset di Settings"}
    import httpx
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    headers = {
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
    }
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.get(url, headers=headers)
        if r.status_code != 200:
            return {"available": False, "reason": r.text[:200]}
        data = r.json()
    reviews = []
    for rv in (data.get("reviews") or [])[:8]:
        reviews.append({
            "name": (rv.get("authorAttribution") or {}).get("displayName", "Anonim"),
            "city": "",
            "text": (rv.get("text") or {}).get("text", ""),
            "rating": rv.get("rating", 5),
            "source": "google",
        })
    return {
        "available": True,
        "rating": data.get("rating"),
        "review_count": data.get("userRatingCount"),
        "reviews": reviews,
    }


# ---------------- root ----------------
@api.get("/")
async def root():
    return {"service": "deli-coffee", "ok": True}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
