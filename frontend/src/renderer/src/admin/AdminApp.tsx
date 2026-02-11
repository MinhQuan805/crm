import { useState, lazy, Suspense, createContext, useContext } from 'react'
import { AppSidebar } from '@/admin/components/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Dashboard } from '@/admin/features/dashboard'
import { Users } from '@/admin/features/users'

// Lazy load new feature modules
const Rooms = lazy(() => import('@/admin/features/rooms').then((m) => ({ default: m.Rooms })))
const RoomTypes = lazy(() =>
  import('@/admin/features/rooms/room-types').then((m) => ({ default: m.RoomTypes }))
)
const Bookings = lazy(() =>
  import('@/admin/features/bookings').then((m) => ({ default: m.Bookings }))
)
const SeasonalPricing = lazy(() =>
  import('@/admin/features/pricing/seasonal').then((m) => ({ default: m.SeasonalPricing }))
)
const DailyPricing = lazy(() =>
  import('@/admin/features/pricing/daily').then((m) => ({ default: m.DailyPricing }))
)
const Promotions = lazy(() =>
  import('@/admin/features/pricing/promotions').then((m) => ({ default: m.Promotions }))
)
const Customers = lazy(() =>
  import('@/admin/features/customers').then((m) => ({ default: m.Customers }))
)
const Reports = lazy(() => import('@/admin/features/reports').then((m) => ({ default: m.Reports })))
const Content = lazy(() => import('@/admin/features/content').then((m) => ({ default: m.Content })))
const SettingsProfile = lazy(() =>
  import('@/admin/features/settings/profile').then((m) => ({ default: m.SettingsProfile }))
)
const SettingsAccount = lazy(() =>
  import('@/admin/features/settings/account').then((m) => ({ default: m.SettingsAccount }))
)
const SettingsAppearance = lazy(() =>
  import('@/admin/features/settings/appearance').then((m) => ({ default: m.SettingsAppearance }))
)
const SettingsNotifications = lazy(() =>
  import('@/admin/features/settings/notifications').then((m) => ({
    default: m.SettingsNotifications
  }))
)
const SettingsDisplay = lazy(() =>
  import('@/admin/features/settings/display').then((m) => ({ default: m.SettingsDisplay }))
)

export type AdminRoute =
  | 'dashboard'
  | 'users'
  | 'rooms'
  | 'room-types'
  | 'bookings'
  | 'pricing-seasonal'
  | 'pricing-daily'
  | 'promotions'
  | 'customers'
  | 'reports'
  | 'content'
  | 'settings'
  | 'settings-account'
  | 'settings-appearance'
  | 'settings-notifications'
  | 'settings-display'

// Context for admin route navigation
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

export function AdminApp(): React.JSX.Element {
  const [currentRoute, setCurrentRoute] = useState<AdminRoute>('dashboard')

  const renderContent = () => {
    switch (currentRoute) {
      case 'users':
        return <Users />
      case 'rooms':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <Rooms />
          </Suspense>
        )
      case 'room-types':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <RoomTypes />
          </Suspense>
        )
      case 'bookings':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <Bookings />
          </Suspense>
        )
      case 'pricing-seasonal':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <SeasonalPricing />
          </Suspense>
        )
      case 'pricing-daily':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <DailyPricing />
          </Suspense>
        )
      case 'promotions':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <Promotions />
          </Suspense>
        )
      case 'customers':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <Customers />
          </Suspense>
        )
      case 'reports':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <Reports />
          </Suspense>
        )
      case 'content':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <Content />
          </Suspense>
        )
      case 'settings':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <SettingsProfile />
          </Suspense>
        )
      case 'settings-account':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <SettingsAccount />
          </Suspense>
        )
      case 'settings-appearance':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <SettingsAppearance />
          </Suspense>
        )
      case 'settings-notifications':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <SettingsNotifications />
          </Suspense>
        )
      case 'settings-display':
        return (
          <Suspense
            fallback={<div className="flex items-center justify-center h-64">Loading...</div>}
          >
            <SettingsDisplay />
          </Suspense>
        )
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
