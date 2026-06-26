import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useRoadmap } from '@/hooks/use-roadmap'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

export const ROADMAP_PHASES = [
  {
    phase: 1,
    title: 'Phase 1: Soil & Basic Garden',
    description: 'Build the foundation. Fix the soil, grow your first vegetables.',
    timeframe: '1 growing season',
    cost: '$50–300',
    items: [
      { key: 'soil_test', label: 'Complete a soil test (county extension or home kit)' },
      { key: 'compost_pile', label: 'Start a compost pile or bin' },
      { key: 'first_bed', label: 'Build or designate at least one garden bed' },
      { key: 'first_planting', label: 'Plant at least 5 vegetable varieties' },
      { key: 'water_setup', label: 'Set up basic watering system (soaker hose or drip)' },
      { key: 'pest_basics', label: 'Learn to identify 3 common pests and their solutions' },
      { key: 'harvest_first', label: 'Harvest and eat from your garden' },
    ],
  },
  {
    phase: 2,
    title: 'Phase 2: Preservation & Seed Saving',
    description: 'Extend your harvest through winter. Save seeds for next year.',
    timeframe: '1–2 seasons',
    cost: '$100–500',
    items: [
      { key: 'save_tomato_seeds', label: 'Save seeds from at least one tomato variety' },
      { key: 'save_bean_seeds', label: 'Save seeds from beans or peas' },
      { key: 'first_ferment', label: 'Make your first batch of sauerkraut or fermented pickles' },
      { key: 'water_bath_canning', label: 'Water bath can at least one product (jam, salsa, or pickles)' },
      { key: 'pressure_canning', label: 'Pressure can a low-acid food (beans, corn, or meat)' },
      { key: 'dehydrate', label: 'Dehydrate at least one crop (herbs, tomatoes, or peppers)' },
      { key: 'seed_storage', label: 'Set up a proper seed storage system (cool, dark, dry)' },
      { key: 'root_cellar', label: 'Store at least one root vegetable through winter' },
    ],
  },
  {
    phase: 3,
    title: 'Phase 3: Chickens & Closed-Loop Composting',
    description: 'Add your first animals. Connect the garden and livestock loop.',
    timeframe: '1–2 years',
    cost: '$200–800',
    items: [
      { key: 'chicken_setup', label: 'Build or purchase a chicken coop and run' },
      { key: 'first_flock', label: 'Get your first flock of 4–6 laying hens' },
      { key: 'fodder_system', label: 'Set up a sprouted fodder tray system for chickens' },
      { key: 'bsfl_bin', label: 'Start a BSFL composting bin to generate free chicken feed' },
      { key: 'chicken_tractor', label: 'Use a chicken tractor or rotate chickens through the garden' },
      { key: 'first_butcher', label: 'Process your first meat bird (or rabbit)' },
      { key: 'manure_composting', label: 'Compost chicken manure and return it to garden beds' },
    ],
  },
  {
    phase: 4,
    title: 'Phase 4: Perennial Food Systems',
    description: 'Plant for permanence. Food that comes back every year.',
    timeframe: '2–5 years (planting) · 20+ years (producing)',
    cost: '$300–2,000',
    items: [
      { key: 'fruit_tree', label: 'Plant at least 2 fruit or nut trees appropriate to your zone' },
      { key: 'berries', label: 'Establish a berry patch (strawberry, blueberry, raspberry, or blackberry)' },
      { key: 'asparagus', label: 'Plant an asparagus bed (produces for 20+ years)' },
      { key: 'perennial_herbs', label: 'Establish perennial herb zone (thyme, sage, oregano, chives, mint)' },
      { key: 'comfrey', label: 'Plant comfrey at garden edges and fruit tree drip lines' },
      { key: 'walking_onions', label: 'Plant walking onions — a true set-and-forget perennial vegetable' },
      { key: 'elderberry', label: 'Plant elderberry for medicine, jelly, and syrup' },
      { key: 'cover_crops', label: 'Start a cover crop rotation program for off-season beds' },
    ],
  },
  {
    phase: 5,
    title: 'Phase 5: Full Homestead Integration',
    description: 'Larger animals, aquaculture, and closing every loop.',
    timeframe: '3–10 years',
    cost: '$1,000–10,000+',
    items: [
      { key: 'dairy_animal', label: 'Acquire a dairy animal (cow, goat, or share in a herd)' },
      { key: 'bees', label: 'Start at least one beehive' },
      { key: 'rabbits', label: 'Establish a small rabbitry for supplemental meat' },
      { key: 'fish_system', label: 'Set up aquaponics or a farm pond' },
      { key: 'rainwater', label: 'Install a rainwater harvesting system (1,000+ gallons)' },
      { key: 'root_cellar_proper', label: 'Build or access a proper root cellar or cold storage' },
      { key: 'fodder_self_sufficient', label: 'Grow 50%+ of animal feed on-property' },
      { key: 'seed_vault', label: 'Maintain a personal seed library of 20+ open-pollinated varieties' },
      { key: 'annual_plan', label: 'Complete one full year with minimal store-bought food' },
    ],
  },
]

export default function RoadmapPage() {
  const { isComplete, toggle, isLoading } = useRoadmap()

  const totalItems = ROADMAP_PHASES.reduce((s, p) => s + p.items.length, 0)
  const totalComplete = ROADMAP_PHASES.reduce((s, p) => s + p.items.filter((item) => isComplete(p.phase, item.key)).length, 0)
  const overallScore = Math.round((totalComplete / totalItems) * 100)

  if (isLoading) return <div className="text-muted-foreground">Loading roadmap...</div>

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Self-Reliance Roadmap</h1>
        <p className="mt-1 text-muted-foreground">
          Your guided path from first garden to full food independence. Check off milestones as you complete them.
        </p>
      </div>

      {/* Overall score */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-green-800">Self-Reliance Score</p>
            <p className="text-2xl font-bold text-green-700">{overallScore}%</p>
          </div>
          <Progress value={overallScore} className="h-3" />
          <p className="text-sm text-green-700">{totalComplete} of {totalItems} milestones completed</p>
        </CardContent>
      </Card>

      {/* Phases */}
      {ROADMAP_PHASES.map((phase) => {
        const phaseComplete = phase.items.filter((item) => isComplete(phase.phase, item.key)).length
        const phaseTotal = phase.items.length
        const phaseScore = Math.round((phaseComplete / phaseTotal) * 100)
        const allDone = phaseComplete === phaseTotal

        return (
          <Card key={phase.phase} className={allDone ? 'border-green-300 bg-green-50/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {allDone
                      ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      : <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary text-xs font-bold text-primary shrink-0">{phase.phase}</div>
                    }
                    {phase.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{phase.description}</CardDescription>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    <Clock className="mr-1 h-3 w-3" />
                    {phase.timeframe}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{phaseComplete}/{phaseTotal} complete</span>
                  <span>{phase.cost}</span>
                </div>
                <Progress value={phaseScore} className="h-1.5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {phase.items.map((item) => {
                const done = isComplete(phase.phase, item.key)
                return (
                  <button
                    key={item.key}
                    onClick={() => toggle.mutate({ phase: phase.phase, item_key: item.key, completed: done })}
                    className="flex w-full items-start gap-3 rounded-md p-2 text-left hover:bg-accent transition-colors"
                  >
                    {done
                      ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    }
                    <span className={`text-sm ${done ? 'line-through text-muted-foreground' : ''}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
