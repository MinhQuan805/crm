import { z } from 'zod'

// ==================== Seasonal Pricing ====================

export const seasonalPriceSchema = z.object({
  id: z.number(),
  roomTypeId: z.number(),
  roomTypeName: z.string().nullable().optional(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  priceMultiplier: z.number(),
  priority: z.number()
})
export type SeasonalPrice = z.infer<typeof seasonalPriceSchema>

export const createSeasonalPriceSchema = z.object({
  roomTypeId: z.number().min(1, 'Loại phòng là bắt buộc.'),
  name: z.string().min(1, 'Tên mùa là bắt buộc.'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc.'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc.'),
  priceMultiplier: z.number().min(0.01, 'Hệ số giá phải lớn hơn 0.'),
  priority: z.number().min(0, 'Độ ưu tiên không được âm.')
})
export type CreateSeasonalPriceRequest = z.infer<typeof createSeasonalPriceSchema>

export const dailyPriceSchema = z.object({
  id: z.number(),
  roomTypeId: z.number(),
  roomTypeName: z.string().nullable().optional(),
  date: z.string(),
  price: z.number(),
  reason: z.string().nullable().optional()
})
export type DailyPrice = z.infer<typeof dailyPriceSchema>

export const createDailyPriceSchema = z.object({
  roomTypeId: z.number().min(1, 'Loại phòng là bắt buộc.'),
  date: z.string().min(1, 'Ngày là bắt buộc.'),
  price: z.number().min(0, 'Giá không được âm.'),
  reason: z.string().optional().default('')
})
export type CreateDailyPriceRequest = z.infer<typeof createDailyPriceSchema>

// ==================== Promotions ====================

export const discountTypeSchema = z.union([z.literal('PERCENTAGE'), z.literal('FIXED')])
export type DiscountType = z.infer<typeof discountTypeSchema>

export const promotionSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string().nullable().optional(),
  discountType: discountTypeSchema,
  discountValue: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  minNights: z.number().nullable().optional(),
  maxUses: z.number().nullable().optional(),
  usedCount: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional()
})
export type Promotion = z.infer<typeof promotionSchema>

export const createPromotionSchema = z.object({
  code: z.string().min(1, 'Mã khuyến mãi là bắt buộc.'),
  description: z.string().default(''),
  discountType: discountTypeSchema,
  discountValue: z.number().min(0.01, 'Giá trị giảm phải lớn hơn 0.'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc.'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc.'),
  minNights: z.number().min(0, 'Số đêm tối thiểu không được âm.').optional(),
  maxUses: z.number().min(0, 'Số lần sử dụng tối đa không được âm.').optional(),
  isActive: z.boolean().default(true)
})
export type CreatePromotionRequest = z.infer<typeof createPromotionSchema>
