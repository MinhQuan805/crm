import { type User, type UserStatus, type UserRole } from './schema'

// Generate a simple UUID
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Mock users data
export const mockUsers: User[] = [
  {
    id: generateId(),
    firstName: 'Nguyen Van',
    lastName: 'A',
    username: 'nguyenvana',
    email: 'nguyenvana@gmail.com',
    phoneNumber: '+1 234 567 8901',
    status: 'active' as UserStatus,
    role: 'superadmin' as UserRole,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: generateId(),
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane.smith@hotel.com',
    phoneNumber: '+1 234 567 8902',
    status: 'active' as UserStatus,
    role: 'admin' as UserRole,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: generateId(),
    firstName: 'Robert',
    lastName: 'Johnson',
    username: 'robertj',
    email: 'robert.johnson@hotel.com',
    phoneNumber: '+1 234 567 8903',
    status: 'active' as UserStatus,
    role: 'manager' as UserRole,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-06-10')
  },
  {
    id: generateId(),
    firstName: 'Emily',
    lastName: 'Brown',
    username: 'emilybrown',
    email: 'emily.brown@hotel.com',
    phoneNumber: '+1 234 567 8904',
    status: 'inactive' as UserStatus,
    role: 'cashier' as UserRole,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-05-25')
  },
  {
    id: generateId(),
    firstName: 'Michael',
    lastName: 'Davis',
    username: 'michaeld',
    email: 'michael.davis@hotel.com',
    phoneNumber: '+1 234 567 8905',
    status: 'invited' as UserStatus,
    role: 'manager' as UserRole,
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-06-01')
  },
  {
    id: generateId(),
    firstName: 'Sarah',
    lastName: 'Wilson',
    username: 'sarahw',
    email: 'sarah.wilson@hotel.com',
    phoneNumber: '+1 234 567 8906',
    status: 'active' as UserStatus,
    role: 'cashier' as UserRole,
    createdAt: new Date('2024-04-25'),
    updatedAt: new Date('2024-06-18')
  },
  {
    id: generateId(),
    firstName: 'David',
    lastName: 'Martinez',
    username: 'davidm',
    email: 'david.martinez@hotel.com',
    phoneNumber: '+1 234 567 8907',
    status: 'suspended' as UserStatus,
    role: 'cashier' as UserRole,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-06-05')
  },
  {
    id: generateId(),
    firstName: 'Lisa',
    lastName: 'Anderson',
    username: 'lisaa',
    email: 'lisa.anderson@hotel.com',
    phoneNumber: '+1 234 567 8908',
    status: 'active' as UserStatus,
    role: 'admin' as UserRole,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-22')
  },
  {
    id: generateId(),
    firstName: 'James',
    lastName: 'Taylor',
    username: 'jamest',
    email: 'james.taylor@hotel.com',
    phoneNumber: '+1 234 567 8909',
    status: 'active' as UserStatus,
    role: 'manager' as UserRole,
    createdAt: new Date('2024-05-28'),
    updatedAt: new Date('2024-06-19')
  },
  {
    id: generateId(),
    firstName: 'Jennifer',
    lastName: 'Thomas',
    username: 'jennifert',
    email: 'jennifer.thomas@hotel.com',
    phoneNumber: '+1 234 567 8910',
    status: 'invited' as UserStatus,
    role: 'cashier' as UserRole,
    createdAt: new Date('2024-06-05'),
    updatedAt: new Date('2024-06-20')
  }
]
