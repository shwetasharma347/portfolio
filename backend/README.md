# Silk Footwear REST API Backend

Express REST API designed to power the [Silk Footwear React Frontend](../frontend). Built with modular ES6 modules, JSON database persistence, request logging, input validation, and comprehensive error handling.

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd backend
npm run dev     # Runs with Node --watch on port 5000
# or
npm start       # Runs production start
```

### 2. Run Test Suite
```bash
npm test        # Runs all 17 integration tests
```

---

## 📡 Base URL & Configuration

- **Default Port**: `5000` (Configurable via `PORT` environment variable or `.env`)
- **Base Endpoint**: `http://localhost:5000/api`
- **Frontend Proxy**: Requests from the Vite frontend dev server at `http://localhost:3000/api/*` are automatically proxied to `http://localhost:5000/api/*`.

---

## 📚 API Reference

### 1. System & Health
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime, memory usage, node version, and database record counts. |

---

### 2. Products (`/api/products`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve products. Supports query parameters:<br>• `category`: Filter by category (`men`, `women`, `kids`, `trending`)<br>• `isBestSeller`: `true`<br>• `isTrending`: `true`<br>• `search`: Keyword search in name, tagline, description, color<br>• `minPrice`, `maxPrice`: Filter by price range<br>• `sort`: `price-asc`, `price-desc`, `rating`, `newest`<br>• `page`, `limit`: Pagination |
| `GET` | `/api/products/:id` | Retrieve single product details by unique ID. |
| `POST` | `/api/products` | Create a new product. |
| `PUT` | `/api/products/:id` | Update an existing product. |
| `DELETE` | `/api/products/:id` | Remove a product from the database. |

---

### 3. Categories (`/api/categories`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all footwear categories with real-time `productCount`. |
| `GET` | `/api/categories/:id` | Retrieve category details and its associated products. |

---

### 4. Customer Reviews (`/api/reviews`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reviews` | Retrieve all customer reviews along with dynamic rating statistics (average rating, total count, star percentage distribution).<br>Supports `?rating=5` and `?sort=helpful\|newest`. |
| `POST` | `/api/reviews` | Submit a new review (`author`, `title`, `content`, `rating`). Automatically recalculates review statistics. |
| `POST` | `/api/reviews/:id/vote` | Vote a review as helpful (`type: "up"`) or unhelpful (`type: "down"`). |
| `DELETE` | `/api/reviews/:id` | Delete a review and recalculate rating distribution. |

---

### 5. Orders & Checkout (`/api/orders`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/orders` | Retrieve all submitted orders (newest first). |
| `GET` | `/api/orders/:id` | Retrieve order confirmation and tracking by `orderNumber` (e.g. `SLK-123456`). |
| `POST` | `/api/orders` | Submit a checkout order. Computes tax (8.5%), shipping ($15 for express, $0 standard), discounts (e.g. `SILK15`), and returns confirmation with estimated delivery. |
| `PATCH` | `/api/orders/:id/status` | Update tracking status (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`). |
| `DELETE` | `/api/orders/:id` | Cancel/remove an order. |

---

### 6. Newsletter Subscription (`/api/newsletter`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/newsletter/subscribe` | Subscribe email to the Silk Club; returns welcome message and `SILK15` 15% discount coupon code. |
| `GET` | `/api/newsletter/subscribers` | List all subscribers. |

---

## 🗄️ Database Storage

- Stored in atomic JSON format at [`backend/data/db.json`](./data/db.json).
- Automatically initializes on startup if not present.

