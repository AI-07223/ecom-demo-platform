import { create } from "zustand"
import type { Order, OrderStatus, CartItem, ShippingAddress } from "@/types"
import {
  fetchOrders as apiFetchOrders,
  fetchCustomerOrders as apiFetchCustomerOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  placeOrderFromCart,
} from "@/lib/mock-api"
import { useUserStore } from "@/stores/userStore"

interface OrderStore {
  orders: Order[]
  loading: boolean

  fetchOrders: (filters?: { status?: string; search?: string }) => Promise<void>
  fetchCustomerOrders: (customerId: string) => Promise<void>
  placeOrder: (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    promoCode?: string,
    discount?: number
  ) => Promise<Order>
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => Promise<void>
}

export const useOrderStore = create<OrderStore>()((set) => ({
  orders: [],
  loading: false,

  fetchOrders: async (filters) => {
    set({ loading: true })
    try {
      const orders = await apiFetchOrders(filters)
      set({ orders, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchCustomerOrders: async (customerId) => {
    set({ loading: true })
    try {
      const orders = await apiFetchCustomerOrders(customerId)
      set({ orders, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  placeOrder: async (cartItems, shippingAddress, promoCode, discount) => {
    const userState = useUserStore.getState()
    const user = userState.user

    const customerId = user?.id ?? "guest"
    const customerName = user?.name ?? shippingAddress.fullName
    const customerEmail = user?.email ?? shippingAddress.email

    const order = await placeOrderFromCart(
      cartItems,
      shippingAddress,
      customerId,
      customerName,
      customerEmail,
      promoCode,
      discount
    )

    set((state) => ({ orders: [order, ...state.orders] }))
    return order
  },

  updateOrderStatus: async (id, status, note) => {
    const updated = await apiUpdateOrderStatus(id, status, note)
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? updated : o)),
    }))
  },
}))
