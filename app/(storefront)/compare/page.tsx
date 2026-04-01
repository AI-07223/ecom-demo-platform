'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, GitCompare, Star, ShoppingCart, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

const ROWS = [
  { key: 'image', label: 'Product' },
  { key: 'price', label: 'Price' },
  { key: 'rating', label: 'Rating' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'stock', label: 'Stock' },
]

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useProductStore()
  const { addItem, openDrawer } = useCartStore()

  const addToCart = (product: typeof compareList[0]) => {
    addItem(product, 1, {})
    toast.success(`${product.name} added to cart`)
    openDrawer()
  }

  if (compareList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-24 text-center"
      >
        <div className="rounded-full bg-muted p-8 w-fit mx-auto mb-6">
          <GitCompare className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No products to compare</h1>
        <p className="text-muted-foreground mb-8">
          Add products to compare by clicking the compare icon on product cards.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Browse Products</Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Compare Products</h1>
          <p className="text-muted-foreground mt-1">Comparing {compareList.length} product{compareList.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={clearCompare}>
          <X className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <colgroup>
            <col className="w-36" />
            {compareList.map((p) => <col key={p.id} />)}
            {Array.from({ length: Math.max(0, 4 - compareList.length) }).map((_, i) => <col key={`empty-${i}`} />)}
          </colgroup>

          {/* Product columns header */}
          <thead>
            <tr>
              <th className="py-4 pr-4 text-left text-sm font-semibold text-muted-foreground align-bottom"></th>
              {compareList.map((product) => (
                <th key={product.id} className="py-4 px-4 align-top">
                  <div className="relative group">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-muted hover:bg-destructive hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                      {product.images[0] && (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <Link href={`/products/${product.id}`} className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </Link>
                    <Button size="sm" className="mt-3 w-full gap-1.5" onClick={() => addToCart(product)}>
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </Button>
                  </div>
                </th>
              ))}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 4 - compareList.length) }).map((_, i) => (
                <th key={`empty-${i}`} className="py-4 px-4 align-top">
                  <Link href="/products" className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors gap-3">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Add product</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROWS.slice(1).map(({ key, label }) => (
              <tr key={key} className="border-t border-border">
                <td className="py-4 pr-4 text-sm font-semibold text-muted-foreground whitespace-nowrap align-top">
                  {label}
                </td>
                {compareList.map((product) => (
                  <td key={product.id} className="py-4 px-4 align-top">
                    {key === 'price' && (
                      <div>
                        <span className="font-bold text-primary text-lg">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                        )}
                      </div>
                    )}
                    {key === 'rating' && (
                      <div className="flex items-center gap-2">
                        <StarRating rating={product.rating} />
                        <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewCount})</span>
                      </div>
                    )}
                    {key === 'category' && (
                      <Badge variant="secondary">{product.category}</Badge>
                    )}
                    {key === 'description' && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                    )}
                    {key === 'stock' && (
                      <Badge variant={product.stock === 0 ? 'destructive' : product.stock < 10 ? 'secondary' : 'outline'}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `${product.stock} left` : 'In Stock'}
                      </Badge>
                    )}
                  </td>
                ))}
                {Array.from({ length: Math.max(0, 4 - compareList.length) }).map((_, i) => (
                  <td key={`empty-${i}`} className="py-4 px-4" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
