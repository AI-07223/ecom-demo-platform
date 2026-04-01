'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  Eye,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { useOrderStore } from '@/stores/orderStore'
import { useCustomerStore } from '@/stores/customerStore'
import { useProductStore } from '@/stores/productStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

type Period = '7d' | '30d' | '12m'

function generateRevenueData(orders: Order[], period: Period) {
  const now = new Date()
  const data: { label: string; revenue: number }[] = []

  if (period === '7d') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('en-US', { weekday: 'short' })
      const dayStr = d.toISOString().split('T')[0]
      const revenue = orders
        .filter(
          (o) =>
            o.status === 'delivered' &&
            o.createdAt.startsWith(dayStr)
        )
        .reduce((sum, o) => sum + o.total, 0)
      data.push({ label, revenue: revenue || Math.random() * 800 + 200 })
    }
  } else if (period === '30d') {
    for (let i = 29; i >= 0; i -= 3) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      data.push({ label, revenue: Math.random() * 2000 + 500 })
    }
  } else {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now)
      d.setMonth(d.getMonth() - i)
      const monthIdx = d.getMonth()
      const revenue = orders
        .filter(
          (o) =>
            o.status === 'delivered' &&
            new Date(o.createdAt).getMonth() === monthIdx &&
            new Date(o.createdAt).getFullYear() === d.getFullYear()
        )
        .reduce((sum, o) => sum + o.total, 0)
      data.push({ label: months[monthIdx], revenue: revenue || Math.random() * 5000 + 1000 })
    }
  }

  return data
}

interface TooltipPayload {
  value?: number
}
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        {formatPrice(payload[0].value ?? 0)}
      </p>
    </div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.3 } }),
}

export default function AdminDashboard() {
  const { orders, loading: ordersLoading, fetchOrders } = useOrderStore()
  const { customers, loading: customersLoading, fetchCustomers } = useCustomerStore()
  const { products, loading: productsLoading, fetchProducts } = useProductStore()
  const [period, setPeriod] = useState<Period>('30d')

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
    fetchProducts()
  }, [fetchOrders, fetchCustomers, fetchProducts])

  const loading = ordersLoading || customersLoading || productsLoading

  const deliveredOrders = orders.filter((o) => o.status === 'delivered')
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
  const revenueData = generateRevenueData(orders, period)

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Top products by mock revenue
  const topProducts = [...products]
    .map((p) => {
      const unitsSold = Math.floor(Math.random() * 50 + 5)
      return { ...p, unitsSold, productRevenue: p.price * unitsSold }
    })
    .sort((a, b) => b.productRevenue - a.productRevenue)
    .slice(0, 5)

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      change: '+12%',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      change: '+8%',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Total Customers',
      value: customers.length.toString(),
      change: '+5%',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      label: 'Avg Order Value',
      value: formatPrice(avgOrderValue),
      change: '+3%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardContent className="p-5">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                          <span className="text-xs text-muted-foreground">vs last period</span>
                        </div>
                      </div>
                      <div className={cn('p-2.5 rounded-xl', stat.bg)}>
                        <Icon className={cn('h-5 w-5', stat.color)} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList className="h-8">
                <TabsTrigger value="7d" className="text-xs px-2.5 h-6">7d</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-2.5 h-6">30d</TabsTrigger>
                <TabsTrigger value="12m" className="text-xs px-2.5 h-6">12m</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Recent Orders */}
        <motion.div
          className="xl:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="/admin/orders">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Order</th>
                      <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Customer</th>
                      <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Date</th>
                      <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Amount</th>
                      <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-border">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <td key={j} className="px-4 py-3">
                                <Skeleton className="h-4 w-20" />
                              </td>
                            ))}
                          </tr>
                        ))
                      : recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-3 font-mono text-xs font-medium">{order.orderNumber}</td>
                            <td className="px-4 py-3 hidden sm:table-cell">{order.customerName}</td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{formatDate(order.createdAt)}</td>
                            <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                            <td className="px-4 py-3">
                              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_COLORS[order.status])}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Eye className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          className="xl:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Top Products</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="/admin/products">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))
                : topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                        {index + 1}
                      </span>
                      <div className="h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0">
                        {product.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">{formatPrice(product.productRevenue)}</p>
                        <p className="text-xs text-muted-foreground">{product.unitsSold} sold</p>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
