import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'hotel_access_token'
const USER_DATA = 'hotel_user_data'

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'staff' | 'client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  exp: number
}

interface AuthState {
  user: AuthUser | null
  accessToken: string
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
  setAccessToken: (accessToken: string) => void
  login: (user: AuthUser, token: string) => void
  logout: () => void
  isAdmin: () => boolean
  isClient: () => boolean
  isSuperAdmin: () => boolean
  isManager: () => boolean
  isStaff: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Initialize from cookies
  const cookieToken = getCookie(ACCESS_TOKEN)
  const cookieUser = getCookie(USER_DATA)

  let initToken = ''
  let initUser: AuthUser | null = null

  try {
    if (cookieToken) {
      initToken = JSON.parse(cookieToken)
    }
    if (cookieUser) {
      initUser = JSON.parse(cookieUser)
      // Check if user session is expired
      if (initUser && initUser.exp < Date.now()) {
        initUser = null
        initToken = ''
        removeCookie(ACCESS_TOKEN)
        removeCookie(USER_DATA)
      }
    }
  } catch {
    initToken = ''
    initUser = null
  }

  return {
    user: initUser,
    accessToken: initToken,
    isAuthenticated: !!initToken && !!initUser,

    setUser: (user) =>
      set((state) => {
        if (user) {
          setCookie(USER_DATA, JSON.stringify(user))
        } else {
          removeCookie(USER_DATA)
        }
        return { ...state, user, isAuthenticated: !!user && !!state.accessToken }
      }),

    setAccessToken: (accessToken) =>
      set((state) => {
        setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
        return { ...state, accessToken, isAuthenticated: !!accessToken && !!state.user }
      }),

    login: (user, token) =>
      set(() => {
        setCookie(ACCESS_TOKEN, JSON.stringify(token))
        setCookie(USER_DATA, JSON.stringify(user))
        return { user, accessToken: token, isAuthenticated: true }
      }),

    logout: () =>
      set(() => {
        removeCookie(ACCESS_TOKEN)
        removeCookie(USER_DATA)
        return { user: null, accessToken: '', isAuthenticated: false }
      }),

    isAdmin: () => {
      const { user } = get()
      return user?.role === 'admin' || user?.role === 'superadmin'
    },

    isClient: () => {
      const { user } = get()
      return user?.role === 'client'
    },

    isSuperAdmin: () => {
      const { user } = get()
      return user?.role === 'superadmin'
    },

    isManager: () => {
      const { user } = get()
      return user?.role === 'manager'
    },

    isStaff: () => {
      const { user } = get()
      return user?.role === 'staff'
    }
  }
})
