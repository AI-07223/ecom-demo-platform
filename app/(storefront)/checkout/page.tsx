'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Loader2, CreditCard, MapPin, ClipboardList, Package } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { formatPrice, sleep } from '@/lib/utils'
import type { ShippingAddress } from '@/types'

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardList },
]

const emptyShipping: ShippingAddress = {
  fullName: '', email: '', phone: '',
  address1: '', city: '', state: '', zip: '', country: 'United States',
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done = currentStep > step.id
        const active = currentStep === step.id
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all font-bold text-sm ${
                done ? 'bg-primary border-primary text-primary-foreground'
                  : active ? 'border-primary text-primary bg-primary/10'
                  : 'border-border text-muted-foreground'
              }`}>
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-all ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getShipping, getTax, getTotal, discount, promoCode, clearCart } = useCartStore()
  const { placeOrder } = useOrderStore()

  const [step, setStep] = useState(1)
  const [shipping, setShipping] = useState<ShippingAddress>(emptyShipping)
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingAddress>>({})
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [placing, setPlacing] = useState(false)

  const subtotal = getSubtotal()
  const shippingCost = getShipping()
  const tax = getTax()
  const total = getTotal()
  const discountAmt = subtotal * discount

  // Format card number with spaces
  const formatCard = (val: string) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`
    return clean
  }

  const validateShipping = () => {
    const errs: Partial<ShippingAddress> = {}
    if (!shipping.fullName.trim()) errs.fullName = 'Required'
    if (!shipping.email.includes('@')) errs.email = 'Valid email required'
    if (!shipping.phone.trim()) errs.phone = 'Required'
    if (!shipping.address1.trim()) errs.address1 = 'Required'
    if (!shipping.city.trim()) errs.city = 'Required'
    if (!shipping.state.trim()) errs.state = 'Required'
    if (!shipping.zip.trim()) errs.zip = 'Required'
    setShippingErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateCard = () => {
    const errs: Record<string, string> = {}
    if (card.number.replace(/\s/g, '').length < 16) errs.number = 'Enter 16-digit card number'
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = 'MM/YY format required'
    if (card.cvv.length < 3) errs.cvv = 'CVV required'
    if (!card.name.trim()) errs.name = 'Cardholder name required'
    setCardErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleStep1 = () => { if (validateShipping()) setStep(2) }
  const handleStep2 = () => { if (validateCard()) setStep(3) }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    await sleep(1500)
    try {
      const order = await placeOrder(items, shipping, promoCode ?? undefined, discount)
      clearCart()
      router.push(`/checkout/confirmation?orderId=${order.id}&orderNumber=${order.orderNumber}`)
    } catch {
      toast.error('Failed to place order. Please try again.')
      setPlacing(false)
    }
  }

  if (items.length === 0 && !placing) {
    router.push('/cart')
    return null
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <StepIndicator currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { field: 'fullName', label: 'Full Name', col: 2, placeholder: 'John Doe' },
                      { field: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
                      { field: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
                      { field: 'address1', label: 'Address', col: 2, placeholder: '123 Main Street' },
                      { field: 'city', label: 'City', placeholder: 'San Francisco' },
                      { field: 'state', label: 'State', placeholder: 'CA' },
                      { field: 'zip', label: 'ZIP Code', placeholder: '94102' },
                      { field: 'country', label: 'Country', placeholder: 'United States' },
                    ].map(({ field, label, col, placeholder, type }) => (
                      <div key={field} className={col === 2 ? 'sm:col-span-2' : ''}>
                        <Label htmlFor={field} className="mb-1.5 block">{label}</Label>
                        <Input
                          id={field}
                          type={type || 'text'}
                          placeholder={placeholder}
                          value={shipping[field as keyof ShippingAddress] as string}
                          onChange={(e) => {
                            setShipping((prev) => ({ ...prev, [field]: e.target.value }))
                            setShippingErrors((prev) => ({ ...prev, [field]: '' }))
                          }}
                          className={shippingErrors[field as keyof ShippingAddress] ? 'border-destructive' : ''}
                        />
                        {shippingErrors[field as keyof ShippingAddress] && (
                          <p className="text-xs text-destructive mt-1">{shippingErrors[field as keyof ShippingAddress]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full gap-2" size="lg" onClick={handleStep1}>
                    Continue to Payment
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName" className="mb-1.5 block">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={card.name}
                        onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                        className={cardErrors.name ? 'border-destructive' : ''}
                      />
                      {cardErrors.name && <p className="text-xs text-destructive mt-1">{cardErrors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cardNumber" className="mb-1.5 block">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={card.number}
                          onChange={(e) => setCard((p) => ({ ...p, number: formatCard(e.target.value) }))}
                          className={`pr-12 font-mono ${cardErrors.number ? 'border-destructive' : ''}`}
                          maxLength={19}
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      {cardErrors.number && <p className="text-xs text-destructive mt-1">{cardErrors.number}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="mb-1.5 block">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={card.expiry}
                          onChange={(e) => setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                          maxLength={5}
                          className={`font-mono ${cardErrors.expiry ? 'border-destructive' : ''}`}
                        />
                        {cardErrors.expiry && <p className="text-xs text-destructive mt-1">{cardErrors.expiry}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="mb-1.5 block">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={card.cvv}
                          onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.slice(0, 4) }))}
                          maxLength={4}
                          className={`font-mono ${cardErrors.cvv ? 'border-destructive' : ''}`}
                        />
                        {cardErrors.cvv && <p className="text-xs text-destructive mt-1">{cardErrors.cvv}</p>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" />
                      This is a demo — no real payment is processed
                    </p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button className="flex-1 gap-2" size="lg" onClick={handleStep2}>
                      Review Order
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Review Your Order
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 text-sm">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                          {item.product.images[0] && (
                            <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product.name}</p>
                          {Object.keys(item.selectedVariants).length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {Object.entries(item.selectedVariants).map(([k,v]) => `${k}: ${v}`).join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-muted-foreground">×{item.quantity}</span>
                        <span className="shrink-0 font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Shipping address */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      Shipping To
                    </p>
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                      <p className="font-medium text-foreground">{shipping.fullName}</p>
                      <p>{shipping.address1}</p>
                      <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                      <p>{shipping.country}</p>
                      <p className="mt-1">{shipping.email} · {shipping.phone}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button
                      className="flex-1 gap-2 text-base"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={placing}
                    >
                      {placing ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Processing...</>
                      ) : (
                        <><Package className="h-4 w-4" />Place Order</>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 sticky top-24">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Discount ({promoCode})</span>
                  <span className="text-green-600">-{formatPrice(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
