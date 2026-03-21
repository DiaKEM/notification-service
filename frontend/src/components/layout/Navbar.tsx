import { NavLink } from 'react-router-dom'
import { Activity, ChevronDown, LogOut, User } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout, selectUsername } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Job Configurations', to: '/jobs/configuration' },
  { label: 'Job Executions', to: '/jobs/execution' },
]

export default function Navbar() {
  const dispatch = useAppDispatch()
  const username = useAppSelector(selectUsername)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-6 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold select-none">
          <Activity className="h-5 w-5 text-primary" aria-hidden />
          <span className="text-sm">Diakem Notify</span>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" aria-hidden />
              <span className="max-w-32 truncate text-sm">{username}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Signed in as</span>
                <span className="truncate font-medium">{username}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => dispatch(logout())}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
