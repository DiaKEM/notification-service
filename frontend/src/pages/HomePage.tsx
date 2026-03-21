import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout, selectUsername } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const username = useAppSelector(selectUsername)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-4xl font-bold text-foreground">Hello World</h1>
      {username && (
        <p className="text-muted-foreground">Welcome, {username}!</p>
      )}
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
