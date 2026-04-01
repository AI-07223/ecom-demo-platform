'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Minus, Plus, Trash2, Tag, ArrowRight, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    promoCode,
    discount,
    applyPromoCode,
    removePromoCode,
  } = useCartStore()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotal()
  const discountAmount = subtotal * discount

  const handlePromo = () => {
    if (!promoInput.trim()) return
    const success = applyPromoCode(promoInput)
    if (success) {
      toast.success(`Promo code applied: ${promoInput.toUpperCase()}`)
      setPromoInput('')
      setPromoError('')
    } else {
      setPromoError('Invalid promo code. Try DEMO10 or SAVE20.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" className="gap-1.5 mb-6 -ml-2" asChild>
        <Link href="/products">
          <ChevronLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <div className="rounded-full bg-muted p-8 mb-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Looks like you haven&apos;t added anything to your cart yet. Browse our products to get started.
          </p>
          <Button size="lg" asChild>
            <Link href="/products" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 p-4 rounded-xl border border-border bg-card"
              >
                <Link href={`/products/${item.productId}`} className="h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover hover:scale-105 transition-transform"
                    />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Badge variant="secondary" className="text-xs mb-1">{item.product.category}</Badge>
                      <Link href={`/products/${item.productId}`} className="block font-semibold hover:text-primary transition-colors line-clamp-2 text-sm md:text-base">
                        {item.product.name}
                      </Link>
                      {Object.entries(item.selectedVariants).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-5">Order Summary</h2>

              {/* Promo code */}
              <div className="mb-5">
                <p className="text-sm font-medium mb-2">Promo Code</p>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-mono font-bold text-green-700 dark:text-green-400">{promoCode}</span>
                      <Badge variant="secondary" className="text-xs">-{Math.round(discount * 100)}%</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={removePromoCode}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code (try DEMO10)"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }}
                      onKeyDown={(e) => e.key === 'Enter' && handlePromo()}
                      className={promoError ? 'border-destructive' : ''}
                    />
                    <Button variant="outline" onClick={handlePromo}>Apply</Button>
                  </div>
                )}
                {promoError && <p className="text-xs text-destructive mt-1">{promoError}</p>}
              </div>

              <Separator className="mb-4" />

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({promoCode})</span>
                    <span className="text-green-600 font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8.5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {subtotal < 100 && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mt-1">
                    Add {formatPrice(100 - subtotal + discountAmount)} more for free shipping
                  </p>
                )}
              </div>

              <Separator className="mb-4" />

              <div className="flex justify-between font-bold text-lg mb-5">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <Button size="lg" className="w-full gap-2 text-base" asChild>
                <Link href="/checkout">
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
