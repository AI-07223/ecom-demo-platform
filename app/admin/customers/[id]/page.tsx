'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { fetchCustomer, fetchCustomerOrders } from '@/lib/mock-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { Customer, Order, OrderStatus } from '@/types'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchCustomer(id), fetchCustomerOrders(id)]).then(([c, o]) => {
      if (!c) {
        toast.error('Customer not found')
        router.push('/admin/customers')
        return
      }
      setCustomer(c)
      setOrders(o)
      setLoading(false)
    })
  }, [id, router])

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!customer) return null

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
  const lastOrderDate = orders.length > 0
    ? [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt
    : null

  const stats = [
    { label: 'Total Orders', value: orders.length.toString() },
    { label: 'Total Spent', value: formatPrice(totalRevenue) },
    { label: 'Avg Order Value', value: formatPrice(avgOrderValue) },
    { label: 'Last Order', value: lastOrderDate ? formatDate(lastOrderDate) : 'Never' },
  ]

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Customer Profile</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback className="text-lg">
                {customer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{customer.name}</h2>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
              {customer.phone && (
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Customer since {formatDate(customer.joinDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Order #</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Items</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Total</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Status</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-5 py-3 font-mono text-xs font-semibold">{order.orderNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
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
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
