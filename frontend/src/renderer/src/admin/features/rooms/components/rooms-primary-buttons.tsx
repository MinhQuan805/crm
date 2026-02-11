import { Plus, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRooms } from './rooms-provider'

export function RoomsPrimaryButtons() {
  const { setOpen } = useRooms()
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="space-x-1" onClick={() => setOpen('bulk')}>
        <span>Thêm Hàng Loạt</span> <Layers size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm Phòng</span> <Plus size={18} />
      </Button>
    </div>
  )
}
