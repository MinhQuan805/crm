import { BookingsActionDialog } from './bookings-action-dialog'
import { BookingsDeleteDialog } from './bookings-delete-dialog'
import { BookingsDetailDialog } from './bookings-detail-dialog'
import { useBookings } from './bookings-provider'

export function BookingsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBookings()

  return (
    <>
      {/* Add Booking Dialog */}
      <BookingsActionDialog
        key="booking-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {/* Edit/Delete/Detail Booking Dialogs - only when a row is selected */}
      {currentRow && (
        <>
          <BookingsActionDialog
            key={`booking-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <BookingsDeleteDialog
            key={`booking-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <BookingsDetailDialog
            key={`booking-detail-${currentRow.id}`}
            open={open === 'detail'}
            onOpenChange={() => {
              setOpen('detail')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
