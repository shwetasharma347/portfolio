# Silk Footwear — React Frontend

This is a modern, modular React frontend application converted from Google Stitch design templates, strictly adhering to the **Silk Neomorphic ("Extruded Light")** Design System.

## Architecture & Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom Material 3 / Neomorphic tokens (`.neo-raised`, `.neo-inset`, `.neo-interactive`)
- **Routing**: `react-router-dom` with smooth scroll restoration
- **State Management**: Reactive `CartContext` with `localStorage` persistence, badge counter, and slide-over drawers
- **Typography**: Google Fonts *Plus Jakarta Sans*
- **Icons**: Google Material Symbols Outlined

## Directory Structure

```
frontend/
├── index.html              # App entry with Plus Jakarta Sans & Material Symbols
├── package.json            # Scripts & dependencies
├── vite.config.js          # Vite configuration with @ path aliases
├── tailwind.config.js      # Neomorphic color palette and box-shadow tokens
├── postcss.config.js       # Tailwind PostCSS configuration
├── src/
│   ├── index.css           # Core Neomorphic CSS classes & base styling
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Top-level routing & layout wrappers
│   ├── context/
│   │   └── CartContext.jsx # Global cart state, totals, and drawer toggles
│   ├── data/
│   │   ├── products.js     # Typed products catalog with Stitch imagery
│   │   └── reviews.js      # Rating metrics & verified customer feedback
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Sticky neomorphic header
│   │   │   ├── NavigationDrawer.jsx  # Slide-out category drawer
│   │   │   └── Footer.jsx            # Tactile footer with company links
│   │   ├── cart/
│   │   │   └── CartDrawer.jsx        # Slide-over shopping bag & checkout link
│   │   └── common/
│   │       └── ProductCard.jsx       # Reusable neomorphic card with hover lift
│   └── pages/
│       ├── HomePage.jsx              # Hero, circular categories, Bento grid
│       ├── BestSellersPage.jsx       # Ranked products with category filter
│       ├── TrendingStylesPage.jsx    # Editorial Bento grid & UGC showcase
│       ├── MensFootwearPage.jsx      # Size, occasion, and price filters
│       ├── WomensFootwearPage.jsx    # Step into Confidence hero & category pills
│       ├── KidsFootwearPage.jsx      # Playground hero, age & closure filters
│       ├── CustomerReviewsPage.jsx   # Rating breakdown & review submission
│       └── SecureCheckoutPage.jsx    # Stepped shipping, delivery & payment
```

## Running the Application

To run the development server:

```bash
cd frontend
npm run dev
```

The application will launch at `http://localhost:3000` with hot module replacement (HMR).

To build for production:

```bash
cd frontend
npm run build
```
