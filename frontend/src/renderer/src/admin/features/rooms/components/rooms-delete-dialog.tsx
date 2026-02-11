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
import type { Room } from '../data/schema'
import { useRooms } from './rooms-provider'

type RoomsDeleteDialogProps = {
  currentRow: Room
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomsDeleteDialog({ currentRow, open, onOpenChange }: RoomsDeleteDialogProps) {
  const { deleteRoom } = useRooms()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteRoom(currentRow.id)
      toast.success(`Đã xóa phòng "${currentRow.roomNumber}".`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa phòng thất bại.')
      console.error('Delete room error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa phòng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa phòng{' '}
            <span className="font-semibold">{currentRow.roomNumber}</span>?
            <br />
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
