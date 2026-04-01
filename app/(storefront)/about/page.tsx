'use client'

import { motion } from 'framer-motion'
import { Heart, Globe, Award, Users, Zap, ShieldCheck } from 'lucide-react'
import { TEAM_MEMBERS } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const values = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with what\'s best for you. Our 50,000+ happy customers are proof.' },
  { icon: Award, title: 'Quality Curation', desc: 'We handpick every product in our catalog. If it doesn\'t meet our standards, it doesn\'t make the cut.' },
  { icon: Globe, title: 'Global Reach', desc: 'Serving customers in 40+ countries with fast, reliable shipping and localized experiences.' },
  { icon: ShieldCheck, title: 'Trust & Security', desc: 'Bank-level encryption, secure payments, and a 30-day hassle-free return policy. Always.' },
  { icon: Zap, title: 'Innovation', desc: 'Constantly improving our platform, logistics, and product selection to stay ahead of your needs.' },
  { icon: Users, title: 'Community', desc: 'Building a community of conscious shoppers who care about quality, value, and the planet.' },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">Est. 2020</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              We&apos;re on a mission to make{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                premium accessible
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              LUXE started with a simple idea: great products shouldn&apos;t cost a fortune. Since 2020, we&apos;ve been
              curating the best in electronics, fashion, home goods, and lifestyle for customers who demand quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '2,400+', label: 'Products' },
              { value: '40+', label: 'Countries Served' },
              { value: '4.9/5', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <motion.div key={label} variants={itemVariants}>
                <p className="text-4xl font-black text-primary">{value}</p>
                <p className="text-muted-foreground mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Our Story</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">From a small idea to a global platform</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                LUXE began in a San Francisco apartment in 2020. Founders Maya Chen and Jordan Hayes were
                frustrated: either you paid premium prices at department stores, or you sifted through
                unreliable listings on generic marketplaces. There had to be a better way.
              </p>
              <p>
                They started small — just 50 carefully selected products across three categories. Word spread
                quickly because customers noticed the difference immediately. Every product was tested, every
                supplier was vetted, every review was real.
              </p>
              <p>
                Today, LUXE serves customers in over 40 countries with more than 2,400 products. The founders&apos;
                original promise — premium quality at honest prices — remains the foundation of everything we do.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
                'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80',
                'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&q=80',
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&q=80',
              ].map((src, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden aspect-square shadow-md ${i % 2 === 1 ? 'mt-6' : ''}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {values.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={itemVariants} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all">
                <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">The People</p>
          <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            A passionate group of designers, engineers, and product experts dedicated to making your shopping experience exceptional.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div key={member.id} variants={itemVariants} className="text-center group">
              <div className="relative w-fit mx-auto mb-4">
                <Avatar className="h-24 w-24 mx-auto ring-4 ring-background shadow-lg">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-2xl">{member.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-sm text-primary font-medium">{member.role}</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 max-w-[180px] mx-auto">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
