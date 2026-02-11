import {
  LayoutDashboard,
  Bed,
  BedDouble,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  CalendarDays,
  CalendarClock,
  Percent,
  AudioWaveform,
  Command,
  GalleryVerticalEnd
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@hotel.com',
    avatar: '/avatars/shadcn.jpg'
  },
  teams: [
    {
      name: 'Hotel Admin',
      logo: Command,
      plan: 'Quản Lý Khách Sạn'
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    }
  ],
  navGroups: [
    {
      title: 'Tổng Quan',
      items: [
        {
          title: 'Bảng điều khiển',
          url: '/',
          icon: LayoutDashboard
        }
      ]
    },
    {
      title: 'Phòng',
      items: [
        {
          title: 'Loại Phòng',
          url: '/room-types',
          icon: BedDouble
        },
        {
          title: 'Danh Sách Phòng',
          url: '/rooms',
          icon: Bed
        }
      ]
    },
    {
      title: 'Đặt Phòng',
      items: [
        {
          title: 'Quản Lý Đặt Phòng',
          url: '/bookings',
          icon: Calendar
        }
      ]
    },
    {
      title: 'Giá và Khuyến Mãi',
      items: [
        {
          title: 'Giá Theo Mùa',
          url: '/pricing-seasonal',
          icon: CalendarDays
        },
        {
          title: 'Giá Theo Ngày',
          url: '/pricing-daily',
          icon: CalendarClock
        },
        {
          title: 'Khuyến Mãi',
          url: '/promotions',
          icon: Percent
        }
      ]
    },
    {
      title: 'Khách Hàng',
      items: [
        {
          title: 'Khách hàng',
          url: '/customers',
          icon: Users
        }
      ]
    },
    {
      title: 'Báo Cáo',
      items: [
        {
          title: 'Báo Cáo và Thống Kê',
          url: '/reports',
          icon: BarChart3
        }
      ]
    },
    {
      title: 'Quản Lý',
      items: [
        {
          title: 'Nội Dung và Chính Sách',
          url: '/content',
          icon: FileText
        },
        {
          title: 'Người Dùng',
          url: '/users',
          icon: UserCog
        }
      ]
    },
    {
      title: 'Cài Đặt',
      items: [
        {
          title: 'Cài đặt',
          icon: Settings,
          items: [
            {
              title: 'Hồ sơ',
              url: '/settings',
              icon: UserCog
            },
            {
              title: 'Tài khoản',
              url: '/settings/account',
              icon: Wrench
            },
            {
              title: 'Giao diện',
              url: '/settings/appearance',
              icon: Palette
            },
            {
              title: 'Thông báo',
              url: '/settings/notifications',
              icon: Bell
            },
            {
              title: 'Hiển thị',
              url: '/settings/display',
              icon: Monitor
            }
          ]
        }
      ]
    }
  ]
}
