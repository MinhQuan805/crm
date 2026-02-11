import { Header, Main, TopNav } from '@/admin/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'

const topNav = [
  { title: 'Overview', href: '/', isActive: false },
  { title: 'Users', href: '/users', isActive: true }
]

export function Users() {
  return (
    <UsersProvider>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h2>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
