import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'
import { type UserStatus } from './schema'

// Status badge colors mapping
export const statusColors = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'
  ]
])

// User roles with icons
export const roles = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: Shield
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: UserCheck
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: Users
  },
  {
    label: 'Staff',
    value: 'staff',
    icon: CreditCard
  },
  {
    label: 'Client',
    value: 'client',
    icon: Users
  }
] as const

// Status options
export const statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended' }
] as const
