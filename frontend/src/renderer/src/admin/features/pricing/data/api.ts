import { api } from '@/admin/lib/api'
import type {
  SeasonalPrice,
  CreateSeasonalPriceRequest,
  DailyPrice,
  CreateDailyPriceRequest,
  Promotion,
  CreatePromotionRequest
} from './schema'

// Seasonal Pricing API
export const seasonalPricingApi = {
  list: (roomTypeId?: number) => {
    const params = roomTypeId ? `?roomTypeId=${roomTypeId}` : ''
    return api.get<SeasonalPrice[]>(`/admin/pricing/seasonal${params}`)
  },
  create: (data: CreateSeasonalPriceRequest) =>
    api.post<SeasonalPrice>('/admin/pricing/seasonal', data),
  update: (id: number, data: CreateSeasonalPriceRequest) =>
    api.put<SeasonalPrice>(`/admin/pricing/seasonal/${id}`, data),
  delete: (id: number) => api.delete<void>(`/admin/pricing/seasonal/${id}`)
}

// Daily Pricing API
export const dailyPricingApi = {
  list: (params?: { roomTypeId?: number; startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.roomTypeId) searchParams.append('roomTypeId', String(params.roomTypeId))
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    const qs = searchParams.toString()
    return api.get<DailyPrice[]>(`/admin/pricing/daily${qs ? `?${qs}` : ''}`)
  },
  create: (data: CreateDailyPriceRequest) => api.post<DailyPrice>('/admin/pricing/daily', data),
  update: (id: number, data: CreateDailyPriceRequest) =>
    api.put<DailyPrice>(`/admin/pricing/daily/${id}`, data),
  delete: (id: number) => api.delete<void>(`/admin/pricing/daily/${id}`)
}

// Promotions API
export const promotionsApi = {
  list: () => api.get<Promotion[]>('/admin/pricing/promotions'),
  listActive: () => api.get<Promotion[]>('/admin/pricing/promotions/active'),
  create: (data: CreatePromotionRequest) => api.post<Promotion>('/admin/pricing/promotions', data),
  update: (id: number, data: CreatePromotionRequest) =>
    api.put<Promotion>(`/admin/pricing/promotions/${id}`, data),
  delete: (id: number) => api.delete<void>(`/admin/pricing/promotions/${id}`)
}
