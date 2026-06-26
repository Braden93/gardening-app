import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useHomesteadAnimals } from '@/hooks/use-homestead-animals'
import { ANIMAL_EMOJIS } from '@/types/garden'
import type { AnimalType } from '@/types/garden'
import { Plus, Trash2 } from 'lucide-react'

const ANIMAL_GUIDES: Record<AnimalType, {
  title: string
  tagline: string
  breeds: { name: string; best: string }[]
  feedFromLand: string[]
  manureNote: string
  startingTip: string
  reference: string
}> = {
  chickens: {
    title: 'Chickens', tagline: 'Eggs, pest control, and the best compost activator',
    breeds: [
      { name: 'Rhode Island Red', best: 'Dual-purpose (eggs + meat), hardy, 250–300 eggs/year' },
      { name: 'Plymouth Rock', best: 'Dual-purpose, cold-hardy, calm temperament, 200+ eggs/year' },
      { name: 'Australorp', best: 'Record egg layers (365+/year), gentle, heat-tolerant' },
      { name: 'Cornish Cross', best: 'Meat breed — reaches 8 lbs in 8 weeks' },
    ],
    feedFromLand: [
      'Sprout barley/wheat/sunflower seeds in 7-day fodder trays (80–90% of diet)',
      'Black Soldier Fly Larvae (BSFL) from kitchen scrap bin — high protein, self-generating',
      'Mealworms (grow in drawer system with oats + apple slices)',
      'Duckweed grown in a trough or small pond — highest plant protein',
      'Garden scraps: beet tops, kale, carrot tops, spent plants, squash',
      'Comfrey (plant once, harvest 4–5x/year, chickens love it)',
      'Sunflower seeds — grow 10–15 plants per bird for winter protein',
      'Amaranth grain — highly productive self-reliance grain crop',
    ],
    manureNote: 'Chicken manure is "hot" — must compost 90–180 days before applying to garden. Excellent finished. Age in a covered pile with carbon (straw).',
    startingTip: 'Start with 4–6 hens. A well-managed flock of 6 produces 18–24 eggs/week for a family of 4. Add a rooster only if you want chicks.',
    reference: 'Storey\'s Guide to Raising Chickens by Gail Damerow',
  },
  cows: {
    title: 'Dairy Cow', tagline: 'Milk, butter, cheese, and pasture fertility',
    breeds: [
      { name: 'Dexter', best: 'Smallest dairy breed (600–900 lbs), excellent for small farms, dual-purpose, friendly' },
      { name: 'Jersey', best: 'Richest milk (5–6% butterfat vs 3.5% average), 6–8 gallons/day at peak, heat-tolerant' },
      { name: 'Milking Shorthorn', best: 'Hardy, adaptable, dual-purpose, 5–6 gallons/day, good for cold climates' },
      { name: 'Brown Swiss', best: 'Long lactation, very gentle, excellent forager, 6–8 gallons/day' },
    ],
    feedFromLand: [
      'Rotational grazing: divide pasture into 4–8 paddocks, rotate every 3–7 days',
      'Alfalfa — highest protein forage, also fixes nitrogen. Grow or buy as hay',
      'Red & white clover — excellent mixed with grasses, high protein',
      'Chicory — deep taproots, drought-tolerant, highly palatable',
      'Turnips & mangel beets — one mangel beet per cow per day as winter supplement',
      'Sorghum-sudangrass — high-yielding summer forage',
      'Winter rye — cool-season forage, can be grazed in fall and spring',
      'Silvopasture: fruit and nut trees in pasture provide browse, shade, and fallen fruit',
    ],
    manureNote: 'Age 3–6 months. Lower nitrogen but high volume — excellent soil conditioner. Spread on pastures and compost into garden beds.',
    startingTip: 'One dairy cow produces 4–8 gallons of milk per day — far more than a family needs. Consider a share or mini-herd of 2 cows milked every other day.',
    reference: 'The Family Cow by Dirk van Loon · Keeping a Family Cow by Joann Grohman',
  },
  rabbits: {
    title: 'Meat Rabbits', tagline: 'Efficient protein, best garden fertilizer, fast reproduction',
    breeds: [
      { name: 'New Zealand White', best: 'Industry-standard meat breed, 8–12 lbs at harvest, efficient feed conversion' },
      { name: 'California White', best: 'Similar to NZW, slightly calmer, fast growth, good mothering' },
      { name: 'Rex', best: 'Dual-purpose: meat + high-value velvety pelt, 7–10 lbs' },
      { name: 'Flemish Giant', best: 'Largest breed (14+ lbs), slower growth, impressive but less efficient' },
    ],
    feedFromLand: [
      'Hay — grow oat hay, timothy, or orchard grass on any spare land',
      'Comfrey — plant once, harvest all season. Rabbits go wild for it',
      'Garden greens: kale, chard, beet tops, carrot tops, lettuce',
      'Dandelion (weeds become feed) — rabbits love it',
      'Plantain weed — free, abundant, very healthy for rabbits',
      'Dried herbs: oregano, dill, mint — health benefits + variety',
      'Sunflower seeds — high-fat supplement for winter and does with kits',
    ],
    manureNote: 'COLD MANURE — the only animal manure that can be used directly on garden beds without composting. Won\'t burn plants. One doe produces 200+ lbs/year. The single best garden fertilizer.',
    startingTip: '3 does + 1 buck = 100–150 kits/year = 300–500 lbs of meat. Gestation is 30 days. Grow-out to harvest weight is 8–12 weeks.',
    reference: 'Storey\'s Guide to Raising Rabbits by Bob Bennett · ARBA (arba.net)',
  },
  fish: {
    title: 'Fish Farm / Aquaponics', tagline: 'Protein + vegetables in one closed loop',
    breeds: [
      { name: 'Tilapia', best: 'Warm water (70–85°F), eats duckweed/algae, fastest growing, tolerates crowding' },
      { name: 'Channel Catfish', best: 'Very hardy, good flavor, tolerates lower water quality, pond or tank' },
      { name: 'Yellow Perch', best: 'Cold-tolerant, excellent flavor, good for cooler climates' },
      { name: 'Trout (Rainbow)', best: 'Cold water (55–65°F), premium eating, requires oxygenated water' },
      { name: 'Bluegill + Largemouth Bass', best: 'Self-regulating pond combination — bass control bluegill population naturally' },
    ],
    feedFromLand: [
      'Duckweed — grows on pond/trough surface, 35–40% protein, doubles every 2–4 days',
      'Azolla (nitrogen-fixing fern) — floats on water, protein-rich, also fixes N for garden',
      'Black Soldier Fly Larvae — same bin system as chickens, extremely high protein',
      'Redworms from compost bin — excellent fish feed, easy to raise',
      'Controlled algae growth — allow beneficial algae in outdoor ponds',
    ],
    manureNote: 'Fish waste = liquid fertilizer for plants. In aquaponics, bacteria convert fish ammonia → nitrates → plant nutrition. Water stays clean while plants feed.',
    startingTip: 'Start with a single 275-gallon IBC tote aquaponics system (under $200 used). Stock 20–30 tilapia. Grow greens and herbs in floating rafts or media beds above.',
    reference: 'Aquaponic Gardening by Sylvia Bernstein · ATTRA (attra.ncat.org) free aquaponics guides',
  },
  ducks: {
    title: 'Ducks', tagline: 'Superior eggs, pest control, and natural slug/snail hunters',
    breeds: [
      { name: 'Khaki Campbell', best: 'Top egg layer (300–340 eggs/year — more than most chickens), active forager' },
      { name: 'Indian Runner', best: 'Excellent layer (250–300 eggs/year), upright posture, great foragers' },
      { name: 'Pekin', best: 'Dual-purpose: meat + eggs, friendly, large white eggs, fast-growing' },
      { name: 'Muscovy', best: 'Quiet (no quacking), self-brooding, lean meat, good eggs, pest hunters' },
    ],
    feedFromLand: [
      'Forage — ducks actively hunt insects, slugs, snails, and mosquito larvae',
      'Worms from compost pile — high protein, ducks love them',
      'Duckweed — they\'ll eat it directly from a pond or trough',
      'Garden scraps and spent plants',
      'Fodder systems same as chickens — sprouted grains',
    ],
    manureNote: 'Similar to chickens — needs aging or composting before applying to garden. Nutrient-rich.',
    startingTip: 'Ducks are excellent pest controllers in the garden — they eat slugs and snails without scratching up beds like chickens. A few ducks patrol the orchard or pathways naturally.',
    reference: 'Storey\'s Guide to Raising Ducks by Dave Holderread',
  },
  quail: {
    title: 'Coturnix Quail', tagline: 'Maximum eggs from minimum space — HOA-friendly',
    breeds: [
      { name: 'Coturnix (Japanese)', best: 'Begins laying at 6–8 weeks, 200–300 eggs/year, silent males, easy to raise' },
      { name: 'Jumbo Coturnix', best: 'Larger meat yield, similar egg production, same care requirements' },
      { name: 'Bobwhite', best: 'Native species, gamey meat, can be wild-released, slower to mature' },
    ],
    feedFromLand: [
      'Sprouted grains (millet, wheat) — fodder system works at small scale',
      'Garden insects and greens',
      'Mealworms — easy to raise, high protein',
      'Dandelion, clover, and small weed seeds',
    ],
    manureNote: 'Small volume but high nitrogen. Compost or use diluted. Easy to handle.',
    startingTip: 'A 4×8 ft hutch houses 20–25 birds comfortably. 20 coturnix hens produce 15–18 eggs/day. Quail are nearly silent — males make a soft crow, nothing like roosters.',
    reference: 'The Quail Lady (YouTube) · Various Coturnix quail forums',
  },
  goats: {
    title: 'Goats', tagline: 'Dairy, meat, brush clearing, and soap',
    breeds: [
      { name: 'Nigerian Dwarf', best: 'Small (50–75 lbs), very high butterfat milk (6–10%), manageable for beginners' },
      { name: 'Nubian', best: 'High butterfat (4–5%), 1–3 quarts/day, long droopy ears, friendly' },
      { name: 'LaMancha', best: 'High production (3–4 quarts/day), very calm, distinctive tiny ears' },
      { name: 'Boer', best: 'Top meat breed, fast-growing, heavy-bodied, tolerant forager' },
    ],
    feedFromLand: [
      'Browse — goats prefer shrubs and weeds over grass (unlike cattle)',
      'Excellent for clearing brush, invasive species, and overgrown areas',
      'Hay — rotate pasture regularly, supplement with hay in winter',
      'Garden scraps and spent plants — they eat almost anything',
      'Tree leaves (apple, willow, mulberry) — excellent browse',
    ],
    manureNote: 'Dry pelleted manure, easy to handle. Similar to rabbit. Age 30–60 days or use directly in compost. Excellent garden amendment.',
    startingTip: 'Goats require a companion — never keep just one. Get at least two. They\'re escape artists: solid fencing is essential. 4+ ft high, no horizontal rails to climb.',
    reference: 'Storey\'s Guide to Raising Dairy Goats by Jerry Belanger',
  },
  pigs: {
    title: 'Pigs', tagline: 'Land clearing, processing waste, and excellent meat',
    breeds: [
      { name: 'Berkshire', best: 'Heritage breed, exceptional marbled flavor, good forager, friendly temperament' },
      { name: 'Tamworth', best: 'Best forager/grazer of any breed, lean meat, excellent for land clearing' },
      { name: 'Red Wattle', best: 'Hardy, aggressive forager, excellent flavor, heat-tolerant' },
      { name: 'Kunekune', best: 'Grazes on grass (unlike other pigs), small, excellent temperament, lower input' },
    ],
    feedFromLand: [
      'Garden waste — spent plants, culls, vegetable scraps',
      'Windfall and imperfect fruit — apples, pears, squash',
      'Whey from cheesemaking — pigs thrive on dairy byproducts',
      'BSFL larvae — high protein supplement',
      'Acorns and mast (rotate through oak-wooded areas)',
      'Rotationally clear new garden areas — pigs do the rototilling for free',
    ],
    manureNote: 'Must be thoroughly composted before use. High pathogen risk if fresh. Compost hot for 90+ days. Excellent when finished.',
    startingTip: 'Most homesteaders raise 1–2 pigs per year from spring to fall. One pig yields 150–200 lbs of pork — a family\'s meat supply for most of the year.',
    reference: 'Storey\'s Guide to Raising Pigs by Kelly Klober · Joel Salatin\'s Polyface farm model',
  },
  bees: {
    title: 'Beekeeping', tagline: 'Honey as sugar replacement, wax, and pollination for the whole homestead',
    breeds: [
      { name: 'Italian', best: 'Most popular, gentle, excellent honey producers, good for beginners' },
      { name: 'Carniolan', best: 'Very gentle, excellent spring buildup, hygienic behavior, cold-hardy' },
      { name: 'Russian', best: 'Varroa mite resistant, cold-hardy, thrifty in early spring' },
      { name: 'Buckfast', best: 'Gentle, disease-resistant, good honey yield, all-around excellent' },
    ],
    feedFromLand: [
      'Plant diverse flowering plants that bloom spring–fall for continuous forage',
      'Clover (most important) — white and red clover are top nectar sources',
      'Sunflowers, borage, phacelia — high-nectar summer crops',
      'Fruit tree blossoms — critical spring buildup forage',
      'Buckwheat — late season nectar source',
      'Lavender, echinacea, anise hyssop, monarda — excellent pollinator plants',
      'Leave some areas "wild" with dandelions and native flowers',
    ],
    manureNote: 'Bees produce no garden-applicable manure, but their pollination service is irreplaceable — can increase fruit and vegetable yields by 30–80%.',
    startingTip: 'Start with a complete beginner kit: Langstroth hive, veil, gloves, smoker, hive tool. Two hives minimum — one to compare against. Local beekeeping clubs offer free mentoring.',
    reference: 'Beekeeping for Dummies by Howland Blackiston · American Beekeeping Federation (abfnet.org)',
  },
}

const ANIMAL_TYPES: AnimalType[] = ['chickens', 'cows', 'rabbits', 'fish', 'ducks', 'quail', 'goats', 'pigs', 'bees']

export default function HomesteadPage() {
  const { animals, isLoading, create, remove } = useHomesteadAnimals()
  const [addOpen, setAddOpen] = useState(false)
  const [animalType, setAnimalType] = useState<AnimalType>('chickens')
  const [breed, setBreed] = useState('')
  const [count, setCount] = useState('1')
  const [notes, setNotes] = useState('')

  async function handleAdd() {
    await create.mutateAsync({ animal_type: animalType, breed: breed || null, count: parseInt(count) || 1, setup_date: null, notes: notes || null })
    setAddOpen(false)
    setBreed('')
    setCount('1')
    setNotes('')
  }

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homestead Animal Integration</h1>
          <p className="mt-1 text-muted-foreground">
            Every animal on a self-reliant homestead feeds the others. Close the loop.
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Animal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add to Your Homestead</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Animal Type</Label>
                <Select value={animalType} onValueChange={(v) => setAnimalType(v as AnimalType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ANIMAL_TYPES.map((a) => (
                      <SelectItem key={a} value={a}>{ANIMAL_EMOJIS[a]} {ANIMAL_GUIDES[a].title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Breed (optional)</Label>
                  <Input placeholder="e.g. Jersey, Khaki Campbell" value={breed} onChange={(e) => setBreed(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Count</Label>
                  <Input type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Notes</Label>
                <Input placeholder="Setup notes, location, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <Button onClick={handleAdd} disabled={create.isPending} className="w-full">Add to Homestead</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My animals */}
      {animals.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">YOUR HOMESTEAD</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border bg-card p-3 group">
                <span className="text-2xl">{ANIMAL_EMOJIS[a.animal_type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{a.count}× {a.breed ?? ANIMAL_GUIDES[a.animal_type].title}</p>
                  {a.notes && <p className="text-xs text-muted-foreground truncate">{a.notes}</p>}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => remove.mutate(a.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrated system */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-green-800">The Integrated Loop</CardTitle>
          <CardDescription>How everything feeds everything else</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2 text-sm text-green-700">
          <p>🌱 <strong>Garden scraps →</strong> Chickens/Rabbits/Pigs → Manure → Compost → Garden</p>
          <p>💧 <strong>Pond/trough →</strong> Duckweed → Fish + Chickens → Aquaponic plants</p>
          <p>🧀 <strong>Dairy →</strong> Whey → Pigs → Manure → Pasture fertility</p>
          <p>🐝 <strong>Bees →</strong> Pollinate garden & orchard → Honey (sugar) + Wax</p>
          <p>🐄 <strong>Pasture →</strong> Cows/Goats → Milk/Meat → Manure → Soil</p>
          <p>🪲 <strong>Kitchen scraps →</strong> BSFL bin → Larvae → Chickens/Fish</p>
        </CardContent>
      </Card>

      {/* Animal guides */}
      <Tabs defaultValue="chickens">
        <TabsList className="flex-wrap h-auto">
          {ANIMAL_TYPES.map((a) => (
            <TabsTrigger key={a} value={a} className="text-base px-2">
              {ANIMAL_EMOJIS[a]}
            </TabsTrigger>
          ))}
        </TabsList>
        {ANIMAL_TYPES.map((a) => {
          const g = ANIMAL_GUIDES[a]
          return (
            <TabsContent key={a} value={a} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">{ANIMAL_EMOJIS[a]} {g.title}</h2>
                <p className="text-muted-foreground">{g.tagline}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Recommended Breeds</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {g.breeds.map((b) => (
                      <div key={b.name}>
                        <p className="font-medium text-sm">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.best}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Feed from the Land</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {g.feedFromLand.map((f) => <li key={f}>• {f}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className="pt-4 grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Manure / Waste</p>
                    <p className="text-muted-foreground">{g.manureNote}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Getting Started</p>
                    <p className="text-muted-foreground">{g.startingTip}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="text-xs text-muted-foreground">
                <strong>Reference: </strong>{g.reference}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
