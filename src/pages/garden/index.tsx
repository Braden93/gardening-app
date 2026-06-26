import { useNavigate } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useGardenProfile } from '@/hooks/use-garden-profile'
import { useGardenBeds } from '@/hooks/use-garden-beds'
import { useGardenTasks } from '@/hooks/use-garden-tasks'
import { useHomesteadAnimals } from '@/hooks/use-homestead-animals'
import { useRoadmap } from '@/hooks/use-roadmap'
import { ANIMAL_EMOJIS, TASK_TYPE_LABELS } from '@/types/garden'
import { ROADMAP_PHASES } from './roadmap'
import {
  Sprout, CalendarDays, LayoutGrid, RefreshCcw, Layers3, Archive, Bug,
  Fish, Map, BookOpen, Droplets, Thermometer, Leaf, ArrowRight, CheckCircle2, Circle
} from 'lucide-react'

const MODULES = [
  { label: 'My Profile', route: '/garden/profile', icon: Map, desc: 'Location, family size & goals' },
  { label: 'Soil Planner', route: '/garden/soil', icon: Layers3, desc: 'pH, nutrients & amendments' },
  { label: 'Plant Picker', route: '/garden/plants', icon: Sprout, desc: 'Region-aware seed selection' },
  { label: 'Layout Builder', route: '/garden/layout', icon: LayoutGrid, desc: 'Design your garden beds' },
  { label: 'Crop Rotation', route: '/garden/rotation', icon: RefreshCcw, desc: 'Year-over-year planning' },
  { label: 'Calendar', route: '/garden/calendar', icon: CalendarDays, desc: 'Tasks & reminders' },
  { label: 'Season Extension', route: '/garden/seasons', icon: Thermometer, desc: 'Grow longer every year' },
  { label: 'Composting', route: '/garden/composting', icon: Leaf, desc: 'Close the nutrient loop' },
  { label: 'Water Management', route: '/garden/water', icon: Droplets, desc: 'Harvesting & irrigation' },
  { label: 'Seed Saving', route: '/garden/seeds', icon: Archive, desc: 'Save & store your seeds' },
  { label: 'Preservation', route: '/garden/preservation', icon: BookOpen, desc: 'Can, ferment & dehydrate' },
  { label: 'Pest Defense', route: '/garden/pests', icon: Bug, desc: 'Keep critters out naturally' },
  { label: 'Homestead', route: '/garden/homestead', icon: Fish, desc: 'Animals & integrated systems' },
  { label: 'Roadmap', route: '/garden/roadmap', icon: Map, desc: 'Your path to self-reliance' },
  { label: 'Resources', route: '/garden/resources', icon: BookOpen, desc: 'Seeds, tools & local help' },
]

export default function GardenHomePage() {
  const navigate = useNavigate()
  const { profile } = useGardenProfile()
  const { beds } = useGardenBeds()
  const { tasks } = useGardenTasks()
  const { animals } = useHomesteadAnimals()
  const { completions } = useRoadmap()

  const today = new Date().toISOString().slice(0, 10)
  const pending = tasks.filter((t) => !t.completed_at && t.due_date <= today)
  const upcoming = tasks
    .filter((t) => !t.completed_at && t.due_date > today)
    .slice(0, 5)

  const totalItems = ROADMAP_PHASES.reduce((s, p) => s + p.items.length, 0)
  const score = totalItems > 0 ? Math.round((completions.length / totalItems) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Garden & Homestead</h1>
          <p className="mt-1 text-muted-foreground">
            {profile
              ? `Zone ${profile.hardiness_zone} · Family of ${profile.family_size} · ${profile.garden_sqft ?? '?'} sq ft`
              : 'Set up your profile to get personalized recommendations.'}
          </p>
        </div>
        {!profile && (
          <Button onClick={() => navigate('/garden/profile')}>
            Set Up Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Garden Beds" value={beds.length} sub="created" color="green" />
        <StatCard label="Tasks Due" value={pending.length} sub="action needed" color="amber" />
        <StatCard label="Animals" value={animals.length} sub="homestead entries" color="blue" />
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Self-Reliance Score</p>
          <p className="text-3xl font-bold">{score}%</p>
          <Progress value={score} className="h-2" />
          <p className="text-xs text-muted-foreground">{completions.length} of {totalItems} milestones</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tasks due */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-amber-500" />
              Due Today / Overdue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing overdue. Nice work!</p>
            )}
            {pending.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-sm">
                <Circle className="h-3 w-3 shrink-0 text-amber-400" />
                <span className="flex-1 truncate">{t.title}</span>
                <Badge variant="outline" className="text-xs">{TASK_TYPE_LABELS[t.task_type]}</Badge>
              </div>
            ))}
            {pending.length > 6 && (
              <p className="text-xs text-muted-foreground">+{pending.length - 6} more</p>
            )}
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('/garden/calendar')}>
              View Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming tasks */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Coming Up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming tasks scheduled.</p>
            )}
            {upcoming.map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-sm">
                <Circle className="h-3 w-3 shrink-0 text-green-400" />
                <span className="flex-1 truncate">{t.title}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(t.due_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Animals */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">My Homestead</CardTitle>
            <CardDescription>Animals you're raising</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {animals.length === 0 && (
              <p className="text-sm text-muted-foreground">No animals tracked yet.</p>
            )}
            {animals.map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-sm">
                <span className="text-lg">{ANIMAL_EMOJIS[a.animal_type]}</span>
                <span className="flex-1">{a.count}× {a.breed ?? a.animal_type}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('/garden/homestead')}>
              Manage Animals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Module grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">All Modules</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MODULES.map((m) => (
            <button
              key={m.route}
              onClick={() => navigate(m.route)}
              className="group flex flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <m.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'text-green-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
  }
  return (
    <div className="rounded-lg border bg-card p-4 space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`text-3xl font-bold ${colors[color] ?? ''}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}
