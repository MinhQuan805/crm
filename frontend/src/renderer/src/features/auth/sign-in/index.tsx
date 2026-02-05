import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn(): React.JSX.Element {
  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu để đăng nhập
            <br />
            vào hệ thống quản lý khách sạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Chính sách bảo mật
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
