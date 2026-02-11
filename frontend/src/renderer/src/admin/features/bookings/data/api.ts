import { api } from '@/admin/lib/api'
import type { Booking, BookingHistory, BookingStatus, CreateBookingRequest } from './schema'

export const bookingsApi = {
  list: (params: { status?: BookingStatus; startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams()
    if (params.status) searchParams.append('status', params.status)
    if (params.startDate) searchParams.append('startDate', params.startDate)
    if (params.endDate) searchParams.append('endDate', params.endDate)
    const qs = searchParams.toString()
    return api.get<Booking[]>(`/admin/bookings${qs ? `?${qs}` : ''}`)
  },
  getById: (id: number) => api.get<Booking>(`/admin/bookings/${id}`),
  create: (data: CreateBookingRequest) => api.post<Booking>('/admin/bookings', data),
  update: (id: number, data: CreateBookingRequest) =>
    api.put<Booking>(`/admin/bookings/${id}`, data),
  delete: (id: number) => api.delete<void>(`/admin/bookings/${id}`),
  confirm: (id: number) => api.put<Booking>(`/admin/bookings/${id}/confirm`, {}),
  checkIn: (id: number) => api.put<Booking>(`/admin/bookings/${id}/check-in`, {}),
  checkOut: (id: number) => api.put<Booking>(`/admin/bookings/${id}/check-out`, {}),
  cancel: (id: number) => api.put<Booking>(`/admin/bookings/${id}/cancel`, {}),
  getHistory: (id: number) => api.get<BookingHistory[]>(`/admin/bookings/${id}/history`)
}
