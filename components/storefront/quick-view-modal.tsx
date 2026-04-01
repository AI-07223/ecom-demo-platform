'use client'

import { useState } from 'react'
import { Star, ShoppingCart, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  )
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const { addItem, openDrawer } = useCartStore()

  if (!product) return null

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariants)
    toast.success(`${product.name} added to cart`)
    openDrawer()
    onClose()
  }

  const isOutOfStock = product.stock === 0

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square sm:aspect-auto bg-muted">
            {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
            {product.compareAtPrice && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh] sm:max-h-none">
            <DialogHeader>
              <Badge variant="secondary" className="w-fit text-xs">{product.category}</Badge>
              <DialogTitle className="text-xl font-bold leading-snug mt-1">{product.name}</DialogTitle>
            </DialogHeader>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants.map((variant) => (
              <div key={variant.type}>
                <p className="text-sm font-medium mb-2">{variant.label}</p>
                <div className="flex flex-wrap gap-2">
                  {variant.values.map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.label]: val }))}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                        selectedVariants[variant.label] === val
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/60'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <span className="text-lg leading-none">-</span>
                </Button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <Button variant="outline" size="icon" className="h-9 w-9"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <span className="text-lg leading-none">+</span>
                </Button>
              </div>
            </div>

            {/* Stock */}
            <Badge variant={isOutOfStock ? 'destructive' : product.stock < 10 ? 'secondary' : 'outline'}>
              {isOutOfStock ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
            </Badge>

            <Button
              className="w-full gap-2 mt-auto"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
