import { z } from 'zod'

// Customer schema
export const customerSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  idNumber: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  isVIP: z.boolean().default(false),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional()
})
export type Customer = z.infer<typeof customerSchema>

export const customerListSchema = z.array(customerSchema)

// Spring Page response
export const customerPageSchema = z.object({
  content: z.array(customerSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number()
})
export type CustomerPage = z.infer<typeof customerPageSchema>

// Customer stats schema
export const customerStatsSchema = z.object({
  totalBookings: z.number(),
  totalSpent: z.number(),
  lastVisit: z.string().nullable(),
  averageStay: z.number()
})
export type CustomerStats = z.infer<typeof customerStatsSchema>

// Booking (for customer's bookings list)
export const customerBookingSchema = z.object({
  id: z.number(),
  roomNumber: z.string().nullable().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  status: z.string(),
  totalPrice: z.number().nullable().optional(),
  createdAt: z.string().nullable().optional()
})
export type CustomerBooking = z.infer<typeof customerBookingSchema>

// Create/Update customer request
export const createCustomerSchema = z.object({
  firstName: z.string().min(1, 'Họ là bắt buộc.'),
  lastName: z.string().min(1, 'Tên là bắt buộc.'),
  email: z.email('Email không hợp lệ.').or(z.literal('')).optional().default(''),
  phone: z.string().optional().default(''),
  idNumber: z.string().optional().default(''),
  nationality: z.string().optional().default(''),
  dateOfBirth: z.string().optional().default(''),
  address: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  isVIP: z.boolean().optional().default(false)
})
export type CreateCustomerRequest = z.infer<typeof createCustomerSchema>
