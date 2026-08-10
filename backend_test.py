#!/usr/bin/env python3
"""
Comprehensive backend API test for Deli Coffee Roastery
Tests all public endpoints, auth flow, and admin CRUD operations
"""
import os
import sys
import requests
import json
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')
load_dotenv('/app/backend/.env')

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

if not BASE_URL:
    print("❌ REACT_APP_BACKEND_URL not found in /app/frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_URL}")
print(f"🔗 MongoDB at: {MONGO_URL}")
print()

# Test results tracking
test_results = {
    'passed': [],
    'failed': [],
    'total': 0
}

def test(name, func):
    """Run a test and track results"""
    test_results['total'] += 1
    try:
        func()
        test_results['passed'].append(name)
        print(f"✅ {name}")
        return True
    except AssertionError as e:
        test_results['failed'].append((name, str(e)))
        print(f"❌ {name}: {e}")
        return False
    except Exception as e:
        test_results['failed'].append((name, f"Exception: {e}"))
        print(f"❌ {name}: Exception: {e}")
        return False

def assert_status(response, expected_status, msg=""):
    """Assert HTTP status code"""
    if response.status_code != expected_status:
        raise AssertionError(
            f"Expected status {expected_status}, got {response.status_code}. "
            f"Response: {response.text[:200]}. {msg}"
        )

def assert_json_field(data, field, expected=None, msg=""):
    """Assert JSON field exists and optionally matches expected value"""
    if field not in data:
        raise AssertionError(f"Field '{field}' not found in response. {msg}")
    if expected is not None and data[field] != expected:
        raise AssertionError(
            f"Field '{field}' expected {expected}, got {data[field]}. {msg}"
        )

# Small base64 PNG (1x1 red pixel)
TINY_PNG_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

# MongoDB client for direct DB operations
mongo_client = MongoClient(MONGO_URL)
db = mongo_client[DB_NAME]

# Store session tokens for cleanup
admin_session_token = None
non_admin_session_token = None
admin_user_id = None
non_admin_user_id = None

print("=" * 80)
print("SECTION 1: PUBLIC ENDPOINTS (No Auth Required)")
print("=" * 80)

def test_root():
    r = requests.get(f"{API_URL}/")
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'service', 'deli-coffee')
    assert_json_field(data, 'ok', True)

def test_categories():
    r = requests.get(f"{API_URL}/categories")
    assert_status(r, 200)
    data = r.json()
    if len(data) != 4:
        raise AssertionError(f"Expected 4 categories, got {len(data)}")
    expected_ids = ['arabica-specialty', 'arabica-premium', 'robusta', 'house-blend']
    actual_ids = [c['id'] for c in data]
    for eid in expected_ids:
        if eid not in actual_ids:
            raise AssertionError(f"Category '{eid}' not found in {actual_ids}")

def test_products():
    r = requests.get(f"{API_URL}/products")
    assert_status(r, 200)
    data = r.json()
    if len(data) == 0:
        raise AssertionError("Expected products, got empty list")

def test_products_with_category():
    r = requests.get(f"{API_URL}/products?category=arabica-specialty")
    assert_status(r, 200)
    data = r.json()
    if len(data) == 0:
        raise AssertionError("Expected arabica-specialty products, got empty list")
    for p in data:
        if p['category'] != 'arabica-specialty':
            raise AssertionError(f"Product {p['id']} has wrong category: {p['category']}")

def test_house_blend_ratios():
    r = requests.get(f"{API_URL}/house-blend/ratios")
    assert_status(r, 200)
    data = r.json()
    if len(data) != 5:
        raise AssertionError(f"Expected 5 house blend ratios, got {len(data)}")

def test_shipping_zones():
    r = requests.get(f"{API_URL}/shipping-zones")
    assert_status(r, 200)
    data = r.json()
    if len(data) != 7:
        raise AssertionError(f"Expected 7 shipping zones, got {len(data)}")
    for zone in data:
        if zone.get('active') == False:
            raise AssertionError(f"Zone {zone['name']} is not active")

def test_testimonials():
    r = requests.get(f"{API_URL}/testimonials")
    assert_status(r, 200)
    data = r.json()
    if len(data) == 0:
        raise AssertionError("Expected testimonials, got empty list")

def test_settings():
    r = requests.get(f"{API_URL}/settings")
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'brand_name')
    assert_json_field(data, 'full_name')

def test_google_reviews():
    r = requests.get(f"{API_URL}/google-reviews")
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'available', False)
    if 'reason' not in data:
        raise AssertionError("Expected 'reason' field in google-reviews response")
    if 'GOOGLE_PLACES_API_KEY' not in data['reason']:
        raise AssertionError(f"Expected reason to mention GOOGLE_PLACES_API_KEY, got: {data['reason']}")

# Run public endpoint tests
test("GET /api/ returns service info", test_root)
test("GET /api/categories returns 4 categories", test_categories)
test("GET /api/products returns products", test_products)
test("GET /api/products?category=arabica-specialty filters correctly", test_products_with_category)
test("GET /api/house-blend/ratios returns 5 ratios", test_house_blend_ratios)
test("GET /api/shipping-zones returns 7 active zones", test_shipping_zones)
test("GET /api/testimonials returns testimonials", test_testimonials)
test("GET /api/settings returns settings", test_settings)
test("GET /api/google-reviews returns unavailable with reason", test_google_reviews)

print()
print("=" * 80)
print("SECTION 2: AUTH FLOW (Direct DB Seeding)")
print("=" * 80)

# Insert admin user and session directly into MongoDB
def setup_admin_user():
    global admin_session_token, admin_user_id
    
    # Clean up any existing test users
    db.users.delete_many({"email": "delicoffeedocument@gmail.com"})
    db.user_sessions.delete_many({"session_token": {"$regex": "^test_session_admin_"}})
    
    admin_user_id = f"test-user-admin-{int(datetime.now().timestamp())}"
    admin_session_token = f"test_session_admin_{int(datetime.now().timestamp())}"
    
    db.users.insert_one({
        "user_id": admin_user_id,
        "email": "delicoffeedocument@gmail.com",
        "name": "Test Admin",
        "picture": "https://via.placeholder.com/150",
        "is_admin": True,
        "created_at": datetime.now(timezone.utc)
    })
    
    db.user_sessions.insert_one({
        "user_id": admin_user_id,
        "session_token": admin_session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    })
    
    print(f"✅ Inserted admin user: {admin_user_id}")
    print(f"✅ Session token: {admin_session_token}")

def setup_non_admin_user():
    global non_admin_session_token, non_admin_user_id
    
    # Clean up any existing test users
    db.users.delete_many({"email": "random@foo.com"})
    db.user_sessions.delete_many({"session_token": {"$regex": "^test_session_nonadmin_"}})
    
    non_admin_user_id = f"test-user-nonadmin-{int(datetime.now().timestamp())}"
    non_admin_session_token = f"test_session_nonadmin_{int(datetime.now().timestamp())}"
    
    db.users.insert_one({
        "user_id": non_admin_user_id,
        "email": "random@foo.com",
        "name": "Non Admin User",
        "picture": "https://via.placeholder.com/150",
        "is_admin": False,
        "created_at": datetime.now(timezone.utc)
    })
    
    db.user_sessions.insert_one({
        "user_id": non_admin_user_id,
        "session_token": non_admin_session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    })
    
    print(f"✅ Inserted non-admin user: {non_admin_user_id}")
    print(f"✅ Session token: {non_admin_session_token}")

setup_admin_user()
setup_non_admin_user()

print()

def test_auth_me_with_token():
    headers = {"Authorization": f"Bearer {admin_session_token}"}
    r = requests.get(f"{API_URL}/auth/me", headers=headers)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'email', 'delicoffeedocument@gmail.com')
    assert_json_field(data, 'is_admin', True)

def test_auth_me_without_token():
    r = requests.get(f"{API_URL}/auth/me")
    assert_status(r, 401, "Should return 401 without auth token")

def test_admin_endpoint_without_auth():
    r = requests.get(f"{API_URL}/admin/products")
    assert_status(r, 401, "Should return 401 for admin endpoint without auth")

def test_admin_endpoint_with_non_admin():
    headers = {"Authorization": f"Bearer {non_admin_session_token}"}
    r = requests.get(f"{API_URL}/admin/products", headers=headers)
    assert_status(r, 403, "Should return 403 for non-admin user")

def test_logout():
    headers = {"Authorization": f"Bearer {admin_session_token}"}
    r = requests.post(f"{API_URL}/auth/logout", headers=headers)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'ok', True)
    
    # Verify session is deleted from DB
    session = db.user_sessions.find_one({"session_token": admin_session_token})
    if session is not None:
        raise AssertionError("Session should be deleted from DB after logout")
    
    # Re-create admin session for subsequent tests
    setup_admin_user()

# Run auth tests
test("GET /api/auth/me with Bearer token returns user", test_auth_me_with_token)
test("GET /api/auth/me without token returns 401", test_auth_me_without_token)
test("GET /api/admin/products without auth returns 401", test_admin_endpoint_without_auth)
test("GET /api/admin/products with non-admin returns 403", test_admin_endpoint_with_non_admin)
test("POST /api/auth/logout clears session", test_logout)

print()
print("=" * 80)
print("SECTION 3: ADMIN CRUD OPERATIONS (With Valid Admin Token)")
print("=" * 80)

headers_admin = {"Authorization": f"Bearer {admin_session_token}"}

# Test product CRUD
test_product_id = None

def test_create_product():
    global test_product_id
    payload = {
        "category": "arabica-specialty",
        "name": "Test Product",
        "process": "Test Process",
        "region": "Test Region",
        "price": 100000,
        "badge": "Test",
        "desc": "Test description",
        "image": TINY_PNG_BASE64,
        "active": True,
        "sort_order": 999
    }
    r = requests.post(f"{API_URL}/admin/products", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'name', 'Test Product')
    assert_json_field(data, 'category', 'arabica-specialty')
    if 'id' not in data:
        raise AssertionError("Product should have 'id' field")
    test_product_id = data['id']
    print(f"  Created product with id: {test_product_id}")

def test_list_admin_products():
    r = requests.get(f"{API_URL}/admin/products", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    found = False
    for p in data:
        if p['id'] == test_product_id:
            found = True
            break
    if not found:
        raise AssertionError(f"Product {test_product_id} not found in admin products list")

def test_update_product():
    payload = {
        "id": test_product_id,
        "category": "arabica-specialty",
        "name": "Updated Test Product",
        "process": "Test Process",
        "region": "Test Region",
        "price": 150000,
        "badge": "Updated",
        "desc": "Updated description",
        "image": TINY_PNG_BASE64,
        "active": True,
        "sort_order": 999
    }
    r = requests.post(f"{API_URL}/admin/products", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'name', 'Updated Test Product')
    assert_json_field(data, 'price', 150000)

def test_delete_product():
    r = requests.delete(f"{API_URL}/admin/products/{test_product_id}", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'deleted', 1)

# Test category CRUD
test_category_id = None

def test_create_category():
    global test_category_id
    payload = {
        "name": "Test Category",
        "short": "Test",
        "description": "Test category description",
        "image": TINY_PNG_BASE64,
        "sort_order": 999
    }
    r = requests.post(f"{API_URL}/admin/categories", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'name', 'Test Category')
    if 'id' not in data:
        raise AssertionError("Category should have 'id' field")
    test_category_id = data['id']
    print(f"  Created category with id: {test_category_id}")

def test_delete_category_with_products():
    # Try to delete arabica-specialty which has products
    r = requests.delete(f"{API_URL}/admin/categories/arabica-specialty", headers=headers_admin)
    assert_status(r, 400, "Should return 400 when trying to delete category with products")

def test_delete_category():
    # Delete test category (no products)
    r = requests.delete(f"{API_URL}/admin/categories/{test_category_id}", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'deleted', 1)

# Test house blend ratios
def test_update_house_blend_ratios():
    payload = {
        "ratios": [
            {"value": "80/20", "label": "80 / 20", "price": 170000, "note": "Test ratio", "sort_order": 1},
            {"value": "20/80", "label": "20 / 80", "price": 130000, "note": "Test ratio 2", "sort_order": 2}
        ]
    }
    r = requests.put(f"{API_URL}/admin/house-blend/ratios", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if 'ratios' not in data:
        raise AssertionError("Response should have 'ratios' field")
    if len(data['ratios']) != 2:
        raise AssertionError(f"Expected 2 ratios, got {len(data['ratios'])}")
    
    # Verify via public endpoint
    r2 = requests.get(f"{API_URL}/house-blend/ratios")
    assert_status(r2, 200)
    ratios = r2.json()
    if len(ratios) != 2:
        raise AssertionError(f"Public endpoint should return 2 ratios, got {len(ratios)}")
    
    # Restore original ratios
    original_ratios = [
        {"value": "30/70", "label": "30 / 70", "price": 140000, "note": "Robusta dominan — bold & pekat", "sort_order": 1},
        {"value": "40/60", "label": "40 / 60", "price": 145000, "note": "Cenderung robusta, tetap smooth", "sort_order": 2},
        {"value": "50/50", "label": "50 / 50", "price": 150000, "note": "Balance klasik — all-day drinker", "sort_order": 3},
        {"value": "60/40", "label": "60 / 40", "price": 155000, "note": "Arabika lebih dominan, lebih floral", "sort_order": 4},
        {"value": "70/30", "label": "70 / 30", "price": 160000, "note": "Arabika kuat, acidity cerah", "sort_order": 5}
    ]
    requests.put(f"{API_URL}/admin/house-blend/ratios", json={"ratios": original_ratios}, headers=headers_admin)

# Test shipping zones
test_zone_id = None

def test_create_shipping_zone():
    global test_zone_id
    payload = {
        "name": "Test Zone",
        "description": "Test shipping zone",
        "cost": 25000,
        "eta": "3-5 days",
        "sort_order": 999,
        "active": True
    }
    r = requests.post(f"{API_URL}/admin/shipping-zones", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'name', 'Test Zone')
    if 'id' not in data:
        raise AssertionError("Shipping zone should have 'id' field")
    test_zone_id = data['id']
    print(f"  Created shipping zone with id: {test_zone_id}")

def test_delete_shipping_zone():
    r = requests.delete(f"{API_URL}/admin/shipping-zones/{test_zone_id}", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'deleted', 1)

# Test testimonials
test_testimonial_id = None

def test_create_testimonial():
    global test_testimonial_id
    payload = {
        "name": "Test User",
        "city": "Test City",
        "text": "Test testimonial text",
        "rating": 5,
        "source": "manual",
        "sort_order": 999,
        "active": True
    }
    r = requests.post(f"{API_URL}/admin/testimonials", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'name', 'Test User')
    if 'id' not in data:
        raise AssertionError("Testimonial should have 'id' field")
    test_testimonial_id = data['id']
    print(f"  Created testimonial with id: {test_testimonial_id}")

def test_list_admin_testimonials():
    r = requests.get(f"{API_URL}/admin/testimonials", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    found = False
    for t in data:
        if t['id'] == test_testimonial_id:
            found = True
            break
    if not found:
        raise AssertionError(f"Testimonial {test_testimonial_id} not found in admin testimonials list")

def test_delete_testimonial():
    r = requests.delete(f"{API_URL}/admin/testimonials/{test_testimonial_id}", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'deleted', 1)

# Test settings
def test_update_settings():
    payload = {
        "brand_name": "Test Coffee",
        "full_name": "Test Coffee Roastery Co.",
        "tagline": "Test tagline",
        "sub_tagline": "Test sub tagline",
        "instagram": "testcoffee",
        "address": "Test address",
        "plus_code": "TEST123",
        "opening_hour": 8,
        "closing_hour": 22,
        "rating": 4.8,
        "review_count": 20,
        "admins": [{"name": "Test Admin", "phone": "1234567890", "display": "123-456-7890"}],
        "google_place_id": "test_place_id"
    }
    r = requests.put(f"{API_URL}/admin/settings", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'brand_name', 'Test Coffee')
    
    # Verify via public endpoint
    r2 = requests.get(f"{API_URL}/settings")
    assert_status(r2, 200)
    settings = r2.json()
    assert_json_field(settings, 'brand_name', 'Test Coffee')
    
    # Restore original settings
    original_settings = {
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
            {"name": "Surya Darma", "phone": "081396041308", "display": "0813-9604-1308"}
        ],
        "google_place_id": ""
    }
    requests.put(f"{API_URL}/admin/settings", json=original_settings, headers=headers_admin)

# Run admin CRUD tests
test("POST /api/admin/products creates product with base64 image", test_create_product)
test("GET /api/admin/products includes new product", test_list_admin_products)
test("POST /api/admin/products with same id updates product", test_update_product)
test("DELETE /api/admin/products/<id> deletes product", test_delete_product)
test("POST /api/admin/categories creates category", test_create_category)
test("DELETE /api/admin/categories fails if products reference it", test_delete_category_with_products)
test("DELETE /api/admin/categories succeeds for empty category", test_delete_category)
test("PUT /api/admin/house-blend/ratios replaces all ratios", test_update_house_blend_ratios)
test("POST /api/admin/shipping-zones creates zone", test_create_shipping_zone)
test("DELETE /api/admin/shipping-zones/<id> deletes zone", test_delete_shipping_zone)
test("POST /api/admin/testimonials creates testimonial", test_create_testimonial)
test("GET /api/admin/testimonials includes new testimonial", test_list_admin_testimonials)
test("DELETE /api/admin/testimonials/<id> deletes testimonial", test_delete_testimonial)
test("PUT /api/admin/settings updates and persists settings", test_update_settings)

print()
print("=" * 80)
print("SECTION 4: NEW FEATURES - ORDERS & BULK IMAGE ASSIGNMENT")
print("=" * 80)

# Test order creation (public endpoint)
test_order_id = None

def test_create_order_public():
    global test_order_id
    payload = {
        "customer_name": "Test Buyer",
        "customer_phone": "08123456789",
        "customer_note": "cek",
        "items": [
            {
                "product_id": "as-wine",
                "name": "Arabica Wine Process",
                "price": 400000,
                "qty": 2
            }
        ],
        "zone_id": "",
        "zone_name": "Medan Kota",
        "shipping_cost": 15000,
        "admin_phone": "081263680926",
        "admin_name": "Deni"
    }
    r = requests.post(f"{API_URL}/orders", json=payload)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'ok', True)
    if 'order_id' not in data:
        raise AssertionError("Response should have 'order_id' field")
    if 'wa_url' not in data:
        raise AssertionError("Response should have 'wa_url' field")
    if 'message' not in data:
        raise AssertionError("Response should have 'message' field")
    
    # Verify wa_url format
    wa_url = data['wa_url']
    if not wa_url.startswith('https://wa.me/62812'):
        raise AssertionError(f"wa_url should start with https://wa.me/62812, got: {wa_url[:50]}")
    if 'text=' not in wa_url:
        raise AssertionError("wa_url should contain url-encoded message")
    
    # Verify message content
    message = data['message']
    if 'Nama    : Test Buyer' not in message:
        raise AssertionError(f"Message should contain customer name, got: {message[:100]}")
    if 'Subtotal   : Rp800.000' not in message:
        raise AssertionError(f"Message should contain subtotal Rp800.000, got: {message}")
    
    test_order_id = data['order_id']
    print(f"  Created order with id: {test_order_id}")
    
    # Verify order in MongoDB
    order = db.orders.find_one({"id": test_order_id})
    if not order:
        raise AssertionError(f"Order {test_order_id} not found in MongoDB")
    if order['subtotal'] != 800000:
        raise AssertionError(f"Expected subtotal 800000, got {order['subtotal']}")
    if order['shipping_cost'] != 15000:
        raise AssertionError(f"Expected shipping_cost 15000, got {order['shipping_cost']}")
    if order['total'] != 815000:
        raise AssertionError(f"Expected total 815000, got {order['total']}")
    if order['status'] != 'new':
        raise AssertionError(f"Expected status 'new', got {order['status']}")

def test_create_order_validation():
    payload = {
        "customer_name": "",  # Empty name should fail
        "customer_phone": "08123456789",
        "customer_note": "",
        "items": [
            {
                "product_id": "as-wine",
                "name": "Arabica Wine Process",
                "price": 400000,
                "qty": 1
            }
        ],
        "zone_id": "",
        "zone_name": "Medan Kota",
        "shipping_cost": 15000,
        "admin_phone": "081263680926",
        "admin_name": "Deni"
    }
    r = requests.post(f"{API_URL}/orders", json=payload)
    assert_status(r, 400, "Should return 400 for empty customer_name")

def test_list_orders_without_auth():
    r = requests.get(f"{API_URL}/admin/orders")
    assert_status(r, 401, "Should return 401 for /api/admin/orders without auth")

def test_list_orders_with_auth():
    r = requests.get(f"{API_URL}/admin/orders", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if not isinstance(data, list):
        raise AssertionError("Response should be a list")
    # Find our test order
    found = False
    for order in data:
        if order['id'] == test_order_id:
            found = True
            break
    if not found:
        raise AssertionError(f"Order {test_order_id} not found in admin orders list")

def test_list_orders_filter_new():
    r = requests.get(f"{API_URL}/admin/orders?status=new", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if not isinstance(data, list):
        raise AssertionError("Response should be a list")
    # All orders should have status=new
    for order in data:
        if order['status'] != 'new':
            raise AssertionError(f"Order {order['id']} has status {order['status']}, expected 'new'")
    # Our test order should be in the list
    found = False
    for order in data:
        if order['id'] == test_order_id:
            found = True
            break
    if not found:
        raise AssertionError(f"Order {test_order_id} not found in filtered list (status=new)")

def test_list_orders_filter_fulfilled_empty():
    r = requests.get(f"{API_URL}/admin/orders?status=fulfilled", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if not isinstance(data, list):
        raise AssertionError("Response should be a list")
    # Should be empty or not contain our test order
    for order in data:
        if order['id'] == test_order_id:
            raise AssertionError(f"Order {test_order_id} should not be in fulfilled list yet")

def test_update_order_status():
    payload = {"status": "fulfilled"}
    r = requests.patch(f"{API_URL}/admin/orders/{test_order_id}", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'ok', True)
    
    # Verify status was updated
    order = db.orders.find_one({"id": test_order_id})
    if order['status'] != 'fulfilled':
        raise AssertionError(f"Order status should be 'fulfilled', got {order['status']}")

def test_list_orders_filter_fulfilled_after_update():
    r = requests.get(f"{API_URL}/admin/orders?status=fulfilled", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if not isinstance(data, list):
        raise AssertionError("Response should be a list")
    # Our test order should now be in the list
    found = False
    for order in data:
        if order['id'] == test_order_id:
            found = True
            if order['status'] != 'fulfilled':
                raise AssertionError(f"Order {test_order_id} should have status 'fulfilled', got {order['status']}")
            break
    if not found:
        raise AssertionError(f"Order {test_order_id} not found in fulfilled list after update")

def test_update_order_invalid_status():
    payload = {"status": "random"}
    r = requests.patch(f"{API_URL}/admin/orders/{test_order_id}", json=payload, headers=headers_admin)
    assert_status(r, 400, "Should return 400 for invalid status")

def test_update_order_not_found():
    payload = {"status": "fulfilled"}
    r = requests.patch(f"{API_URL}/admin/orders/ghost-id-nope", json=payload, headers=headers_admin)
    assert_status(r, 404, "Should return 404 for non-existent order")

def test_delete_order():
    r = requests.delete(f"{API_URL}/admin/orders/{test_order_id}", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'deleted', 1)
    
    # Verify order is deleted from MongoDB
    order = db.orders.find_one({"id": test_order_id})
    if order is not None:
        raise AssertionError(f"Order {test_order_id} should be deleted from MongoDB")

def test_bulk_assign_images():
    payload = {
        "assignments": [
            {
                "product_id": "as-wine",
                "image": "data:image/png;base64,iVBORw0KGgo="
            },
            {
                "product_id": "ghost-id-nope",
                "image": "data:image/png;base64,X"
            }
        ]
    }
    r = requests.post(f"{API_URL}/admin/products/bulk-images", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if 'updated' not in data:
        raise AssertionError("Response should have 'updated' field")
    if 'not_found' not in data:
        raise AssertionError("Response should have 'not_found' field")
    if data['updated'] != 1:
        raise AssertionError(f"Expected updated=1, got {data['updated']}")
    if 'ghost-id-nope' not in data['not_found']:
        raise AssertionError(f"Expected 'ghost-id-nope' in not_found, got {data['not_found']}")
    
    # Verify product image was updated
    r2 = requests.get(f"{API_URL}/products?category=arabica-specialty")
    assert_status(r2, 200)
    products = r2.json()
    found = False
    for p in products:
        if p['id'] == 'as-wine':
            found = True
            if p['image'] != 'data:image/png;base64,iVBORw0KGgo=':
                raise AssertionError(f"Product as-wine image should be updated, got: {p['image'][:50]}")
            break
    if not found:
        raise AssertionError("Product as-wine not found in arabica-specialty category")

def test_bulk_images_without_auth():
    payload = {
        "assignments": [
            {
                "product_id": "as-wine",
                "image": "data:image/png;base64,test"
            }
        ]
    }
    r = requests.post(f"{API_URL}/admin/products/bulk-images", json=payload)
    assert_status(r, 401, "Should return 401 for /api/admin/products/bulk-images without auth")

# Run new feature tests
test("POST /api/orders creates order with correct response", test_create_order_public)
test("POST /api/orders with empty customer_name returns 400", test_create_order_validation)
test("GET /api/admin/orders without auth returns 401", test_list_orders_without_auth)
test("GET /api/admin/orders with admin Bearer returns list", test_list_orders_with_auth)
test("GET /api/admin/orders?status=new filters correctly", test_list_orders_filter_new)
test("GET /api/admin/orders?status=fulfilled is empty before update", test_list_orders_filter_fulfilled_empty)
test("PATCH /api/admin/orders/{id} updates status to fulfilled", test_update_order_status)
test("GET /api/admin/orders?status=fulfilled shows updated order", test_list_orders_filter_fulfilled_after_update)
test("PATCH /api/admin/orders/{id} with invalid status returns 400", test_update_order_invalid_status)
test("PATCH /api/admin/orders/{id} with non-existent id returns 404", test_update_order_not_found)
test("DELETE /api/admin/orders/{id} deletes order", test_delete_order)
test("POST /api/admin/products/bulk-images updates and reports not found", test_bulk_assign_images)
test("POST /api/admin/products/bulk-images without auth returns 401", test_bulk_images_without_auth)

print()
print("=" * 80)
print("CLEANUP")
print("=" * 80)

# Clean up test data
db.users.delete_many({"user_id": {"$in": [admin_user_id, non_admin_user_id]}})
db.user_sessions.delete_many({"session_token": {"$in": [admin_session_token, non_admin_session_token]}})
print("✅ Cleaned up test users and sessions")

mongo_client.close()

print()
print("=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total tests: {test_results['total']}")
print(f"Passed: {len(test_results['passed'])}")
print(f"Failed: {len(test_results['failed'])}")
print()

if test_results['failed']:
    print("❌ FAILED TESTS:")
    for name, error in test_results['failed']:
        print(f"  - {name}")
        print(f"    {error}")
    print()
    sys.exit(1)
else:
    print("✅ ALL TESTS PASSED!")
    sys.exit(0)
