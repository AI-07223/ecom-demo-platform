import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { Header } from '@/components/storefront/header'
import { Footer } from '@/components/storefront/footer'
import { CartDrawer } from '@/components/storefront/cart-drawer'
import { ComparisonTray } from '@/components/storefront/comparison-tray'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <ComparisonTray />
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </ThemeProvider>
  )
}
