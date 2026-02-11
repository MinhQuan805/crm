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
import { type Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

type CustomersDeleteDialogProps = {
  currentRow: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomersDeleteDialog({
  currentRow,
  open,
  onOpenChange
}: CustomersDeleteDialogProps) {
  const { deleteCustomer } = useCustomers()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteCustomer(currentRow.id)
      toast.success(`Đã xóa khách hàng "${currentRow.firstName} ${currentRow.lastName}".`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa khách hàng thất bại.')
      console.error('Delete customer error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa khách hàng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa khách hàng{' '}
            <span className="font-semibold">
              {currentRow.firstName} {currentRow.lastName}
            </span>
            ?
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
