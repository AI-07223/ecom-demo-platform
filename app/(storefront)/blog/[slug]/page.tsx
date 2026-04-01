'use client'

import { use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, ChevronLeft, Tag } from 'lucide-react'
import { BLOG_ARTICLES } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  const related = BLOG_ARTICLES.filter((a) => a.slug !== slug && a.category === article?.category).slice(0, 3)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Button asChild><Link href="/blog">Back to Blog</Link></Button>
      </div>
    )
  }

  // Split content into paragraphs
  const paragraphs = article.content.split('\n\n').filter((p) => p.trim())

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" className="gap-1.5 mb-6 -ml-2" asChild>
        <Link href="/blog">
          <ChevronLeft className="h-4 w-4" />
          Back to Journal
        </Link>
      </Button>

      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{article.category}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime} min read
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
          {article.title}
        </h1>

        {/* Author + date */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={article.author.avatar} />
            <AvatarFallback>{article.author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{article.author.name}</p>
            <p className="text-sm text-muted-foreground">{article.author.role} · {formatDate(article.publishedAt)}</p>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-10 shadow-lg">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Article content */}
      <div className="prose prose-lg max-w-none">
        {/* Excerpt/lead */}
        <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-5 italic">
          {article.excerpt}
        </p>

        <div className="space-y-5 text-foreground leading-relaxed">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {para.trim()}
            </p>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-10 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="gap-1 text-xs">
            <Tag className="h-2.5 w-2.5" />
            {tag}
          </Badge>
        ))}
      </div>

      <Separator className="my-12" />

      {/* Author bio */}
      <div className="flex gap-5 p-6 rounded-xl bg-muted/50 border border-border mb-12">
        <Avatar className="h-16 w-16 shrink-0">
          <AvatarImage src={article.author.avatar} />
          <AvatarFallback className="text-xl">{article.author.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-lg">{article.author.name}</p>
          <p className="text-primary text-sm font-medium mb-2">{article.author.role}</p>
          <p className="text-sm text-muted-foreground">
            A passionate contributor to the LUXE Journal, sharing insights on the latest trends, products, and lifestyle tips.
          </p>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">More from {article.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((rel) => (
              <Link key={rel.id} href={`/blog/${rel.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img src={rel.featuredImage} alt={rel.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors text-sm">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {rel.readTime} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
