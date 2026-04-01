import { create } from "zustand"
import type { Customer } from "@/types"
import {
  fetchCustomers as apiFetchCustomers,
  fetchCustomer as apiFetchCustomer,
} from "@/lib/mock-api"

interface CustomerStore {
  customers: Customer[]
  loading: boolean

  fetchCustomers: (filters?: { search?: string }) => Promise<void>
  fetchCustomer: (id: string) => Promise<Customer | null>
}

export const useCustomerStore = create<CustomerStore>()((set) => ({
  customers: [],
  loading: false,

  fetchCustomers: async (filters) => {
    set({ loading: true })
    try {
      const customers = await apiFetchCustomers(filters)
      set({ customers, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchCustomer: async (id) => {
    try {
      return await apiFetchCustomer(id)
    } catch {
      return null
    }
  },
}))
