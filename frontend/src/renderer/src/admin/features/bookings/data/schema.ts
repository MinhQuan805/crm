import { z } from 'zod'

// Booking status
export const bookingStatusSchema = z.union([
  z.literal('PENDING'),
  z.literal('CONFIRMED'),
  z.literal('CHECKED_IN'),
  z.literal('CHECKED_OUT'),
  z.literal('CANCELLED')
])
export type BookingStatus = z.infer<typeof bookingStatusSchema>

// Booking schema
export const bookingSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  customerName: z.string(),
  roomId: z.number(),
  roomNumber: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  totalPrice: z.number(),
  status: bookingStatusSchema,
  specialRequests: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional()
})
export type Booking = z.infer<typeof bookingSchema>

export const bookingListSchema = z.array(bookingSchema)

// Booking history schema
export const bookingHistorySchema = z.object({
  id: z.number(),
  bookingId: z.number(),
  action: z.string(),
  performedBy: z.string(),
  timestamp: z.string(),
  notes: z.string().nullable().optional()
})
export type BookingHistory = z.infer<typeof bookingHistorySchema>

export const bookingHistoryListSchema = z.array(bookingHistorySchema)

// Create booking request
export const createBookingSchema = z.object({
  customerId: z.number().min(1, 'Khách hàng là bắt buộc.'),
  roomId: z.number().min(1, 'Phòng là bắt buộc.'),
  checkInDate: z.string().min(1, 'Ngày nhận phòng là bắt buộc.'),
  checkOutDate: z.string().min(1, 'Ngày trả phòng là bắt buộc.'),
  specialRequests: z.string().optional().default('')
})
export type CreateBookingRequest = z.infer<typeof createBookingSchema>
