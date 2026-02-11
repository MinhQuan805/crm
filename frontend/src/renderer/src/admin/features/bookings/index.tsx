import { Header, Main, TopNav } from '@/admin/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { BookingsDialogs } from './components/bookings-dialogs'
import { BookingsPrimaryButtons } from './components/bookings-primary-buttons'
import { BookingsProvider } from './components/bookings-provider'
import { BookingsTable } from './components/bookings-table'

const topNav = [
  { title: 'Overview', href: '/', isActive: false },
  { title: 'Đặt Phòng', href: '/bookings', isActive: true }
]

export function Bookings() {
  return (
    <BookingsProvider>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý Đặt Phòng</h2>
          </div>
          <BookingsPrimaryButtons />
        </div>
        <BookingsTable />
      </Main>

      <BookingsDialogs />
    </BookingsProvider>
  )
}
