import { Main } from '@/admin/components/layout'
import { BookingsDialogs } from './components/bookings-dialogs'
import { BookingsPrimaryButtons } from './components/bookings-primary-buttons'
import { BookingsProvider } from './components/bookings-provider'
import { BookingsTable } from './components/bookings-table'


export function Bookings() {
  return (
    <BookingsProvider>
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
