import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
  username: z
    .string('Vui lòng nhập tên người dùng.')
    .min(2, 'Tên người dùng tối thiểu 2 ký tự.')
    .max(30, 'Tên người dùng không được quá 30 ký tự.'),
  email: z.email({
    error: (iss) => (iss.input === undefined ? 'Vui lòng chọn email để hiển thị.' : undefined)
  }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url('Vui lòng nhập URL hợp lệ.')
      })
    )
    .optional()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  bio: 'Tôi sở hữu một máy tính.',
  urls: [{ value: 'https://hotel.com' }, { value: 'http://twitter.com/hotel' }]
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange'
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          showSubmittedData(data, 'Bạn đã cập nhật hồ sơ:')
          toast.success('Cập nhật hồ sơ thành công!')
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người dùng</FormLabel>
              <FormControl>
                <Input placeholder="hotel" {...field} />
              </FormControl>
              <FormDescription>Đây là tên hiển thị công khai.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn email để hiển thị" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Bạn có thể quản lý email đã xác thực trong phần cài đặt email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu</FormLabel>
              <FormControl>
                <Textarea placeholder="Giới thiệu về bạn" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Bạn có thể nhắc đến người dùng và tổ chức bằng @mention.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((fieldItem, index) => (
            <FormField
              control={form.control}
              key={fieldItem.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>Liên kết</FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Thêm liên kết trang web, blog hoặc mạng xã hội.
                  </FormDescription>
                  <FormControl className={cn(index !== 0 && 'mt-1.5')}>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
          >
            Thêm liên kết
          </Button>
        </div>
        <Button type="submit">Cập nhật hồ sơ</Button>
      </form>
    </Form>
  )
}
