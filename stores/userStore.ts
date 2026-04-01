import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@/types"

interface UserStore {
  user: User | null
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<void>
  loginAsAdmin: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<Pick<User, "name" | "email">>) => void
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

function buildMockUser(name: string, email: string): User {
  const seed = email.replace(/[^a-z0-9]/gi, "")
  return {
    id: `user-${Date.now()}`,
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
    role: "customer",
    wishlist: [],
    addresses: [],
    createdAt: new Date().toISOString(),
  }
}

// Simulate async auth delay
const authDelay = () => new Promise<void>((r) => setTimeout(r, 400 + Math.random() * 400))

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      loginAsAdmin: () => {
        const adminUser: User = {
          id: "admin-demo",
          name: "Admin Demo",
          email: "admin@luxe-demo.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdminDemo",
          role: "admin",
          wishlist: [],
          addresses: [],
          createdAt: new Date().toISOString(),
        }
        set({ user: adminUser, isAuthenticated: true })
      },

      login: async (email, password) => {
        if (!email.trim() || !password.trim()) {
          throw new Error("Email and password are required")
        }
        await authDelay()
        const existing = get().user
        // Re-use existing user if same email, otherwise create a fresh demo user
        const user =
          existing && existing.email === email
            ? existing
            : buildMockUser(email.split("@")[0].replace(/[._]/g, " "), email)
        set({ user, isAuthenticated: true })
      },

      register: async (name, email, password) => {
        if (!name.trim() || !email.trim() || !password.trim()) {
          throw new Error("All fields are required")
        }
        await authDelay()
        const user = buildMockUser(name, email)
        set({ user, isAuthenticated: true })
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state
          return { user: { ...state.user, ...data } }
        })
      },

      addToWishlist: (productId) => {
        set((state) => {
          if (!state.user) return state
          if (state.user.wishlist.includes(productId)) return state
          return { user: { ...state.user, wishlist: [...state.user.wishlist, productId] } }
        })
      },

      removeFromWishlist: (productId) => {
        set((state) => {
          if (!state.user) return state
          return {
            user: {
              ...state.user,
              wishlist: state.user.wishlist.filter((id) => id !== productId),
            },
          }
        })
      },

      isInWishlist: (productId) => {
        return get().user?.wishlist.includes(productId) ?? false
      },
    }),
    {
      name: "ecom-user-store",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as Storage))),
    }
  )
)
