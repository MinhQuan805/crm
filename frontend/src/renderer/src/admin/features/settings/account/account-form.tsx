import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DatePicker } from '@/components/date-picker'

const languages = [
  { label: 'Tiếng Anh', value: 'en' },
  { label: 'Tiếng Pháp', value: 'fr' },
  { label: 'Tiếng Đức', value: 'de' },
  { label: 'Tiếng Tây Ban Nha', value: 'es' },
  { label: 'Tiếng Bồ Đào Nha', value: 'pt' },
  { label: 'Tiếng Nga', value: 'ru' },
  { label: 'Tiếng Nhật', value: 'ja' },
  { label: 'Tiếng Hàn', value: 'ko' },
  { label: 'Tiếng Trung', value: 'zh' }
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập họ tên.')
    .min(2, 'Họ tên tối thiểu 2 ký tự.')
    .max(30, 'Họ tên không được quá 30 ký tự.'),
  dob: z.date('Vui lòng chọn ngày sinh.'),
  language: z.string('Vui lòng chọn ngôn ngữ.')
})

type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultValues: Partial<AccountFormValues> = {
  name: ''
}

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues
  })

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data, 'Bạn đã cập nhật tài khoản:')
    toast.success('Cập nhật tài khoản thành công!')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormDescription>Tên này sẽ được hiển thị trên hồ sơ và trong email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày sinh</FormLabel>
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormDescription>Ngày sinh dùng để tính tuổi.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngôn ngữ</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find((language) => language.value === field.value)?.label
                        : 'Chọn ngôn ngữ'}
                      <CaretSortIcon className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm ngôn ngữ..." />
                    <CommandEmpty>Không tìm thấy ngôn ngữ.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4',
                                language.value === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Ngôn ngữ sẽ được sử dụng trong hệ thống.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Cập nhật tài khoản</Button>
      </form>
    </Form>
  )
}
