import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import type { Room, CreateRoomRequest } from '../data/schema'
import { createRoomSchema } from '../data/schema'
import { useRooms } from './rooms-provider'

type RoomsActionDialogProps = {
  currentRow?: Room
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomsActionDialog({ currentRow, open, onOpenChange }: RoomsActionDialogProps) {
  const { addRoom, updateRoom, roomTypes } = useRooms()
  const isEdit = !!currentRow
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreateRoomRequest>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: isEdit
      ? {
          roomTypeId: currentRow.roomTypeId,
          roomNumber: currentRow.roomNumber,
          floor: currentRow.floor,
          status: currentRow.status,
          notes: currentRow.notes ?? ''
        }
      : {
          roomTypeId: 0,
          roomNumber: '',
          floor: 1,
          status: 'AVAILABLE',
          notes: ''
        }
  })

  const onSubmit = async (values: CreateRoomRequest) => {
    try {
      setSubmitting(true)
      if (isEdit && currentRow) {
        await updateRoom(currentRow.id, values)
        toast.success('Cập nhật phòng thành công!')
      } else {
        await addRoom(values)
        toast.success('Thêm phòng thành công!')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Cập nhật phòng thất bại.' : 'Thêm phòng thất bại.')
      console.error('Room form error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const roomTypeItems = roomTypes.map((rt) => ({
    label: rt.name,
    value: String(rt.id)
  }))

  const statusItems = [
    { label: 'Trống', value: 'AVAILABLE' },
    { label: 'Đang sử dụng', value: 'OCCUPIED' },
    { label: 'Bảo trì', value: 'MAINTENANCE' },
    { label: 'Đã đặt', value: 'RESERVED' }
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? 'Sửa phòng' : 'Thêm phòng mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin phòng. ' : 'Nhập thông tin phòng mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="room-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Số phòng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: 101"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Tầng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 1"
                        className="col-span-4"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomTypeId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Loại phòng</FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                      placeholder="Chọn loại phòng"
                      items={roomTypeItems}
                      className="col-span-4"
                      isControlled
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Trạng thái</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Chọn trạng thái"
                      items={statusItems}
                      className="col-span-4"
                      isControlled
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Ghi chú</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ghi chú (tùy chọn)"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="room-form" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
