import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const METHODS = [
  {
    name: 'Hot Composting',
    icon: '🔥',
    time: '4–8 weeks',
    space: 'Bin or pile 3×3×3 ft minimum',
    difficulty: 'Moderate',
    bestFor: 'Fastest results, kills weed seeds and pathogens, large volumes',
    steps: [
      'Layer 2:1 ratio of browns (carbon) to greens (nitrogen)',
      'Keep as moist as a wrung-out sponge',
      'Turn every 3–5 days when pile reaches 130–160°F',
      'Done when temperature no longer rises after turning and looks dark and earthy',
    ],
    notes: 'Chicken manure works great here. Rabbit manure can go straight to garden — too valuable to compost.',
  },
  {
    name: 'Cold Composting',
    icon: '🌡️',
    time: '6–18 months',
    space: 'Any size bin or pile',
    difficulty: 'Easy',
    bestFor: 'Minimal effort, no turning required, good for most home gardeners',
    steps: [
      'Add kitchen and garden scraps as they\'re available',
      'Mix greens and browns roughly',
      'Water occasionally if too dry',
      'Wait — microbes do all the work',
    ],
    notes: 'Best approach for most families. Two bins: one filling, one finishing.',
  },
  {
    name: 'Vermicomposting (Worms)',
    icon: '🪱',
    time: '2–3 months continuous',
    space: 'Bin 1–2 sq ft (can be indoors)',
    difficulty: 'Easy',
    bestFor: 'Small spaces, apartments, turning kitchen scraps into premium castings',
    steps: [
      'Set up a bin with shredded paper bedding, moisture, and red wigglers (not earthworms)',
      'Feed kitchen scraps (no meat, dairy, or citrus in large quantities)',
      'Harvest castings every 2–3 months by moving bedding aside',
      'Use castings as-is or make worm tea (soak in water)',
    ],
    notes: 'Worm castings are the highest-quality soil amendment available. 5× more nutrients than topsoil.',
  },
  {
    name: 'BSFL Composting',
    icon: '🪲',
    time: '2–4 weeks per batch',
    space: 'Small bin, 2×2 ft',
    difficulty: 'Easy once running',
    bestFor: 'Fastest decomposition of food waste + produces high-protein chicken/fish feed',
    steps: [
      'Set up a ventilated bin with sloped sides (larvae self-harvest)',
      'Add kitchen scraps (including meat and dairy — they can handle it)',
      'Black soldier fly adults naturally colonize in warm months (or buy starter larvae)',
      'Prepupae walk up the ramp and collect in a bucket — feed directly to chickens or fish',
    ],
    notes: 'Colonies self-regulate. The larvae eat 2× their body weight daily. This is one of the most powerful closed-loop systems available.',
  },
]

const GREENS = [
  'Vegetable and fruit scraps', 'Coffee grounds and filters', 'Tea bags', 'Fresh grass clippings',
  'Fresh garden trimmings', 'Chicken manure (hot compost)', 'Rabbit manure (use directly)',
  'Eggshells', 'Seaweed', 'Young weeds (before seed set)',
]

const BROWNS = [
  'Cardboard (torn up)', 'Paper (non-glossy, shredded)', 'Straw', 'Dried leaves',
  'Wood chips', 'Sawdust (untreated)', 'Corn stalks', 'Dried plant stems',
  'Paper bags and paper towels',
]

const AVOID = [
  'Meat and fish (hot compost only, otherwise pests)', 'Dairy products', 'Diseased plants',
  'Weed seeds (unless hot composting)', 'Dog/cat feces', 'Coal ash (wood ash is fine in moderation)',
  'Chemically treated wood', 'Glossy paper', 'Invasive plants',
]

const MANURE_GUIDE = [
  { animal: 'Rabbit', type: 'Cold', notes: 'Use directly on garden — won\'t burn roots. Highest NPK of common manures. Compost or apply fresh.', npk: '2.4-1.4-0.6' },
  { animal: 'Chicken', type: 'Hot', notes: 'Must age or compost 90–180 days before use. High nitrogen — can burn if fresh. Excellent finished.', npk: '1.1-0.8-0.5' },
  { animal: 'Cow', type: 'Cold', notes: 'Age 3–6 months. Lower nitrogen but great volume. Excellent soil conditioner.', npk: '0.6-0.2-0.5' },
  { animal: 'Goat', type: 'Cold', notes: 'Dry, pelleted — easy to handle. Age 30–60 days. Similar to rabbit, excellent for gardens.', npk: '0.7-0.3-0.9' },
  { animal: 'Pig', type: 'Hot', notes: 'Must compost thoroughly. High risk of pathogens if used fresh. Excellent once composted.', npk: '0.8-0.7-0.5' },
  { animal: 'Horse', type: 'Hot/Cold', notes: 'Often mixed with bedding — excellent when fully composted. Weed seeds are a risk if not hot composted.', npk: '0.7-0.3-0.6' },
]

export default function CompostingPage() {
  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Composting System</h1>
        <p className="mt-1 text-muted-foreground">
          Composting closes the loop — waste becomes the foundation of your next harvest. Choose the method that fits your space and time.
        </p>
      </div>

      <Tabs defaultValue="methods">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="materials">Materials Guide</TabsTrigger>
          <TabsTrigger value="manure">Animal Manure</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          {METHODS.map((m) => (
            <Card key={m.name}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{m.icon}</span> {m.name}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{m.time}</Badge>
                    <Badge variant="outline" className="text-xs">{m.difficulty}</Badge>
                  </div>
                </div>
                <CardDescription>{m.bestFor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Space needed: </strong>{m.space}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Steps</p>
                  <ol className="space-y-1 text-sm text-muted-foreground">
                    {m.steps.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}
                  </ol>
                </div>
                <div className="rounded-md bg-amber-50 border border-amber-200 p-2 text-xs text-amber-700">
                  {m.notes}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-700">Greens (Nitrogen Sources)</CardTitle>
                <CardDescription className="text-xs">High moisture, fast to break down</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {GREENS.map((g) => <li key={g}>• {g}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700">Browns (Carbon Sources)</CardTitle>
                <CardDescription className="text-xs">Dry, structural, slow to break down</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {BROWNS.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-700">Avoid</CardTitle>
                <CardDescription className="text-xs">These cause problems or attract pests</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {AVOID.map((a) => <li key={a}>• {a}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="pt-4 text-sm text-muted-foreground space-y-2">
              <p><strong className="text-foreground">The 2:1 rule:</strong> For hot composting, aim for 2 parts browns to 1 part greens by volume. Too many greens = slimy and smelly. Too many browns = slow decomposition.</p>
              <p><strong className="text-foreground">Moisture test:</strong> Squeeze a handful — it should feel like a wrung-out sponge. If it drips, add more browns. If it crumbles, add water.</p>
              <p><strong className="text-foreground">Particle size matters:</strong> Smaller pieces = faster breakdown. Run a lawnmower over leaves before adding.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manure" className="space-y-4">
          <p className="text-sm text-muted-foreground">Animal manure is one of the most valuable soil amendments on a homestead. Each type has different properties.</p>
          <div className="space-y-3">
            {MANURE_GUIDE.map((m) => (
              <Card key={m.animal}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{m.animal}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={m.type === 'Cold' ? 'secondary' : 'destructive'} className="text-xs">{m.type} Manure</Badge>
                      <Badge variant="outline" className="text-xs font-mono">NPK {m.npk}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{m.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4 text-sm text-green-700">
              <p><strong>Rabbit manure is the #1 cold manure:</strong> Use it directly in garden beds, mix into potting soil, or compost it. Unlike other manures, it won't burn plants even when fresh. One doe produces 200+ lbs of pellets per year — enough to fertilize a 1,000 sq ft garden.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
