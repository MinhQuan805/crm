import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'client')[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps): React.JSX.Element {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  // Not authenticated - redirect to sign-in
  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate page based on user's actual role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (user.role === 'client') {
      return <Navigate to="/client" replace />
    }
    // Fallback - logout and redirect to sign-in
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}

export function PublicRoute({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user) {
    // Redirect authenticated users to their appropriate dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (user.role === 'client') {
      return <Navigate to="/client" replace />
    }
  }

  return <>{children}</>
}
