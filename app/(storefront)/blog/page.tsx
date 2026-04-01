'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, User, ChevronRight, Tag, Search } from 'lucide-react'
import { BLOG_ARTICLES } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)))]

  const filtered = BLOG_ARTICLES.filter((article) => {
    if (activeCategory !== 'All' && article.category !== activeCategory) return false
    if (search && !article.title.toLowerCase().includes(search.toLowerCase()) &&
        !article.excerpt.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const [featured, ...rest] = filtered

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-background via-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              LUXE{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Journal
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
              Style guides, product spotlights, and expert advice for living better.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && activeCategory === 'All' && !search && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-[16/9] md:aspect-auto overflow-hidden bg-muted">
                <img
                  src={featured.featuredImage}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{featured.category}</Badge>
                  <span className="text-xs text-muted-foreground">Featured</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={featured.author.avatar} />
                      <AvatarFallback>{featured.author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{featured.author.name}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime} min read
                  </span>
                  <span>{formatDate(featured.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  Read article
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Article grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No articles found</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(activeCategory === 'All' && !search ? rest : filtered).map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <Link href={`/blog/${article.slug}`} className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all h-full">
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={article.author.avatar} />
                          <AvatarFallback>{article.author.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{article.author.name}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}m
                      </span>
                      <span className="ml-auto">{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
