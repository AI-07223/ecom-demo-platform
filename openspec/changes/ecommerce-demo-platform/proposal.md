## Why

We need a stunning, fully-functional e-commerce demo frontend to showcase to prospective clients. The platform must look and feel like a real production store — with product browsing, cart, checkout, user accounts, and a complete admin panel — all powered by simulated/mock data. This eliminates the need for a backend while delivering a polished, interactive experience that sells our capabilities.

## What Changes

- Build a complete storefront UI: homepage, product catalog with filtering/search, product detail pages, shopping cart, and simulated checkout flow
- Build a full admin dashboard: product management (CRUD), order management, customer list, analytics/dashboard overview, and settings
- Implement client-side state management with mock data to simulate all interactions (add to cart, place order, manage inventory)
- Responsive design across all breakpoints (mobile, tablet, desktop)
- Modern UI with smooth animations, transitions, and micro-interactions
- Dark/light theme support throughout
- Authentication simulation (login/register for both storefront and admin)

## Capabilities

### New Capabilities
- `storefront-shell`: App shell, routing, layout, navigation, theme switching, and responsive framework
- `product-catalog`: Product listing, grid/list views, filtering, sorting, search, and category navigation
- `product-detail`: Individual product page with image gallery, variants, reviews, and add-to-cart
- `shopping-cart`: Cart drawer/page, quantity management, price calculation, and promo codes
- `checkout-flow`: Multi-step simulated checkout (shipping, payment, confirmation) with form validation
- `user-accounts`: Login/register simulation, profile page, order history, wishlist, and saved addresses
- `admin-dashboard`: Admin layout, overview analytics cards, charts, recent activity feed
- `admin-products`: Product CRUD table, image upload simulation, variant management, inventory tracking
- `admin-orders`: Order list with status filters, order detail view, status update workflow
- `admin-customers`: Customer list, customer detail with order history, customer segments
- `mock-data-engine`: Centralized mock data store with realistic sample data and simulated API delay
- `notifications-system`: Toast notifications, notification bell dropdown with activity feed in both storefront and admin
- `advanced-product-features`: Product comparison, recently viewed products, quick view modal, size guides
- `marketing-pages`: Landing/about/contact/FAQ pages, blog-style content section with mock articles

### Modified Capabilities

## Impact

- **New codebase**: Greenfield Next.js (App Router) project with TypeScript
- **Dependencies**: React 19, Next.js 15, Tailwind CSS 4, shadcn/ui, Framer Motion, Recharts, Zustand (state), Lucide icons
- **No backend required**: All data is client-side mock data with simulated latency
- **Deployment**: Static export compatible, Vercel-ready
