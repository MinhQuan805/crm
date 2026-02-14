import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Command } from 'lucide-react'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
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
        <div className="flex items-center gap-2 group-data-[state=collapsed]:flex-col">
          <SidebarMenu className="flex-1 group-data-[state=collapsed]:flex-none">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="cursor-default">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">Hotel Admin</span>
                  <span className="truncate text-xs">Quản Lý Khách Sạn</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger
            variant="outline"
            className="shrink-0 group-data-[state=collapsed]:mt-2"
          />
        </div>
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
