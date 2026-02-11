import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { useAdminRoute, type AdminRoute } from '@/admin/AdminApp'

// Map route to URL path
const routeToUrl: Record<AdminRoute, string> = {
  dashboard: '/dashboard',
  users: '/users',
  rooms: '/rooms',
  'room-types': '/room-types',
  bookings: '/bookings',
  'pricing-seasonal': '/pricing-seasonal',
  'pricing-daily': '/pricing-daily',
  promotions: '/promotions',
  customers: '/customers',
  reports: '/reports',
  content: '/content',
  settings: '/settings',
  'settings-account': '/settings/account',
  'settings-appearance': '/settings/appearance',
  'settings-notifications': '/settings/notifications',
  'settings-display': '/settings/display'
}

interface AppSidebarProps {
  currentPath?: string
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const { collapsible, variant } = useLayout()
  const { currentRoute } = useAdminRoute()

  // Use currentRoute from context if currentPath prop is not provided
  const activePath = currentPath ?? routeToUrl[currentRoute] ?? '/'

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} currentPath={activePath} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
