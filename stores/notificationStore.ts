import { create } from "zustand"
import type { AppNotification, NotificationType } from "@/types"
import { INITIAL_NOTIFICATIONS } from "@/lib/mock-data"

// Simulation templates for randomly generated notifications
interface SimTemplate {
  type: NotificationType
  title: string
  message: () => string
  link?: string
}

const SIM_TEMPLATES: SimTemplate[] = [
  {
    type: "success",
    title: "New Order Received",
    message: () => {
      const names = ["Alex Turner", "Maria Santos", "Kenji Watanabe", "Fatima Al-Hassan"]
      const total = (80 + Math.random() * 400).toFixed(2)
      const name = names[Math.floor(Math.random() * names.length)]
      const seq = Math.floor(400 + Math.random() * 200)
      return `Order #ORD-2026-0${seq} placed by ${name} for $${total}.`
    },
    link: "/orders",
  },
  {
    type: "warning",
    title: "Low Stock Alert",
    message: () => {
      const products = [
        "Wireless Charging Pad",
        "Merino Wool Scarf",
        "Bamboo Cutting Board Set",
        "Running Performance Tee",
      ]
      const units = Math.floor(10 + Math.random() * 40)
      const prod = products[Math.floor(Math.random() * products.length)]
      return `${prod} has only ${units} units remaining. Consider reordering.`
    },
    link: "/products",
  },
  {
    type: "info",
    title: "New Customer Sign-Up",
    message: () => {
      const names = ["Chris Park", "Isabelle Moreau", "Omar Khalid", "Yuki Tanaka"]
      const name = names[Math.floor(Math.random() * names.length)]
      return `${name} created a new account. Welcome email sent.`
    },
    link: "/customers",
  },
  {
    type: "success",
    title: "Order Delivered",
    message: () => {
      const names = ["Diana Prince", "Sam Wilson", "Lena Kovacs", "Jin-ho Baek"]
      const name = names[Math.floor(Math.random() * names.length)]
      const seq = Math.floor(400 + Math.random() * 200)
      return `Order #ORD-2026-0${seq} for ${name} has been delivered. Confirmed by carrier.`
    },
    link: "/orders",
  },
]

function generateId(): string {
  return `notif-sim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

interface NotificationStore {
  notifications: AppNotification[]
  _simulationTimer: ReturnType<typeof setTimeout> | null

  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void
  markAllRead: () => void
  markRead: (id: string) => void
  clearAll: () => void
  getUnreadCount: () => number

  startSimulation: () => void
  stopSimulation: () => void
}

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [...INITIAL_NOTIFICATIONS],
  _simulationTimer: null,

  addNotification: (n) => {
    const notification: AppNotification = {
      ...n,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    }
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }))
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }))
  },

  markRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  clearAll: () => set({ notifications: [] }),

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length
  },

  startSimulation: () => {
    // Avoid double-starting
    const existing = get()._simulationTimer
    if (existing !== null) return

    function scheduleNext() {
      // 30–60 seconds between notifications
      const ms = 30_000 + Math.random() * 30_000
      const timer = setTimeout(() => {
        const template = SIM_TEMPLATES[Math.floor(Math.random() * SIM_TEMPLATES.length)]
        get().addNotification({
          type: template.type,
          title: template.title,
          message: template.message(),
          link: template.link,
        })
        // Schedule the next one and update the timer reference
        scheduleNext()
      }, ms)

      set({ _simulationTimer: timer })
    }

    scheduleNext()
  },

  stopSimulation: () => {
    const timer = get()._simulationTimer
    if (timer !== null) {
      clearTimeout(timer)
      set({ _simulationTimer: null })
    }
  },
}))
