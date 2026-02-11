import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, LogIn, LogOut, XCircle } from 'lucide-react'
import { bookingsApi } from '../data/api'
import type { Booking, BookingHistory, BookingStatus } from '../data/schema'
import { useBookings } from './bookings-provider'

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  CHECKED_IN: 'bg-green-100 text-green-800',
  CHECKED_OUT: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  CHECKED_IN: 'Đã nhận phòng',
  CHECKED_OUT: 'Đã trả phòng',
  CANCELLED: 'Đã hủy'
}

const formatCurrency = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN')

const formatDateTime = (date: string) => new Date(date).toLocaleString('vi-VN')

type BookingsDetailDialogProps = {
  currentRow: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingsDetailDialog({
  currentRow,
  open,
  onOpenChange
}: BookingsDetailDialogProps) {
  const { confirmBooking, checkInBooking, checkOutBooking, cancelBooking, setCurrentRow } =
    useBookings()
  const [history, setHistory] = useState<BookingHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (open && currentRow) {
      setLoadingHistory(true)
      bookingsApi
        .getHistory(currentRow.id)
        .then((data) => setHistory(data))
        .catch((error) => {
          console.error('Failed to fetch booking history:', error)
          toast.error('Không thể tải lịch sử đặt phòng.')
        })
        .finally(() => setLoadingHistory(false))
    }
  }, [open, currentRow])

  const handleStatusAction = async (action: () => Promise<void>) => {
    try {
      setActionLoading(true)
      await action()
      onOpenChange(false)
    } catch (error) {
      console.error('Status action error:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-start">
          <DialogTitle>Chi tiết đặt phòng #{currentRow.id}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông Tin</TabsTrigger>
            <TabsTrigger value="history">Lịch Sử</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Card>
              <CardContent className="grid gap-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                    <p className="text-sm">{currentRow.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phòng</p>
                    <p className="text-sm">{currentRow.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                    <Badge
                      variant="outline"
                      className={cn('border-0', statusColors[currentRow.status])}
                    >
                      {statusLabels[currentRow.status]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày nhận phòng</p>
                    <p className="text-sm">{formatDate(currentRow.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày trả phòng</p>
                    <p className="text-sm">{formatDate(currentRow.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng tiền</p>
                    <p className="text-sm font-semibold">{formatCurrency(currentRow.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                    <p className="text-sm">
                      {currentRow.createdAt ? formatDateTime(currentRow.createdAt) : '—'}
                    </p>
                  </div>
                </div>
                {currentRow.specialRequests && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Yêu cầu đặc biệt</p>
                    <p className="text-sm">{currentRow.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {loadingHistory ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : sortedHistory.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Chưa có lịch sử.</p>
            ) : (
              <div className="relative space-y-0">
                {sortedHistory.map((item, index) => (
                  <div key={item.id} className="flex gap-4 pb-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      {index < sortedHistory.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(item.timestamp)} — {item.performedBy}
                      </p>
                      {item.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Status action buttons */}
        <div className="flex justify-end gap-2 border-t pt-4">
          {currentRow.status === 'PENDING' && (
            <Button
              size="sm"
              onClick={() => handleStatusAction(() => confirmBooking(currentRow.id))}
              disabled={actionLoading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Xác nhận
            </Button>
          )}
          {currentRow.status === 'CONFIRMED' && (
            <Button
              size="sm"
              onClick={() => handleStatusAction(() => checkInBooking(currentRow.id))}
              disabled={actionLoading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Check-in
            </Button>
          )}
          {currentRow.status === 'CHECKED_IN' && (
            <Button
              size="sm"
              onClick={() => handleStatusAction(() => checkOutBooking(currentRow.id))}
              disabled={actionLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Check-out
            </Button>
          )}
          {currentRow.status !== 'CANCELLED' && currentRow.status !== 'CHECKED_OUT' && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusAction(() => cancelBooking(currentRow.id))}
              disabled={actionLoading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Hủy đặt phòng
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
