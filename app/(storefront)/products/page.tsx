'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, LayoutGrid, LayoutList, SlidersHorizontal, X } from 'lucide-react'
import { useProductStore } from '@/stores/productStore'
import { ProductCard } from '@/components/storefront/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ProductCategory } from '@/types'

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Living',
  'Sports',
  'Accessories',
]

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Best Selling', value: 'popular' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { products, loading, fetchProducts } = useProductStore()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState<ProductCategory | 'All'>(
    (searchParams.get('category') as ProductCategory) || 'All'
  )
  const [sort, setSort] = useState('newest')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Sync url param category on mount
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat as ProductCategory)
  }, [searchParams])

  const filtered = products
    .filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.category.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        default: return 0
      }
    })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">All Products</h1>
        <p className="text-muted-foreground">
          {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setSearch('')}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-48 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Layout toggle */}
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-9 w-9 rounded-none', layout === 'grid' && 'bg-muted')}
              onClick={() => setLayout('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-9 w-9 rounded-none', layout === 'list' && 'bg-muted')}
              onClick={() => setLayout('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
              category === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary/60 text-muted-foreground hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
        {(category !== 'All' || search) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1 text-muted-foreground"
            onClick={() => { setCategory('All'); setSearch('') }}
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className={cn(
          layout === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
            : 'flex flex-col gap-4'
        )}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              {layout === 'grid' ? (
                <>
                  <Skeleton className="aspect-square" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </>
              ) : (
                <div className="flex gap-4 p-4">
                  <Skeleton className="h-32 w-32 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-muted-foreground">
          <Search className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
          <Button className="mt-6" onClick={() => { setCategory('All'); setSearch('') }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <motion.div
          key={`${category}-${sort}-${layout}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            layout === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
          )}
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} layout={layout} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><Skeleton className="h-96 w-full" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
