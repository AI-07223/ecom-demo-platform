'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductStore } from '@/stores/productStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { products } = useProductStore()

  const filtered = query.trim().length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : []

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleSelect = (id: string) => {
    router.push(`/products/${id}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl bg-background rounded-xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="border-0 bg-transparent text-base h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              />
              {query && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setQuery('')}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={onClose}>
                ESC
              </Button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length > 1 && filtered.length === 0 && (
                <div className="flex flex-col items-center py-12 text-muted-foreground">
                  <Search className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs mt-1">Try different keywords</p>
                </div>
              )}

              {filtered.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Products
                  </p>
                  {filtered.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                        {product.images[0] && (
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
                      <span className="text-sm font-semibold text-primary shrink-0">
                        {formatPrice(product.price)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {query.trim().length <= 1 && (
                <div className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Trending searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Headphones', 'Running shoes', 'Smart watch', 'Laptop', 'Yoga mat'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full bg-muted hover:bg-accent text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
