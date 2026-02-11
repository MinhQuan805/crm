import { api } from '@/admin/lib/api'
import type { Policy, PolicyType, CreatePolicyRequest } from './schema'

export const policiesApi = {
  list: () => api.get<Policy[]>('/admin/policies'),
  getById: (id: number) => api.get<Policy>(`/admin/policies/${id}`),
  create: (data: CreatePolicyRequest) => api.post<Policy>('/admin/policies', data),
  update: (id: number, data: CreatePolicyRequest) => api.put<Policy>(`/admin/policies/${id}`, data),
  delete: (id: number) => api.delete<void>(`/admin/policies/${id}`),
  publish: (id: number) => api.put<Policy>(`/admin/policies/${id}/publish`, {}),
  getByType: (type: PolicyType) => api.get<Policy[]>(`/admin/policies/type/${type}`)
}
