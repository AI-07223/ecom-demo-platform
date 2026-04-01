'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useOrderStore } from '@/stores/orderStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const PAYMENT_COLORS = {
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

const STATUS_TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PAGE_SIZE = 10

export default function OrdersPage() {
  const { orders, loading, fetchOrders } = useOrderStore()
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusTab === 'all' || o.status === statusTab
      return matchSearch && matchStatus
    })
  }, [orders, search, statusTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length }
    for (const o of orders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1
    }
    return counts
  }, [orders])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} orders</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search order # or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="overflow-x-auto pb-1">
        <Tabs value={statusTab} onValueChange={(v) => { setStatusTab(v); setPage(1) }}>
          <TabsList className="h-9 gap-1">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3">
                {tab.label}
                {statusCounts[tab.value] !== undefined && (
                  <span className="ml-1.5 text-muted-foreground">
                    ({statusCounts[tab.value] ?? 0})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Order #</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Customer</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden lg:table-cell">Items</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Total</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Payment</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Status</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-20" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : paginated.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-5 py-3 font-mono text-xs font-semibold">{order.orderNumber}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                            PAYMENT_COLORS[order.paymentStatus]
                          )}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                            STATUS_COLORS[order.status]
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-sm">No orders found</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium">{page} / {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
