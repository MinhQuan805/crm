import { api } from '@/admin/lib/api'

export interface OverviewData {
  totalRooms: number
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
  totalCustomers: number
  monthlyRevenue: number
  occupiedRooms: number
  availableRooms: number
  revenueGrowth: number
  todayBookings: number
}

export interface TrendItem {
  date: string
  bookingCount: number
  revenue: number
}

export interface OccupancyData {
  date: string
  occupiedRooms: number
  totalRooms: number
  availableRooms: number
  occupancyRate: number
}

export interface RoomTypeStats {
  roomType: string
  count: number
}

export interface RoomStatusStats {
  status: string
  count: number
}

export interface BookingStatusStats {
  status: string
  count: number
}

export interface RevenueByRoomType {
  roomType: string
  bookingCount: number
  revenue: number
}

export interface MonthlyRevenueData {
  month: string
  revenue: number
  bookingCount: number
}

export interface RecentBookingData {
  id: number
  customerName: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  totalPrice: number
  status: string
}

export interface RevenueReportData {
  startDate: string
  endDate: string
  totalRevenue: number
  groupBy: string
  breakdown: Array<{
    period: string
    revenue: number
  }>
}

export interface OccupancyReportData {
  startDate: string
  endDate: string
  averageOccupancy: number
  data: OccupancyData[]
}

export interface BookingTrendsData {
  startDate: string
  endDate: string
  totalBookings: number
  trends: TrendItem[]
}

export const reportsApi = {
  // Dashboard overview
  getOverview: () => api.get<OverviewData>('/admin/reports/overview'),

  getDashboard: () => api.get<OverviewData>('/admin/reports/dashboard'),

  // Revenue endpoints
  getRevenue: (startDate: string, endDate: string) =>
    api.get<number>(`/admin/reports/total-revenue?startDate=${startDate}&endDate=${endDate}`),

  getRevenueReport: (startDate: string, endDate: string, groupBy: string = 'MONTH') =>
    api.get<RevenueReportData>(
      `/admin/reports/revenue?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`
    ),

  getMonthlyRevenue: (months: number = 12) =>
    api.get<MonthlyRevenueData[]>(`/admin/reports/monthly-revenue?months=${months}`),

  // Occupancy endpoints
  getOccupancy: (date: string) =>
    api.get<OccupancyData>(`/admin/reports/occupancy-today?date=${date}`),

  getOccupancyReport: (startDate: string, endDate: string) =>
    api.get<OccupancyReportData>(
      `/admin/reports/occupancy?startDate=${startDate}&endDate=${endDate}`
    ),

  // Booking endpoints
  getTrends: (startDate: string, endDate: string) =>
    api.get<TrendItem[]>(`/admin/reports/trends?startDate=${startDate}&endDate=${endDate}`),

  getBookingTrends: (startDate: string, endDate: string) =>
    api.get<BookingTrendsData>(
      `/admin/reports/booking-trends?startDate=${startDate}&endDate=${endDate}`
    ),

  getRecentBookings: (limit: number = 5) =>
    api.get<RecentBookingData[]>(`/admin/reports/recent-bookings?limit=${limit}`),

  // Room statistics
  getRoomsByType: () => api.get<RoomTypeStats[]>('/admin/reports/rooms-by-type'),

  getRoomsByStatus: () => api.get<RoomStatusStats[]>('/admin/reports/rooms-by-status'),

  getPopularRoomTypes: (startDate: string, endDate: string) =>
    api.get<RoomTypeStats[]>(
      `/admin/reports/popular-room-types?startDate=${startDate}&endDate=${endDate}`
    ),

  // Booking statistics
  getBookingsByStatus: () => api.get<BookingStatusStats[]>('/admin/reports/bookings-by-status'),

  // Revenue by room type
  getRevenueByRoomType: () => api.get<RevenueByRoomType[]>('/admin/reports/revenue-by-room-type')
}
