import { Monitor, Bell, Palette, Wrench, UserCog } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/admin/components/layout/header'
import { Main } from '@/admin/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarNav } from './components/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'Hồ sơ',
    href: '/settings',
    icon: <UserCog size={18} />
  },
  {
    title: 'Tài khoản',
    href: '/settings/account',
    icon: <Wrench size={18} />
  },
  {
    title: 'Giao diện',
    href: '/settings/appearance',
    icon: <Palette size={18} />
  },
  {
    title: 'Thông báo',
    href: '/settings/notifications',
    icon: <Bell size={18} />
  },
  {
    title: 'Hiển thị',
    href: '/settings/display',
    icon: <Monitor size={18} />
  }
]

type SettingsShellProps = {
  children: React.ReactNode
}

export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <>

      <Main fixed>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Cài đặt</h1>
          <p className="text-muted-foreground">Quản lý cài đặt tài khoản và tùy chọn thông báo.</p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-hidden p-1">{children}</div>
        </div>
      </Main>
    </>
  )
}
