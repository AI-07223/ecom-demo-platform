'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Zap,
  ShoppingBag,
  Shirt,
  Home,
  Activity,
  Watch,
  Tag,
  Sparkles,
} from 'lucide-react'
import { useProductStore } from '@/stores/productStore'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/storefront/product-card'
import { Skeleton } from '@/components/ui/skeleton'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const categories = [
  { name: 'Electronics', icon: Zap, href: '/products?category=Electronics', color: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-500' },
  { name: 'Clothing', icon: Shirt, href: '/products?category=Clothing', color: 'from-pink-500/20 to-rose-500/10', iconColor: 'text-pink-500' },
  { name: 'Home & Living', icon: Home, href: '/products?category=Home+%26+Living', color: 'from-amber-500/20 to-orange-500/10', iconColor: 'text-amber-500' },
  { name: 'Sports', icon: Activity, href: '/products?category=Sports', color: 'from-green-500/20 to-emerald-500/10', iconColor: 'text-green-500' },
  { name: 'Accessories', icon: Watch, href: '/products?category=Accessories', color: 'from-purple-500/20 to-violet-500/10', iconColor: 'text-purple-500' },
]

export default function HomePage() {
  const { products, loading, fetchProducts, recentlyViewed } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const featuredProducts = products.slice(0, 8)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                New arrivals every week
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Discover{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Premium
                </span>{' '}
                Products
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Curated collections of the finest electronics, fashion, and lifestyle essentials. Quality you can feel, prices that make sense.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2 text-base px-6" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-base px-6" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-2">
                <div>
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy customers</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold">2K+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-sm text-muted-foreground">Avg. rating</p>
                </div>
              </div>
            </motion.div>

            {/* Hero images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
                  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className={`rounded-2xl overflow-hidden shadow-lg aspect-square ${i === 1 ? 'mt-8' : i === 3 ? '-mt-8' : ''}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Categories</p>
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          </div>
          <Button variant="ghost" className="gap-1.5 hidden sm:flex" asChild>
            <Link href="/products">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <motion.div key={cat.name} variants={itemVariants}>
                <Link
                  href={cat.href}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-gradient-to-br ${cat.color} hover:shadow-md hover:border-primary/30 transition-all group text-center`}
                >
                  <div className={`p-3 rounded-xl bg-background shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                  </div>
                  <span className="font-semibold text-sm">{cat.name}</span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Featured</p>
              <h2 className="text-2xl md:text-3xl font-bold">Our Best Sellers</h2>
            </div>
            <Button variant="ghost" className="gap-1.5 hidden sm:flex" asChild>
              <Link href="/products">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Button asChild>
              <Link href="/products" className="gap-2">
                View all products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-primary to-blue-600 p-8 md:p-12 text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.15),transparent)]" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-4">
                <Tag className="h-3.5 w-3.5" />
                Limited time offer
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Get 10% Off Your First Order
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Use code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">DEMO10</span> at checkout. Valid on all products, no minimum order.
              </p>
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-purple-700 hover:bg-white/90 font-semibold" asChild>
                <Link href="/products">
                  Shop & Save
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="text-[120px] font-black opacity-10 leading-none absolute -top-8 -right-4">10%</div>
                <div className="flex flex-col gap-3">
                  {['Free shipping on $100+', 'Easy 30-day returns', '24/7 customer support'].map((perk) => (
                    <div key={perk} className="flex items-center gap-2 bg-white/15 rounded-lg px-4 py-2.5 backdrop-blur-sm">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-sm font-medium">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">History</p>
              <h2 className="text-2xl font-bold">Recently Viewed</h2>
            </div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {recentlyViewed.slice(0, 6).map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </div>
  )
}
