import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PH_RANGES = [
  { min: 4.0, max: 5.0, label: 'Very Acidic', color: 'bg-red-500', plants: 'Blueberries, cranberries' },
  { min: 5.0, max: 5.5, label: 'Acidic', color: 'bg-orange-500', plants: 'Potatoes, sweet potatoes' },
  { min: 5.5, max: 6.0, label: 'Mildly Acidic', color: 'bg-yellow-500', plants: 'Beans, corn, tomatoes' },
  { min: 6.0, max: 7.0, label: 'Optimal (most veg)', color: 'bg-green-500', plants: 'Most vegetables & herbs' },
  { min: 7.0, max: 7.5, label: 'Neutral–Alkaline', color: 'bg-teal-500', plants: 'Asparagus, brassicas' },
  { min: 7.5, max: 8.5, label: 'Alkaline', color: 'bg-blue-500', plants: 'Limited options; needs correction' },
]

const NUTRIENTS = [
  {
    name: 'Nitrogen (N)', role: 'Leaf & stem growth', deficiency: 'Yellow leaves starting from bottom, stunted growth',
    sources: ['Blood meal', 'Fish emulsion', 'Compost', 'Composted manure', 'Cover crops (legumes)'],
    excess: 'Lots of foliage, few flowers/fruit',
  },
  {
    name: 'Phosphorus (P)', role: 'Root development, flowering, fruiting', deficiency: 'Purple-tinted leaves, poor root growth, delayed maturity',
    sources: ['Bone meal', 'Rock phosphate', 'Compost', 'Wood ash (small amounts)'],
    excess: 'Inhibits uptake of zinc and iron',
  },
  {
    name: 'Potassium (K)', role: 'Water regulation, disease resistance, fruit quality', deficiency: 'Brown leaf edges, weak stems, poor fruit flavor',
    sources: ['Wood ash', 'Kelp meal', 'Greensand', 'Banana peels (composted)'],
    excess: 'Inhibits calcium and magnesium uptake',
  },
  {
    name: 'Calcium (Ca)', role: 'Cell wall strength, prevents blossom end rot', deficiency: 'Blossom end rot (tomatoes/peppers), tip burn (lettuce)',
    sources: ['Lime', 'Gypsum', 'Crushed eggshells', 'Oyster shell flour'],
    excess: 'Rarely toxic; raises pH if lime is used',
  },
  {
    name: 'Magnesium (Mg)', role: 'Chlorophyll production, enzyme activation', deficiency: 'Yellowing between leaf veins (interveinal chlorosis)',
    sources: ['Epsom salt (1 tbsp/gallon water)', 'Dolomite lime', 'Kelp'],
    excess: 'Can inhibit calcium uptake',
  },
]

const SOIL_TYPES = [
  {
    type: 'Clay', feel: 'Sticky, heavy, forms ribbons', drainage: 'Poor — waterlogging risk',
    pros: ['Holds nutrients well', 'Retains moisture in drought'],
    cons: ['Compacts easily', 'Slow to warm in spring', 'Root penetration difficult'],
    fix: 'Add compost (4+ inches), aged manure, gypsum. Never till when wet. Consider raised beds.',
  },
  {
    type: 'Sandy', feel: 'Gritty, falls apart, no ribbon', drainage: 'Excellent — may be too fast',
    pros: ['Warms quickly in spring', 'Easy to work', 'Good aeration'],
    cons: ['Nutrients leach quickly', 'Dries out fast', 'Low fertility'],
    fix: 'Add heavy compost (6+ inches), biochar, mulch thickly. Water frequently.',
  },
  {
    type: 'Silt', feel: 'Smooth, silky, slippery when wet', drainage: 'Moderate — can compact',
    pros: ['Nutrient-rich', 'Holds moisture well'],
    cons: ['Compacts and crusts', 'Prone to erosion'],
    fix: 'Add compost, avoid heavy foot traffic. Permanent mulch or cover crops.',
  },
  {
    type: 'Loam', feel: 'Crumbly, slightly gritty, holds shape briefly', drainage: 'Good',
    pros: ['Ideal balance', 'Nutrient-rich', 'Good drainage and retention'],
    cons: ['May still benefit from organic matter'],
    fix: 'Maintain with annual compost additions. You\'re in good shape.',
  },
]

const AMENDMENTS = [
  { name: 'Compost', purpose: 'All-around soil improvement', rate: '2–4 inches worked into top 6"', notes: 'The single best thing you can add to any soil type.' },
  { name: 'Agricultural Lime', purpose: 'Raise pH (makes acidic soil more neutral)', rate: '5–10 lbs per 100 sq ft', notes: 'Calcitic lime also adds calcium. Takes 2–3 months to fully react.' },
  { name: 'Sulfur', purpose: 'Lower pH (make alkaline soil more acidic)', rate: '1–2 lbs per 100 sq ft', notes: 'Elemental sulfur takes several months. Iron sulfate acts faster.' },
  { name: 'Gypsum', purpose: 'Improve clay structure, add calcium without raising pH', rate: '2–3 lbs per 100 sq ft', notes: 'Safe to use abundantly. Good for saline soils too.' },
  { name: 'Blood Meal', purpose: 'Fast nitrogen boost', rate: '1–2 lbs per 100 sq ft', notes: 'Strong smell deters deer briefly. Don\'t overuse — can burn plants.' },
  { name: 'Bone Meal', purpose: 'Phosphorus for roots and flowering', rate: '1–2 lbs per 100 sq ft', notes: 'Steamed bone meal breaks down faster than raw.' },
  { name: 'Wood Ash', purpose: 'Potassium + raises pH slightly', rate: '5–10 lbs per 100 sq ft max', notes: 'Use sparingly — can raise pH too fast. Never use near blueberries.' },
  { name: 'Kelp Meal', purpose: 'Trace minerals, potassium, growth hormones', rate: '1 lb per 100 sq ft', notes: 'Slow-release, excellent for long-term soil health.' },
  { name: 'Biochar', purpose: 'Long-term carbon, improves water retention in sandy soil', rate: '10–15% by volume', notes: 'Charge with compost tea or compost before applying.' },
  { name: 'Aged Manure', purpose: 'N-P-K + organic matter', rate: '1–2 inches per year', notes: 'Never use fresh. Rabbit manure is "cold" and can go direct.' },
]

export default function SoilPage() {
  const [currentPh, setCurrentPh] = useState('')
  const [targetPh, setTargetPh] = useState('6.5')
  const [sqft, setSqft] = useState('100')

  function getLimeNeeded() {
    const curr = parseFloat(currentPh)
    const tgt = parseFloat(targetPh)
    const area = parseFloat(sqft)
    if (!curr || !tgt || !area || curr >= tgt) return null
    const diff = tgt - curr
    const lbsPer100 = diff * 5
    return ((lbsPer100 / 100) * area).toFixed(1)
  }

  function getSulfurNeeded() {
    const curr = parseFloat(currentPh)
    const tgt = parseFloat(targetPh)
    const area = parseFloat(sqft)
    if (!curr || !tgt || !area || curr <= tgt) return null
    const diff = curr - tgt
    const lbsPer100 = diff * 1.5
    return ((lbsPer100 / 100) * area).toFixed(1)
  }

  const lime = getLimeNeeded()
  const sulfur = getSulfurNeeded()

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Soil Planner</h1>
        <p className="mt-1 text-muted-foreground">
          Healthy soil is the foundation of everything. Fix your soil first — plants do the rest.
        </p>
      </div>

      <Tabs defaultValue="ph">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="ph">pH Guide</TabsTrigger>
          <TabsTrigger value="nutrients">Nutrients (N-P-K)</TabsTrigger>
          <TabsTrigger value="types">Soil Types</TabsTrigger>
          <TabsTrigger value="amendments">Amendments</TabsTrigger>
          <TabsTrigger value="calculator">pH Calculator</TabsTrigger>
        </TabsList>

        {/* pH Guide */}
        <TabsContent value="ph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Soil pH</CardTitle>
              <CardDescription>
                pH runs 0–14. Most vegetables prefer 6.0–7.0. Testing costs $15–30 at a garden center or free through your county extension office.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {PH_RANGES.map((r) => (
                <div key={r.label} className="flex items-start gap-3">
                  <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${r.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.min}–{r.max}</span>
                      <Badge variant="outline" className="text-xs">{r.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.plants}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">How to Test Your Soil</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Collect samples from 6–8 spots in your garden, 6" deep, avoiding roots and rocks.</p>
              <p>2. Mix all samples in a clean bucket — this averages the variation.</p>
              <p>3. Use a pH meter, test strips, or send to your county cooperative extension office (often free).</p>
              <p>4. Test every 2–3 years, or whenever adding significant amendments.</p>
              <p className="text-green-700 font-medium">Pro tip: Extension offices often test for N-P-K and micronutrients too for $20–40 total.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrients */}
        <TabsContent value="nutrients" className="space-y-3">
          {NUTRIENTS.map((n) => (
            <Card key={n.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{n.name}</CardTitle>
                <CardDescription>{n.role}</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-amber-700 mb-1">Deficiency Signs</p>
                  <p className="text-muted-foreground">{n.deficiency}</p>
                </div>
                <div>
                  <p className="font-medium text-green-700 mb-1">Organic Sources</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    {n.sources.map((s) => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-red-700 mb-1">Too Much?</p>
                  <p className="text-muted-foreground">{n.excess}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Soil Types */}
        <TabsContent value="types" className="space-y-3">
          {SOIL_TYPES.map((s) => (
            <Card key={s.type}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{s.type} Soil</CardTitle>
                  <Badge variant="outline">{s.drainage}</Badge>
                </div>
                <CardDescription>Feel: {s.feel}</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-700 mb-1">Pros</p>
                  <ul className="text-muted-foreground space-y-0.5">{s.pros.map((p) => <li key={p}>• {p}</li>)}</ul>
                </div>
                <div>
                  <p className="font-medium text-red-700 mb-1">Cons</p>
                  <ul className="text-muted-foreground space-y-0.5">{s.cons.map((c) => <li key={c}>• {c}</li>)}</ul>
                </div>
                <div>
                  <p className="font-medium text-blue-700 mb-1">How to Fix</p>
                  <p className="text-muted-foreground">{s.fix}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Amendments */}
        <TabsContent value="amendments" className="space-y-3">
          {AMENDMENTS.map((a) => (
            <Card key={a.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{a.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">{a.rate}</Badge>
                </div>
                <CardDescription>{a.purpose}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a.notes}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Calculator */}
        <TabsContent value="calculator" className="space-y-4 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Amendment Calculator</CardTitle>
              <CardDescription>Estimate how much lime or sulfur to add.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Current pH</Label>
                  <Input placeholder="6.0" value={currentPh} onChange={(e) => setCurrentPh(e.target.value)} type="number" step="0.1" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Target pH</Label>
                  <Input placeholder="6.5" value={targetPh} onChange={(e) => setTargetPh(e.target.value)} type="number" step="0.1" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Area (sq ft)</Label>
                  <Input placeholder="100" value={sqft} onChange={(e) => setSqft(e.target.value)} type="number" />
                </div>
              </div>
              {lime && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                  <p className="font-medium">Add approximately <strong>{lime} lbs of agricultural lime</strong></p>
                  <p className="text-xs mt-1 text-green-700">Apply and work into the top 6". Re-test in 2–3 months.</p>
                </div>
              )}
              {sulfur && (
                <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                  <p className="font-medium">Add approximately <strong>{sulfur} lbs of elemental sulfur</strong></p>
                  <p className="text-xs mt-1 text-yellow-700">Elemental sulfur takes months to react. Iron sulfate acts faster but costs more.</p>
                </div>
              )}
              {!lime && !sulfur && currentPh && (
                <div className="rounded-md bg-gray-50 border p-3 text-sm text-muted-foreground">
                  pH is already at or near target — no major amendment needed.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
