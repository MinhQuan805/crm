import { Main } from '@/admin/components/layout'
import { RoomsDialogs } from './components/rooms-dialogs'
import { RoomsPrimaryButtons } from './components/rooms-primary-buttons'
import { RoomsProvider } from './components/rooms-provider'
import { RoomsTable } from './components/rooms-table'

export function Rooms() {
  return (
    <RoomsProvider>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý Phòng</h2>
            <p className="text-muted-foreground">Quản lý danh sách phòng khách sạn tại đây.</p>
          </div>
          <RoomsPrimaryButtons />
        </div>
        <RoomsTable />
      </Main>

      <RoomsDialogs />
    </RoomsProvider>
  )
}
