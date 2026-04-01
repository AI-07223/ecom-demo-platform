'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, ChevronDown, Home, Package, Info, Phone, HelpCircle, BookOpen, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/storefront/theme-toggle'
import { NotificationBell } from '@/components/storefront/notification-bell'
import { SearchModal } from '@/components/storefront/search-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const pagesLinks = [
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Phone },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Blog', href: '/blog', icon: BookOpen },
]

export function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())
  const openCart = useCartStore((s) => s.openDrawer)
  const { user, isAuthenticated, logout } = useUserStore()

  const navLinkClass = (href: string) =>
    cn(
      'text-sm font-medium transition-colors hover:text-primary',
      pathname === href ? 'text-primary' : 'text-muted-foreground'
    )

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              LUXE
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link href="/products" className={navLinkClass('/products')}>
              Products
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn('flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary text-muted-foreground outline-none')}>
                  Pages
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {pagesLinks.map(({ label, href, icon: Icon }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href} className="flex items-center gap-2 cursor-pointer">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <NotificationBell />

            {/* Theme */}
            <ThemeToggle />

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={openCart} aria-label="Cart">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Button>

            {/* User */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/account/login">Sign in</Link>
              </Button>
            )}

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left">
                    <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                      LUXE
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Home className="h-4 w-4 text-muted-foreground" />
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Products
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pages</p>
                  {pagesLinks.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {label}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <Link
                        href="/account/login"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Sign in
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
