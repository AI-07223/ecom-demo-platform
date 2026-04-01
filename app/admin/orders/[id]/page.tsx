'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { fetchOrder } from '@/lib/mock-api'
import { useOrderStore } from '@/stores/orderStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

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

const TIMELINE_ICONS: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { updateOrderStatus } = useOrderStore()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrder(id).then((o) => {
      if (o) {
        setOrder(o)
        setNewStatus(o.status)
      } else {
        toast.error('Order not found')
        router.push('/admin/orders')
      }
      setLoading(false)
    })
  }, [id, router])

  const handleUpdateStatus = async () => {
    if (!order) return
    setUpdating(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      // Re-fetch to get the latest timeline
      const updated = await fetchOrder(order.id)
      if (updated) setOrder(updated)
      toast.success('Order status updated')
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!order) return null

  const variantString = (variants: Record<string, string>) =>
    Object.entries(variants).map(([k, v]) => `${k}: ${v}`).join(', ')

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold">{order.orderNumber}</h1>
          <span className={cn(
            'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
            STATUS_COLORS[order.status]
          )}>
            {order.status}
          </span>
          <span className={cn(
            'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
            PAYMENT_COLORS[order.paymentStatus]
          )}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
            {order.shippingAddress.phone && (
              <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
            )}
            <div className="pt-1">
              <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                <Link href={`/admin/customers/${order.customerId}`}>
                  View Customer
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5 text-sm">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-muted-foreground">{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && (
              <p className="text-muted-foreground">{order.shippingAddress.address2}</p>
            )}
            <p className="text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p className="text-muted-foreground">{order.shippingAddress.country}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Product</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Variants</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Qty</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Price</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                          {item.productImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                      {Object.keys(item.selectedVariants).length > 0
                        ? variantString(item.selectedVariants)
                        : '—'}
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{formatPrice(item.price)}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="px-5 py-4 border-t border-border">
            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.promoCode && `(${order.promoCode})`}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Update */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              onClick={handleUpdateStatus}
              disabled={updating || newStatus === order.status}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Current: <span className="capitalize font-medium">{order.status}</span>
            </p>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l border-border pl-6">
              {[...order.timeline].reverse().map((event, i) => {
                const Icon = TIMELINE_ICONS[event.status]
                return (
                  <li key={i} className="relative">
                    <span className="absolute -left-[1.65rem] flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <p className="text-sm font-semibold capitalize">{event.status}</p>
                    {event.note && (
                      <p className="text-xs text-muted-foreground">{event.note}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(event.date)}</p>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
