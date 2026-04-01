## Context

This is a greenfield project — no existing code. The goal is a visually impressive e-commerce demo that runs entirely client-side with simulated data. It needs to feel production-real: smooth animations, realistic data, working flows (browse → cart → checkout), and a complete admin panel. Target audience is prospective clients evaluating our frontend capabilities.

**Constraints:**
- No backend — all data simulated in-browser
- Must be deployable as a static site (Vercel/Netlify)
- Performance must be excellent despite being a rich UI
- Must work flawlessly on mobile, tablet, and desktop

## Goals / Non-Goals

**Goals:**
- Deliver a pixel-perfect, modern e-commerce storefront with full browse-to-checkout flow
- Deliver a complete admin panel with dashboard, product/order/customer management
- All interactions feel real (loading states, optimistic updates, toast notifications)
- Dark/light theme with smooth transitions
- Responsive design at every breakpoint
- Easy to extend with real APIs later (clean data layer abstraction)

**Non-Goals:**
- Real payment processing or backend integration
- SEO optimization (this is a demo, not a production store)
- Multi-language/i18n support
- Real authentication or security (simulated only)
- Email notifications or real-time features
- Accessibility audit (basic a11y via shadcn, but no formal audit)

## Decisions

### 1. Framework: Next.js 15 (App Router) + TypeScript
**Why:** Industry standard, file-based routing simplifies the large route structure, App Router gives us layouts for storefront vs. admin shells. Static export for easy deployment.
**Alternatives:** Vite + React Router (lighter but loses layout nesting), Remix (less ecosystem support for shadcn).

### 2. UI: Tailwind CSS 4 + shadcn/ui
**Why:** shadcn/ui provides beautiful, accessible components out of the box. We own the code (copy-paste model), so full customization. Tailwind enables rapid, consistent styling.
**Alternatives:** Material UI (heavier, harder to customize), Ant Design (enterprise look, less modern).

### 3. State Management: Zustand stores + mock data layer
**Why:** Lightweight, no boilerplate. We'll create domain stores (cartStore, productStore, orderStore, userStore) that read from a mock data module. The mock data layer simulates async API calls with configurable delay.
**Alternatives:** Redux Toolkit (overkill for client-only state), React Context (doesn't scale well for this many domains).

### 4. Mock Data Architecture
```
/lib/mock-data/        — Static JSON-like data (products, users, orders)
/lib/mock-api/         — Async functions that simulate API calls with delays
/stores/               — Zustand stores consuming mock-api functions
```
**Why:** Clean separation means swapping mock-api for real API calls later is a single-layer change. Simulated delays (300-800ms) make the demo feel authentic.

### 5. Routing Structure
```
/(storefront)/                — Storefront layout (header, footer, nav)
  /                           — Homepage (hero, featured, categories)
  /products                   — Product catalog with filters
  /products/[id]              — Product detail
  /cart                       — Cart page
  /checkout                   — Multi-step checkout
  /account                    — User profile, orders, wishlist
  /account/login              — Login page
  /account/register           — Register page

/admin/                       — Admin layout (sidebar, topbar)
  /admin                      — Dashboard overview
  /admin/products             — Product management table
  /admin/products/[id]        — Product edit form
  /admin/products/new         — New product form
  /admin/orders               — Order management
  /admin/orders/[id]          — Order detail
  /admin/customers            — Customer list
  /admin/customers/[id]       — Customer detail
  /admin/settings             — Store settings
```

### 6. Animation: Framer Motion
**Why:** Production-quality page transitions, layout animations, and micro-interactions. Integrates seamlessly with React.
**Scope:** Page transitions, cart drawer slide, product image gallery, hover effects, loading skeletons.

### 7. Charts: Recharts
**Why:** Lightweight, composable, works well with shadcn styling. Used in admin dashboard for sales charts, order trends, revenue graphs.

### 8. Theming: CSS variables + next-themes
**Why:** shadcn/ui already uses CSS variable theming. next-themes handles system preference detection and persistence. We'll define a custom color palette that looks premium.

### 9. Notifications System
**Approach:** A centralized notification store (Zustand) that components can push to. Two surfaces:
- **Toasts** (sonner via shadcn): Transient success/error/info messages for actions (add to cart, order placed, product saved)
- **Notification bell** (header): Persistent activity feed showing simulated events (new orders, low stock alerts, customer signups). Uses mock data with timestamps. Badge shows unread count.

### 10. Advanced Product Features
- **Quick View Modal**: Clicking a "quick view" eye icon on product cards opens a modal with key product info and add-to-cart — avoids full page navigation
- **Recently Viewed**: Stored in localStorage, shown as a horizontal scroll section on the homepage and product pages (last 8 products)
- **Product Comparison**: Users can add up to 4 products to a comparison tray (floating bar at bottom). Comparison page shows side-by-side specs table
- **Size Guide**: Modal triggered from product detail page showing a size chart table (mock data per category)

### 11. Marketing / Content Pages
Static-ish pages that round out the demo and make it feel like a complete store:
- **Homepage hero**: Already planned, but add seasonal banners and value proposition section
- **About Us**: Company story, team section with avatar grid, mission/values
- **Contact**: Contact form (simulated submit), store locations map placeholder, business hours
- **FAQ**: Accordion-style FAQ with mock questions/answers
- **Blog**: Grid of mock articles with featured image, title, excerpt, date. Article detail page with rich content layout

All marketing pages use the storefront shell layout.

## Risks / Trade-offs

- **Large initial bundle** → Mitigate with Next.js code splitting (each route lazy-loaded), dynamic imports for heavy components (charts, image galleries)
- **Mock data feels fake** → Use realistic product names, prices, images (Unsplash placeholders), varied order statuses, and realistic timestamps
- **State resets on refresh** → Use localStorage persistence in Zustand stores so cart/auth survives page refresh
- **Admin panel scope creep** → Keep to core CRUD views; avoid building a full CMS. Settings page is display-only
- **No real image upload** → Simulate with file picker that shows preview but stores a placeholder URL
