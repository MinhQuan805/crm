import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

// Mock users for testing
const MOCK_USERS: Record<string, { password: string; user: Omit<AuthUser, 'exp'> }> = {
  'admin@gmail.com': {
    password: '123456',
    user: {
      id: '1',
      email: 'admin@gmail.com',
      name: 'Admin',
      role: 'admin'
    }
  },
  'client@gmail.com': {
    password: '123456',
    user: {
      id: '2',
      email: 'client@gmail.com',
      name: 'Client User',
      role: 'client'
    }
  }
}

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(data: z.infer<typeof formSchema>): Promise<void> {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = MOCK_USERS[data.email]

    if (!mockUser || mockUser.password !== data.password) {
      setIsLoading(false)
      toast.error('Đăng nhập thất bại', {
        description: 'Email hoặc mật khẩu không đúng'
      })
      return
    }

    // Check if user is admin - only admin can login
    if (mockUser.user.role !== 'admin') {
      setIsLoading(false)
      toast.error('Không có quyền truy cập', {
        description: 'Chỉ admin mới được đăng nhập vào hệ thống'
      })
      return
    }

    // Create authenticated user with expiration
    const authenticatedUser: AuthUser = {
      ...mockUser.user,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
    }

    // Login and store token
    login(authenticatedUser, 'mock-access-token-' + Date.now())

    setIsLoading(false)
    toast.success(`Chào mừng, ${authenticatedUser.name}!`)

    // Redirect based on role
    if (authenticatedUser.role === 'admin') {
      navigate('/admin', { replace: true })
    } else {
      navigate('/client', { replace: true })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to="/forgot-password"
                className="absolute end-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75"
              >
                Quên mật khẩu?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Đăng nhập
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{' '}
          <Link to="/sign-up" className="underline underline-offset-4 hover:text-primary">
            Đăng ký
          </Link>
        </p>
      </form>
    </Form>
  )
}
