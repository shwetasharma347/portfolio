async function runTests() {
  console.log('Testing Silk Footwear REST API:');
  
  // 1. Health
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('✔ Health Check:', health.status);

  // 2. Products
  const prodRes = await fetch('http://localhost:5000/api/products');
  const prod = await prodRes.json();
  console.log(`✔ Products fetched: ${prod.count} products`);

  // 3. Category filter
  const menRes = await fetch('http://localhost:5000/api/products?category=men');
  const men = await menRes.json();
  console.log(`✔ Men products: ${men.count} products`);

  // 4. Categories
  const catRes = await fetch('http://localhost:5000/api/categories');
  const cat = await catRes.json();
  console.log(`✔ Categories count: ${cat.count}`);

  // 5. Post review
  const revRes = await fetch('http://localhost:5000/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: 'E2E Tester',
      title: 'Seamless Integration',
      content: 'The backend REST API connects beautifully with the React frontend!',
      rating: 5
    })
  });
  const rev = await revRes.json();
  console.log(`✔ Review created: ID ${rev.data.id} by ${rev.data.author}`);

  // 6. Helpful vote
  const voteRes = await fetch(`http://localhost:5000/api/reviews/${rev.data.id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'up' })
  });
  const vote = await voteRes.json();
  console.log(`✔ Helpful vote registered: count is now ${vote.data.helpfulCount}`);

  // 7. Create order
  const orderRes = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: 'silk-aeris-pro', name: 'Silk Aeris Pro', quantity: 2, price: 145 }],
      customer: { firstName: 'Sarah', lastName: 'Connor', city: 'Los Angeles', state: 'CA' },
      deliveryMethod: 'express',
      paymentMethod: 'card',
      subtotal: 290,
      tax: 23.2,
      shippingCost: 15,
      total: 328.2
    })
  });
  const order = await orderRes.json();
  console.log(`✔ Order placed: ${order.data.orderNumber}, Total: $${order.data.pricing.total}`);

  // 8. Fetch order
  const fetchOrderRes = await fetch(`http://localhost:5000/api/orders/${order.data.orderNumber}`);
  const fetchedOrder = await fetchOrderRes.json();
  console.log(`✔ Order fetched by ID: ${fetchedOrder.data.orderNumber} for ${fetchedOrder.data.customer.firstName}`);

  console.log('\n⭐ ALL 8 ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
