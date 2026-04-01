'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Share2, Camera, Rss, Video, ArrowRight, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const shopLinks = [
  { label: 'Electronics', href: '/products?category=Electronics' },
  { label: 'Clothing', href: '/products?category=Clothing' },
  { label: 'Home & Living', href: '/products?category=Home+%26+Living' },
  { label: 'Sports', href: '/products?category=Sports' },
  { label: 'Accessories', href: '/products?category=Accessories' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
]

const supportLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Returns', href: '#' },
  { label: 'Track Order', href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setEmail('')
    toast.success('You\'re subscribed! Welcome to LUXE updates.')
  }

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {/* Brand */}
          <div className="xl:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                LUXE
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Premium products, exceptional experiences. We curate the best in electronics, fashion, and lifestyle.
            </p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>123 Commerce St, San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>+1 (800) 555-LUXE</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2.5 mb-6">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get exclusive deals and new arrivals delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? 'Subscribing...' : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LUXE Store. All rights reserved. Demo platform.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { Icon: Share2, label: 'Twitter' },
              { Icon: Camera, label: 'Instagram' },
              { Icon: Rss, label: 'Facebook' },
              { Icon: Video, label: 'YouTube' },
              { Icon: Mail, label: 'Email' },
            ].map(({ Icon, label }) => (
              <Button key={label} variant="ghost" size="icon" className="h-8 w-8" aria-label={label} asChild>
                <a href="#" aria-label={label}>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
