import { useEffect, useState } from 'react'
import { Bed, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsChart } from './analytics-chart'
import { dashboardApi, type DashboardOverview } from '../data/api'

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

export function Analytics() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    dashboardApi
      .getOverview()
      .then(setOverview)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Xu Hướng 7 Ngày Qua</CardTitle>
          <CardDescription>Đặt phòng và doanh thu hàng ngày</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <AnalyticsChart />
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đặt Phòng Hôm Nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview?.todayBookings ?? 0}</div>
                <p className="text-xs text-muted-foreground">Đặt phòng mới</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng Trống</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview?.availableRooms ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  /{overview?.totalRooms ?? 0} tổng phòng
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ Lệ Lấp Đầy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overview?.occupancyRate?.toFixed(1) ?? 0}%
                </div>
                <p className="text-xs text-muted-foreground">Công suất hiện tại</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh Thu Tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {overview ? formatVND(overview.monthlyRevenue) : '—'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {overview && overview.revenueGrowth >= 0 ? '+' : ''}
                  {overview?.revenueGrowth?.toFixed(1) ?? 0}% so với tháng trước
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
