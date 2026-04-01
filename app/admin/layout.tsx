'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  Menu,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/stores/userStore'
import { NotificationBell } from '@/components/storefront/notification-bell'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard'
  if (pathname.startsWith('/admin/products/new')) return 'New Product'
  if (pathname.match(/\/admin\/products\/.+/)) return 'Edit Product'
  if (pathname === '/admin/products') return 'Products'
  if (pathname.match(/\/admin\/orders\/.+/)) return 'Order Detail'
  if (pathname === '/admin/orders') return 'Orders'
  if (pathname.match(/\/admin\/customers\/.+/)) return 'Customer Detail'
  if (pathname === '/admin/customers') return 'Customers'
  if (pathname === '/admin/settings') return 'Settings'
  return 'Admin'
}

interface SidebarNavProps {
  collapsed: boolean
  onNavigate?: () => void
}

function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const { user, logout } = useUserStore()
  const router = useRouter()

  const isActive = (link: typeof NAV_LINKS[0]) => {
    if (link.exact) return pathname === link.href
    return pathname.startsWith(link.href)
  }

  const handleLogout = () => {
    logout()
    router.push('/account/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-border shrink-0',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-sm">L</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight">LUXE Admin</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon
          const active = isActive(link)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Bottom section */}
      <div className="py-4 px-2 space-y-1">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <Store className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>

        <div className={cn(
          'flex items-center px-3 py-2.5 rounded-lg',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="text-xs">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-9 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useUserStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Collapse on small screens initially
    if (window.innerWidth < 1024) {
      setCollapsed(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/account/login')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const pageTitle = getPageTitle(pathname)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col border-r border-border bg-card overflow-hidden relative shrink-0"
      >
        <SidebarNav collapsed={collapsed} />

        {/* Collapse toggle */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3.5 top-[72px] h-7 w-7 rounded-full border bg-background shadow-sm z-10"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      </motion.aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center gap-4 px-4 lg:px-6 shrink-0">
          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold flex-1">{pageTitle}</h1>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
              <Avatar className="h-8 w-8">
                <AvatarImage src={useUserStore.getState().user?.avatar} />
                <AvatarFallback className="text-xs">
                  {useUserStore.getState().user?.name?.charAt(0).toUpperCase() ?? 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">
                {useUserStore.getState().user?.name ?? 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4 lg:p-6 min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
