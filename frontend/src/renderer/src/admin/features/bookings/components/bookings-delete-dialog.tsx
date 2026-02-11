import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { Booking } from '../data/schema'
import { useBookings } from './bookings-provider'

type BookingsDeleteDialogProps = {
  currentRow: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingsDeleteDialog({
  currentRow,
  open,
  onOpenChange
}: BookingsDeleteDialogProps) {
  const { deleteBooking } = useBookings()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteBooking(currentRow.id)
      toast.success(`Đã xóa đặt phòng #${currentRow.id}.`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa đặt phòng thất bại.')
      console.error('Delete booking error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa đặt phòng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa đặt phòng{' '}
            <span className="font-semibold">#{currentRow.id}</span> của khách{' '}
            <span className="font-semibold">{currentRow.customerName}</span>?
            <br />
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
