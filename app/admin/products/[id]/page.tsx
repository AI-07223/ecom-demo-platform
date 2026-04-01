'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Plus, X, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { fetchProduct, adminUpdateProduct } from '@/lib/mock-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Product, ProductCategory, ProductVariant } from '@/types'

const CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Clothing',
  'Home & Living',
  'Sports',
  'Accessories',
]

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState<ProductCategory | ''>('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'draft'>('active')
  const [imageUrl, setImageUrl] = useState('')
  const [stock, setStock] = useState('')
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [newVariantType, setNewVariantType] = useState<'size' | 'color'>('size')
  const [newVariantLabel, setNewVariantLabel] = useState('')
  const [newVariantValues, setNewVariantValues] = useState('')

  useEffect(() => {
    fetchProduct(id).then((p) => {
      if (p) {
        setProduct(p)
        setName(p.name)
        setSlug(p.slug)
        setCategory(p.category)
        setPrice(p.price.toString())
        setCompareAtPrice(p.compareAtPrice?.toString() ?? '')
        setDescription(p.description)
        setStatus(p.status)
        setImageUrl(p.images[0] ?? '')
        setStock(p.stock.toString())
        setVariants(p.variants)
      } else {
        toast.error('Product not found')
        router.push('/admin/products')
      }
      setLoadingProduct(false)
    })
  }, [id, router])

  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(slugify(value))
  }

  const addVariant = () => {
    if (!newVariantLabel.trim() || !newVariantValues.trim()) return
    const values = newVariantValues.split(',').map((v) => v.trim()).filter(Boolean)
    if (values.length === 0) return
    setVariants((prev) => [
      ...prev,
      { type: newVariantType, label: newVariantLabel.trim(), values },
    ])
    setNewVariantLabel('')
    setNewVariantValues('')
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !category || !price) {
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      await adminUpdateProduct(id, {
        name: name.trim(),
        slug: slug || slugify(name),
        category: category as ProductCategory,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        description: description.trim(),
        longDescription: description.trim(),
        images: imageUrl ? [imageUrl] : product?.images ?? [],
        status,
        stock: parseInt(stock) || 0,
        variants,
      })
      toast.success('Product updated successfully')
      router.push('/admin/products')
    } catch {
      toast.error('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-9 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">{product?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Premium Wireless Headphones"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">
                  Price (USD) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="compareAtPrice">Compare-at Price (USD)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {imageUrl && (
              <div className="h-40 w-40 rounded-xl overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.length > 0 && (
              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <span className="text-sm font-medium">{v.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({v.type})</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {v.values.map((val) => (
                          <span
                            key={val}
                            className="px-1.5 py-0.5 bg-background border border-border rounded text-xs"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => removeVariant(i)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Add Variant</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  value={newVariantType}
                  onValueChange={(v) => setNewVariantType(v as 'size' | 'color')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="color">Color</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={newVariantLabel}
                  onChange={(e) => setNewVariantLabel(e.target.value)}
                  placeholder="Label (e.g. Size)"
                />
                <Input
                  value={newVariantValues}
                  onChange={(e) => setNewVariantValues(e.target.value)}
                  placeholder="Values (comma separated)"
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Variant
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Product Status</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {status === 'active' ? 'Visible in the store' : 'Hidden from customers'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  'text-sm font-medium',
                  status === 'active' ? 'text-green-600' : 'text-muted-foreground'
                )}>
                  {status === 'active' ? 'Active' : 'Draft'}
                </span>
                <Switch
                  checked={status === 'active'}
                  onCheckedChange={(checked) => setStatus(checked ? 'active' : 'draft')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
