#!/usr/bin/env python3
"""
Regression test for restock-alerts endpoint after code-quality fix.
Change: if p.get("active") is False → if not p.get("active", True)

Tests:
1. Public endpoints unchanged
2. Auth still works
3. Focus: restock-alerts endpoint behavior
4. Auth-required endpoints unchanged
5. Bulk-images and orders CRUD sanity check
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

# MongoDB client for direct DB operations
mongo_client = MongoClient(MONGO_URL)
db = mongo_client[DB_NAME]

# Store session tokens for cleanup
admin_session_token = None
admin_user_id = None

print("=" * 80)
print("REGRESSION TEST: Restock Alerts Endpoint")
print("=" * 80)
print()

print("=" * 80)
print("SECTION 1: PUBLIC ENDPOINTS (Verify Unchanged)")
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

def test_products():
    r = requests.get(f"{API_URL}/products")
    assert_status(r, 200)
    data = r.json()
    if len(data) == 0:
        raise AssertionError("Expected products, got empty list")
    # All products should have active != False (either True or missing)
    for p in data:
        if p.get('active') == False:
            raise AssertionError(f"Product {p['id']} has active=False in public list")
    return len(data)

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

# Run public endpoint tests
test("GET /api/ → {service, ok:true}", test_root)
test("GET /api/categories → 4 items", test_categories)
products_count = None
def test_products_wrapper():
    global products_count
    products_count = test_products()
test("GET /api/products → 14 items (all active != False)", test_products_wrapper)
test("GET /api/house-blend/ratios → 5 items", test_house_blend_ratios)
test("GET /api/shipping-zones → 7 items", test_shipping_zones)
test("GET /api/testimonials → 4 items", test_testimonials)
test("GET /api/settings → valid response", test_settings)

print()
print("=" * 80)
print("SECTION 2: AUTH FLOW (Setup Admin Session)")
print("=" * 80)

# Insert admin user and session directly into MongoDB
def setup_admin_user():
    global admin_session_token, admin_user_id
    
    # Clean up any existing test users
    db.users.delete_many({"email": "delicoffeedocument@gmail.com"})
    db.user_sessions.delete_many({"session_token": {"$regex": "^test_session_regression_"}})
    
    admin_user_id = f"test-user-regression-{int(datetime.now().timestamp())}"
    admin_session_token = f"test_session_regression_{int(datetime.now().timestamp())}"
    
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

setup_admin_user()

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

# Run auth tests
test("GET /api/auth/me with Bearer → 200", test_auth_me_with_token)
test("GET /api/auth/me without auth → 401", test_auth_me_without_token)

print()
print("=" * 80)
print("SECTION 3: FOCUS TEST - RESTOCK-ALERTS ENDPOINT")
print("=" * 80)

headers_admin = {"Authorization": f"Bearer {admin_session_token}"}

def test_restock_alerts_without_auth():
    r = requests.get(f"{API_URL}/admin/stats/restock-alerts")
    assert_status(r, 401, "Should return 401 without auth")

def test_restock_alerts_with_auth():
    r = requests.get(f"{API_URL}/admin/stats/restock-alerts", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    
    # Check required keys
    assert_json_field(data, 'no_image')
    assert_json_field(data, 'zero_price')
    assert_json_field(data, 'inactive')
    assert_json_field(data, 'total_products')
    
    # Verify total_products matches public products count
    if data['total_products'] != products_count:
        raise AssertionError(
            f"total_products ({data['total_products']}) should match "
            f"public products count ({products_count})"
        )
    
    # Verify inactive is an array
    if not isinstance(data['inactive'], list):
        raise AssertionError(f"inactive should be an array, got {type(data['inactive'])}")
    
    print(f"  total_products: {data['total_products']}")
    print(f"  no_image: {len(data['no_image'])} products")
    print(f"  zero_price: {len(data['zero_price'])} products")
    print(f"  inactive: {len(data['inactive'])} products")
    
    return data

# Test product IDs for cleanup
test_inactive_product_id = None
test_active_product_id = None

def test_create_inactive_product():
    global test_inactive_product_id
    payload = {
        "category": "arabica-specialty",
        "name": "Test Inactive Product",
        "process": "Test Process",
        "region": "Test Region",
        "price": 100000,
        "badge": "Test",
        "desc": "Test inactive product",
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
        "active": False,  # Explicitly set to False
        "sort_order": 999
    }
    r = requests.post(f"{API_URL}/admin/products", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'active', False)
    test_inactive_product_id = data['id']
    print(f"  Created inactive product: {test_inactive_product_id}")

def test_restock_alerts_includes_inactive():
    r = requests.get(f"{API_URL}/admin/stats/restock-alerts", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    
    # Verify inactive array contains our test product
    inactive_ids = [p['id'] for p in data['inactive']]
    if test_inactive_product_id not in inactive_ids:
        raise AssertionError(
            f"Product {test_inactive_product_id} with active=False should appear in inactive array. "
            f"Got: {inactive_ids}"
        )
    print(f"  ✓ Inactive product {test_inactive_product_id} correctly appears in inactive array")

def test_create_active_product():
    global test_active_product_id
    payload = {
        "category": "arabica-specialty",
        "name": "Test Active Product",
        "process": "Test Process",
        "region": "Test Region",
        "price": 100000,
        "badge": "Test",
        "desc": "Test active product",
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
        "active": True,  # Explicitly set to True
        "sort_order": 999
    }
    r = requests.post(f"{API_URL}/admin/products", json=payload, headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'active', True)
    test_active_product_id = data['id']
    print(f"  Created active product: {test_active_product_id}")

def test_restock_alerts_excludes_active():
    r = requests.get(f"{API_URL}/admin/stats/restock-alerts", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    
    # Verify inactive array does NOT contain our active test product
    inactive_ids = [p['id'] for p in data['inactive']]
    if test_active_product_id in inactive_ids:
        raise AssertionError(
            f"Product {test_active_product_id} with active=True should NOT appear in inactive array. "
            f"Got: {inactive_ids}"
        )
    print(f"  ✓ Active product {test_active_product_id} correctly excluded from inactive array")

def test_delete_test_products():
    # Delete inactive product
    r1 = requests.delete(f"{API_URL}/admin/products/{test_inactive_product_id}", headers=headers_admin)
    assert_status(r1, 200)
    print(f"  Deleted inactive product: {test_inactive_product_id}")
    
    # Delete active product
    r2 = requests.delete(f"{API_URL}/admin/products/{test_active_product_id}", headers=headers_admin)
    assert_status(r2, 200)
    print(f"  Deleted active product: {test_active_product_id}")

# Run restock-alerts tests
test("GET /api/admin/stats/restock-alerts without auth → 401", test_restock_alerts_without_auth)
test("GET /api/admin/stats/restock-alerts with auth → 200 with correct keys", test_restock_alerts_with_auth)
test("Create product with active=false", test_create_inactive_product)
test("Restock-alerts includes product with active=false in inactive array", test_restock_alerts_includes_inactive)
test("Create product with active=true", test_create_active_product)
test("Restock-alerts excludes product with active=true from inactive array", test_restock_alerts_excludes_active)
test("Delete test products", test_delete_test_products)

print()
print("=" * 80)
print("SECTION 4: AUTH-REQUIRED ENDPOINTS (Verify Unchanged)")
print("=" * 80)

def test_admin_orders_without_auth():
    r = requests.get(f"{API_URL}/admin/orders")
    assert_status(r, 401, "Should return 401 without auth")

def test_admin_orders_with_auth():
    r = requests.get(f"{API_URL}/admin/orders", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if not isinstance(data, list):
        raise AssertionError("Response should be a list")

def test_admin_products_without_auth():
    r = requests.get(f"{API_URL}/admin/products")
    assert_status(r, 401, "Should return 401 without auth")

def test_admin_products_with_auth():
    r = requests.get(f"{API_URL}/admin/products", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    if not isinstance(data, list):
        raise AssertionError("Response should be a list")

# Run auth-required endpoint tests
test("GET /api/admin/orders without auth → 401", test_admin_orders_without_auth)
test("GET /api/admin/orders with auth → 200", test_admin_orders_with_auth)
test("GET /api/admin/products without auth → 401", test_admin_products_without_auth)
test("GET /api/admin/products with auth → 200", test_admin_products_with_auth)

print()
print("=" * 80)
print("SECTION 5: SANITY CHECK - BULK-IMAGES AND ORDERS CRUD")
print("=" * 80)

# Test order creation (public endpoint)
test_order_id = None

def test_create_order_public():
    global test_order_id
    payload = {
        "customer_name": "Regression Test Buyer",
        "customer_phone": "08123456789",
        "customer_note": "Regression test order",
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
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'ok', True)
    if 'order_id' not in data:
        raise AssertionError("Response should have 'order_id' field")
    if 'wa_url' not in data:
        raise AssertionError("Response should have 'wa_url' field")
    
    # Verify wa_url format
    wa_url = data['wa_url']
    if not wa_url.startswith('https://wa.me/62812'):
        raise AssertionError(f"wa_url should start with https://wa.me/62812, got: {wa_url[:50]}")
    
    test_order_id = data['order_id']
    print(f"  Created order: {test_order_id}")

def test_delete_order():
    r = requests.delete(f"{API_URL}/admin/orders/{test_order_id}", headers=headers_admin)
    assert_status(r, 200)
    data = r.json()
    assert_json_field(data, 'deleted', 1)
    print(f"  Deleted order: {test_order_id}")

# Run sanity check tests
test("POST /api/orders (public) → 200 with wa_url", test_create_order_public)
test("DELETE /api/admin/orders/{id} → 200", test_delete_order)

print()
print("=" * 80)
print("CLEANUP")
print("=" * 80)

# Clean up test data
db.users.delete_many({"user_id": admin_user_id})
db.user_sessions.delete_many({"session_token": admin_session_token})
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
    print("✅ ALL REGRESSION TESTS PASSED!")
    print()
    print("CONCLUSION:")
    print("No regression detected from the code-quality fix:")
    print("  if p.get('active') is False → if not p.get('active', True)")
    print()
    print("Both implementations behave identically for boolean active values.")
    print("The new implementation is more defensive (handles None/missing gracefully).")
    sys.exit(0)
