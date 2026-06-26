import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SeedData {
  plant: string
  family: string
  type: 'OP' | 'Hybrid' | 'Self-pollinating'
  isolation: string
  harvestTime: string
  processing: string
  storage: string
  viability: string
  difficulty: 'Easy' | 'Moderate' | 'Advanced'
  notes: string
}

const SEED_DATA: SeedData[] = [
  { plant: 'Tomato', family: 'Nightshade', type: 'Self-pollinating', isolation: 'None needed (or 25 ft for purity)', harvestTime: 'When fully ripe, slightly overripe', processing: 'Ferment pulp in water 2–3 days, rinse, dry on screen', storage: 'Paper envelope in airtight container', viability: '4–6 years', difficulty: 'Easy', notes: 'Fermentation removes germination inhibitors and cleans seeds. One of the best beginner seed crops.' },
  { plant: 'Pepper', family: 'Nightshade', type: 'Self-pollinating', isolation: '300–1,600 ft (cross-pollinates with other peppers)', harvestTime: 'Fully red/ripe — not green', processing: 'Cut open, scoop seeds onto screen, dry completely', storage: 'Envelope in airtight container', viability: '2–4 years', difficulty: 'Easy', notes: 'Peppers cross freely with other pepper varieties. Grow only one variety or isolate.' },
  { plant: 'Bean (Bush/Pole)', family: 'Legume', type: 'Self-pollinating', isolation: 'Minimal (150 ft for purity)', harvestTime: 'When pods turn brown and papery on the plant', processing: 'Shell dried pods; let dry further 2–3 weeks', storage: 'Glass jar with silica packet', viability: '3–5 years', difficulty: 'Easy', notes: 'Most reliable seed-saving crop. Beans almost always self-pollinate before flowers open.' },
  { plant: 'Pea', family: 'Legume', type: 'Self-pollinating', isolation: 'Minimal (50 ft)', harvestTime: 'Pods turn brown and seeds rattle inside', processing: 'Shell and dry 2–3 more weeks', storage: 'Glass jar', viability: '3–5 years', difficulty: 'Easy', notes: 'Peas are one of the safest and easiest seed crops.' },
  { plant: 'Lettuce', family: 'Composite', type: 'Self-pollinating', isolation: '10–25 ft', harvestTime: 'Let plants bolt — harvest seed heads when fluffy/dried', processing: 'Shake into bag, winnow to remove chaff', storage: 'Envelope', viability: '3–5 years', difficulty: 'Easy', notes: 'Harvest early morning before heat opens seeds. Shake daily into a bag once drying begins.' },
  { plant: 'Tomato (heirloom)', family: 'Nightshade', type: 'Self-pollinating', isolation: '25 ft minimum', harvestTime: 'Beyond eating-ripe, gel-covered seeds', processing: 'Fermentation method required', storage: 'Cool, dry, dark location', viability: '4–6 years', difficulty: 'Easy', notes: '' },
  { plant: 'Squash (Winter)', family: 'Cucurbit', type: 'OP', isolation: '¼–½ mile between same species', harvestTime: '3–4 weeks past eating maturity', processing: 'Scoop, wash, dry completely on screen (3–4 weeks)', storage: 'Envelope or glass jar', viability: '4–6 years', difficulty: 'Moderate', notes: 'C. pepo, C. maxima, and C. moschata don\'t cross with each other — only within species.' },
  { plant: 'Cucumber', family: 'Cucurbit', type: 'OP', isolation: '½ mile', harvestTime: 'Beyond eating — yellow/orange and plump', processing: 'Scoop seeds, ferment 1–2 days, rinse, dry', storage: 'Envelope', viability: '5–7 years', difficulty: 'Moderate', notes: 'Cross-pollinates freely. Grow only one variety without isolation.' },
  { plant: 'Corn', family: 'Grass', type: 'OP', isolation: '1,000+ ft or timing isolation', harvestTime: 'Husks fully dry and papery on stalk', processing: 'Twist dried cobs over bucket; discard tip and end kernels', storage: 'Mesh bag in dry location', viability: '2–4 years', difficulty: 'Moderate', notes: 'Wind-pollinated — requires the largest isolation distance. Grow blocks not rows for good seed set.' },
  { plant: 'Carrot', family: 'Umbel', type: 'OP', isolation: '1,000+ ft (crosses with Queen Anne\'s Lace)', harvestTime: 'Umbels turn brown and seeds begin to shed', processing: 'Cut seed heads, dry in paper bag, shake to release', storage: 'Envelope', viability: '1–3 years', difficulty: 'Advanced', notes: 'Biennial — must overwinter. Crosses with wild carrots (Queen Anne\'s Lace). Difficult for beginners.' },
  { plant: 'Onion', family: 'Allium', type: 'OP', isolation: '1,000 ft', harvestTime: 'Flower heads turn black and dry', processing: 'Bag seed heads, hang dry, shake to release', storage: 'Envelope (short-lived)', viability: '1–2 years', difficulty: 'Advanced', notes: 'Biennial — must grow 2 years. Very short viability. Buy fresh seed most years unless you have a reliable system.' },
  { plant: 'Beet', family: 'Chenopod', type: 'OP', isolation: '2–5 miles (wind-pollinated)', harvestTime: 'Seed clusters brown and harden', processing: 'Hand-thresh, winnow chaff', storage: 'Envelope', viability: '4–6 years', difficulty: 'Advanced', notes: 'Biennial, wind-pollinated. Requires large isolation — challenging without neighbors\' cooperation.' },
  { plant: 'Kale', family: 'Brassica', type: 'OP', isolation: '1,000 ft (crosses with all brassicas)', harvestTime: 'Pods turn brown and rattle', processing: 'Bag plant, thresh, winnow', storage: 'Envelope', viability: '4–6 years', difficulty: 'Moderate', notes: 'Cross-pollinates with ALL brassica family members (broccoli, cabbage, Brussels sprouts, etc.).' },
  { plant: 'Sunflower', family: 'Composite', type: 'OP', isolation: '1,000+ ft', harvestTime: 'Head fully brown, seeds feel firm', processing: 'Rub seeds off head, dry further 1–2 weeks', storage: 'Paper bag or jar', viability: '3–5 years', difficulty: 'Easy', notes: 'Leave heads on plant until birds start picking — then harvest. Cross-pollinates but most varieties breed fairly true.' },
  { plant: 'Amaranth', family: 'Amaranth', type: 'OP', isolation: '1,000 ft', harvestTime: 'Seed heads dry on plant; rubbing releases seed', processing: 'Strip seed heads into bucket, winnow', storage: 'Jar', viability: '5–7 years', difficulty: 'Easy', notes: 'Wind-pollinated but most cross-pollinated seeds are still excellent grain. Great crop for seed saving even without isolation.' },
  { plant: 'Basil', family: 'Mint', type: 'Self-pollinating', isolation: '150 ft', harvestTime: 'Flower spikes dry brown on plant', processing: 'Strip flower spikes into bag, shake, winnow lightly', storage: 'Envelope', viability: '3–5 years', difficulty: 'Easy', notes: 'Let a few plants bolt. After harvesting seed, dry seed spikes in paper bag.' },
]

const VIABILITY_GUIDE = [
  { years: '1–2 years', crops: 'Onion, leek, parsley, parsnip, sweet corn' },
  { years: '3–4 years', crops: 'Pepper, bean, pea, tomato, carrot, beet, asparagus' },
  { years: '4–6 years', crops: 'Cabbage, broccoli, kale, lettuce, squash, pumpkin, sunflower, amaranth, beet' },
  { years: '6–10 years', crops: 'Cucumber, watermelon, melon, radish, spinach (when stored properly frozen)' },
]

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-800 border-green-200',
  Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Advanced: 'bg-red-100 text-red-800 border-red-200',
}

export default function SeedsPage() {
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState<string>('all')

  const filtered = SEED_DATA.filter((s) => {
    if (search && !s.plant.toLowerCase().includes(search.toLowerCase())) return false
    if (diffFilter !== 'all' && s.difficulty !== diffFilter) return false
    return true
  })

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seed Saving Library</h1>
        <p className="mt-1 text-muted-foreground">
          Save seeds from this year's harvest and you'll never pay for those varieties again. Start with easy self-pollinators.
        </p>
      </div>

      {/* Key concept */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-4 text-sm text-amber-800 space-y-1">
          <p><strong>Open-Pollinated vs. Hybrid:</strong> Only save seeds from open-pollinated (OP) or heirloom varieties. Hybrids (marked F1) won't breed true — you'll get unpredictable results.</p>
          <p><strong>Isolation distance</strong> prevents cross-pollination between varieties of the same species. Wind and insects carry pollen far.</p>
          <p><strong>Best starters:</strong> Tomatoes, beans, peas, and lettuce — all self-pollinate before insects can interfere.</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search plants..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {(['all', 'Easy', 'Moderate', 'Advanced'] as const).map((d) => (
          <Badge
            key={d}
            variant={diffFilter === d ? 'default' : 'outline'}
            className="cursor-pointer capitalize"
            onClick={() => setDiffFilter(d)}
          >
            {d === 'all' ? 'All Difficulties' : d}
          </Badge>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <Card key={s.plant}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <CardTitle className="text-base">{s.plant}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{s.type}</Badge>
                  <Badge variant="outline" className={`text-xs ${DIFFICULTY_COLORS[s.difficulty]}`}>{s.difficulty}</Badge>
                  <Badge variant="secondary" className="text-xs">Viable {s.viability}</Badge>
                </div>
              </div>
              <CardDescription>{s.family} · Isolation: {s.isolation}</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-medium mb-1">When to Harvest</p>
                <p className="text-muted-foreground">{s.harvestTime}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Processing</p>
                <p className="text-muted-foreground">{s.processing}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Storage</p>
                <p className="text-muted-foreground">{s.storage}</p>
              </div>
              {s.notes && (
                <div className="sm:col-span-3 rounded-md bg-blue-50 border border-blue-200 p-2 text-xs text-blue-700">
                  {s.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Viability chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seed Viability Guide</CardTitle>
          <CardDescription>How long seeds stay viable under ideal storage conditions (cool, dark, dry — or frozen)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {VIABILITY_GUIDE.map((v) => (
            <div key={v.years} className="flex gap-4 text-sm">
              <span className="shrink-0 font-medium w-24">{v.years}</span>
              <span className="text-muted-foreground">{v.crops}</span>
            </div>
          ))}
          <div className="rounded-md bg-green-50 border border-green-200 p-2 text-xs text-green-700 mt-2">
            <strong>Long-term storage tip:</strong> Freeze seeds in airtight glass jars for 10–20 year viability. Vacuum-sealed, they last indefinitely. The Svalbard Global Seed Vault stores seeds at –18°C forever.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
