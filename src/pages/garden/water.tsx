import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const IRRIGATION_METHODS = [
  {
    name: 'Drip Irrigation',
    icon: '💧',
    cost: '$0.50–2/ft installed',
    efficiency: '90–95%',
    bestFor: 'Row crops, raised beds, trees, water conservation',
    pros: ['Lowest water use', 'Delivers water to roots directly', 'Reduces fungal disease (dry leaves)', 'Can be automated', 'Works on a timer'],
    cons: ['Higher upfront cost', 'Emitters can clog', 'Doesn\'t work as well for broadcast seeding', 'Mice can chew lines'],
    setup: 'Run main line along bed, add emitters every 12–18" for vegetables. Bury under mulch for best results.',
  },
  {
    name: 'Soaker Hose',
    icon: '🌧️',
    cost: '$0.10–0.30/ft',
    efficiency: '80–90%',
    bestFor: 'Row vegetables, shrubs, simpler setup than drip',
    pros: ['Cheap and easy to install', 'Releases water slowly along entire length', 'Good for dense plantings', 'Lasts 5–10 years if stored properly'],
    cons: ['Can develop uneven flow', 'Not suited for individual plant targeting', 'Degrades faster in UV if left out'],
    setup: 'Lay along base of plants, cover with mulch. Connect to timer. Run 30–60 min every 2–3 days rather than daily.',
  },
  {
    name: 'Hand Watering',
    icon: '🪣',
    cost: '$10–30 for wand/can',
    efficiency: '60–70%',
    bestFor: 'Small gardens, seedlings, containers, flexibility',
    pros: ['No installation', 'Allows close inspection of plants', 'Good for small patches', 'Immediate control'],
    cons: ['Time-intensive', 'Easy to over or under water', 'High water loss to evaporation if overhead'],
    setup: 'Use a wand to direct water to the base of plants. Water deeply 1–2x per week rather than lightly every day.',
  },
  {
    name: 'Flood / Furrow Irrigation',
    icon: '🌊',
    cost: 'Near zero (labor only)',
    efficiency: '50–60%',
    bestFor: 'Large vegetable rows, orchard trees, access to abundant water',
    pros: ['No equipment needed', 'Works for large areas', 'Deep water penetration'],
    cons: ['High water use', 'Can cause soil compaction and erosion', 'Encourages fungal disease', 'Inefficient'],
    setup: 'Create furrows between rows, flood slowly. Best with very flat ground.',
  },
]

const WATER_NEEDS = [
  { crop: 'Tomatoes', gallonsPerWeek: '1–2 gal/plant', notes: 'Consistent moisture critical to prevent blossom end rot and cracking' },
  { crop: 'Peppers', gallonsPerWeek: '1 gal/plant', notes: 'Drought-tolerant once established; stress slightly for flavor' },
  { crop: 'Cucumbers', gallonsPerWeek: '1–2 gal/plant', notes: 'Need consistent moisture; bitterness from water stress' },
  { crop: 'Squash/Zucchini', gallonsPerWeek: '2–3 gal/plant', notes: 'Large leaves lose a lot of moisture; mulch heavily' },
  { crop: 'Corn', gallonsPerWeek: '1"/week across bed', notes: 'Critical at tasseling/silking stage' },
  { crop: 'Beans', gallonsPerWeek: '0.5"/week', notes: 'More drought-tolerant; don\'t overwater or root rot occurs' },
  { crop: 'Lettuce/Greens', gallonsPerWeek: '1"/week', notes: 'Consistent moisture = less bolting; mulch to retain' },
  { crop: 'Carrots/Beets', gallonsPerWeek: '1"/week', notes: 'Even watering prevents splits and forking' },
  { crop: 'Potatoes', gallonsPerWeek: '1–2"/week', notes: 'Critical during tuber set; reduce when tops yellow' },
  { crop: 'Fruit Trees', gallonsPerWeek: '5–15 gal/tree (established)', notes: 'Deep, infrequent watering trains deep roots' },
]

const DROUGHT_TOLERANT = [
  'Sweet potatoes', 'Jerusalem artichoke', 'Asparagus (established)', 'Rhubarb (established)',
  'Garlic', 'Onions', 'Most herbs (rosemary, thyme, oregano, sage, lavender)',
  'Amaranth', 'Sunflowers', 'Beans (once established)', 'Peppers (once established)',
  'Winter squash (once established)', 'Corn (once established)',
]

export default function WaterPage() {
  const [roofSqft, setRoofSqft] = useState('')
  const [rainfall, setRainfall] = useState('')
  const [efficiency, setEfficiency] = useState('0.85')

  const barrelGallons = roofSqft && rainfall
    ? (parseFloat(roofSqft) * parseFloat(rainfall) * 0.623 * parseFloat(efficiency)).toFixed(0)
    : null

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Water Management</h1>
        <p className="mt-1 text-muted-foreground">
          Water is the most critical resource on a homestead. Harvest what falls free, deliver it efficiently, and grow drought-tolerant crops where possible.
        </p>
      </div>

      <Tabs defaultValue="irrigation">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="irrigation">Irrigation Methods</TabsTrigger>
          <TabsTrigger value="rainwater">Rainwater Harvesting</TabsTrigger>
          <TabsTrigger value="needs">Water Needs by Crop</TabsTrigger>
          <TabsTrigger value="drought">Drought-Tolerant Crops</TabsTrigger>
        </TabsList>

        <TabsContent value="irrigation" className="space-y-3">
          {IRRIGATION_METHODS.map((m) => (
            <Card key={m.name}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{m.icon}</span> {m.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">{m.efficiency} efficient</Badge>
                    <Badge variant="outline" className="text-xs">{m.cost}</Badge>
                  </div>
                </div>
                <CardDescription>{m.bestFor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-700 mb-1">Pros</p>
                    <ul className="text-muted-foreground space-y-0.5">{m.pros.map((p) => <li key={p}>• {p}</li>)}</ul>
                  </div>
                  <div>
                    <p className="font-medium text-amber-700 mb-1">Cons</p>
                    <ul className="text-muted-foreground space-y-0.5">{m.cons.map((c) => <li key={c}>• {c}</li>)}</ul>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground"><strong>Setup: </strong>{m.setup}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4 text-sm text-blue-700 space-y-1">
              <p><strong>Deep vs. Shallow Watering:</strong> Water deeply (to 6–12") once or twice a week rather than lightly every day. This trains roots to grow deep, making plants far more drought-resistant.</p>
              <p><strong>Mulch is free irrigation:</strong> 3–4" of wood chip mulch reduces water needs by 50–75% by preventing evaporation. The single highest-ROI thing you can do for water conservation.</p>
              <p><strong>When to water:</strong> Early morning is best. Evening watering leaves foliage wet overnight (fungal disease risk). Never water in midday heat.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rainwater" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Barrel Capacity Calculator</CardTitle>
              <CardDescription>Estimate how much water you can collect from your roof per inch of rain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Roof Area (sq ft)</Label>
                  <Input placeholder="1200" value={roofSqft} onChange={(e) => setRoofSqft(e.target.value)} type="number" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rainfall (inches)</Label>
                  <Input placeholder="1" value={rainfall} onChange={(e) => setRainfall(e.target.value)} type="number" step="0.1" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Efficiency (0–1)</Label>
                  <Input placeholder="0.85" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} type="number" step="0.05" max="1" />
                </div>
              </div>
              {barrelGallons && (
                <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
                  <p className="font-medium">~<strong>{barrelGallons} gallons</strong> per {rainfall}" of rainfall</p>
                  <p className="text-xs mt-1 text-blue-700">A typical 55-gal barrel fills in {Math.ceil(55 / parseFloat(barrelGallons) * parseFloat(rainfall) * 10) / 10}" of rain. Consider a 275-gallon IBC tote for serious storage.</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Formula: roof area × rainfall × 0.623 × efficiency = gallons</p>
            </CardContent>
          </Card>
          <div className="grid sm:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Basic Barrel Setup</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>1. Position barrel under downspout with diverter kit ($20–40)</p>
                <p>2. Elevate on blocks for gravity-fed hose</p>
                <p>3. Screen the top to exclude mosquitoes and debris</p>
                <p>4. Install overflow hose to route excess away from foundation</p>
                <p>5. Add a spigot near the bottom for hose attachment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">IBC Tote System (275–330 gal)</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>• Used food-grade IBC totes: $50–150</p>
                <p>• Connect multiple totes together for larger storage</p>
                <p>• Install a 3/4" ball valve at bottom for hose connection</p>
                <p>• Connect to downspouts with first-flush diverters</p>
                <p>• Can daisy-chain 4–6 totes = 1,000–2,000 gallons</p>
              </CardContent>
            </Card>
          </div>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4 text-sm text-amber-700">
              <strong>Legal note:</strong> Rainwater collection laws vary by state. Most states allow it freely; a few restrict it. Check your state's water rights laws before investing in large systems.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="needs" className="space-y-2">
          <p className="text-sm text-muted-foreground">Most vegetables need approximately 1 inch of water per week. Use this as a baseline and adjust for your climate, soil, and season.</p>
          <div className="space-y-2">
            {WATER_NEEDS.map((w) => (
              <Card key={w.crop}>
                <CardContent className="py-3 flex items-start gap-4">
                  <div className="min-w-[140px]">
                    <p className="font-medium text-sm">{w.crop}</p>
                    <Badge variant="secondary" className="text-xs mt-1">{w.gallonsPerWeek}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{w.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drought" className="space-y-4">
          <p className="text-sm text-muted-foreground">These crops tolerate dry conditions well once established. Prioritize them if you have limited water or rely on rainfall.</p>
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {DROUGHT_TOLERANT.map((c) => (
                  <Badge key={c} variant="secondary" className="text-sm">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Water-Saving Strategies</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• <strong>Mulch everything:</strong> 3–4" of wood chips, straw, or leaves cuts water needs by up to 75%.</p>
              <p>• <strong>Hugelkultur beds:</strong> Buried logs create a sponge that slowly releases moisture — often need no watering after the first year.</p>
              <p>• <strong>Swales:</strong> On-contour ditches slow water runoff and sink it into the soil rather than losing it downhill.</p>
              <p>• <strong>Sheet mulching (lasagna gardening):</strong> Cardboard + deep mulch creates a moisture-retaining zone that suppresses weeds and reduces watering by 50%.</p>
              <p>• <strong>Plant density:</strong> Tightly planted crops shade the soil, reducing evaporation and weed competition.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
