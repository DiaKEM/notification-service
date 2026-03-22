import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
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
  { label: 'Users', to: '/users' },
]

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = useAppSelector(selectUsername)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-6 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          <img src="/images/navbar.png" alt="Diakem Notify" className="h-8 w-auto" />
          <span className="text-lg font-bold tracking-tight">
            <span style={{ color: '#2879C0' }}>Dia</span><span style={{ color: '#3D8B3D' }}>KEM</span>
          </span>
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
              className="cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-4 w-4" aria-hidden />
              Administration
            </DropdownMenuItem>
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
