import { Main } from '@/admin/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { CustomersDialogs } from './components/customers-dialogs'
import { CustomersPrimaryButtons } from './components/customers-primary-buttons'
import { CustomersProvider } from './components/customers-provider'
import { CustomersTable } from './components/customers-table'

export function Customers() {
  return (
    <CustomersProvider>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý khách hàng</h2>
          </div>
          <CustomersPrimaryButtons />
        </div>
        <CustomersTable />
      </Main>

      <CustomersDialogs />
    </CustomersProvider>
  )
}
