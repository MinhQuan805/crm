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
import type { BulkCreateRoomFormValues } from '../data/schema'
import { bulkCreateRoomSchema } from '../data/schema'
import { useRooms } from './rooms-provider'

type RoomsBulkDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomsBulkDialog({ open, onOpenChange }: RoomsBulkDialogProps) {
  const { bulkCreateRooms, roomTypes } = useRooms()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<BulkCreateRoomFormValues>({
    resolver: zodResolver(bulkCreateRoomSchema),
    defaultValues: {
      roomTypeId: 0,
      floor: 1,
      roomNumbers: '',
      status: 'AVAILABLE'
    }
  })

  const onSubmit = async (values: BulkCreateRoomFormValues) => {
    try {
      setSubmitting(true)
      const roomNumbersArr = values.roomNumbers
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      if (roomNumbersArr.length === 0) {
        toast.error('Vui lòng nhập ít nhất một số phòng.')
        return
      }

      await bulkCreateRooms({
        roomTypeId: values.roomTypeId,
        floor: values.floor,
        roomNumbers: roomNumbersArr,
        status: values.status
      })
      toast.success(`Đã thêm ${roomNumbersArr.length} phòng thành công!`)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error('Thêm phòng hàng loạt thất bại.')
      console.error('Bulk create rooms error:', error)
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
          <DialogTitle>Thêm phòng hàng loạt</DialogTitle>
          <DialogDescription>
            Nhập danh sách số phòng cách nhau bởi dấu phẩy. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="room-bulk-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
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
                name="roomNumbers"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 pt-3 text-end">Số phòng</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="VD: 101, 102, 103, 104"
                        className="col-span-4 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
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
            </form>
          </Form>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="room-bulk-form" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
