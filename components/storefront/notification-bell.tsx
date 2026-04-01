'use client'

import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/stores/notificationStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, formatDate } from '@/lib/utils'
import type { NotificationType } from '@/types'

function NotificationIcon({ type }: { type: NotificationType }) {
  const iconClass = 'h-4 w-4 shrink-0'
  switch (type) {
    case 'success':
      return <CheckCircle className={cn(iconClass, 'text-green-500')} />
    case 'warning':
      return <AlertTriangle className={cn(iconClass, 'text-yellow-500')} />
    case 'error':
      return <XCircle className={cn(iconClass, 'text-red-500')} />
    default:
      return <Info className={cn(iconClass, 'text-blue-500')} />
  }
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return formatDate(dateStr)
}

export function NotificationBell() {
  const { notifications, markAllRead, markRead, getUnreadCount } = useNotificationStore()
  const router = useRouter()
  const unreadCount = getUnreadCount()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <DropdownMenuLabel className="p-0 text-base font-semibold">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={markAllRead}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 cursor-pointer focus:bg-accent',
                  !notif.read && 'bg-primary/5'
                )}
                onClick={() => {
                  markRead(notif.id)
                  if (notif.link) router.push(notif.link)
                }}
              >
                <NotificationIcon type={notif.type} />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm leading-snug', !notif.read && 'font-medium')}>{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{relativeTime(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
