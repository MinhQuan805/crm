import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Star, CalendarDays, DollarSign, Hotel, Clock } from 'lucide-react'
import { customersApi } from '../data/api'
import type { Customer, CustomerStats, CustomerBooking } from '../data/schema'

type CustomersDetailDialogProps = {
  currentRow: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export function CustomersDetailDialog({
  currentRow,
  open,
  onOpenChange
}: CustomersDetailDialogProps) {
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    if (!open || !currentRow) return

    const fetchStats = async () => {
      try {
        setLoadingStats(true)
        const data = await customersApi.getStats(currentRow.id)
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch customer stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true)
        const data = await customersApi.getBookings(currentRow.id)
        setBookings(data.content || [])
      } catch (error) {
        console.error('Failed to fetch customer bookings:', error)
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchStats()
    fetchBookings()
  }, [open, currentRow])

  const statusMap: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
  > = {
    CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
    CHECKED_IN: { label: 'Đang ở', variant: 'default' },
    CHECKED_OUT: { label: 'Đã trả phòng', variant: 'secondary' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
    PENDING: { label: 'Chờ xác nhận', variant: 'outline' }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <ErrorBoundary resetKeys={[currentRow.id, open]}>
          <DialogHeader className="text-start">
            <DialogTitle className="flex items-center gap-2">
              {currentRow.firstName} {currentRow.lastName}
              {currentRow.isVIP && (
                <Badge variant="outline" className="border-0 bg-amber-100 text-amber-800 gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  VIP
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>Chi Tiết Khách Hàng</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="info">Thông Tin</TabsTrigger>
              <TabsTrigger value="stats">Thống Kê</TabsTrigger>
              <TabsTrigger value="bookings">Đặt Phòng</TabsTrigger>
            </TabsList>

            {/* Tab: Thông Tin */}
            <TabsContent value="info" className="mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Họ:</span>
                  <p className="font-medium">{currentRow.firstName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tên:</span>
                  <p className="font-medium">{currentRow.lastName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{currentRow.email || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Số điện thoại:</span>
                  <p className="font-medium">{currentRow.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">CMND/CCCD:</span>
                  <p className="font-medium">{currentRow.idNumber || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quốc tịch:</span>
                  <p className="font-medium">{currentRow.nationality || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ngày sinh:</span>
                  <p className="font-medium">{formatDate(currentRow.dateOfBirth)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Địa chỉ:</span>
                  <p className="font-medium">{currentRow.address || '—'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Ghi chú:</span>
                  <p className="font-medium">{currentRow.notes || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <p className="font-medium">{formatDate(currentRow.createdAt)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                  <p className="font-medium">{formatDate(currentRow.updatedAt)}</p>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Thống Kê */}
            <TabsContent value="stats" className="mt-4">
              {loadingStats ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full" />
                  ))}
                </div>
              ) : stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng đặt phòng</CardTitle>
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatVND(stats.totalSpent)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lần ghé thăm cuối</CardTitle>
                      <Hotel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatDate(stats.lastVisit)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Thời gian lưu trú TB</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Number.isFinite(stats.averageStay) ? stats.averageStay.toFixed(1) : '—'}{' '}
                        <span className="text-sm font-normal text-muted-foreground">đêm</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Không có dữ liệu thống kê.</p>
              )}
            </TabsContent>

            {/* Tab: Đặt Phòng */}
            <TabsContent value="bookings" className="mt-4">
              {loadingBookings ? (
                <Skeleton className="h-48 w-full" />
              ) : bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Khách hàng chưa có đặt phòng nào.
                </p>
              ) : (
                <div className="overflow-hidden rounded-md border max-h-[40vh] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Phòng</TableHead>
                        <TableHead>Nhận phòng</TableHead>
                        <TableHead>Trả phòng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Tổng tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => {
                        const status = statusMap[booking.status] ?? {
                          label: booking.status,
                          variant: 'outline' as const
                        }
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.roomNumber || '—'}
                            </TableCell>
                            <TableCell>{formatDate(booking.checkIn)}</TableCell>
                            <TableCell>{formatDate(booking.checkOut)}</TableCell>
                            <TableCell>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {booking.totalPrice != null ? formatVND(booking.totalPrice) : '—'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  )
}
