import type {
  Product,
  Order,
  OrderStatus,
  Customer,
  CartItem,
  ShippingAddress,
} from "@/types"
import {
  PRODUCTS,
  ORDERS,
  CUSTOMERS,
} from "@/lib/mock-data"

// ── Mutable in-memory copies ──────────────────────────────────────────────────
export let products: Product[] = [...PRODUCTS]
export let orders: Order[] = [...ORDERS]
export let customers: Customer[] = [...CUSTOMERS]

// ── Helpers ───────────────────────────────────────────────────────────────────
const delay = () => new Promise<void>((r) => setTimeout(r, 300 + Math.random() * 500))

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const seq = Math.floor(1000 + Math.random() * 9000)
  return `ORD-${year}-${seq}`
}

// ── Products ──────────────────────────────────────────────────────────────────
export async function fetchProducts(
  filters?: { category?: string; search?: string; sort?: string }
): Promise<Product[]> {
  await delay()

  let result = [...products]

  if (filters?.category) {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  if (filters?.sort) {
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }
  }

  return result
}

export async function fetchProduct(id: string): Promise<Product | null> {
  await delay()
  return products.find((p) => p.id === id || p.slug === id) ?? null
}

export async function fetchRelatedProducts(
  productId: string,
  category: string
): Promise<Product[]> {
  await delay()
  return products
    .filter((p) => p.category === category && p.id !== productId && p.status === "active")
    .slice(0, 4)
}

// ── Orders ────────────────────────────────────────────────────────────────────
export async function fetchOrders(
  filters?: { status?: string; search?: string }
): Promise<Order[]> {
  await delay()

  let result = [...orders]

  if (filters?.status) {
    result = result.filter((o) => o.status === filters.status)
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    )
  }

  return result
}

export async function fetchOrder(id: string): Promise<Order | null> {
  await delay()
  return orders.find((o) => o.id === id || o.orderNumber === id) ?? null
}

export async function fetchCustomerOrders(customerId: string): Promise<Order[]> {
  await delay()
  return orders.filter((o) => o.customerId === customerId)
}

export async function createOrder(
  data: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<Order> {
  await delay()

  const now = new Date().toISOString()
  const newOrder: Order = {
    ...data,
    id: generateId("order"),
    orderNumber: generateOrderNumber(),
    createdAt: now,
    updatedAt: now,
  }

  orders = [newOrder, ...orders]
  return newOrder
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Promise<Order> {
  await delay()

  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) throw new Error(`Order not found: ${id}`)

  const now = new Date().toISOString()
  const updated: Order = {
    ...orders[idx],
    status,
    updatedAt: now,
    timeline: [
      ...orders[idx].timeline,
      { status, date: now, ...(note ? { note } : {}) },
    ],
  }

  orders = orders.map((o) => (o.id === id ? updated : o))
  return updated
}

// ── Customers ─────────────────────────────────────────────────────────────────
export async function fetchCustomers(
  filters?: { search?: string }
): Promise<Customer[]> {
  await delay()

  let result = [...customers]

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }

  return result
}

export async function fetchCustomer(id: string): Promise<Customer | null> {
  await delay()
  return customers.find((c) => c.id === id) ?? null
}

// ── Admin: Product CRUD ───────────────────────────────────────────────────────
export async function adminCreateProduct(
  data: Omit<Product, "id" | "createdAt" | "reviews" | "rating" | "reviewCount">
): Promise<Product> {
  await delay()

  const newProduct: Product = {
    ...data,
    id: generateId("prod"),
    createdAt: new Date().toISOString(),
    reviews: [],
    rating: 0,
    reviewCount: 0,
  }

  products = [newProduct, ...products]
  return newProduct
}

export async function adminUpdateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  await delay()

  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error(`Product not found: ${id}`)

  const updated: Product = { ...products[idx], ...data }
  products = products.map((p) => (p.id === id ? updated : p))
  return updated
}

export async function adminDeleteProduct(id: string): Promise<void> {
  await delay()
  products = products.filter((p) => p.id !== id)
}

export async function adminBulkDeleteProducts(ids: string[]): Promise<void> {
  await delay()
  const set = new Set(ids)
  products = products.filter((p) => !set.has(p.id))
}

export async function adminBulkUpdateProductStatus(
  ids: string[],
  status: "active" | "draft"
): Promise<void> {
  await delay()
  const set = new Set(ids)
  products = products.map((p) => (set.has(p.id) ? { ...p, status } : p))
}

// ── Utilities re-exported for reset ──────────────────────────────────────────
export function _resetProducts() {
  products = [...PRODUCTS]
}
export function _resetOrders() {
  orders = [...ORDERS]
}
export function _resetCustomers() {
  customers = [...CUSTOMERS]
}

// ── Convenience: build an Order from cart items (used by orderStore) ──────────
export async function placeOrderFromCart(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress,
  customerId: string,
  customerName: string,
  customerEmail: string,
  promoCode?: string,
  discount?: number
): Promise<Order> {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const discountAmount = discount ? subtotal * discount : 0
  const discountedSubtotal = subtotal - discountAmount
  const shipping = discountedSubtotal >= 100 ? 0 : 9.99
  const tax = discountedSubtotal * 0.085
  const total = discountedSubtotal + shipping + tax

  const now = new Date().toISOString()
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const data: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt"> = {
    customerId,
    customerName,
    customerEmail,
    items: cartItems.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0] ?? "",
      quantity: item.quantity,
      price: item.product.price,
      selectedVariants: item.selectedVariants,
    })),
    shippingAddress,
    subtotal,
    shipping,
    tax,
    total,
    discount: discountAmount,
    promoCode,
    status: "pending",
    paymentStatus: "paid",
    timeline: [{ status: "pending", date: now, note: "Order placed successfully" }],
    estimatedDelivery,
  }

  return createOrder(data)
}
