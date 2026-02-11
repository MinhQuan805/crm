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
import { Textarea } from '@/components/ui/textarea'
import type { Booking, CreateBookingRequest } from '../data/schema'
import { createBookingSchema } from '../data/schema'
import { useBookings } from './bookings-provider'

type BookingsActionDialogProps = {
  currentRow?: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingsActionDialog({
  currentRow,
  open,
  onOpenChange
}: BookingsActionDialogProps) {
  const { addBooking, updateBooking } = useBookings()
  const isEdit = !!currentRow
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreateBookingRequest>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: isEdit
      ? {
          customerId: currentRow.customerId,
          roomId: currentRow.roomId,
          checkInDate: currentRow.checkInDate?.split('T')[0] ?? '',
          checkOutDate: currentRow.checkOutDate?.split('T')[0] ?? '',
          specialRequests: currentRow.specialRequests ?? ''
        }
      : {
          customerId: 0,
          roomId: 0,
          checkInDate: '',
          checkOutDate: '',
          specialRequests: ''
        }
  })

  const onSubmit = async (values: CreateBookingRequest) => {
    try {
      setSubmitting(true)
      if (isEdit && currentRow) {
        await updateBooking(currentRow.id, values)
        toast.success('Cập nhật đặt phòng thành công!')
      } else {
        await addBooking(values)
        toast.success('Thêm đặt phòng thành công!')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Cập nhật đặt phòng thất bại.' : 'Thêm đặt phòng thất bại.')
      console.error('Booking form error:', error)
    } finally {
      setSubmitting(false)
    }
  }

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
          <DialogTitle>{isEdit ? 'Sửa đặt phòng' : 'Thêm đặt phòng mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin đặt phòng. ' : 'Nhập thông tin đặt phòng mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="booking-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Khách hàng ID</FormLabel>
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
                name="roomId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Phòng ID</FormLabel>
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
                name="checkInDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Ngày nhận phòng</FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Ngày trả phòng</FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Yêu cầu đặc biệt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập yêu cầu đặc biệt (tùy chọn)"
                        className="col-span-4"
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" form="booking-form" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
