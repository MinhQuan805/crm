import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookings } from './bookings-provider'

export function BookingsPrimaryButtons() {
  const { setOpen } = useBookings()
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm Đặt Phòng</span> <Plus size={18} />
      </Button>
    </div>
  )
}
