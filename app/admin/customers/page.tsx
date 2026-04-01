'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCustomerStore } from '@/stores/customerStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice, formatDate } from '@/lib/utils'

const PAGE_SIZE = 10

export default function CustomersPage() {
  const { customers, loading, fetchCustomers } = useCustomerStore()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }, [customers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Customer</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Orders</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden lg:table-cell">Total Spent</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden xl:table-cell">Joined</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </td>
                        {Array.from({ length: 4 }).map((_, j) => (
                          <td key={j} className="px-4 py-3 hidden sm:table-cell">
                            <Skeleton className="h-4 w-20" />
                          </td>
                        ))}
                        <td className="px-4 py-3"><Skeleton className="h-7 w-7" /></td>
                      </tr>
                    ))
                  : paginated.map((customer) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={customer.avatar} alt={customer.name} />
                              <AvatarFallback className="text-xs">
                                {customer.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-xs text-muted-foreground sm:hidden">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {customer.email}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="font-medium">{customer.totalOrders}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell font-medium">
                          {formatPrice(customer.totalSpent)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell">
                          {formatDate(customer.joinDate)}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link href={`/admin/customers/${customer.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-sm">No customers found</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium">{page} / {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
