import { api } from '@/admin/lib/api'
import type {
  Room,
  RoomType,
  RoomStatus,
  CreateRoomTypeRequest,
  CreateRoomRequest,
  BulkCreateRoomRequest
} from './schema'

// Room Types API
export const roomTypesApi = {
  list: () => api.get<RoomType[]>('/admin/room-types'),
  create: (data: CreateRoomTypeRequest) => api.post<RoomType>('/admin/room-types', data),
  update: (id: number, data: CreateRoomTypeRequest) =>
    api.put<RoomType>(`/admin/room-types/${id}`, data),
  delete: (id: number) => api.delete<void>(`/admin/room-types/${id}`)
}

// Rooms API
export const roomsApi = {
  list: (params: { roomTypeId?: number; status?: RoomStatus }) => {
    const searchParams = new URLSearchParams()
    if (params.roomTypeId) searchParams.append('roomTypeId', String(params.roomTypeId))
    if (params.status) searchParams.append('status', params.status)
    return api.get<Room[]>(`/admin/rooms?${searchParams.toString()}`)
  },
  getById: (id: number) => api.get<Room>(`/admin/rooms/${id}`),
  create: (data: CreateRoomRequest) => api.post<Room>('/admin/rooms', data),
  bulkCreate: (data: BulkCreateRoomRequest) => api.post<Room[]>('/admin/rooms/bulk', data),
  update: (id: number, data: CreateRoomRequest) => api.put<Room>(`/admin/rooms/${id}`, data),
  delete: (id: number) => api.delete<void>(`/admin/rooms/${id}`),
  updateStatus: (id: number, status: RoomStatus) =>
    api.put<Room>(`/admin/rooms/${id}/status?status=${status}`, {}),
  available: (checkIn: string, checkOut: string) =>
    api.get<Room[]>(`/admin/rooms/availability?checkInDate=${checkIn}&checkOutDate=${checkOut}`)
}
