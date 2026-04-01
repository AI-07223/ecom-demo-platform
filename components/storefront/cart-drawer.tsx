'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    promoCode,
    discount,
  } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotal()
  const discountAmount = subtotal * discount

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {items.length > 0 && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">({items.length} items)</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
            </div>
            <SheetClose asChild>
              <Button asChild className="mt-2">
                <Link href="/products">Browse Products</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-4">
                  {/* Image */}
                  <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-medium leading-snug hover:text-primary transition-colors line-clamp-2"
                      onClick={closeDrawer}
                    >
                      {item.product.name}
                    </Link>
                    {Object.entries(item.selectedVariants).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primary mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-1 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-border px-6 py-4 space-y-2 bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount ({promoCode})</span>
                  <span className="text-green-600">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <SheetClose asChild>
                  <Button asChild className="w-full gap-2">
                    <Link href="/checkout">
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/cart">View Full Cart</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
