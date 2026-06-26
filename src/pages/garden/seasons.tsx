import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FROST_TOLERANCE = [
  { group: 'Hardy to Heavy Frost (below 20°F)', color: 'bg-blue-100 text-blue-800', crops: ['Kale', 'Collards', 'Spinach', 'Mâche', 'Arugula (light frost)', 'Garlic', 'Leeks', 'Brussels Sprouts'] },
  { group: 'Semi-Hardy (25–32°F)', color: 'bg-teal-100 text-teal-800', crops: ['Broccoli', 'Cabbage', 'Cauliflower', 'Beets', 'Carrots', 'Chard', 'Lettuce', 'Parsley', 'Turnips', 'Radish'] },
  { group: 'Frost-Tender (dies at 32°F)', color: 'bg-orange-100 text-orange-800', crops: ['Tomatoes', 'Peppers', 'Eggplant', 'Basil', 'Cucumbers', 'Squash', 'Beans', 'Corn', 'Sweet Potato'] },
]

const METHODS = [
  {
    name: 'Row Covers (Floating)',
    icon: '🏕️',
    cost: '$0.10–0.30/sq ft',
    tempGain: '+4–8°F',
    bestFor: 'Frost protection for semi-hardy crops in spring and fall',
    setup: 'Lay directly on plants or drape over hoops. Secure edges with soil, rocks, or pins. Remove on warm days for pollination.',
    pros: ['Lightweight and reusable', 'Transmits 85% of sunlight', 'Also deters insects', 'Easy to store'],
    cons: ['Can blow off in wind', 'Must be removed for pollination of flowering crops'],
    crops: ['Lettuce', 'Brassicas', 'Spinach', 'Carrots', 'Early transplants'],
  },
  {
    name: 'Cold Frames',
    icon: '🪟',
    cost: '$30–150 DIY, $100–500 commercial',
    tempGain: '+10–20°F',
    bestFor: 'Winter greens production, spring seed starting, hardening off transplants',
    setup: 'Box frame (wood, brick, hay bales) with old windows or polycarbonate on top. Face south, angle lid for sun. Open on warm days to prevent overheating.',
    pros: ['Cheap with salvaged windows', 'Very effective', 'Grows greens all winter in zones 5+', 'No electricity needed'],
    cons: ['Small area coverage', 'Must be vented on warm days', 'Fixed location'],
    crops: ['Lettuce', 'Spinach', 'Kale', 'Arugula', 'Mâche', 'Radish', 'Scallions'],
  },
  {
    name: 'Low Tunnels',
    icon: '🌈',
    cost: '$0.50–2/linear ft',
    tempGain: '+10–15°F',
    bestFor: 'Season extension over entire garden beds, spring/fall',
    setup: 'Bend 10-gauge wire or conduit into arches every 3–4 ft. Cover with row cover or plastic. Clip sides up for ventilation. Use sandbags at ends.',
    pros: ['Cover entire beds', 'More headroom than cold frames', 'Easy to vent'],
    cons: ['Wind can be an issue', 'Plastic traps more heat (can overheat on sunny days)'],
    crops: ['Strawberries', 'Greens', 'Brassicas', 'Early tomatoes/peppers (with caution)'],
  },
  {
    name: 'Hoop Houses',
    icon: '⛺',
    cost: '$1–5/sq ft DIY',
    tempGain: '+15–30°F',
    bestFor: 'Season extension and year-round growing, especially greens and herbs',
    setup: 'Metal conduit or PVC hoops every 4 ft. Cover with 6-mil poly or greenhouse plastic. Roll-up sides for ventilation. Can be 6–8 ft tall.',
    pros: ['Large growing area', 'Year-round production in most zones', 'Protects from wind and rain', 'Can grow tomatoes into November'],
    cons: ['Larger upfront cost', 'Ventilation management critical in summer', 'More setup time'],
    crops: ['Everything — full garden protection'],
  },
  {
    name: 'Greenhouse',
    icon: '🏠',
    cost: '$500–5,000+ depending on size',
    tempGain: 'Year-round growing regardless of outdoor temps',
    bestFor: 'Year-round production, tropical plants, seed starting, aquaponics',
    setup: 'Permanent structure with polycarbonate or glass. Needs heat source below Zone 7 for winter. Shade cloth for summer. Good ventilation essential.',
    pros: ['Completely season-independent', 'Seed starting center', 'Year-round salad greens', 'Aquaponics integration'],
    cons: ['Highest cost and commitment', 'Heating costs in winter', 'Requires active management'],
    crops: ['Everything — even tropical species'],
  },
]

export default function SeasonsPage() {
  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Season Extension</h1>
        <p className="mt-1 text-muted-foreground">
          Stretch your growing season by weeks or months using simple techniques. Most can be built cheaply from salvaged materials.
        </p>
      </div>

      <Tabs defaultValue="methods">
        <TabsList>
          <TabsTrigger value="methods">Extension Methods</TabsTrigger>
          <TabsTrigger value="frost">Frost Tolerance Chart</TabsTrigger>
          <TabsTrigger value="timing">Planting Timing</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          {METHODS.map((m) => (
            <Card key={m.name}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{m.icon}</span> {m.name}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">+{m.tempGain} warmth</Badge>
                    <Badge variant="outline" className="text-xs">{m.cost}</Badge>
                  </div>
                </div>
                <CardDescription>{m.bestFor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <span className="font-medium">Setup: </span>
                  <span className="text-muted-foreground">{m.setup}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-700 mb-1">Pros</p>
                    <ul className="space-y-0.5 text-muted-foreground">{m.pros.map((p) => <li key={p}>• {p}</li>)}</ul>
                  </div>
                  <div>
                    <p className="font-medium text-amber-700 mb-1">Considerations</p>
                    <ul className="space-y-0.5 text-muted-foreground">{m.cons.map((c) => <li key={c}>• {c}</li>)}</ul>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Best crops: </span>
                  <span className="text-muted-foreground">{m.crops.join(', ')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="frost" className="space-y-3">
          <p className="text-sm text-muted-foreground">Know your plants' cold limits to plan what to protect and when to let nature take over.</p>
          {FROST_TOLERANCE.map((group) => (
            <Card key={group.group}>
              <CardHeader className="pb-2">
                <Badge className={`w-fit ${group.color}`}>{group.group}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {group.crops.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4 text-sm text-blue-700 space-y-1">
              <p><strong>Pro tip:</strong> Root crops (carrots, parsnips, beets) actually get sweeter after a hard frost — the cold converts starches to sugar.</p>
              <p>Leave them in the ground until needed and mulch heavily to prevent the ground freezing solid.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spring Extension (Plant Earlier)</CardTitle>
              <CardDescription>Work backward from your last frost date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                <p><strong>14+ weeks before last frost:</strong> Onion seeds, leeks indoors</p>
                <p><strong>10–12 weeks:</strong> Peppers, eggplant indoors</p>
                <p><strong>8–10 weeks:</strong> Tomatoes indoors; cabbage/broccoli outdoors under cold frame</p>
                <p><strong>6–8 weeks:</strong> Squash, cucumber, melons indoors</p>
                <p><strong>4–6 weeks:</strong> Kale, lettuce, spinach outdoors (with frost protection)</p>
                <p><strong>2 weeks:</strong> Peas, spinach, radish direct sow (soil workable)</p>
                <p><strong>Last frost + 2 weeks:</strong> Tomatoes, peppers transplant out</p>
                <p><strong>Soil 70°F:</strong> Beans, corn, squash direct sow</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fall Extension (Plant Later)</CardTitle>
              <CardDescription>Work backward from your first frost date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                <p><strong>12 weeks before first frost:</strong> Brassicas (broccoli, kale, cabbage)</p>
                <p><strong>10 weeks:</strong> Beets, carrots, turnips direct sow</p>
                <p><strong>8 weeks:</strong> Spinach, lettuce, radish direct sow</p>
                <p><strong>6 weeks:</strong> Arugula, mâche, claytonia</p>
                <p><strong>4 weeks:</strong> Overwintering spinach varieties</p>
                <p><strong>After first frost:</strong> Hardy greens under cold frame continue all winter</p>
              </div>
              <p className="text-muted-foreground mt-2">Rule of thumb: count backward from first frost using days-to-maturity + 2 weeks for slower fall growth.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
