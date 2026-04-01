'use client'

import Link from 'next/link'
import { X, GitCompare, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductStore } from '@/stores/productStore'
import { Button } from '@/components/ui/button'

export function ComparisonTray() {
  const { compareList, removeFromCompare, clearCompare } = useProductStore()

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur shadow-2xl"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm font-semibold mr-2">
                <GitCompare className="h-4 w-4 text-primary" />
                Comparing {compareList.length} of 4
              </div>

              <div className="flex items-center gap-3 flex-1 flex-wrap">
                {compareList.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 bg-muted rounded-lg pl-2 pr-1 py-1"
                  >
                    <div className="h-8 w-8 rounded overflow-hidden bg-background shrink-0">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs font-medium max-w-[120px] truncate">{product.name}</span>
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="h-5 w-5 rounded-full hover:bg-border flex items-center justify-center transition-colors shrink-0"
                      aria-label={`Remove ${product.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: 4 - compareList.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-10 w-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">Add product</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground gap-1.5"
                  onClick={clearCompare}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
                <Button size="sm" className="gap-1.5" asChild>
                  <Link href="/compare">
                    <GitCompare className="h-3.5 w-3.5" />
                    Compare ({compareList.length})
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
