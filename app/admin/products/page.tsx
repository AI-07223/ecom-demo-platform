'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductStore } from '@/stores/productStore'
import {
  adminDeleteProduct,
  adminBulkDeleteProducts,
  adminBulkUpdateProductStatus,
} from '@/lib/mock-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatPrice } from '@/lib/utils'

const PAGE_SIZE = 10

export default function ProductsPage() {
  const { products, loading, fetchProducts } = useProductStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'all' || p.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [products, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allSelected =
    paginated.length > 0 && paginated.every((p) => selected.has(p.id))
  const someSelected = selected.size > 0

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        paginated.forEach((p) => next.delete(p.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        paginated.forEach((p) => next.add(p.id))
        return next
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await adminDeleteProduct(deleteId)
      await fetchProducts()
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  const handleBulkDelete = async () => {
    setBulkLoading(true)
    try {
      await adminBulkDeleteProducts(Array.from(selected))
      await fetchProducts()
      setSelected(new Set())
      toast.success(`${selected.size} products deleted`)
    } catch {
      toast.error('Bulk delete failed')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkStatus = async (status: 'active' | 'draft') => {
    setBulkLoading(true)
    try {
      await adminBulkUpdateProductStatus(Array.from(selected), status)
      await fetchProducts()
      setSelected(new Set())
      toast.success(`${selected.size} products set to ${status}`)
    } catch {
      toast.error('Bulk update failed')
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg">
              <span className="text-sm font-medium">{selected.size} selected</span>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkLoading}
                onClick={() => handleBulkStatus('active')}
              >
                Set Active
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkLoading}
                onClick={() => handleBulkStatus('draft')}
              >
                Set Draft
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={bulkLoading}
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 w-14">Image</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Product</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Price</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Stock</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-10 w-10 rounded" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                        <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-12" /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-5 w-16 rounded-full" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-7 w-16" /></td>
                      </tr>
                    ))
                  : paginated.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selected.has(product.id)}
                            onCheckedChange={() => toggleSelect(product.id)}
                            aria-label={`Select ${product.name}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted">
                            {product.images[0] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium leading-tight">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell font-medium">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={cn(
                            'text-sm font-medium',
                            product.stock < 10 ? 'text-red-600' : 'text-foreground'
                          )}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          )}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                              <Link href={`/admin/products/${product.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(product.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium">{page} / {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
