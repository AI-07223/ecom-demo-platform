// ── Product ──────────────────────────────────────────────────────────────────
export interface ProductVariant {
  type: "size" | "color"
  label: string
  values: string[]
}

export interface ProductReview {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
  verified: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  price: number
  compareAtPrice?: number
  category: ProductCategory
  images: string[]
  rating: number
  reviewCount: number
  reviews: ProductReview[]
  variants: ProductVariant[]
  stock: number
  status: "active" | "draft"
  tags: string[]
  createdAt: string
}

export type ProductCategory = "Electronics" | "Clothing" | "Home & Living" | "Sports" | "Accessories"

// ── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string
  product: Product
  quantity: number
  selectedVariants: Record<string, string>
}

// ── Order ─────────────────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "paid" | "unpaid" | "refunded"

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  selectedVariants: Record<string, string>
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
}

export interface OrderTimeline {
  status: OrderStatus
  date: string
  note?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shipping: number
  tax: number
  total: number
  discount: number
  promoCode?: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  timeline: OrderTimeline[]
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
}

// ── Customer / User ────────────────────────────────────────────────────────────
export interface Address {
  id: string
  label: string
  fullName: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  addresses: Address[]
  totalOrders: number
  totalSpent: number
  joinDate: string
  lastOrderDate?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "customer" | "admin"
  wishlist: string[]
  addresses: Address[]
  createdAt: string
}

// ── Notification ──────────────────────────────────────────────────────────────
export type NotificationType = "success" | "warning" | "info" | "error"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export interface BlogAuthor {
  name: string
  avatar: string
  role: string
}

export interface BlogArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage: string
  author: BlogAuthor
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
export interface FaqItem {
  id: string
  question: string
  answer: string
  category: "Shipping" | "Returns" | "Payments" | "Account"
}

// ── Team ──────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
  social?: { twitter?: string; linkedin?: string }
}
