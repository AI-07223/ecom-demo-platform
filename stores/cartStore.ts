import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { CartItem, Product } from "@/types"

const PROMO_CODES: Record<string, number> = {
  DEMO10: 0.1,
  SAVE20: 0.2,
}

const SHIPPING_THRESHOLD = 100
const SHIPPING_FLAT = 9.99
const TAX_RATE = 0.085

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  promoCode: string | null
  discount: number

  addItem: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
  clearCart: () => void
  toggleDrawer: () => void
  openDrawer: () => void
  closeDrawer: () => void

  getSubtotal: () => number
  getShipping: () => number
  getTax: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      discount: 0,

      addItem: (product, quantity, selectedVariants) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.productId === product.id &&
              JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
          )

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id &&
                JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          const newItem: CartItem = {
            productId: product.id,
            product,
            quantity,
            selectedVariants,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }))
      },

      applyPromoCode: (code) => {
        const rate = PROMO_CODES[code.toUpperCase()]
        if (rate !== undefined) {
          set({ promoCode: code.toUpperCase(), discount: rate })
          return true
        }
        return false
      },

      removePromoCode: () => set({ promoCode: null, discount: 0 }),

      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      openDrawer: () => set({ isOpen: true }),

      closeDrawer: () => set({ isOpen: false }),

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },

      getShipping: () => {
        const { discount } = get()
        const subtotal = get().getSubtotal()
        const discounted = subtotal - subtotal * discount
        return discounted >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
      },

      getTax: () => {
        const { discount } = get()
        const subtotal = get().getSubtotal()
        const discounted = subtotal - subtotal * discount
        return discounted * TAX_RATE
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const { discount } = get()
        const discounted = subtotal - subtotal * discount
        return discounted + get().getShipping() + get().getTax()
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: "ecom-cart-store",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as Storage))),
      // Persist cart items and promo but not drawer open state
      partialize: (state) =>
        ({
          items: state.items,
          promoCode: state.promoCode,
          discount: state.discount,
        }) as CartStore,
    }
  )
)
