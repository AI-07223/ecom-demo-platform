'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye, GitCompare, ShoppingCart, Star, Check } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { useProductStore } from '@/stores/productStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuickViewModal } from '@/components/storefront/quick-view-modal'
import { formatPrice, cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  layout?: 'grid' | 'list'
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3',
            i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'
          )}
        />
      ))}
    </div>
  )
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { addItem, openDrawer } = useCartStore()
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useUserStore()
  const { compareList, addToCompare, removeFromCompare } = useProductStore()

  const inWishlist = isInWishlist(product.id)
  const inCompare = compareList.some((p) => p.id === product.id)
  const discountPct = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 1, {})
    toast.success(`${product.name} added to cart`)
    openDrawer()
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Sign in to save items to your wishlist')
      return
    }
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product.id)
      toast.success('Added to wishlist')
    }
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inCompare) {
      removeFromCompare(product.id)
      toast.success('Removed from comparison')
    } else {
      if (compareList.length >= 4) {
        toast.error('You can compare up to 4 products')
        return
      }
      addToCompare(product)
      toast.success('Added to comparison')
    }
  }

  if (layout === 'list') {
    return (
      <>
        <div className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all group">
          <Link href={`/products/${product.id}`} className="relative h-32 w-32 shrink-0 rounded-lg overflow-hidden bg-muted">
            {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </Link>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="secondary" className="text-xs mb-1">{product.category}</Badge>
                <Link href={`/products/${product.id}`} className="block font-semibold hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </Link>
              </div>
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="font-bold text-primary text-lg">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={product.rating} />
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" className="gap-1.5" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Cart
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleWishlist}>
                <Heart className={cn('h-4 w-4', inWishlist && 'fill-red-500 text-red-500')} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuickViewProduct(product)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      </>
    )
  }

  return (
    <>
      <div className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image container */}
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-muted block">
          {product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}

          {/* Discount badge */}
          {discountPct > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-xs">
              -{discountPct}%
            </Badge>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="font-semibold">Out of Stock</Badge>
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 shadow-sm"
              onClick={handleWishlist}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-4 w-4', inWishlist && 'fill-red-500 text-red-500')} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 shadow-sm"
              onClick={(e) => { e.preventDefault(); setQuickViewProduct(product) }}
              title="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={cn('h-8 w-8 shadow-sm', inCompare && 'bg-primary text-primary-foreground hover:bg-primary/90')}
              onClick={handleCompare}
              title={inCompare ? 'Remove from compare' : 'Add to compare'}
            >
              {inCompare ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
            </Button>
          </div>

          {/* Quick add on hover */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <Button
              className="w-full gap-2 shadow-lg"
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Quick Add
            </Button>
          </div>
        </Link>

        {/* Product info */}
        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <Badge variant="secondary" className="w-fit text-xs">{product.category}</Badge>
          <Link href={`/products/${product.id}`} className="font-semibold text-sm leading-snug hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </Link>
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto pt-1">
            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  )
}
