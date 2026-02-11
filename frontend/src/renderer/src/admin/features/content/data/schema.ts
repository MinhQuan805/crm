import { z } from 'zod'

// Policy type
export const policyTypeSchema = z.union([
  z.literal('CANCELLATION'),
  z.literal('TERMS'),
  z.literal('PRIVACY'),
  z.literal('CHECKIN_CHECKOUT')
])
export type PolicyType = z.infer<typeof policyTypeSchema>

// Policy schema
export const policySchema = z.object({
  id: z.number(),
  type: policyTypeSchema,
  title: z.string(),
  content: z.string(),
  language: z.string(),
  isActive: z.boolean(),
  version: z.number(),
  updatedAt: z.string().nullable().optional()
})
export type Policy = z.infer<typeof policySchema>

export const policyListSchema = z.array(policySchema)

// Create policy request
export const createPolicySchema = z.object({
  type: policyTypeSchema,
  title: z.string().min(1, 'Tiêu đề là bắt buộc.'),
  content: z.string().min(1, 'Nội dung là bắt buộc.'),
  language: z.string().optional().default('vi')
})
export type CreatePolicyRequest = z.infer<typeof createPolicySchema>
