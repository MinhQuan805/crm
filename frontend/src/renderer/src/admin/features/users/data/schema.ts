import { z } from 'zod'

// User status schema
export const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended')
])
export type UserStatus = z.infer<typeof userStatusSchema>

// User role schema
export const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('manager'),
  z.literal('staff'),
  z.literal('client')
])
export type UserRole = z.infer<typeof userRoleSchema>

// User schema
export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string().nullable().optional(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional()
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)

// Create user request schema
export const createUserSchema = z.object({
  firstName: z.string().min(1, 'Tên là bắt buộc.'),
  lastName: z.string().min(1, 'Họ là bắt buộc.'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự.'),
  email: z.email('Email không hợp lệ.'),
  phoneNumber: z.string().optional().default(''),
  status: userStatusSchema.default('active'),
  role: userRoleSchema.default('client'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.')
})
export type CreateUserRequest = z.infer<typeof createUserSchema>

// Update user request schema
export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'Tên là bắt buộc.'),
  lastName: z.string().min(1, 'Họ là bắt buộc.'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự.'),
  email: z.email('Email không hợp lệ.'),
  phoneNumber: z.string().optional().default(''),
  status: userStatusSchema,
  role: userRoleSchema,
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.').optional()
})
export type UpdateUserRequest = z.infer<typeof updateUserSchema>
