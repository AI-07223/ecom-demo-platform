import { _resetProducts, _resetOrders, _resetCustomers } from "@/lib/mock-api"

/**
 * Restores all mutable in-memory data arrays in the mock API back to their
 * original seed data from lib/mock-data. Useful in tests or dev tooling.
 */
export function resetAllMockData(): void {
  _resetProducts()
  _resetOrders()
  _resetCustomers()
}
