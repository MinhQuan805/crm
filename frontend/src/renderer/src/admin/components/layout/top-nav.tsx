import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { type AdminRoute } from '@/admin/AdminApp'
import { useAdminRoute } from '@/admin/AdminApp'

// Map URL to route name
const urlToRoute: Record<string, AdminRoute> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/users': 'users',
  '/rooms': 'rooms',
  '/room-types': 'room-types',
  '/bookings': 'bookings',
  '/pricing-seasonal': 'pricing-seasonal',
  '/pricing-daily': 'pricing-daily',
  '/promotions': 'promotions',
  '/customers': 'customers',
  '/reports': 'reports',
  '/content': 'content',
  '/settings': 'settings',
  '/settings/account': 'settings-account',
  '/settings/appearance': 'settings-appearance',
  '/settings/notifications': 'settings-notifications',
  '/settings/display': 'settings-display'
}

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const { setCurrentRoute } = useAdminRoute()

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    const route = urlToRoute[href]
    if (route) {
      setCurrentRoute(route)
    }
  }

  return (
    <>
      <div className="lg:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="md:size-7">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <a
                  href={href}
                  onClick={(e) => handleClick(e, href)}
                  className={!isActive ? 'text-muted-foreground' : ''}
                  aria-disabled={disabled}
                >
                  {title}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn('hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6', className)}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <a
            key={`${title}-${href}`}
            href={href}
            onClick={(e) => handleClick(e, href)}
            aria-disabled={disabled}
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? '' : 'text-muted-foreground'}`}
          >
            {title}
          </a>
        ))}
      </nav>
    </>
  )
}
