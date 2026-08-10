#!/usr/bin/env python3
"""
Bug Fix Verification Test for Product Image Issue
Issue: Product "Arabica Wine Process" (id: as-wine) had broken 1-byte base64 image
Fix: Updated to Unsplash URL
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

if not BASE_URL:
    print("❌ REACT_APP_BACKEND_URL not found in /app/frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_URL}")
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

print("=" * 80)
print("BUG FIX VERIFICATION: Product Image for 'as-wine'")
print("=" * 80)
print()

# Store the as-wine product data for verification
as_wine_product = None

def test_as_wine_image_in_arabica_specialty():
    """Test 1: GET /api/products?category=arabica-specialty - verify as-wine image"""
    global as_wine_product
    
    r = requests.get(f"{API_URL}/products?category=arabica-specialty")
    if r.status_code != 200:
        raise AssertionError(f"Expected status 200, got {r.status_code}. Response: {r.text[:200]}")
    
    products = r.json()
    
    # Find as-wine product
    as_wine = None
    for p in products:
        if p.get('id') == 'as-wine':
            as_wine = p
            break
    
    if not as_wine:
        raise AssertionError("Product 'as-wine' not found in arabica-specialty category")
    
    as_wine_product = as_wine
    
    # Verify image URL starts with expected Unsplash URL
    image_url = as_wine.get('image', '')
    expected_prefix = 'https://images.unsplash.com/photo-1675306408031-'
    
    if not image_url.startswith(expected_prefix):
        raise AssertionError(
            f"Image URL should start with '{expected_prefix}', got: {image_url[:100]}"
        )
    
    # Verify it's NOT the broken base64 test data
    broken_base64 = 'data:image/png;base64,iVBORw0KGgo='
    if image_url == broken_base64:
        raise AssertionError(f"Image is still the broken 1-byte base64 test data!")
    
    # Verify name and price
    if as_wine.get('name') != 'Arabica Wine Process':
        raise AssertionError(f"Expected name 'Arabica Wine Process', got: {as_wine.get('name')}")
    
    if as_wine.get('price') != 400000:
        raise AssertionError(f"Expected price 400000, got: {as_wine.get('price')}")
    
    print(f"  ✓ Product 'as-wine' found")
    print(f"  ✓ Image URL: {image_url}")
    print(f"  ✓ Name: {as_wine.get('name')}")
    print(f"  ✓ Price: {as_wine.get('price')}")

def test_fetch_image_url():
    """Test 2: Fetch the image URL itself and verify HTTP 200 with image/* content-type"""
    if not as_wine_product:
        raise AssertionError("as-wine product not found in previous test")
    
    image_url = as_wine_product.get('image', '')
    
    # Fetch the image URL
    r = requests.get(image_url, timeout=10)
    
    if r.status_code != 200:
        raise AssertionError(f"Image URL returned status {r.status_code}, expected 200")
    
    # Verify content-type is image/*
    content_type = r.headers.get('Content-Type', '')
    if not content_type.startswith('image/'):
        raise AssertionError(f"Expected Content-Type to start with 'image/', got: {content_type}")
    
    print(f"  ✓ Image URL returned HTTP 200")
    print(f"  ✓ Content-Type: {content_type}")

def test_no_broken_base64_in_all_products():
    """Test 3: Verify no other product has the broken 1-byte base64 image"""
    r = requests.get(f"{API_URL}/products")
    if r.status_code != 200:
        raise AssertionError(f"Expected status 200, got {r.status_code}. Response: {r.text[:200]}")
    
    products = r.json()
    
    broken_base64 = 'iVBORw0KGgo='
    products_with_broken_image = []
    
    for p in products:
        image = p.get('image', '')
        if broken_base64 in image:
            products_with_broken_image.append(p.get('id', 'unknown'))
    
    if products_with_broken_image:
        raise AssertionError(
            f"Found {len(products_with_broken_image)} product(s) with broken base64 image: {products_with_broken_image}"
        )
    
    print(f"  ✓ Checked {len(products)} products - no broken base64 images found")

def test_categories_sanity():
    """Test 4: Sanity check - GET /api/categories returns 4 categories"""
    r = requests.get(f"{API_URL}/categories")
    if r.status_code != 200:
        raise AssertionError(f"Expected status 200, got {r.status_code}. Response: {r.text[:200]}")
    
    categories = r.json()
    
    if len(categories) != 4:
        raise AssertionError(f"Expected 4 categories, got {len(categories)}")
    
    print(f"  ✓ Categories endpoint returns 4 categories")

def test_shipping_zones_sanity():
    """Test 5: Sanity check - GET /api/shipping-zones returns >0 zones"""
    r = requests.get(f"{API_URL}/shipping-zones")
    if r.status_code != 200:
        raise AssertionError(f"Expected status 200, got {r.status_code}. Response: {r.text[:200]}")
    
    zones = r.json()
    
    if len(zones) == 0:
        raise AssertionError("Expected at least 1 shipping zone, got 0")
    
    print(f"  ✓ Shipping zones endpoint returns {len(zones)} zones")

def test_settings_sanity():
    """Test 6: Sanity check - GET /api/settings returns valid settings"""
    r = requests.get(f"{API_URL}/settings")
    if r.status_code != 200:
        raise AssertionError(f"Expected status 200, got {r.status_code}. Response: {r.text[:200]}")
    
    settings = r.json()
    
    required_fields = ['brand_name', 'full_name']
    for field in required_fields:
        if field not in settings:
            raise AssertionError(f"Settings missing required field: {field}")
    
    print(f"  ✓ Settings endpoint returns valid settings")

# Run all tests
test("GET /api/products?category=arabica-specialty - verify as-wine image", test_as_wine_image_in_arabica_specialty)
test("Fetch image URL - verify HTTP 200 with image/* content-type", test_fetch_image_url)
test("GET /api/products - verify no broken base64 images", test_no_broken_base64_in_all_products)
test("GET /api/categories - sanity check (4 categories)", test_categories_sanity)
test("GET /api/shipping-zones - sanity check (>0 zones)", test_shipping_zones_sanity)
test("GET /api/settings - sanity check (valid settings)", test_settings_sanity)

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
    
    # Print detailed as-wine product info if available
    if as_wine_product:
        print("=" * 80)
        print("DETAILED as-wine PRODUCT INFO:")
        print("=" * 80)
        import json
        print(json.dumps(as_wine_product, indent=2))
    
    sys.exit(1)
else:
    print("✅ ALL BUG FIX VERIFICATION TESTS PASSED!")
    print()
    
    # Print detailed as-wine product info
    if as_wine_product:
        print("=" * 80)
        print("VERIFIED as-wine PRODUCT INFO:")
        print("=" * 80)
        import json
        print(json.dumps(as_wine_product, indent=2))
    
    sys.exit(0)
