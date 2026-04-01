'use client'

import { useState } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { resetAllMockData } from '@/lib/mock-api/reset'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const STORE_SETTINGS = {
  name: 'LUXE Store',
  currency: 'USD (United States Dollar)',
  timezone: 'America/New_York (UTC-5)',
  email: 'hello@luxestore.demo',
  supportPhone: '+1 (555) 000-1234',
}

const NOTIFICATION_SETTINGS = [
  { id: 'new_order', label: 'New Orders', description: 'Get notified when a new order is placed', defaultChecked: true },
  { id: 'low_stock', label: 'Low Stock Alerts', description: 'Alert when product stock falls below 10 units', defaultChecked: true },
  { id: 'new_customer', label: 'New Customers', description: 'Notify when a new customer registers', defaultChecked: false },
  { id: 'order_shipped', label: 'Order Shipped', description: 'Confirmation when orders are marked as shipped', defaultChecked: true },
  { id: 'reviews', label: 'Product Reviews', description: 'Notify on new product reviews', defaultChecked: false },
]

export default function SettingsPage() {
  const [resetting, setResetting] = useState(false)
  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultChecked]))
  )

  const handleReset = async () => {
    setResetting(true)
    try {
      // Small async delay for UX
      await new Promise((r) => setTimeout(r, 600))
      resetAllMockData()
      toast.success('Demo data has been reset successfully')
    } catch {
      toast.error('Failed to reset demo data')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Store Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(STORE_SETTINGS).map(([key, value]) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{value}</p>
              </div>
            </div>
          ))}
          <div className="pt-2 pb-1">
            <p className="text-xs text-muted-foreground italic">
              Store settings are display-only in this demo environment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo Data Reset */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Demo Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm font-medium text-destructive">Warning</p>
            <p className="text-sm text-muted-foreground mt-1">
              Resetting will restore all products, orders, and customers to their original demo state.
              Any changes you have made (product edits, order status updates, etc.) will be lost.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={resetting}
            className="gap-2"
          >
            <RotateCcw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Resetting...' : 'Reset Demo Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {NOTIFICATION_SETTINGS.map((setting, i) => (
            <div key={setting.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor={setting.id} className="text-sm font-medium cursor-pointer">
                    {setting.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                </div>
                <Switch
                  id={setting.id}
                  checked={notifSettings[setting.id]}
                  onCheckedChange={(checked) =>
                    setNotifSettings((prev) => ({ ...prev, [setting.id]: checked }))
                  }
                />
              </div>
              {i < NOTIFICATION_SETTINGS.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground italic">
              Notification preferences are display-only in this demo environment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
