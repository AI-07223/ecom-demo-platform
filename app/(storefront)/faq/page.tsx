'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, HelpCircle } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Category = 'Shipping' | 'Returns' | 'Payments' | 'Account'

const CATEGORY_ICONS: Record<Category, string> = {
  Shipping: '🚚',
  Returns: '↩️',
  Payments: '💳',
  Account: '👤',
}

export default function FaqPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')

  const categories = ['All', ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))] as (Category | 'All')[]

  const filtered = FAQ_ITEMS.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false
    if (search && !item.question.toLowerCase().includes(search.toLowerCase()) &&
        !item.answer.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const grouped = filtered.reduce<Record<string, typeof FAQ_ITEMS>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-background via-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
              Find answers to common questions about ordering, shipping, returns, and more.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-3xl">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/60'
              }`}
            >
              {cat !== 'All' && <span className="mr-1">{CATEGORY_ICONS[cat as Category]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No results for &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{CATEGORY_ICONS[category as Category]}</span>
                  <h2 className="text-xl font-bold">{category}</h2>
                  <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                </div>
                <Accordion type="single" collapsible className="rounded-xl border border-border bg-card overflow-hidden">
                  {items.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="px-5 last:border-0">
                      <AccordionTrigger className="text-left text-sm font-semibold py-4 hover:no-underline hover:text-primary transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center rounded-2xl border border-border bg-card p-8"
        >
          <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-xl mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is happy to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </section>
    </div>
  )
}
