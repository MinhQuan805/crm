import { z } from 'zod'

// Room status
export const roomStatusSchema = z.union([
  z.literal('AVAILABLE'),
  z.literal('OCCUPIED'),
  z.literal('MAINTENANCE'),
  z.literal('RESERVED')
])
export type RoomStatus = z.infer<typeof roomStatusSchema>

// Room Type schema
export const roomTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  capacity: z.number(),
  basePrice: z.number(),
  images: z.array(z.string()).nullable().optional(),
  amenities: z.array(z.string()).nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional()
})
export type RoomType = z.infer<typeof roomTypeSchema>

export const roomTypeListSchema = z.array(roomTypeSchema)

// Room schema
export const roomSchema = z.object({
  id: z.number(),
  roomTypeId: z.number(),
  roomTypeName: z.string().nullable().optional(),
  roomNumber: z.string(),
  floor: z.number(),
  status: roomStatusSchema,
  notes: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional()
})
export type Room = z.infer<typeof roomSchema>

export const roomListSchema = z.array(roomSchema)

// Create room type request
export const createRoomTypeSchema = z.object({
  name: z.string().min(1, 'Tên loại phòng là bắt buộc.'),
  description: z.string().default(''),
  capacity: z.number().min(1, 'Sức chứa phải lớn hơn 0.'),
  basePrice: z.number().min(0, 'Giá cơ bản không được âm.'),
  images: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([])
})
export type CreateRoomTypeRequest = z.infer<typeof createRoomTypeSchema>

// Create room request
export const createRoomSchema = z.object({
  roomTypeId: z.number().min(1, 'Loại phòng là bắt buộc.'),
  roomNumber: z.string().min(1, 'Số phòng là bắt buộc.'),
  floor: z.number().min(0, 'Tầng không được âm.'),
  status: roomStatusSchema.default('AVAILABLE'),
  notes: z.string().default('')
})
export type CreateRoomRequest = z.infer<typeof createRoomSchema>

// Bulk create rooms request
export const bulkCreateRoomSchema = z.object({
  roomTypeId: z.number().min(1, 'Loại phòng là bắt buộc.'),
  floor: z.number().min(0, 'Tầng không được âm.'),
  roomNumbers: z.string().min(1, 'Danh sách số phòng là bắt buộc.'),
  status: roomStatusSchema.default('AVAILABLE')
})
export type BulkCreateRoomFormValues = z.infer<typeof bulkCreateRoomSchema>

export type BulkCreateRoomRequest = {
  roomTypeId: number
  floor: number
  roomNumbers: string[]
  status: RoomStatus
}
