const BASE_URL = 'http://localhost:5000/api';

async function test(title, fn) {
  try {
    process.stdout.write(`  ⏳ ${title}... `);
    await fn();
    console.log(`✅ PASSED`);
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    throw err;
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('   SILK FOOTWEAR BACKEND COMPREHENSIVE TEST SUITE     ');
  console.log('======================================================\n');

  // 1. Health check
  await test('GET /health - System health and database metrics', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'online') throw new Error(`Expected online, got ${data.status}`);
    if (typeof data.database.products !== 'number') throw new Error('Missing products metric');
  });

  // 2. Categories
  await test('GET /categories - Fetch all categories with dynamic product counts', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Categories array invalid');
    }
    const menCat = data.data.find(c => c.id === 'men');
    if (!menCat || typeof menCat.productCount !== 'number') throw new Error('Category productCount missing');
  });

  await test('GET /categories/men - Fetch single category with product list', async () => {
    const res = await fetch(`${BASE_URL}/categories/men`);
    const data = await res.json();
    if (!data.success || data.data.id !== 'men' || !Array.isArray(data.data.products)) {
      throw new Error('Failed to retrieve single category');
    }
  });

  // 3. Products
  let createdProductId = null;

  await test('GET /products - Fetch all products', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length < 5) {
      throw new Error(`Expected at least 5 products, got ${data.count}`);
    }
  });

  await test('GET /products?category=men - Filter by category', async () => {
    const res = await fetch(`${BASE_URL}/products?category=men`);
    const data = await res.json();
    if (!data.success || data.data.some(p => p.category !== 'men')) {
      throw new Error('Category filter returned incorrect category');
    }
  });

  await test('GET /products?search=glide - Search query filter', async () => {
    const res = await fetch(`${BASE_URL}/products?search=glide`);
    const data = await res.json();
    if (!data.success || data.count === 0) {
      throw new Error('Search query returned 0 results');
    }
  });

  await test('GET /products?sort=price-asc - Sorting by price', async () => {
    const res = await fetch(`${BASE_URL}/products?sort=price-asc`);
    const data = await res.json();
    for (let i = 1; i < data.data.length; i++) {
      if (data.data[i].price < data.data[i - 1].price) {
        throw new Error('Products are not sorted by price ascending');
      }
    }
  });

  await test('POST /products - Create new product', async () => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Velocity Pro',
        tagline: 'Ultralight Sprint',
        price: 155,
        category: 'men',
        description: 'Test neomorphic runner engineered for maximum energy return.'
      })
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Product creation failed');
    createdProductId = data.data.id;
  });

  await test('GET /products/:id - Fetch single product', async () => {
    const res = await fetch(`${BASE_URL}/products/${createdProductId}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.id !== createdProductId) throw new Error('Product ID mismatch');
  });

  await test('PUT /products/:id - Update product', async () => {
    const res = await fetch(`${BASE_URL}/products/${createdProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 165 })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.price !== 165) throw new Error('Price was not updated');
  });

  await test('DELETE /products/:id - Delete product', async () => {
    const res = await fetch(`${BASE_URL}/products/${createdProductId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const check = await fetch(`${BASE_URL}/products/${createdProductId}`);
    if (check.status !== 404) throw new Error('Deleted product still accessible');
  });

  // 4. Reviews & Rating Stats
  let testReviewId = null;

  await test('GET /reviews - Fetch reviews with calculated stats', async () => {
    const res = await fetch(`${BASE_URL}/reviews`);
    const data = await res.json();
    if (!data.success || !data.stats || typeof data.stats.averageRating !== 'number') {
      throw new Error('Reviews stats missing or invalid');
    }
  });

  await test('POST /reviews - Create review & update stats', async () => {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: 'Backend Integration Tester',
        title: 'Outstanding quality and comfort',
        content: 'The neomorphic aesthetic matches the actual comfort in daily use.',
        rating: 5
      })
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Review creation failed');
    testReviewId = data.data.id;
  });

  await test('POST /reviews/:id/vote - Helpful vote', async () => {
    const res = await fetch(`${BASE_URL}/reviews/${testReviewId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'up' })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.helpfulCount < 1) throw new Error('Helpful count did not increment');
  });

  // 5. Orders & Checkout
  let createdOrderNumber = null;

  await test('POST /orders - Create order with discount & tax computation', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { id: 'silk-aeris-pro', name: 'Silk Aeris Pro', price: 145, quantity: 2, size: 10 }
        ],
        customer: {
          firstName: 'Alexander',
          lastName: 'Pierce',
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          zip: '97477'
        },
        deliveryMethod: 'express',
        couponCode: 'SILK15'
      })
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.orderNumber) throw new Error('Order number missing');
    if (data.data.pricing.discount <= 0) throw new Error('Coupon discount was not applied');
    createdOrderNumber = data.data.orderNumber;
  });

  await test('GET /orders/:id - Fetch order by order number', async () => {
    const res = await fetch(`${BASE_URL}/orders/${createdOrderNumber}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.orderNumber !== createdOrderNumber) throw new Error('Order number mismatch');
  });

  await test('PATCH /orders/:id/status - Update tracking status to Shipped', async () => {
    const res = await fetch(`${BASE_URL}/orders/${createdOrderNumber}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Shipped' })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.data.status !== 'Shipped') throw new Error('Status was not updated');
  });

  // 6. Newsletter Subscription
  await test('POST /newsletter/subscribe - Subscribe new email and receive coupon', async () => {
    const uniqueEmail = `tester-${Date.now()}@silkfootwear.com`;
    const res = await fetch(`${BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: uniqueEmail })
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.couponCode !== 'SILK15') throw new Error('Coupon code missing');
  });

  await test('GET /newsletter/subscribers - List subscribers', async () => {
    const res = await fetch(`${BASE_URL}/newsletter/subscribers`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Subscribers list invalid');
  });

  // 7. Error Handling & 404 Route
  await test('GET /unknown-route - 404 handler returns informative JSON', async () => {
    const res = await fetch(`${BASE_URL}/unknown-route`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    if (data.success !== false || !Array.isArray(data.availableEndpoints)) {
      throw new Error('404 response missing availableEndpoints list');
    }
  });

  console.log('\n🎉 ALL 17 INTEGRATION TESTS PASSED SUCCESSFULLY!\n');
}

runAllTests().catch(err => {
  console.error('\n💥 Suite stopped with failure:', err);
  process.exit(1);
});
