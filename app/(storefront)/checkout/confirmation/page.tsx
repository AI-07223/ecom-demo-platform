'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react'
import { useOrderStore } from '@/stores/orderStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate } from '@/lib/utils'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')
  const { orders } = useOrderStore()
  const order = orders.find((o) => o.id === orderId)

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="container mx-auto px-4 py-16 max-w-2xl text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="rounded-full bg-green-100 dark:bg-green-950/30 p-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h1 className="text-3xl font-black mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-1">
          Thank you for your purchase.
        </p>
        <p className="text-muted-foreground">
          We&apos;ve sent a confirmation to {order?.customerEmail ?? 'your email'}.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-2xl border border-border bg-card p-6 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Order number</p>
            <p className="text-xl font-black text-primary">{orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Estimated delivery</p>
            <p className="font-semibold flex items-center gap-1 justify-end">
              <Truck className="h-4 w-4 text-primary" />
              {formatDate(estimatedDelivery.toISOString())}
            </p>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Timeline */}
        <div className="space-y-3">
          {[
            { icon: CheckCircle, label: 'Order placed', sub: 'Your order has been received', active: true },
            { icon: Package, label: 'Processing', sub: 'Preparing your items for shipment', active: true },
            { icon: Truck, label: 'Shipped', sub: 'On its way to you', active: false },
            { icon: Home, label: 'Delivered', sub: 'Estimated ' + formatDate(estimatedDelivery.toISOString()), active: false },
          ].map(({ icon: Icon, label, sub, active }) => (
            <div key={label} className="flex items-start gap-3">
              <div className={`mt-0.5 rounded-full p-1 ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {order && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Order Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 mt-8 justify-center"
      >
        <Button asChild size="lg" className="gap-2">
          <Link href="/account">
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2">
          <Link href="/products">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
