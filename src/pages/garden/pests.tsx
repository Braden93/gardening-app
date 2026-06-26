import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Pest {
  name: string
  type: 'animal' | 'insect'
  emoji: string
  damage: string
  signs: string
  solutions: { budget: 'free' | 'low' | 'medium'; label: string; detail: string }[]
  companions: string[]
}

const PESTS: Pest[] = [
  {
    name: 'Deer', type: 'animal', emoji: '🦌',
    damage: 'Eat young plants, browse fruit trees and shrubs, trample beds overnight',
    signs: 'Ragged bite marks (they tear, not cut), hoofprints, scat, damaged branch ends',
    solutions: [
      { budget: 'free', label: 'Strong-scent barriers', detail: 'Hang bars of Irish Spring soap in mesh bags every 3 ft. Human hair in mesh bags. Predator urine (coyote/wolf) around perimeter. Refresh after rain.' },
      { budget: 'free', label: 'Noise deterrents', detail: 'Wind chimes, aluminum pie plates on string, motion-activated radio. They habituate over time — rotate methods.' },
      { budget: 'low', label: 'Motion-activated sprinkler', detail: 'Orbit Yard Enforcer ($30–50) surprises deer with a burst of water. Very effective, especially on paths they use.' },
      { budget: 'medium', label: 'Deer fence (8 ft)', detail: '8 ft woven wire or plastic mesh fence is the only fully reliable solution. Deer won\'t jump what they can\'t see over — double-fence system (two 4 ft fences 3 ft apart) is cheaper and equally effective.' },
    ],
    companions: ['Lavender (repels deer)', 'Rosemary', 'Sage', 'Yarrow', 'Marigold (perimeter)'],
  },
  {
    name: 'Rabbits', type: 'animal', emoji: '🐇',
    damage: 'Clip young plants at soil level, eat leafy greens, girdle young trees',
    signs: 'Clean 45° cuts at ground level, small round droppings, small tracks',
    solutions: [
      { budget: 'free', label: 'Hardware cloth cylinders', detail: 'Wrap individual plants with 1/4" hardware cloth cylinders 18" tall. Cheap, effective for trees and transplants.' },
      { budget: 'free', label: 'Scent deterrents', detail: 'Blood meal sprinkled around beds (also feeds plants). Predator urine. Cayenne pepper on leaves (reapply after rain).' },
      { budget: 'low', label: 'Chicken wire perimeter', detail: '2 ft chicken wire around entire garden, buried 6" underground (L-shape outward) to prevent burrowing.' },
      { budget: 'medium', label: 'Hardware cloth fence', detail: '1/4" hardware cloth, 36" tall, buried 6" at an outward L-angle. More expensive but permanent and fully effective.' },
    ],
    companions: ['Garlic (planted densely at perimeter)', 'Marigold', 'Lavender', 'Catnip'],
  },
  {
    name: 'Gophers', type: 'animal', emoji: '🐿️',
    damage: 'Tunnel underground and eat roots, bulbs, and pull plants down from below',
    signs: 'Fan-shaped soil mounds (different from moles), disappearing plants, wilting without cause',
    solutions: [
      { budget: 'free', label: 'Castor oil repellent', detail: 'Mix 3 tbsp castor oil + 1 tbsp dish soap in 1 gallon water. Pour into active tunnels and around beds. Reapply monthly.' },
      { budget: 'low', label: 'Hardware cloth basket lining', detail: 'Line raised beds with 1/4" hardware cloth before filling. Create wire baskets around individual plants. Most effective permanent solution for raised beds.' },
      { budget: 'low', label: 'Trapping', detail: 'Macabee traps placed in active tunnels (look for fresh mounds). Cover tunnel opening after setting. Check daily.' },
      { budget: 'medium', label: 'Raised beds with wire liner', detail: 'The definitive solution. Any raised bed with 1/4" hardware cloth floor is gopher-proof permanently.' },
    ],
    companions: ['Gopher spurge (Euphorbia lathyris) — natural repellent plant', 'Garlic (mass planting)'],
  },
  {
    name: 'Groundhog / Woodchuck', type: 'animal', emoji: '🦫',
    damage: 'Eat almost everything, burrow under fences',
    signs: 'Large burrow entrances (6–8" diameter), broad gnaw marks, missing entire plants',
    solutions: [
      { budget: 'free', label: 'Predator scent', detail: 'Place used cat litter, coyote urine, or fox urine near burrow entrances monthly.' },
      { budget: 'low', label: 'Electric fence strand', detail: 'A single electric wire 4–5" above ground deters groundhogs reliably. Simple, cheap, effective.' },
      { budget: 'medium', label: 'Hardware cloth + electric combo', detail: '3 ft buried hardware cloth fence + single electric wire at top. Fully effective barrier.' },
    ],
    companions: ['Marigold', 'Lavender', 'Garlic at perimeter'],
  },
  {
    name: 'Aphids', type: 'insect', emoji: '🐛',
    damage: 'Suck sap from stems and leaves, transmit disease, create sticky honeydew',
    signs: 'Clusters of tiny soft insects under leaves, curled or yellowed leaves, sticky residue, ants farming them',
    solutions: [
      { budget: 'free', label: 'Blast with water', detail: 'Spray with strong water stream to knock off. Aphids rarely reattach once dislodged. Repeat daily for 3–4 days.' },
      { budget: 'free', label: 'Attract beneficials', detail: 'Ladybugs, lacewings, and parasitic wasps eat aphids. Plant dill, fennel, yarrow, and sweet alyssum to attract them.' },
      { budget: 'low', label: 'Insecticidal soap spray', detail: '1 tbsp pure liquid soap (not dish soap with degreasers) per quart water. Spray directly on aphids. Kills on contact — no residual effect.' },
      { budget: 'low', label: 'Neem oil spray', detail: 'Mix neem oil per directions. Spray undersides of leaves in evening. Disrupts aphid reproduction. 7-day cycle.' },
    ],
    companions: ['Marigold', 'Nasturtium (trap crop — aphids prefer it)', 'Dill', 'Fennel', 'Sweet alyssum'],
  },
  {
    name: 'Tomato Hornworm', type: 'insect', emoji: '🐛',
    damage: 'Defoliate tomato, pepper, and eggplant plants rapidly overnight',
    signs: 'Large green caterpillars hard to spot, dark droppings on leaves, stripped stems',
    solutions: [
      { budget: 'free', label: 'Hand pick', detail: 'Check plants at night with a black light — hornworms glow. Drop into soapy water. Check daily.' },
      { budget: 'free', label: 'Leave parasitized ones', detail: 'Hornworms with white egg sacs (braconid wasp eggs) should be left — the wasps will kill many more pests.' },
      { budget: 'low', label: 'Bt (Bacillus thuringiensis)', detail: 'Spray Bt on plants every 5–7 days. Natural bacterial pesticide — kills caterpillars without harming other insects.' },
    ],
    companions: ['Dill (attracts parasitic wasps)', 'Basil', 'Marigold', 'Borage'],
  },
  {
    name: 'Squash Vine Borer', type: 'insect', emoji: '🦋',
    damage: 'Larvae bore into squash stems and kill plants from inside',
    signs: 'Sudden wilting of entire plants, sawdust-like frass at base of stem',
    solutions: [
      { budget: 'free', label: 'Row covers at planting', detail: 'Cover squash with row covers before adults emerge (late June in most zones). Remove for pollination once plants flower.' },
      { budget: 'free', label: 'Succession planting', detail: 'Plant a second succession in July — it matures after the SVB flight is done and largely escapes damage.' },
      { budget: 'low', label: 'Inject Bt into stems', detail: 'If larvae are already inside, inject a Bt solution into the stem at entry points. Slit stem, remove larva, mound soil over wound.' },
    ],
    companions: ['Nasturtium', 'Radish (planted at base)'],
  },
  {
    name: 'Cabbage Worm', type: 'insect', emoji: '🦋',
    damage: 'Swiss-cheese holes in brassica leaves, soil the heads',
    signs: 'Ragged holes, small green caterpillars, white butterflies hovering',
    solutions: [
      { budget: 'free', label: 'Row covers from transplant', detail: 'Cover brassicas immediately after transplanting. The white cabbage moth can\'t lay eggs. Keep covered until heads form.' },
      { budget: 'free', label: 'Hand pick eggs and larvae', detail: 'Check undersides of leaves for tiny yellow eggs. Pick caterpillars into soapy water.' },
      { budget: 'low', label: 'Bt spray', detail: 'Bacillus thuringiensis spray is very effective — kills caterpillars, safe for beneficials. Spray every 5–7 days.' },
    ],
    companions: ['Thyme', 'Sage', 'Rosemary', 'Dill', 'Nasturtium'],
  },
  {
    name: 'Cucumber Beetle', type: 'insect', emoji: '🐞',
    damage: 'Transmit bacterial wilt disease to cucurbits; larvae eat roots',
    signs: 'Small yellow/black striped or spotted beetles, sudden wilting that doesn\'t recover',
    solutions: [
      { budget: 'free', label: 'Row covers at planting', detail: 'Cover cucurbits with row covers until flowering — keeps adults from plants during vulnerable young stage.' },
      { budget: 'low', label: 'Kaolin clay', detail: 'Spray kaolin clay (Surround) on plants — beetles won\'t land on coated plants. Food-safe, washes off at harvest.' },
      { budget: 'low', label: 'Yellow sticky traps', detail: 'Cucumber beetles are attracted to yellow. Place traps in and around plants to monitor and reduce populations.' },
    ],
    companions: ['Radish (trap crop)', 'Nasturtium', 'Catnip', 'Tansy'],
  },
]

const BENEFICIAL_INSECTS = [
  { name: 'Ladybug', eats: 'Aphids, mites, scale insects', attract: 'Dill, fennel, yarrow, cilantro in flower, sweet alyssum' },
  { name: 'Lacewing', eats: 'Aphids, caterpillar eggs, whitefly', attract: 'Dill, angelica, coreopsis, cosmos' },
  { name: 'Ground Beetle', eats: 'Slugs, caterpillars, soil pests', attract: 'Clover, mulch for hiding places, compost piles' },
  { name: 'Parasitic Wasp', eats: 'Lays eggs in caterpillars/aphids', attract: 'Dill, fennel, parsley, phacelia, sweet alyssum' },
  { name: 'Hoverfly', eats: 'Aphids, thrips', attract: 'Alyssum, marigold, phacelia, coriander' },
  { name: 'Praying Mantis', eats: 'Wide range of insects', attract: 'Leave wild areas, tall grasses for egg cases' },
]

export default function PestsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filtered = PESTS.filter((p) => typeFilter === 'all' || p.type === typeFilter)

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pest & Predator Defense</h1>
        <p className="mt-1 text-muted-foreground">
          No-poison-first approach: exclusion → deterrents → trapping → biological → organic sprays. Poisons are always last resort.
        </p>
      </div>

      <Tabs defaultValue="pests">
        <TabsList>
          <TabsTrigger value="pests">Pest Solutions</TabsTrigger>
          <TabsTrigger value="beneficials">Beneficial Insects</TabsTrigger>
          <TabsTrigger value="companion">Companion Deterrents</TabsTrigger>
        </TabsList>

        <TabsContent value="pests" className="space-y-4">
          <div className="flex gap-2">
            {['all', 'animal', 'insect'].map((f) => (
              <Badge key={f} variant={typeFilter === f ? 'default' : 'outline'} className="cursor-pointer capitalize" onClick={() => setTypeFilter(f)}>
                {f === 'all' ? 'All Pests' : f === 'animal' ? 'Animal Pests' : 'Insect Pests'}
              </Badge>
            ))}
          </div>
          {filtered.map((pest) => (
            <Card key={pest.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{pest.emoji}</span> {pest.name}
                  <Badge variant="outline" className="text-xs capitalize">{pest.type}</Badge>
                </CardTitle>
                <CardDescription>{pest.damage}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Signs: </span>
                  <span className="text-muted-foreground">{pest.signs}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Solutions (budget order)</p>
                  {pest.solutions.map((s) => (
                    <div key={s.label} className="flex gap-3 text-sm">
                      <Badge variant="outline" className={`shrink-0 text-xs ${s.budget === 'free' ? 'bg-green-50 text-green-700 border-green-200' : s.budget === 'low' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {s.budget === 'free' ? 'Free' : s.budget === 'low' ? '$Low' : '$$Med'}
                      </Badge>
                      <div>
                        <strong className="text-foreground">{s.label}:</strong>{' '}
                        <span className="text-muted-foreground">{s.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {pest.companions.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-green-700">Companion deterrents: </span>
                    <span className="text-muted-foreground">{pest.companions.join(', ')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="beneficials" className="space-y-3">
          <p className="text-sm text-muted-foreground">Attract these allies and they'll do most of your pest control for free. The key: grow a diversity of flowering plants, especially small-flowered umbels and composites.</p>
          {BENEFICIAL_INSECTS.map((b) => (
            <Card key={b.name}>
              <CardContent className="py-3 grid sm:grid-cols-3 gap-3 text-sm">
                <div className="font-medium">{b.name}</div>
                <div><span className="text-muted-foreground">Eats: </span>{b.eats}</div>
                <div><span className="text-muted-foreground">Attract with: </span>{b.attract}</div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="companion" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Best Pest-Deterring Companion Plants</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { plant: 'Marigold (French)', repels: 'Aphids, whitefly, nematodes, rabbits', plant_with: 'Tomatoes, peppers, squash — everywhere', notes: 'The universal pest deterrent. Plant thickly throughout garden.' },
                { plant: 'Nasturtium', repels: 'Aphids (as trap crop), whiteflies, squash bugs', plant_with: 'Cucumbers, squash, fruit trees', notes: 'Let aphids colonize it instead of your crops. Sacrifice some plants.' },
                { plant: 'Basil', repels: 'Aphids, tomato hornworm, flies, mosquitoes', plant_with: 'Tomatoes, peppers', notes: 'Strong scent confuses pests. Keep flowers pinched for strongest oil production.' },
                { plant: 'Lavender', repels: 'Deer, rabbits, moths, fleas', plant_with: 'Garden perimeter, near brassicas', notes: 'Plant at garden edges. Deer and rabbits actively avoid it.' },
                { plant: 'Garlic', repels: 'Aphids, Japanese beetle, deer, rabbits, moles', plant_with: 'Most vegetables, roses', notes: 'Mass planting at perimeter creates a scent barrier. Make garlic spray (blend + dilute) for aphids.' },
                { plant: 'Catnip', repels: 'Aphids, flea beetles, squash bugs, deer, rabbits', plant_with: 'Garden perimeter', notes: 'Nepetalactone is more effective than DEET against some insects. Attracts cats (beneficial hunters).' },
                { plant: 'Dill', repels: 'Aphids, spider mites (when in flower attracts predators)', plant_with: 'Brassicas, cucumbers, onions', notes: 'Let some bolt and flower — attracts parasitic wasps and predatory insects in large numbers.' },
              ].map((c) => (
                <div key={c.plant} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium">{c.plant}</p>
                    <p className="text-xs text-muted-foreground">Plant with: {c.plant_with}</p>
                  </div>
                  <p className="text-muted-foreground text-xs"><strong className="text-foreground">Repels: </strong>{c.repels}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{c.notes}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
