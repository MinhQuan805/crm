import { useEffect, useState } from 'react'
import { Bed, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'
import { Header, Main, TopNav } from '@/admin/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  reportsApi,
  type OverviewData,
  type TrendItem,
  type OccupancyData,
  type RoomTypeStats,
  type BookingStatusStats,
  type RevenueByRoomType
} from './data/api'

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042'
]

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN')

function getDefaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  }
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

function getBookingStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    CHECKED_IN: 'Đã nhận phòng',
    CHECKED_OUT: 'Đã trả phòng',
    CANCELLED: 'Đã hủy'
  }
  return statusMap[status] || status
}

export function Reports() {
  // Overview
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(true)

  // Trends
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [trendsLoading, setTrendsLoading] = useState(true)
  const [trendsRange, setTrendsRange] = useState(getDefaultDateRange)

  // Revenue
  const [revenue, setRevenue] = useState<number | null>(null)
  const [revenueChartData, setRevenueChartData] = useState<TrendItem[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)
  const [revenueRange, setRevenueRange] = useState(getDefaultDateRange)

  // Occupancy
  const [occupancy, setOccupancy] = useState<OccupancyData | null>(null)
  const [occupancyLoading, setOccupancyLoading] = useState(true)

  // Room statistics
  const [roomsByType, setRoomsByType] = useState<RoomTypeStats[]>([])
  const [roomsLoading, setRoomsLoading] = useState(true)

  // Booking statistics
  const [bookingsByStatus, setBookingsByStatus] = useState<BookingStatusStats[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  // Revenue by room type
  const [revenueByRoomType, setRevenueByRoomType] = useState<RevenueByRoomType[]>([])
  const [revenueByTypeLoading, setRevenueByTypeLoading] = useState(true)

  // Fetch overview on mount
  useEffect(() => {
    reportsApi
      .getOverview()
      .then(setOverview)
      .catch(console.error)
      .finally(() => setOverviewLoading(false))

    // Fetch room and booking statistics
    reportsApi
      .getRoomsByType()
      .then(setRoomsByType)
      .catch(console.error)
      .finally(() => setRoomsLoading(false))

    reportsApi
      .getBookingsByStatus()
      .then(setBookingsByStatus)
      .catch(console.error)
      .finally(() => setBookingsLoading(false))

    reportsApi
      .getRevenueByRoomType()
      .then(setRevenueByRoomType)
      .catch(console.error)
      .finally(() => setRevenueByTypeLoading(false))
  }, [])

  // Fetch trends
  useEffect(() => {
    let active = true
    setTrendsLoading(true)
    reportsApi
      .getTrends(trendsRange.startDate, trendsRange.endDate)
      .then((data) => active && setTrends(data))
      .catch(console.error)
      .finally(() => active && setTrendsLoading(false))
    return () => {
      active = false
    }
  }, [trendsRange.startDate, trendsRange.endDate])

  // Fetch revenue
  useEffect(() => {
    let active = true
    setRevenueLoading(true)
    Promise.all([
      reportsApi.getRevenue(revenueRange.startDate, revenueRange.endDate),
      reportsApi.getTrends(revenueRange.startDate, revenueRange.endDate)
    ])
      .then(([rev, data]) => {
        if (active) {
          setRevenue(rev)
          setRevenueChartData(data)
        }
      })
      .catch(console.error)
      .finally(() => active && setRevenueLoading(false))
    return () => {
      active = false
    }
  }, [revenueRange.startDate, revenueRange.endDate])

  // Fetch occupancy
  useEffect(() => {
    reportsApi
      .getOccupancy(getTodayStr())
      .then(setOccupancy)
      .catch(console.error)
      .finally(() => setOccupancyLoading(false))
  }, [])

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Báo Cáo và Thống Kê</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
          <OverviewCard
            title="Tổng Phòng"
            value={overview?.totalRooms}
            loading={overviewLoading}
            icon={<Bed className="h-4 w-4 text-muted-foreground" />}
          />
          <OverviewCard
            title="Tổng Đặt Phòng"
            value={overview?.totalBookings}
            loading={overviewLoading}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
          <OverviewCard
            title="Doanh Thu"
            value={overview ? formatVND(overview.totalRevenue) : undefined}
            loading={overviewLoading}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <OverviewCard
            title="Tỷ Lệ Lấp Đầy"
            value={overview != null ? `${overview.occupancyRate.toFixed(1)}%` : undefined}
            loading={overviewLoading}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <OverviewCard
            title="Tổng Khách Hàng"
            value={overview?.totalCustomers}
            loading={overviewLoading}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="trends" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="trends">Xu Hướng</TabsTrigger>
              <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
              <TabsTrigger value="occupancy">Công Suất</TabsTrigger>
              <TabsTrigger value="rooms">Phòng</TabsTrigger>
              <TabsTrigger value="bookings">Đặt Phòng</TabsTrigger>
            </TabsList>
          </div>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <DateRangeSelector
              startDate={trendsRange.startDate}
              endDate={trendsRange.endDate}
              onChange={setTrendsRange}
            />
            {trendsLoading ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Đang tải dữ liệu...
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Xu Hướng Đặt Phòng và Doanh Thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                      <YAxis
                        yAxisId="left"
                        label={{
                          value: 'Số đặt phòng',
                          angle: -90,
                          position: 'insideLeft'
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(v: number) => formatVND(v)}
                        label={{
                          value: 'Doanh thu',
                          angle: 90,
                          position: 'insideRight'
                        }}
                      />
                      <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number, name: string) => [
                          name === 'revenue' ? formatVND(value) : value,
                          name === 'revenue' ? 'Doanh thu' : 'Số đặt phòng'
                        ]}
                      />
                      <Legend
                        formatter={(value: string) =>
                          value === 'revenue' ? 'Doanh thu' : 'Số đặt phòng'
                        }
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="bookingCount"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-4">
            <DateRangeSelector
              startDate={revenueRange.startDate}
              endDate={revenueRange.endDate}
              onChange={setRevenueRange}
            />
            {revenueLoading ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Đang tải dữ liệu...
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Tổng Doanh Thu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {revenue != null ? formatVND(revenue) : '—'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Từ {formatDate(revenueRange.startDate)} đến {formatDate(revenueRange.endDate)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Biểu Đồ Doanh Thu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                        <YAxis tickFormatter={(v: number) => formatVND(v)} />
                        <Tooltip
                          labelFormatter={formatDate}
                          formatter={(value: number) => [formatVND(value), 'Doanh thu']}
                        />
                        <Legend formatter={() => 'Doanh thu'} />
                        <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Occupancy Tab */}
          <TabsContent value="occupancy" className="space-y-4">
            {occupancyLoading ? (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                Đang tải dữ liệu...
              </div>
            ) : occupancy ? (
              <Card>
                <CardHeader>
                  <CardTitle>Công Suất Phòng Hôm Nay</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Phòng Đã Sử Dụng</p>
                      <p className="text-3xl font-bold">{occupancy.occupiedRooms}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Tổng Số Phòng</p>
                      <p className="text-3xl font-bold">{occupancy.totalRooms}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Tỷ Lệ Lấp Đầy</p>
                      <p className="text-3xl font-bold">{occupancy.occupancyRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {occupancy.occupiedRooms} / {occupancy.totalRooms} phòng
                      </span>
                      <span className="font-medium">{occupancy.occupancyRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-secondary">
                      <div
                        className={cn(
                          'h-4 rounded-full transition-all',
                          occupancy.occupancyRate >= 80
                            ? 'bg-green-500'
                            : occupancy.occupancyRate >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        )}
                        style={{
                          width: `${Math.min(occupancy.occupancyRate, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                Không có dữ liệu công suất
              </div>
            )}
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Room by Type Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Phòng Theo Loại</CardTitle>
                </CardHeader>
                <CardContent>
                  {roomsLoading ? (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Đang tải dữ liệu...
                    </div>
                  ) : roomsByType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={roomsByType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ roomType, count, percent }) =>
                            `${roomType}: ${count} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="roomType"
                        >
                          {roomsByType.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Không có dữ liệu
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Revenue by Room Type Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Doanh Thu Theo Loại Phòng</CardTitle>
                </CardHeader>
                <CardContent>
                  {revenueByTypeLoading ? (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Đang tải dữ liệu...
                    </div>
                  ) : revenueByRoomType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueByRoomType} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(v) => formatVND(v)} />
                        <YAxis type="category" dataKey="roomType" width={100} />
                        <Tooltip formatter={(value: number) => [formatVND(value), 'Doanh thu']} />
                        <Legend formatter={() => 'Doanh thu'} />
                        <Bar dataKey="revenue" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Không có dữ liệu
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Booking by Status Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Đặt Phòng Theo Trạng Thái</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Đang tải dữ liệu...
                    </div>
                  ) : bookingsByStatus.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={bookingsByStatus.map((item) => ({
                            ...item,
                            statusLabel: getBookingStatusLabel(item.status)
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ statusLabel, count, percent }) =>
                            `${statusLabel}: ${count} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="statusLabel"
                        >
                          {bookingsByStatus.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Không có dữ liệu
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Status Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Tổng Quan Đặt Phòng</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Đang tải dữ liệu...
                    </div>
                  ) : bookingsByStatus.length > 0 ? (
                    <div className="space-y-4">
                      {bookingsByStatus.map((item, index) => {
                        const total = bookingsByStatus.reduce((sum, i) => sum + i.count, 0)
                        const percent = total > 0 ? (item.count / total) * 100 : 0
                        return (
                          <div key={item.status} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {getBookingStatusLabel(item.status)}
                              </span>
                              <span className="text-muted-foreground">
                                {item.count} ({percent.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${percent}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      Không có dữ liệu
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

/* ---- Sub-components ---- */

function OverviewCard({
  title,
  value,
  loading,
  icon
}: {
  title: string
  value?: string | number
  loading: boolean
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{value ?? '—'}</div>
        )}
      </CardContent>
    </Card>
  )
}

function DateRangeSelector({
  startDate,
  endDate,
  onChange
}: {
  startDate: string
  endDate: string
  onChange: (range: { startDate: string; endDate: string }) => void
}) {
  const [start, setStart] = useState(startDate)
  const [end, setEnd] = useState(endDate)

  const handleApply = () => {
    if (start && end) {
      onChange({ startDate: start, endDate: end })
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="text-sm font-medium mb-1 block">Từ ngày</label>
        <Input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-auto"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Đến ngày</label>
        <Input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-auto"
        />
      </div>
      <Button onClick={handleApply} size="sm">
        Áp dụng
      </Button>
    </div>
  )
}

/* ---- TopNav config ---- */

const topNav = [
  {
    title: 'Overview',
    href: '/',
    isActive: false,
    disabled: false
  },
  {
    title: 'Báo Cáo',
    href: '/reports',
    isActive: true,
    disabled: false
  }
]
