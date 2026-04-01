'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Phone, Mail, Clock, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const contactInfo = [
  { icon: MapPin, title: 'Visit Us', lines: ['123 Commerce Street', 'San Francisco, CA 94102'] },
  { icon: Phone, title: 'Call Us', lines: ['+1 (800) 555-LUXE', 'Mon–Fri, 9am–6pm PT'] },
  { icon: Mail, title: 'Email Us', lines: ['support@luxestore.demo', 'We reply within 24 hours'] },
  { icon: Clock, title: 'Business Hours', lines: ['Monday – Friday: 9am–6pm PT', 'Saturday: 10am–4pm PT'] },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.includes('@')) errs.email = 'Valid email required'
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-background via-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Get in{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Have a question or need help? We&apos;re here for you. Our team typically responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-950/30 p-6 mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks {form.name || 'for reaching out'}! We&apos;ll reply to your email within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Message</Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="mb-1.5 block">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Jane Doe"
                          value={form.name}
                          onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: '' })) }}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email" className="mb-1.5 block">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: '' })) }}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="mb-1.5 block">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={(e) => { setForm((p) => ({ ...p, subject: e.target.value })); setErrors((p) => ({ ...p, subject: '' })) }}
                        className={errors.subject ? 'border-destructive' : ''}
                      />
                      {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <Label htmlFor="message" className="mb-1.5 block">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us what's on your mind..."
                        rows={5}
                        value={form.message}
                        onChange={(e) => { setForm((p) => ({ ...p, message: e.target.value })); setErrors((p) => ({ ...p, message: '' })) }}
                        className={errors.message ? 'border-destructive' : ''}
                      />
                      {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                    </div>
                    <Button type="submit" size="lg" className="gap-2 w-full sm:w-auto" disabled={loading}>
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                      ) : (
                        <><Send className="h-4 w-4" />Send Message</>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, title, lines }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5 flex gap-4"
              >
                <div className="rounded-lg bg-primary/10 p-2.5 h-fit">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">{title}</p>
                  {lines.map((line) => (
                    <p key={line} className="text-sm text-muted-foreground">{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-border bg-muted overflow-hidden aspect-video flex items-center justify-center"
            >
              <div className="text-center text-muted-foreground">
                <MapPin className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Map placeholder</p>
                <p className="text-xs">123 Commerce St, SF</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
