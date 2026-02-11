import { RoomsActionDialog } from './rooms-action-dialog'
import { RoomsBulkDialog } from './rooms-bulk-dialog'
import { RoomsDeleteDialog } from './rooms-delete-dialog'
import { useRooms } from './rooms-provider'

export function RoomsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRooms()

  return (
    <>
      {/* Add Room Dialog */}
      <RoomsActionDialog key="room-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />

      {/* Bulk Create Dialog */}
      <RoomsBulkDialog
        key="room-bulk"
        open={open === 'bulk'}
        onOpenChange={() => setOpen('bulk')}
      />

      {/* Edit/Delete Room Dialogs - only when a row is selected */}
      {currentRow && (
        <>
          <RoomsActionDialog
            key={`room-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <RoomsDeleteDialog
            key={`room-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
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
