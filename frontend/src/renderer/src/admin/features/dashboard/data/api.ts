import { api } from '@/admin/lib/api'

export interface DashboardOverview {
  totalRooms: number
  totalCustomers: number
  totalBookings: number
  monthlyRevenue: number
  totalRevenue: number
  occupiedRooms: number
  availableRooms: number
  occupancyRate: number
  revenueGrowth: number
  todayBookings: number
}

export interface MonthlyRevenue {
  month: string
  year: number
  revenue: number
  bookings: number
}

export interface RecentBooking {
  id: number
  customerName: string
  customerEmail: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  totalPrice: number
  status: string
  createdAt: string
}

export const dashboardApi = {
  getOverview: () => api.get<DashboardOverview>('/admin/reports/overview'),

  getMonthlyRevenue: (months: number = 12) =>
    api.get<MonthlyRevenue[]>(`/admin/reports/monthly-revenue?months=${months}`),

  getRecentBookings: (limit: number = 5) =>
    api.get<RecentBooking[]>(`/admin/reports/recent-bookings?limit=${limit}`)
}
