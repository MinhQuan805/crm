import { api } from '@/admin/lib/api'

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'staff' | 'client'
export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'

export interface LoginRequest {
  email: string
  password: string
}

export interface UserDTO {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  accessToken: string
  user: UserDTO
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  
  register: (data: RegisterRequest) => api.post<UserDTO>('/auth/register', data),
  
  getCurrentUser: (email: string) => api.get<UserDTO>(`/auth/me?email=${encodeURIComponent(email)}`)
}
