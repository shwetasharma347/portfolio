# Silk Footwear — Full Stack E-Commerce Platform

A modern, tactile, full-stack footwear e-commerce application engineered with **React 18 + Vite** on the frontend and **Node.js + Express** on the backend, built around the **Silk Neomorphic ("Extruded Light")** Design System.

---

## 🌟 Features

- **Neomorphic Design System**: Tactile elevations, extruded shadows (`neo-raised`), depressed surfaces (`neo-inset`), and interactive click states (`neo-interactive`).
- **Comprehensive Footwear Catalog**: Filtering by Category (*Men, Women, Kids, Trending, Best Sellers*), Search, Price Range, and Sorting.
- **Interactive Shopping Bag**: Slide-out cart drawer, persistent `localStorage` synchronization, size selector, quantity stepper, and live tax/shipping calculation.
- **Stepped Checkout Flow**: Stepped delivery choices (*Standard* vs. *Express*), coupon code application (`SILK15`), simulated card payment, and instant order tracking receipt.
- **Customer Reviews & Ratings**: Dynamic 5-star rating breakdowns, customer testimonials, interactive helpfulness voting, and modal review submission.
- **Silk Club Newsletter**: Email subscription with 15% discount coupon code generation.
- **Live Interactive API Console**: Backend landing dashboard at `http://localhost:5000` with live database metrics, one-click endpoint testing, visual card previews, and formatted JSON output.
- **Automated Integration Test Suite**: 17 automated integration tests verifying health, products, categories, reviews, orders, newsletter, and 404 handlers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS v3, Plus Jakarta Sans, Material Symbols Outlined |
| **Backend** | Node.js, Express 4, CORS, Dotenv, File-backed JSON Database Persistence |
| **Deployment** | Render (Backend Web Service), Vercel (Frontend Static / SPA) |

---

## 📁 Repository Structure

```
Portfolio/
├── backend/                  # Node.js + Express REST API Server
│   ├── data/
│   │   └── db.json           # File-backed database (products, reviews, orders, etc.)
│   ├── src/
│   │   ├── db.js             # DB helper with auto-seed fallback
│   │   └── routes/
│   │       ├── products.js   # Products CRUD, search, filter & sort
│   │       ├── categories.js # Categories with dynamic item counts
│   │       ├── reviews.js    # Reviews with dynamic rating distribution
│   │       ├── orders.js     # Checkout orders & order status tracking
│   │       └── newsletter.js # Newsletter subscriptions & coupon codes
│   ├── server.js             # Express server with live interactive API playground
│   ├── test-api.js           # 17-point integration test suite
│   ├── package.json          # Backend scripts & dependencies
│   ├── .env.example          # Backend environment variables template
│   └── README.md             # Detailed backend documentation
│
├── frontend/                 # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js     # API client with automatic fallback & normalization
│   │   ├── components/
│   │   │   ├── cart/         # CartDrawer slide-over
│   │   │   ├── common/       # ProductCard with neomorphic hover lift
│   │   │   └── layout/       # Navbar, NavigationDrawer, Footer
│   │   ├── context/
│   │   │   └── CartContext.jsx # Global shopping cart state & localStorage
│   │   ├── data/             # Offline fallback dataset (products, reviews)
│   │   ├── pages/            # Home, Best Sellers, Trending, Men, Women, Kids, Reviews, Checkout
│   │   ├── App.jsx           # Top-level routing & ErrorBoundary wrapper
│   │   └── index.css         # Custom neomorphic utility classes
│   ├── vercel.json           # SPA rewrite rules for Vercel deployment
│   ├── package.json          # Frontend dependencies & build scripts
│   ├── .env.example          # Frontend environment variables template
│   └── README.md             # Detailed frontend documentation
│
├── .gitignore                # Production gitignore (ignores node_modules, .env, dist)
└── README.md                 # Project root documentation (this file)
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/shwetasharma347/portfolio.git
cd portfolio
```

### 2. Run the Backend Server
In a new terminal window:
```bash
cd backend
npm install
npm run dev
```
- **Backend URL**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Interactive Playground**: Open [http://localhost:5000](http://localhost:5000) in your browser.

### 3. Run the Frontend Application
In another terminal window:
```bash
cd frontend
npm install
npm run dev
```
- **Frontend URL**: [http://localhost:3000](http://localhost:3000)

### 4. Run the Backend Integration Test Suite
```bash
cd backend
npm test
```
Executes all 17 automated integration tests against the live API endpoints.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` (see [`backend/.env.example`](backend/.env.example)):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
Create `frontend/.env` (see [`frontend/.env.example`](frontend/.env.example)):
```env
# Local development (proxied through Vite to port 5000):
VITE_API_URL=http://localhost:5000/api

# Production (e.g. hosted on Vercel pointing to Render):
# VITE_API_URL=https://portfolio-yk0i.onrender.com/api
```

---

## 🌐 Production Deployment

### Backend on Render (Web Service)
- **Repository**: `portfolio`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV` = `production`
- **Live URL**: [https://portfolio-yk0i.onrender.com](https://portfolio-yk0i.onrender.com)

### Frontend on Vercel (Static / SPA)
- **Repository**: `portfolio`
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL` = `https://portfolio-yk0i.onrender.com/api`
- Handled SPA routing via [`frontend/vercel.json`](frontend/vercel.json).

---

## 📡 Core API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status, uptime, memory usage, and database records |
| `GET` | `/api/products` | All products with filtering (`category`, `isBestSeller`, `isTrending`, `search`, `minPrice`, `maxPrice`, `sort`) |
| `GET` | `/api/products/:id` | Single product details |
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/categories` | Categories with real-time product counts |
| `GET` | `/api/reviews` | Customer reviews with dynamic rating statistics |
| `POST` | `/api/reviews` | Submit new review |
| `POST` | `/api/reviews/:id/vote` | Vote helpful / unhelpful |
| `GET` | `/api/orders` | Order history |
| `GET` | `/api/orders/:id` | Lookup order by order number (e.g., `SLK-123456`) |
| `POST` | `/api/orders` | Submit order with tax, shipping, and discount calculation |
| `POST` | `/api/newsletter/subscribe` | Subscribe to Silk Club and receive `SILK15` coupon |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
