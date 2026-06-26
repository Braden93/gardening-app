import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGardenProfile } from '@/hooks/use-garden-profile'
import { Search } from 'lucide-react'

interface Plant {
  name: string
  category: 'vegetable' | 'fruit' | 'herb' | 'medicinal' | 'grain'
  type: 'annual' | 'perennial' | 'biennial'
  family: string
  zones: string
  daysToHarvest: string
  yieldPer: string
  seedSavable: boolean
  heirloom: boolean
  unusual: boolean
  companionsWith: string[]
  avoidWith: string[]
  notes: string
}

const PLANTS: Plant[] = [
  { name: 'Tomato', category: 'vegetable', type: 'annual', family: 'Nightshade', zones: '4–11', daysToHarvest: '60–85', yieldPer: '10–15 lbs/plant', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Basil', 'Carrot', 'Parsley'], avoidWith: ['Fennel', 'Brassicas', 'Corn'], notes: 'Start indoors 6–8 weeks before last frost.' },
  { name: 'Pepper (Sweet)', category: 'vegetable', type: 'annual', family: 'Nightshade', zones: '4–11', daysToHarvest: '70–90', yieldPer: '4–6 lbs/plant', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Basil', 'Carrot', 'Tomato'], avoidWith: ['Fennel', 'Brassicas'], notes: 'Needs warmth — don\'t rush transplanting.' },
  { name: 'Potato', category: 'vegetable', type: 'annual', family: 'Nightshade', zones: '3–10', daysToHarvest: '70–120', yieldPer: '5–10 lbs/10 ft row', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Beans', 'Horseradish', 'Marigold'], avoidWith: ['Tomato', 'Squash', 'Cucumber'], notes: 'Save seed potatoes from each year\'s crop.' },
  { name: 'Kale', category: 'vegetable', type: 'annual', family: 'Brassica', zones: '3–10', daysToHarvest: '55–65', yieldPer: '1–2 lbs/plant/month', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Beets', 'Celery', 'Herbs'], avoidWith: ['Strawberry', 'Tomato', 'Beans'], notes: 'Hardy to 15°F. Great for year-round production.' },
  { name: 'Broccoli', category: 'vegetable', type: 'annual', family: 'Brassica', zones: '3–10', daysToHarvest: '50–80', yieldPer: '1–2 lbs/plant', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Dill', 'Celery', 'Sage'], avoidWith: ['Tomato', 'Strawberry', 'Pepper'], notes: 'Harvest before flowers open. Side shoots produce for months.' },
  { name: 'Cabbage', category: 'vegetable', type: 'annual', family: 'Brassica', zones: '3–9', daysToHarvest: '70–120', yieldPer: '1 head/plant (3–6 lbs)', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Dill', 'Mint', 'Thyme'], avoidWith: ['Strawberry', 'Tomato'], notes: 'Great for fermentation (sauerkraut).' },
  { name: 'Green Beans (Bush)', category: 'vegetable', type: 'annual', family: 'Legume', zones: '3–10', daysToHarvest: '50–60', yieldPer: '1–2 lbs/plant', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Carrot', 'Squash', 'Corn'], avoidWith: ['Onion', 'Fennel', 'Beets'], notes: 'Fixes nitrogen — always follow with heavy feeders.' },
  { name: 'Peas (Shelling)', category: 'vegetable', type: 'annual', family: 'Legume', zones: '3–9', daysToHarvest: '60–70', yieldPer: '1 lb/5 ft row', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Carrot', 'Radish', 'Spinach'], avoidWith: ['Onion', 'Garlic', 'Shallot'], notes: 'Cool-season crop. Plant as soon as soil can be worked.' },
  { name: 'Garlic', category: 'vegetable', type: 'annual', family: 'Allium', zones: '3–9', daysToHarvest: '240 (plant fall, harvest summer)', yieldPer: '1 bulb/clove planted', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Tomato', 'Rose', 'Brassicas'], avoidWith: ['Beans', 'Peas', 'Asparagus'], notes: 'Save your biggest bulbs each year to replant.' },
  { name: 'Onion', category: 'vegetable', type: 'annual', family: 'Allium', zones: '3–9', daysToHarvest: '100–120', yieldPer: '1 bulb/set', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Carrot', 'Beet', 'Tomato'], avoidWith: ['Beans', 'Peas'], notes: 'Dry thoroughly before storing — lasts 6–8 months.' },
  { name: 'Cucumber', category: 'vegetable', type: 'annual', family: 'Cucurbit', zones: '4–11', daysToHarvest: '50–70', yieldPer: '10–15 fruits/plant', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Bean', 'Pea', 'Sunflower'], avoidWith: ['Sage', 'Potato', 'Melons'], notes: 'Harvest frequently to keep plant producing.' },
  { name: 'Zucchini / Summer Squash', category: 'vegetable', type: 'annual', family: 'Cucurbit', zones: '3–11', daysToHarvest: '45–60', yieldPer: '6–10 lbs/plant/week', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Corn', 'Bean', 'Nasturtium'], avoidWith: ['Potato'], notes: 'One plant feeds a family — plant one or two max.' },
  { name: 'Winter Squash', category: 'vegetable', type: 'annual', family: 'Cucurbit', zones: '3–10', daysToHarvest: '80–110', yieldPer: '5–15 lbs/plant', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Corn', 'Bean', 'Borage'], avoidWith: ['Potato'], notes: 'Stores 3–6 months in cool, dry conditions.' },
  { name: 'Carrot', category: 'vegetable', type: 'biennial', family: 'Root', zones: '3–10', daysToHarvest: '70–80', yieldPer: '10–15 per ft row', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Tomato', 'Lettuce', 'Onion'], avoidWith: ['Dill', 'Parsnip'], notes: 'Direct sow only — hates transplanting.' },
  { name: 'Beet', category: 'vegetable', type: 'annual', family: 'Root', zones: '3–10', daysToHarvest: '55–70', yieldPer: '1 lb/ft row', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Onion', 'Lettuce', 'Brassicas'], avoidWith: ['Beans'], notes: 'Eat both the roots and greens. Tops are great for chickens.' },
  { name: 'Sweet Corn', category: 'vegetable', type: 'annual', family: 'Grain', zones: '3–11', daysToHarvest: '70–90', yieldPer: '1–2 ears/stalk', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Bean', 'Squash', 'Cucumber'], avoidWith: ['Tomato', 'Celery'], notes: 'Plant in blocks (not rows) for good pollination.' },
  { name: 'Lettuce', category: 'vegetable', type: 'annual', family: 'Other', zones: '3–10', daysToHarvest: '45–60', yieldPer: 'Multiple harvests', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Carrot', 'Radish', 'Strawberry'], avoidWith: ['Celery', 'Parsley'], notes: 'Cut-and-come-again variety best for continuous harvest.' },
  { name: 'Sweet Potato', category: 'vegetable', type: 'annual', family: 'Root', zones: '5–11', daysToHarvest: '90–120', yieldPer: '4–6 lbs/plant', seedSavable: true, heirloom: false, unusual: true, companionsWith: ['Okra', 'Beets', 'Thyme'], avoidWith: ['Squash'], notes: 'Cure for 2 weeks at 85°F before storage — dramatically improves keeping.' },
  { name: 'Jerusalem Artichoke', category: 'vegetable', type: 'perennial', family: 'Other', zones: '3–9', daysToHarvest: '110–150', yieldPer: '7–10 lbs/plant/year', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Most plants', 'Corn'], avoidWith: ['Sunflower'], notes: 'Also called sunchoke. Extremely productive perennial. Spreads aggressively — contain it.' },
  { name: 'Amaranth', category: 'grain', type: 'annual', family: 'Grain', zones: '4–10', daysToHarvest: '90–110', yieldPer: '1–2 lbs grain/plant', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Corn', 'Onion', 'Pepper'], avoidWith: [], notes: 'Dual-use: grain and leafy greens. Excellent self-reliance crop.' },
  { name: 'Asparagus', category: 'vegetable', type: 'perennial', family: 'Other', zones: '3–8', daysToHarvest: 'Year 3 (plant crowns)', yieldPer: '½ lb/crown/year', seedSavable: false, heirloom: false, unusual: false, companionsWith: ['Tomato', 'Basil', 'Parsley'], avoidWith: ['Onion', 'Garlic'], notes: 'Perennial for 20+ years. Worth the wait. Plant crowns for fastest harvest.' },
  { name: 'Rhubarb', category: 'vegetable', type: 'perennial', family: 'Other', zones: '3–8', daysToHarvest: 'Year 2', yieldPer: '3–5 lbs/plant/year', seedSavable: false, heirloom: false, unusual: false, companionsWith: ['Onion', 'Garlic', 'Brassicas'], avoidWith: ['Pumpkin', 'Dock'], notes: 'Leaf stalks only — leaves are toxic. Great for pies, jams, and trading.' },
  { name: 'Walking Onion', category: 'vegetable', type: 'perennial', family: 'Allium', zones: '3–9', daysToHarvest: 'Year-round once established', yieldPer: 'Multiplies each year', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Most vegetables', 'Rose'], avoidWith: ['Beans', 'Peas'], notes: '"Plants itself" by bending over and planting topsets. Zero-maintenance perennial onion.' },
  { name: 'Apple', category: 'fruit', type: 'perennial', family: 'Fruit', zones: '3–9', daysToHarvest: 'Year 2–4', yieldPer: '400–600 lbs/tree at maturity', seedSavable: false, heirloom: false, unusual: false, companionsWith: ['Nasturtium', 'Comfrey', 'Chive'], avoidWith: ['Grass (competing)'], notes: 'Needs a pollinator variety. Dwarf trees produce earlier.' },
  { name: 'Pear', category: 'fruit', type: 'perennial', family: 'Fruit', zones: '4–9', daysToHarvest: 'Year 3–5', yieldPer: '150–200 lbs/tree at maturity', seedSavable: false, heirloom: false, unusual: false, companionsWith: ['Comfrey', 'Chive', 'Nasturtium'], avoidWith: [], notes: 'Asian pears are more disease-resistant and produce earlier.' },
  { name: 'Pawpaw', category: 'fruit', type: 'perennial', family: 'Fruit', zones: '5–9', daysToHarvest: 'Year 5–7', yieldPer: '25–40 lbs/tree at maturity', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Comfrey', 'Native plants'], avoidWith: [], notes: 'Native American fruit. No pests, no spraying needed. Custard-like tropical flavor.' },
  { name: 'Fig', category: 'fruit', type: 'perennial', family: 'Fruit', zones: '7–11', daysToHarvest: 'Year 2–3', yieldPer: '20–30 lbs/tree', seedSavable: false, heirloom: false, unusual: false, companionsWith: ['Rue', 'Comfrey'], avoidWith: [], notes: 'Can be grown in pots in colder zones (bring indoors in winter).' },
  { name: 'Mulberry', category: 'fruit', type: 'perennial', family: 'Fruit', zones: '4–9', daysToHarvest: 'Year 2–3', yieldPer: '30–60 lbs/tree/year', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Comfrey', 'Clover'], avoidWith: [], notes: 'Extremely productive, low-maintenance. Also feeds chickens and pigs directly.' },
  { name: 'Persimmon', category: 'fruit', type: 'perennial', family: 'Fruit', zones: '4–9', daysToHarvest: 'Year 3–5', yieldPer: '50–80 lbs/tree at maturity', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Comfrey'], avoidWith: [], notes: 'American persimmon (astringent) is extremely cold-hardy and disease-free.' },
  { name: 'Basil', category: 'herb', type: 'annual', family: 'Herb', zones: '4–11', daysToHarvest: '30–40', yieldPer: 'Continuous harvest', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Tomato', 'Pepper', 'Asparagus'], avoidWith: ['Sage', 'Thyme'], notes: 'Pinch flowers to keep producing. Repels aphids and whiteflies.' },
  { name: 'Comfrey', category: 'medicinal', type: 'perennial', family: 'Herb', zones: '3–9', daysToHarvest: 'Year 1', yieldPer: '4–5 harvests/year', seedSavable: false, heirloom: false, unusual: true, companionsWith: ['Everything — plant at edges', 'Fruit trees'], avoidWith: [], notes: 'Dynamic accumulator. Feed to chickens, rabbits. Steep in water for liquid fertilizer. Spreads — contain roots.' },
  { name: 'Lavender', category: 'herb', type: 'perennial', family: 'Herb', zones: '5–9', daysToHarvest: 'Year 2', yieldPer: 'Multiple harvests', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Brassicas', 'Tomato', 'Rose'], avoidWith: [], notes: 'Attracts pollinators. Repels deer, rabbits, and moths.' },
  { name: 'Echinacea', category: 'medicinal', type: 'perennial', family: 'Herb', zones: '3–9', daysToHarvest: 'Year 2–3 (roots)', yieldPer: 'Ongoing', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Lavender', 'Salvia'], avoidWith: [], notes: 'Medicinal roots and flowers. Self-seeds freely. Immune support herb.' },
  { name: 'Elderberry', category: 'medicinal', type: 'perennial', family: 'Fruit', zones: '3–9', daysToHarvest: 'Year 2', yieldPer: '10–25 lbs/plant/year', seedSavable: true, heirloom: true, unusual: true, companionsWith: ['Native plants', 'Berry shrubs'], avoidWith: [], notes: 'Medicinal immune-support berries. Make syrup for winter. Also attracts beneficial insects.' },
  { name: 'Duckweed', category: 'vegetable', type: 'perennial', family: 'Other', zones: '4–11', daysToHarvest: 'Ongoing (doubles every 2 days)', yieldPer: 'Self-replenishing aquatic crop', seedSavable: false, heirloom: false, unusual: true, companionsWith: ['Fish', 'Chickens'], avoidWith: [], notes: 'Highest protein-per-acre of any plant. Feed to chickens, fish, ducks. Grow in a trough or pond.' },
  { name: 'Sunflower', category: 'grain', type: 'annual', family: 'Other', zones: '3–11', daysToHarvest: '80–120', yieldPer: '1–2 lbs seeds/plant', seedSavable: true, heirloom: true, unusual: false, companionsWith: ['Cucumber', 'Corn', 'Squash'], avoidWith: ['Potato', 'Beans (some)'], notes: 'Dual use: human food + chicken/bird feed. Excellent pollinator plant.' },
]

const CATEGORIES = ['all', 'vegetable', 'fruit', 'herb', 'medicinal', 'grain'] as const
const TYPES = ['all', 'annual', 'perennial', 'biennial'] as const

export default function PlantsPage() {
  const { profile } = useGardenProfile()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [type, setType] = useState<string>('all')
  const [showUnusual, setShowUnusual] = useState(false)

  const filtered = useMemo(() => {
    return PLANTS.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'all' && p.category !== category) return false
      if (type !== 'all' && p.type !== type) return false
      if (showUnusual && !p.unusual) return false
      return true
    })
  }, [search, category, type, showUnusual])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plant Picker</h1>
        <p className="mt-1 text-muted-foreground">
          {profile?.hardiness_zone
            ? `Showing plants suitable for Zone ${profile.hardiness_zone}. Click any plant for companion and care details.`
            : 'Set your profile ZIP code to see zone-filtered recommendations.'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search plants..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => <SelectItem key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge
          variant={showUnusual ? 'default' : 'outline'}
          className="cursor-pointer select-none"
          onClick={() => setShowUnusual((v) => !v)}
        >
          High-Value & Unusual
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} plants</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <div className="flex gap-1 flex-wrap justify-end">
                  {p.unusual && <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">★ High-Value</Badge>}
                  <Badge variant="outline" className="text-xs">{p.type}</Badge>
                </div>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground flex-wrap">
                <span>{p.family}</span>
                <span>·</span>
                <span>Zone {p.zones}</span>
                <span>·</span>
                <span>{p.daysToHarvest} days</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yield</span>
                <span className="font-medium">{p.yieldPer}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {p.seedSavable && <Badge variant="secondary" className="text-xs">Seed-Savable</Badge>}
                {p.heirloom && <Badge variant="secondary" className="text-xs">Heirloom</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{p.notes}</p>
              {p.companionsWith.length > 0 && (
                <div className="text-xs">
                  <span className="text-green-600 font-medium">Companions: </span>
                  <span className="text-muted-foreground">{p.companionsWith.join(', ')}</span>
                </div>
              )}
              {p.avoidWith.length > 0 && (
                <div className="text-xs">
                  <span className="text-red-600 font-medium">Avoid near: </span>
                  <span className="text-muted-foreground">{p.avoidWith.join(', ')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-green-800">Trusted Seed Sources</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2 text-sm text-green-700">
          <div><strong>Baker Creek Heirloom Seeds</strong> — rareseeds.com — largest heirloom variety selection</div>
          <div><strong>Seed Savers Exchange</strong> — seedsavers.org — non-profit, open-pollinated focus</div>
          <div><strong>Southern Exposure Seed Exchange</strong> — southernexposure.com — Southeast-adapted varieties</div>
          <div><strong>High Mowing Organic Seeds</strong> — highmowingseeds.com — certified organic, cold-climate varieties</div>
        </CardContent>
      </Card>
    </div>
  )
}
