import { CustomersActionDialog } from './customers-action-dialog'
import { CustomersDeleteDialog } from './customers-delete-dialog'
import { CustomersDetailDialog } from './customers-detail-dialog'
import { useCustomers } from './customers-provider'

export function CustomersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomers()

  return (
    <>
      {/* Add Customer Dialog */}
      <CustomersActionDialog
        key="customer-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {/* Edit/Delete/Detail Customer Dialogs - only when a row is selected */}
      {currentRow && (
        <>
          <CustomersActionDialog
            key={`customer-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <CustomersDeleteDialog
            key={`customer-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <CustomersDetailDialog
            key={`customer-detail-${currentRow.id}`}
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
