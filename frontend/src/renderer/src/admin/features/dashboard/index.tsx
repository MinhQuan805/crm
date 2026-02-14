import { useEffect, useState } from 'react'
import { Bed, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/admin/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { dashboardApi, type DashboardOverview } from './data/api'

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

export function Dashboard() {
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
    <>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Bảng điều khiển</h1>
          <div className="flex items-center space-x-2">
            <Button onClick={() => window.location.reload()}>Làm mới</Button>
          </div>
        </div>
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                        {overview?.revenueGrowth.toFixed(1)}% so với tháng trước
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng Khách Hàng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{overview?.totalCustomers ?? '—'}</div>
                      <p className="text-xs text-muted-foreground">Khách hàng đã đăng ký</p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng Đặt Phòng</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{overview?.totalBookings ?? '—'}</div>
                      <p className="text-xs text-muted-foreground">
                        +{overview?.todayBookings ?? 0} hôm nay
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Công Suất Phòng</CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {overview?.occupiedRooms ?? 0}/{overview?.totalRooms ?? 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {overview?.occupancyRate?.toFixed(1) ?? 0}% lấp đầy
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Doanh Thu 12 Tháng</CardTitle>
                </CardHeader>
                <CardContent className="ps-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Đặt Phòng Gần Đây</CardTitle>
                  <CardDescription>
                    {overview?.todayBookings ?? 0} đặt phòng hôm nay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
