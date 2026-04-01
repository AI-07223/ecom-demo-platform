'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Star,
  ShoppingCart,
  Heart,
  GitCompare,
  ChevronLeft,
  Check,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
  BadgeCheck,
  Ruler,
} from 'lucide-react'
import { toast } from 'sonner'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProductCard } from '@/components/storefront/product-card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatPrice, formatDate, cn } from '@/lib/utils'

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(cls, i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40')}
        />
      ))}
    </div>
  )
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { products, loading, fetchProducts, addToRecentlyViewed, compareList, addToCompare, removeFromCompare } = useProductStore()
  const { addItem, openDrawer } = useCartStore()
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useUserStore()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (products.length === 0) fetchProducts()
  }, [products.length, fetchProducts])

  const product = products.find((p) => p.id === id)

  useEffect(() => {
    if (product) addToRecentlyViewed(product)
  }, [product, addToRecentlyViewed])

  const inWishlist = isInWishlist(id)
  const inCompare = compareList.some((p) => p.id === id)
  const relatedProducts = products.filter((p) => p.id !== id && p.category === product?.category).slice(0, 4)

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity, selectedVariants)
    toast.success(`${product.name} added to cart`)
    openDrawer()
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlist = () => {
    if (!user) {
      toast.error('Sign in to save items to your wishlist')
      return
    }
    if (inWishlist) {
      removeFromWishlist(id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(id)
      toast.success('Added to wishlist')
    }
  }

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0
  const discountPct = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0
  const showSizeGuide = product.category === 'Clothing' || product.category === 'Sports'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-48">{product.name}</span>
      </div>

      <Button variant="ghost" size="sm" className="gap-1.5 mb-6 -ml-2" asChild>
        <Link href="/products">
          <ChevronLeft className="h-4 w-4" />
          Back to products
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image gallery */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0.7, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
          >
            {product.images[selectedImage] && (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
            {discountPct > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 text-sm">
                -{discountPct}% OFF
              </Badge>
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                    selectedImage === i ? 'border-primary' : 'border-border hover:border-primary/50'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} — {product.reviewCount} reviews
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
            {discountPct > 0 && (
              <Badge variant="destructive" className="text-sm">Save {discountPct}%</Badge>
            )}
          </div>

          {/* Stock */}
          <div>
            <Badge
              variant={isOutOfStock ? 'destructive' : product.stock < 10 ? 'secondary' : 'outline'}
              className="gap-1"
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : product.stock < 10 ? (
                `Only ${product.stock} left in stock — order soon`
              ) : (
                <><Check className="h-3 w-3" /> In Stock</>
              )}
            </Badge>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Variants */}
          {product.variants.map((variant) => (
            <div key={variant.type}>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm font-semibold">{variant.label}:</p>
                {selectedVariants[variant.label] && (
                  <span className="text-sm text-muted-foreground">{selectedVariants[variant.label]}</span>
                )}
                {showSizeGuide && variant.type === 'size' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline ml-auto">
                        <Ruler className="h-3 w-3" />
                        Size Guide
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Size Guide</DialogTitle>
                      </DialogHeader>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border px-3 py-2 text-left">Size</th>
                              <th className="border border-border px-3 py-2">Chest (in)</th>
                              <th className="border border-border px-3 py-2">Waist (in)</th>
                              <th className="border border-border px-3 py-2">Hips (in)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[['XS', '30-32', '24-26', '33-35'], ['S', '34-36', '28-30', '36-38'], ['M', '38-40', '32-34', '39-41'], ['L', '42-44', '36-38', '42-44'], ['XL', '46-48', '40-42', '45-47']].map(([s, c, w, h]) => (
                              <tr key={s}>
                                <td className="border border-border px-3 py-2 font-medium">{s}</td>
                                <td className="border border-border px-3 py-2 text-center">{c}</td>
                                <td className="border border-border px-3 py-2 text-center">{w}</td>
                                <td className="border border-border px-3 py-2 text-center">{h}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {variant.values.map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.label]: val }))}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm border transition-all font-medium',
                      selectedVariants[variant.label] === val
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border hover:border-primary/60 hover:bg-accent'
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <Button variant="outline" size="icon" className="h-10 w-10"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2 text-base"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {addedToCart ? (
                <><Check className="h-4 w-4" /> Added!</>
              ) : (
                <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={handleWishlist}
            >
              <Heart className={cn('h-4 w-4', inWishlist && 'fill-red-500 text-red-500')} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={cn('gap-2', inCompare && 'border-primary text-primary')}
              onClick={() => {
                if (inCompare) {
                  removeFromCompare(product.id)
                  toast.success('Removed from comparison')
                } else {
                  addToCompare(product)
                  toast.success('Added to comparison')
                }
              }}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
            {[
              { icon: Truck, label: 'Free shipping', sub: 'Orders $100+' },
              { icon: RotateCcw, label: '30-day returns', sub: 'Easy & free' },
              { icon: Shield, label: 'Secure payment', sub: '256-bit SSL' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-muted/50">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-xs text-muted-foreground">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>{product.longDescription}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            {/* Summary */}
            <div className="flex items-center gap-6 p-6 rounded-xl bg-muted/50 border border-border">
              <div className="text-center">
                <p className="text-5xl font-black text-primary">{product.rating.toFixed(1)}</p>
                <StarRating rating={product.rating} size="lg" />
                <p className="text-sm text-muted-foreground mt-1">{product.reviewCount} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5,4,3,2,1].map((star) => {
                  const count = product.reviews.filter((r) => r.rating === star).length
                  const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-right text-muted-foreground">{star}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-xs text-muted-foreground">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reviews list */}
            {product.reviews.map((review) => (
              <div key={review.id} className="flex gap-4 pb-6 border-b border-border last:border-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>{review.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{review.author}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <BadgeCheck className="h-3 w-3 text-green-500" />
                        Verified
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">{formatDate(review.date)}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  )
}
