'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Package,
  Heart,
  MapPin,
  Edit2,
  Check,
  X,
  ShoppingCart,
  Trash2,
  LogOut,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { useUserStore } from '@/stores/userStore'
import { useOrderStore } from '@/stores/orderStore'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice, formatDate } from '@/lib/utils'

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400',
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, updateProfile, logout, removeFromWishlist } = useUserStore()
  const { orders, fetchCustomerOrders, loading: ordersLoading } = useOrderStore()
  const { products } = useProductStore()
  const { addItem, openDrawer } = useCartStore()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (user?.id) {
      fetchCustomerOrders(user.id)
    }
  }, [user?.id, fetchCustomerOrders])

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    )
  }

  const startEdit = () => {
    setEditName(user.name)
    setEditEmail(user.email)
    setEditing(true)
  }

  const saveEdit = () => {
    updateProfile({ name: editName, email: editEmail })
    setEditing(false)
    toast.success('Profile updated')
  }

  const wishlistProducts = products.filter((p) => user.wishlist.includes(p.id))

  const handleAddWishlistToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    addItem(product, 1, {})
    toast.success(`${product.name} added to cart`)
    openDrawer()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 p-6 rounded-2xl bg-card border border-border">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-2xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex flex-col gap-2 max-w-sm">
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
              <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" type="email" />
              <div className="flex gap-2">
                <Button size="sm" className="gap-1.5" onClick={saveEdit}>
                  <Check className="h-3.5 w-3.5" />Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {formatDate(user.createdAt)}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!editing && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={startEdit}>
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => { logout(); router.push('/') }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package },
          { label: 'Wishlist', value: user.wishlist.length, icon: Heart },
          { label: 'Saved Addresses', value: user.addresses.length, icon: MapPin },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 text-center">
            <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders">
        <TabsList className="mb-6 h-auto p-1">
          <TabsTrigger value="orders" className="gap-2 py-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-2 py-2">
            <Heart className="h-4 w-4" />
            Wishlist
            {user.wishlist.length > 0 && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                {user.wishlist.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-2 py-2">
            <MapPin className="h-4 w-4" />
            Addresses
          </TabsTrigger>
        </TabsList>

        {/* Orders tab */}
        <TabsContent value="orders">
          {ordersLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm mt-1">Your orders will appear here after you make a purchase</p>
              <Button className="mt-6" asChild>
                <a href="/products">Start Shopping</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-bold text-primary">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ORDER_STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                      <span className="font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.productId} className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                        <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                      View details
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Wishlist tab */}
        <TabsContent value="wishlist">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">Your wishlist is empty</p>
              <p className="text-sm mt-1">Save products you love by clicking the heart icon</p>
              <Button className="mt-6" asChild>
                <a href="/products">Browse Products</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="rounded-xl border border-border bg-card overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.images[0] && (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold line-clamp-2 mb-1">{product.name}</p>
                    <p className="text-sm font-bold text-primary mb-3">{formatPrice(product.price)}</p>
                    <div className="flex gap-1.5">
                      <Button size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => handleAddWishlistToCart(product.id)}>
                        <ShoppingCart className="h-3 w-3" />
                        Add
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => {
                        removeFromWishlist(product.id)
                        toast.success('Removed from wishlist')
                      }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Addresses tab */}
        <TabsContent value="addresses">
          {user.addresses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No saved addresses</p>
              <p className="text-sm mt-1">Addresses saved during checkout will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm">{addr.label}</p>
                      {addr.isDefault && <Badge variant="secondary" className="text-xs mt-1">Default</Badge>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p className="font-medium text-foreground">{addr.fullName}</p>
                    <p>{addr.address1}</p>
                    {addr.address2 && <p>{addr.address2}</p>}
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                    <p>{addr.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
