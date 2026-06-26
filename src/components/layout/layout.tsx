import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '@/contexts/auth-context'
import {
  CalendarDays,
  Droplets,
  FlameKindling,
  Flower2,
  Globe,
  Layers,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Repeat2,
  Ruler,
  Shield,
  Sprout,
  UtensilsCrossed,
  Wind,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', route: '/garden/home', icon: LayoutDashboard },
  { label: 'My Profile', route: '/garden/profile', icon: Sprout },
  { label: 'Soil Planner', route: '/garden/soil', icon: Layers },
  { label: 'Plant Picker', route: '/garden/plants', icon: Flower2 },
  { label: 'Layout Builder', route: '/garden/layout', icon: Ruler },
  { label: 'Crop Rotation', route: '/garden/rotation', icon: Repeat2 },
  { label: 'Calendar', route: '/garden/calendar', icon: CalendarDays },
  { label: 'Season Extension', route: '/garden/seasons', icon: Wind },
  { label: 'Composting', route: '/garden/composting', icon: Sprout },
  { label: 'Water Management', route: '/garden/water', icon: Droplets },
  { label: 'Seed Saving', route: '/garden/seeds', icon: Globe },
  { label: 'Preservation', route: '/garden/preservation', icon: UtensilsCrossed },
  { label: 'Pest Defense', route: '/garden/pests', icon: Shield },
  { label: 'Homestead Animals', route: '/garden/homestead', icon: FlameKindling },
  { label: 'Self-Reliance Roadmap', route: '/garden/roadmap', icon: Map },
  { label: 'Resources', route: '/garden/resources', icon: Globe },
]

export function AppLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-card transition-transform lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              🌱
            </div>
            <span className="font-semibold text-sm">Garden & Homestead</span>
          </div>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors mb-0.5',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex h-14 items-center border-b bg-card px-4 lg:hidden">
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-semibold">Garden & Homestead</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
