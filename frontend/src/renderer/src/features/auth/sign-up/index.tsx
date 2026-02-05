import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp(): React.JSX.Element {
  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">Tạo tài khoản</CardTitle>
          <CardDescription>Nhập thông tin để đăng ký tài khoản mới</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Bằng việc đăng ký, bạn đồng ý với{' '}
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
