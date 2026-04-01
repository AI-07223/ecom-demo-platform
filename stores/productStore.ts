import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Product } from "@/types"
import { fetchProducts as apiFetchProducts } from "@/lib/mock-api"

const MAX_RECENTLY_VIEWED = 8
const MAX_COMPARE = 4

interface ProductStore {
  products: Product[]
  loading: boolean
  error: string | null
  recentlyViewed: Product[]
  compareList: Product[]

  fetchProducts: (filters?: { category?: string; search?: string; sort?: string }) => Promise<void>
  addToRecentlyViewed: (product: Product) => void
  addToCompare: (product: Product) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      recentlyViewed: [],
      compareList: [],

      fetchProducts: async (filters) => {
        set({ loading: true, error: null })
        try {
          const products = await apiFetchProducts(filters)
          set({ products, loading: false })
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : "Failed to fetch products",
          })
        }
      },

      addToRecentlyViewed: (product) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((p) => p.id !== product.id)
          const next = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
          return { recentlyViewed: next }
        })
      },

      addToCompare: (product) => {
        set((state) => {
          if (state.compareList.some((p) => p.id === product.id)) return state
          if (state.compareList.length >= MAX_COMPARE) return state
          return { compareList: [...state.compareList, product] }
        })
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          compareList: state.compareList.filter((p) => p.id !== productId),
        }))
      },

      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: "ecom-product-store",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as Storage))),
      // Only persist recentlyViewed and compareList; products are fetched fresh
      partialize: (state) =>
        ({
          recentlyViewed: state.recentlyViewed,
          compareList: state.compareList,
        }) as ProductStore,
    }
  )
)
