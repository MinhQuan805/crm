import { useState } from 'react'
import { AppSidebar } from '@/admin/components/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Dashboard } from '@/admin/features/dashboard'
import { Users } from '@/admin/features/users'

type AdminRoute = 'dashboard' | 'users'

export function AdminApp(): React.JSX.Element {
  const [currentRoute, setCurrentRoute] = useState<AdminRoute>('dashboard')

  const renderContent = () => {
    switch (currentRoute) {
      case 'users':
        return <Users />
      case 'dashboard':
      default:
        return <Dashboard />
    }
  }

  return (
    <AdminRouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>{renderContent()}</SidebarInset>
      </SidebarProvider>
    </AdminRouteContext.Provider>
  )
}

// Simple route context for navigation
import { createContext, useContext } from 'react'

type AdminRouteContextType = {
  currentRoute: AdminRoute
  setCurrentRoute: (route: AdminRoute) => void
}

export const AdminRouteContext = createContext<AdminRouteContextType | null>(null)

export const useAdminRoute = () => {
  const context = useContext(AdminRouteContext)
  if (!context) {
    throw new Error('useAdminRoute must be used within AdminRouteContext')
  }
  return context
}
