import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productsRouter from './src/routes/products.js';
import categoriesRouter from './src/routes/categories.js';
import reviewsRouter from './src/routes/reviews.js';
import ordersRouter from './src/routes/orders.js';
import newsletterRouter from './src/routes/newsletter.js';
import { readDB } from './src/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Root Landing Route - Friendly Dashboard & API Navigator
app.get(['/', '/api'], (req, res) => {
  const db = readDB();
  const prodCount = (db.products || []).length;
  const revCount = (db.reviews || []).length;
  const ordCount = (db.orders || []).length;
  const catCount = (db.categories || []).length;
  const subCount = (db.newsletter || []).length;

  if (req.accepts('html')) {
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Silk Footwear | API Backend & Live Console</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #e8eaf0;
      color: #2e3040;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 16px 60px;
    }
    .container {
      max-width: 960px;
      width: 100%;
    }
    .card {
      background: #e8eaf0;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.7);
      margin-bottom: 24px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      background: #e8eaf0;
      box-shadow: inset 3px 3px 6px rgba(0,0,0,0.06), inset -3px -3px 6px rgba(255,255,255,0.6);
      color: #10b981;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      margin-top: 16px;
      margin-bottom: 8px;
      color: #1e202e;
    }
    p.lead {
      color: #63677e;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }
    .stat-box {
      padding: 14px;
      border-radius: 16px;
      background: #e8eaf0;
      box-shadow: inset 3px 3px 6px rgba(0,0,0,0.05), inset -3px -3px 6px rgba(255,255,255,0.6);
      text-align: center;
    }
    .stat-val {
      font-size: 24px;
      font-weight: 800;
      color: #3b82f6;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: #71768e;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .btn-frontend {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 22px;
      border-radius: 16px;
      background: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 4px 4px 10px rgba(59, 130, 246, 0.35);
      transition: transform 0.15s ease;
    }
    .btn-frontend:hover { transform: translateY(-2px); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }
    .endpoint-card {
      display: block;
      padding: 16px 18px;
      border-radius: 18px;
      background: #e8eaf0;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.07), -5px -5px 10px rgba(255, 255, 255, 0.7);
      transition: all 0.2s ease;
      border: 2px solid transparent;
      user-select: none;
    }
    .endpoint-card:hover {
      transform: translateY(-2px);
    }
    .endpoint-card.active {
      box-shadow: inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.7);
      border-color: #3b82f6;
      background: #f0f2f7;
    }
    .ep-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .ep-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      background: #dbeafe;
      color: #1d4ed8;
    }
    .ep-badge.post {
      background: #dcfce7;
      color: #15803d;
    }
    .ep-click-hint {
      font-size: 11px;
      font-weight: 600;
      color: #3b82f6;
    }
    .ep-name {
      font-size: 15px;
      font-weight: 700;
      color: #1e202e;
      margin-bottom: 4px;
    }
    .ep-desc {
      font-size: 12px;
      color: #6a6f87;
      line-height: 1.4;
    }
    /* Quick Query Filters Pill Bar */
    .filter-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }
    .pill-btn {
      padding: 6px 14px;
      border-radius: 12px;
      background: #e8eaf0;
      border: none;
      box-shadow: 3px 3px 6px rgba(0,0,0,0.06), -3px -3px 6px rgba(255,255,255,0.7);
      font-size: 12px;
      font-weight: 600;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .pill-btn:hover {
      color: #3b82f6;
      transform: translateY(-1px);
    }
    .pill-btn:active, .pill-btn.active {
      box-shadow: inset 2px 2px 5px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.6);
      color: #3b82f6;
    }
    /* Console & Response Area */
    .console-card {
      background: #e8eaf0;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.7);
    }
    .console-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      margin-bottom: 16px;
    }
    .console-target {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 600;
    }
    .method-tag {
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      background: #3b82f6;
      color: #ffffff;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      background: #dcfce7;
      color: #15803d;
    }
    .tabs {
      display: flex;
      gap: 8px;
    }
    .tab-btn {
      padding: 6px 14px;
      border-radius: 10px;
      border: none;
      background: #e8eaf0;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 3px 3px 6px rgba(0,0,0,0.06), -3px -3px 6px rgba(255,255,255,0.7);
      color: #6b7280;
    }
    .tab-btn.active {
      box-shadow: inset 2px 2px 5px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.6);
      color: #3b82f6;
    }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    pre.json-view {
      background: #1e202e;
      color: #f1f5f9;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.6;
      padding: 20px;
      border-radius: 16px;
      overflow-x: auto;
      max-height: 480px;
      box-shadow: inset 4px 4px 10px rgba(0,0,0,0.4);
    }
    /* Visual Previews */
    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      max-height: 520px;
      overflow-y: auto;
      padding: 4px;
    }
    .preview-product-card {
      background: #e8eaf0;
      border-radius: 16px;
      padding: 14px;
      box-shadow: 4px 4px 8px rgba(0,0,0,0.06), -4px -4px 8px rgba(255,255,255,0.7);
      display: flex;
      flex-direction: column;
    }
    .preview-product-card img {
      width: 100%;
      height: 120px;
      object-fit: contain;
      border-radius: 10px;
      background: #ffffff;
      margin-bottom: 10px;
      box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05);
    }
    .preview-p-title {
      font-size: 13px;
      font-weight: 700;
      color: #1e202e;
      margin-bottom: 2px;
    }
    .preview-p-price {
      font-size: 14px;
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 6px;
    }
    .preview-p-cat {
      font-size: 11px;
      color: #71768e;
      text-transform: uppercase;
      font-weight: 600;
    }
    .btn-raw-tab {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #3b82f6;
      text-decoration: none;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .btn-raw-tab:hover { text-decoration: underline; }
    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(59,130,246,0.3);
      border-radius: 50%;
      border-top-color: #3b82f6;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Card -->
    <div class="card">
      <div class="badge">
        <span class="dot"></span>
        REST API SERVER ONLINE & OPERATIONAL
      </div>
      <h1>Silk Footwear API Backend</h1>
      <p class="lead">
        The Node.js Express REST API is live on port <strong>5000</strong>. Click any live endpoint below to execute it in real-time and inspect both formatted JSON and visual preview data.
      </p>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-val">${prodCount}</div>
          <div class="stat-label">Products</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${catCount}</div>
          <div class="stat-label">Categories</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${revCount}</div>
          <div class="stat-label">Reviews</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${ordCount}</div>
          <div class="stat-label">Orders</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${subCount}</div>
          <div class="stat-label">Club Members</div>
        </div>
      </div>

      <div class="actions">
        <a href="http://localhost:3000" class="btn-frontend" target="_blank">
          <span>👟 Open React Frontend</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>

    <!-- Live Endpoints Explorer -->
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
      <h2 style="font-size: 20px; font-weight: 800; color: #1e202e;">⚡ Live Interactive API Explorer</h2>
      <span style="font-size: 12px; color: #6a6f87; font-weight: 600;">Click any card to run live request</span>
    </div>

    <!-- Quick Query Filters -->
    <div class="filter-pills">
      <button class="pill-btn active" onclick="executeEndpoint('/api/products', 'GET', null, this)">All Products</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/products?category=men', 'GET', null, this)">Men's Footwear</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/products?category=women', 'GET', null, this)">Women's Footwear</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/products?category=kids', 'GET', null, this)">Kids' Footwear</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/products?isBestSeller=true', 'GET', null, this)">Best Sellers Only</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/products?sort=price-asc', 'GET', null, this)">Sort: Price Low-to-High</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/categories', 'GET', null, this)">Categories with Counts</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/reviews', 'GET', null, this)">Reviews & Stats</button>
      <button class="pill-btn" onclick="executeEndpoint('/api/orders', 'GET', null, this)">List Orders</button>
      <button class="pill-btn" onclick="simulateOrder(this)">+ Simulate Sample Order</button>
      <button class="pill-btn" onclick="simulateReview(this)">+ Post Sample Review</button>
    </div>

    <!-- Endpoint Cards Grid -->
    <div class="grid">
      <div class="endpoint-card active" id="card-products" onclick="executeEndpoint('/api/products', 'GET', null, this)">
        <div class="ep-header">
          <span class="ep-badge">GET /api/products</span>
          <span class="ep-click-hint">▶ Click to Run</span>
        </div>
        <div class="ep-name">Products Catalog</div>
        <div class="ep-desc">Full sneaker inventory with sizes, colors, prices, and ratings.</div>
      </div>

      <div class="endpoint-card" id="card-health" onclick="executeEndpoint('/api/health', 'GET', null, this)">
        <div class="ep-header">
          <span class="ep-badge">GET /api/health</span>
          <span class="ep-click-hint">▶ Click to Run</span>
        </div>
        <div class="ep-name">System Health & Metrics</div>
        <div class="ep-desc">Live memory usage, process uptime, and database records.</div>
      </div>

      <div class="endpoint-card" id="card-categories" onclick="executeEndpoint('/api/categories', 'GET', null, this)">
        <div class="ep-header">
          <span class="ep-badge">GET /api/categories</span>
          <span class="ep-click-hint">▶ Click to Run</span>
        </div>
        <div class="ep-name">Categories</div>
        <div class="ep-desc">Men, Women, Kids, Trending, and Best Sellers with counts.</div>
      </div>

      <div class="endpoint-card" id="card-reviews" onclick="executeEndpoint('/api/reviews', 'GET', null, this)">
        <div class="ep-header">
          <span class="ep-badge">GET /api/reviews</span>
          <span class="ep-click-hint">▶ Click to Run</span>
        </div>
        <div class="ep-name">Customer Reviews</div>
        <div class="ep-desc">Verified customer ratings, feedback, and star distribution.</div>
      </div>

      <div class="endpoint-card" id="card-orders" onclick="executeEndpoint('/api/orders', 'GET', null, this)">
        <div class="ep-header">
          <span class="ep-badge">GET /api/orders</span>
          <span class="ep-click-hint">▶ Click to Run</span>
        </div>
        <div class="ep-name">Orders Database</div>
        <div class="ep-desc">Placed orders, delivery tracking, items, and receipts.</div>
      </div>

      <div class="endpoint-card" id="card-newsletter" onclick="executeEndpoint('/api/newsletter/subscribers', 'GET', null, this)">
        <div class="ep-header">
          <span class="ep-badge">GET /api/newsletter/subscribers</span>
          <span class="ep-click-hint">▶ Click to Run</span>
        </div>
        <div class="ep-name">Silk Club Subscribers</div>
        <div class="ep-desc">List of newsletter members and issued discount coupons.</div>
      </div>
    </div>

    <!-- Live Console Output Area -->
    <div class="console-card">
      <div class="console-header">
        <div class="console-target">
          <span class="method-tag" id="current-method">GET</span>
          <span id="current-url">/api/products</span>
          <span class="status-badge" id="current-status">200 OK</span>
          <span style="font-size: 11px; color: #71768e; font-weight: 600;" id="current-time">12ms</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <a id="current-raw-link" href="/api/products" target="_blank" class="btn-raw-tab">Open Raw Tab ↗</a>
          <div class="tabs">
            <button class="tab-btn active" id="btn-tab-visual" onclick="switchTab('visual')">Visual View</button>
            <button class="tab-btn" id="btn-tab-json" onclick="switchTab('json')">Formatted JSON</button>
            <button class="tab-btn" onclick="copyJson()">📋 Copy</button>
          </div>
        </div>
      </div>

      <!-- Tab 1: Visual View -->
      <div id="tab-visual" class="tab-content active">
        <div id="visual-container" class="preview-grid">
          <!-- Filled dynamically -->
        </div>
      </div>

      <!-- Tab 2: Formatted JSON View -->
      <div id="tab-json" class="tab-content">
        <pre class="json-view" id="json-output">// Loading live endpoint response...</pre>
      </div>
    </div>
  </div>

  <script>
    let latestData = null;
    let currentEndpoint = '/api/products';
    let currentMethod = 'GET';

    function switchTab(tab) {
      document.getElementById('tab-visual').classList.toggle('active', tab === 'visual');
      document.getElementById('tab-json').classList.toggle('active', tab === 'json');
      document.getElementById('btn-tab-visual').classList.toggle('active', tab === 'visual');
      document.getElementById('btn-tab-json').classList.toggle('active', tab === 'json');
    }

    function copyJson() {
      if (latestData) {
        navigator.clipboard.writeText(JSON.stringify(latestData, null, 2));
        alert('JSON copied to clipboard!');
      }
    }

    async function executeEndpoint(url, method = 'GET', body = null, triggerEl = null) {
      currentEndpoint = url;
      currentMethod = method;

      // Update UI elements
      document.getElementById('current-method').textContent = method;
      document.getElementById('current-url').textContent = url;
      document.getElementById('current-raw-link').href = url;
      document.getElementById('current-status').innerHTML = '<span class="loading-spinner"></span> Loading';

      if (triggerEl) {
        document.querySelectorAll('.endpoint-card, .pill-btn').forEach(el => el.classList.remove('active'));
        triggerEl.classList.add('active');
      }

      const start = performance.now();
      try {
        const options = { method, headers: { 'Accept': 'application/json' } };
        if (body) {
          options.headers['Content-Type'] = 'application/json';
          options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        const duration = Math.round(performance.now() - start);
        const data = await res.json();
        latestData = data;

        document.getElementById('current-status').textContent = res.status + ' ' + (res.ok ? 'OK' : 'Error');
        document.getElementById('current-status').style.background = res.ok ? '#dcfce7' : '#fee2e2';
        document.getElementById('current-status').style.color = res.ok ? '#15803d' : '#b91c1c';
        document.getElementById('current-time').textContent = duration + 'ms';

        // Display JSON
        document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);

        // Render Visual View
        renderVisual(url, data);
      } catch (err) {
        document.getElementById('current-status').textContent = 'Request Failed';
        document.getElementById('current-status').style.background = '#fee2e2';
        document.getElementById('current-status').style.color = '#b91c1c';
        document.getElementById('json-output').textContent = '// Error: ' + err.message;
      }
    }

    function renderVisual(url, data) {
      const container = document.getElementById('visual-container');
      container.innerHTML = '';

      if (url.includes('/products')) {
        const items = data.data || [];
        if (!items.length) {
          container.innerHTML = '<p style="padding: 20px; color: #6a6f87;">No products matched this filter.</p>';
          return;
        }
        items.forEach(p => {
          const card = document.createElement('div');
          card.className = 'preview-product-card';
          card.innerHTML = \`
            <img src="\${p.image}" alt="\${p.name}" onerror="this.src='https://via.placeholder.com/200?text=Footwear'" />
            <div class="preview-p-title">\${p.name}</div>
            <div class="preview-p-price">$\${Number(p.price).toFixed(2)}</div>
            <div class="preview-p-cat">\${p.category} | \${p.color || 'Standard'}</div>
            <div style="font-size: 11px; color: #f59e0b; margin-top: 4px;">★ \${p.rating} (\${p.reviewCount} reviews)</div>
          \`;
          container.appendChild(card);
        });
      } else if (url.includes('/categories')) {
        const items = data.data || [];
        items.forEach(c => {
          const card = document.createElement('div');
          card.className = 'preview-product-card';
          card.style.textAlign = 'center';
          card.innerHTML = \`
            <div style="font-size: 32px; margin-bottom: 8px;">🏷️</div>
            <div class="preview-p-title">\${c.name}</div>
            <div class="preview-p-price" style="font-size: 18px;">\${c.productCount || 0} Products</div>
            <div class="preview-p-cat">Path: \${c.path}</div>
          \`;
          container.appendChild(card);
        });
      } else if (url.includes('/reviews')) {
        const stats = data.stats || {};
        const items = data.data || [];
        container.innerHTML = \`
          <div style="grid-column: 1 / -1; background: #ffffff; padding: 16px; border-radius: 14px; margin-bottom: 12px; box-shadow: 2px 2px 5px rgba(0,0,0,0.05);">
            <strong style="font-size: 16px; color: #1e202e;">Average Rating: ★ \${stats.averageRating || '4.8'} / 5.0</strong>
            <span style="color: #6a6f87; margin-left: 8px;">(\${stats.totalReviews || items.length} total reviews verified)</span>
          </div>
        \`;
        items.forEach(r => {
          const card = document.createElement('div');
          card.className = 'preview-product-card';
          card.innerHTML = \`
            <div style="color: #f59e0b; font-size: 12px; margin-bottom: 4px;">\${'★'.repeat(r.rating || 5)}</div>
            <div class="preview-p-title">\${r.title}</div>
            <div style="font-size: 12px; color: #4b5563; margin: 6px 0; line-height: 1.4;">"\${r.content.slice(0, 100)}..."</div>
            <div class="preview-p-cat">By \${r.author} (\${r.date})</div>
          \`;
          container.appendChild(card);
        });
      } else if (url.includes('/orders')) {
        const items = data.data || (data.data ? [data.data] : []);
        if (!items.length) {
          container.innerHTML = '<p style="padding: 20px; color: #6a6f87;">No orders placed yet.</p>';
          return;
        }
        items.forEach(o => {
          const card = document.createElement('div');
          card.className = 'preview-product-card';
          card.innerHTML = \`
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="preview-p-title">#\${o.orderNumber}</span>
              <span style="font-size: 11px; font-weight: 700; color: #15803d; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">\${o.status || 'Confirmed'}</span>
            </div>
            <div class="preview-p-price" style="margin-top: 4px;">$\${o.pricing ? o.pricing.total : o.total}</div>
            <div class="preview-p-cat">Customer: \${o.customer ? o.customer.firstName + ' ' + (o.customer.lastName || '') : 'Valued'}</div>
            <div style="font-size: 11px; color: #6a6f87; margin-top: 4px;">\${(o.items || []).length} item(s) • \${o.deliveryMethod || 'standard'} shipping</div>
          \`;
          container.appendChild(card);
        });
      } else if (url.includes('/health')) {
        container.innerHTML = \`
          <div style="grid-column: 1 / -1; background: #ffffff; padding: 20px; border-radius: 16px; box-shadow: 2px 2px 6px rgba(0,0,0,0.06);">
            <h3 style="margin-bottom: 12px; color: #15803d;">🟢 Service: \${data.service || 'Silk Footwear API'}</h3>
            <p style="margin-bottom: 6px;"><strong>Status:</strong> \${data.status}</p>
            <p style="margin-bottom: 6px;"><strong>Uptime:</strong> \${data.uptime}</p>
            <p style="margin-bottom: 6px;"><strong>Node Version:</strong> \${data.nodeVersion}</p>
            <p style="margin-bottom: 6px;"><strong>Memory:</strong> RSS \${data.memory ? data.memory.rss : 'N/A'}, Heap \${data.memory ? data.memory.heapUsed : 'N/A'}</p>
            <p><strong>Database counts:</strong> \${JSON.stringify(data.database)}</p>
          </div>
        \`;
      } else {
        container.innerHTML = \`<pre style="grid-column: 1/-1; padding: 16px; background: #ffffff; border-radius: 12px;">\${JSON.stringify(data, null, 2)}</pre>\`;
      }
    }

    async function simulateOrder(btn) {
      const sampleOrder = {
        items: [{ id: 'silk-aeris-pro', name: 'Silk Aeris Pro', price: 145, quantity: 1, size: 10 }],
        customer: { firstName: 'Tester', lastName: 'User', street: '123 Silk Blvd', city: 'San Francisco', state: 'CA', zip: '94103' },
        deliveryMethod: 'express',
        couponCode: 'SILK15'
      };
      await executeEndpoint('/api/orders', 'POST', sampleOrder, btn);
    }

    async function simulateReview(btn) {
      const sampleReview = {
        author: 'Browser Tester',
        title: 'Super smooth neomorphic sole',
        content: 'I love how lightweight and springy these sneakers are for all-day walking!',
        rating: 5
      };
      await executeEndpoint('/api/reviews', 'POST', sampleReview, btn);
    }

    // Auto-run /api/products on initial page load
    window.addEventListener('DOMContentLoaded', () => {
      executeEndpoint('/api/products', 'GET', null, document.getElementById('card-products'));
    });
  </script>
</body>
</html>
    `);
  }

  return res.json({
    success: true,
    message: 'Silk Footwear REST API Backend is online and operational.',
    version: '1.0.0',
    frontendUrl: 'http://localhost:3000',
    database: {
      products: prodCount,
      categories: catCount,
      reviews: revCount,
      orders: ordCount,
      subscribers: subCount
    },
    documentation: 'See http://localhost:5000 in your browser or README.md'
  });
});

// Comprehensive Health Check & Metrics
app.get('/api/health', (req, res) => {
  try {
    const db = readDB();
    const mem = process.memoryUsage();

    res.json({
      status: 'online',
      service: 'Silk Footwear REST API',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      nodeVersion: process.version,
      database: {
        products: (db.products || []).length,
        categories: (db.categories || []).length,
        reviews: (db.reviews || []).length,
        orders: (db.orders || []).length,
        newsletterSubscribers: (db.newsletter || []).length
      },
      memory: {
        rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'degraded', error: err.message });
  }
});

// Mount Resource Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/newsletter', newsletterRouter);

// 404 Route Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.method} ${req.originalUrl}' not found`,
    availableEndpoints: [
      'GET    /api/health',
      'GET    /api/products',
      'GET    /api/products/:id',
      'POST   /api/products',
      'PUT    /api/products/:id',
      'DELETE /api/products/:id',
      'GET    /api/categories',
      'GET    /api/categories/:id',
      'GET    /api/reviews',
      'POST   /api/reviews',
      'POST   /api/reviews/:id/vote',
      'DELETE /api/reviews/:id',
      'GET    /api/orders',
      'GET    /api/orders/:id',
      'POST   /api/orders',
      'PATCH  /api/orders/:id/status',
      'DELETE /api/orders/:id',
      'POST   /api/newsletter/subscribe',
      'GET    /api/newsletter/subscribers'
    ]
  });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(`Unhandled error at ${req.method} ${req.url}:`, err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Silk Footwear Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
});
