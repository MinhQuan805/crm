import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { dashboardApi, type RecentBooking } from '../data/api'

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    PENDING: { label: 'Chờ xử lý', variant: 'outline' },
    CONFIRMED: { label: 'Đã xác nhận', variant: 'secondary' },
    CHECKED_IN: { label: 'Đã nhận phòng', variant: 'default' },
    CHECKED_OUT: { label: 'Đã trả phòng', variant: 'default' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' }
  }
  return statusMap[status] || { label: status, variant: 'outline' as const }
}

const getInitials = (name: string) => {
  if (!name || name === 'N/A') return 'KH'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function RecentSales() {
  const [bookings, setBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    dashboardApi
      .getRecentBookings(5)
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="flex flex-1 flex-wrap items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!bookings.length) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Chưa có đặt phòng nào
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {bookings.map((booking) => {
        const status = getStatusBadge(booking.status)
        return (
          <div key={booking.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getInitials(booking.customerName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm leading-none font-medium">{booking.customerName}</p>
                <p className="text-sm text-muted-foreground">Phòng {booking.roomNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={status.variant}>{status.label}</Badge>
                <div className="font-medium text-right">{formatVND(booking.totalPrice)}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
