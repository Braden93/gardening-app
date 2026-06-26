import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const STORAGE_GUIDE = [
  { food: 'Tomatoes', method: 'Can (pressure or water bath)', shelfLife: '12–18 months', notes: 'Process whole, crushed, or as sauce. Water bath OK for high-acid varieties.' },
  { food: 'Green Beans', method: 'Pressure can', shelfLife: '12–18 months', notes: 'Low-acid — must pressure can. Do NOT water bath.' },
  { food: 'Corn', method: 'Freeze (blanched 4 min) or pressure can', shelfLife: '12–18 months', notes: 'Cut from cob after blanching. Pressure can as cream-style for best results.' },
  { food: 'Squash/Pumpkin', method: 'Freeze (cubed, blanched) or cure whole', shelfLife: '1 year frozen / 3–6 months cured', notes: 'Winter squash stores amazingly well whole in a cool, dry room after curing.' },
  { food: 'Cucumbers', method: 'Ferment or pickle', shelfLife: '6–12 months', notes: 'Lacto-fermented pickles: salt + water brine, no canning needed.' },
  { food: 'Carrots', method: 'Root cellar, freeze (blanched), or ferment', shelfLife: '4–6 months root cellar', notes: 'Best kept in moist sand in a root cellar. Freeze for longer storage.' },
  { food: 'Beets', method: 'Pickle or freeze', shelfLife: '12 months', notes: 'Roast, slice, pickle in vinegar + sugar. Or freeze cooked.' },
  { food: 'Garlic', method: 'Dry cure in warm, airy location', shelfLife: '6–10 months', notes: 'Cure 3–4 weeks hanging. Hard-neck: 4–6 months. Soft-neck: 8–10 months.' },
  { food: 'Onion', method: 'Dry cure', shelfLife: '6–8 months', notes: 'Cure 2–4 weeks in warm, dry air with good circulation. Ideal in mesh bags hung in a shed.' },
  { food: 'Potatoes', method: 'Root cellar at 38–40°F', shelfLife: '4–8 months', notes: 'Cure 2 weeks at 50–60°F first to harden skins. Keep dark to prevent greening.' },
  { food: 'Sweet Potatoes', method: 'Cure then root cellar at 55–60°F', shelfLife: '6–12 months', notes: 'Cure 10–14 days at 85°F and high humidity first. Then store at 55–60°F — NOT colder.' },
  { food: 'Peppers', method: 'Freeze, dry, or ferment (hot sauce)', shelfLife: '12 months frozen, 1–2 years dried', notes: 'Freeze whole without blanching. Dehydrate for powder or flakes. Ferment into hot sauce.' },
  { food: 'Cabbage', method: 'Root cellar or ferment (sauerkraut)', shelfLife: '3–4 months whole / 12+ months fermented', notes: 'Sauerkraut: shred, salt (2% by weight), pack into jar. Ready in 1–4 weeks at room temp.' },
  { food: 'Kale', method: 'Freeze (blanched 2 min) or dry', shelfLife: '12 months frozen', notes: 'Blanch, cool, squeeze dry, freeze in portions. Also dehydrates into chips.' },
  { food: 'Apples', method: 'Root cellar, dehydrate, sauce, cider', shelfLife: '2–6 months fresh / 12 months preserved', notes: 'Store unwashed in cool, humid cellar. Never store near potatoes (ethylene gas).' },
  { food: 'Berries', method: 'Freeze, jam, or dehydrate', shelfLife: '12 months', notes: 'Freeze on trays first then bag — prevents clumping. Use honey as sweetener for jam.' },
  { food: 'Beans (dried)', method: 'Dry in shell, store whole', shelfLife: '2–10 years', notes: 'The ultimate storage food. Pick when pods are papery, finish drying indoors.' },
  { food: 'Grain (wheat, corn)', method: 'Store in sealed containers', shelfLife: '5–30 years', notes: 'Whole grains store far longer than flour. Oxygen absorbers in sealed mylar bags = decades.' },
]

const FERMENTS = [
  { name: 'Sauerkraut', difficulty: 'Beginner', time: '1–4 weeks', ingredients: '1 head cabbage, 1 tsp salt per pound', steps: ['Shred cabbage finely', 'Massage with salt until brine releases', 'Pack tightly into jar, press below brine', 'Cover loosely (not airtight)', 'Taste daily — done at your preferred sourness', 'Refrigerate or move to cold storage'] },
  { name: 'Dill Pickles', difficulty: 'Beginner', time: '3–7 days', ingredients: 'Cucumbers, 2% salt brine, dill, garlic', steps: ['Pack cucumbers into jar with dill and garlic', 'Pour cool 2% salt brine (1 tsp/cup water) over cucumbers', 'Weight down below brine', 'Ferment at room temp 3–7 days', 'Refrigerate when sour to your taste'] },
  { name: 'Fermented Hot Sauce', difficulty: 'Beginner', time: '5–14 days', ingredients: 'Hot peppers, 2–3% salt brine', steps: ['Blend or chop peppers', 'Pack into jar with salt brine', 'Ferment until bubbly and sour', 'Blend smooth, strain if desired', 'Bottle — lasts 6+ months refrigerated'] },
  { name: 'Kimchi', difficulty: 'Beginner', time: '1–5 days', ingredients: 'Napa cabbage, radish, gochugaru, garlic, ginger, salt', steps: ['Salt cabbage and let sit 1 hour', 'Rinse, mix with paste (pepper, garlic, ginger)', 'Pack into jar, ferment 1–5 days at room temp', 'Refrigerate — improves for months'] },
  { name: 'Sourdough Starter', difficulty: 'Beginner', time: '5–7 days to establish', ingredients: 'Equal weights flour and water, daily feeding', steps: ['Mix 50g flour + 50g water in jar', 'Feed daily by discarding half and adding 50g flour + 50g water', 'Done when it doubles predictably within 4–8 hours of feeding'] },
  { name: 'Apple Cider Vinegar', difficulty: 'Intermediate', time: '2–4 months', ingredients: 'Apple scraps, water, sugar (optional)', steps: ['Pack jar with apple scraps, cover with water + 1 tbsp sugar', 'Cover with cloth, ferment 2–4 weeks to hard cider', 'Leave uncovered another 4–8 weeks to acidify to vinegar', 'Taste for sharpness — strain and bottle'] },
]

export default function PreservationPage() {
  const [search, setSearch] = useState('')

  const filtered = STORAGE_GUIDE.filter((s) =>
    !search || s.food.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Food Preservation Hub</h1>
        <p className="mt-1 text-muted-foreground">
          Preservation is the bridge between your harvest and your table in February. Master two or three methods and you'll never waste a harvest again.
        </p>
      </div>

      <Tabs defaultValue="storage">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="storage">By Crop</TabsTrigger>
          <TabsTrigger value="canning">Canning Guide</TabsTrigger>
          <TabsTrigger value="ferments">Fermentation</TabsTrigger>
          <TabsTrigger value="dehydrating">Dehydrating</TabsTrigger>
          <TabsTrigger value="cellar">Root Cellar</TabsTrigger>
        </TabsList>

        <TabsContent value="storage" className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search crops..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="space-y-2">
            {filtered.map((s) => (
              <Card key={s.food}>
                <CardContent className="py-3 grid sm:grid-cols-4 gap-2 items-start">
                  <div>
                    <p className="font-medium text-sm">{s.food}</p>
                    <Badge variant="secondary" className="text-xs mt-1">{s.shelfLife}</Badge>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground"><strong className="text-foreground">Method: </strong>{s.method}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="canning" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-base text-blue-800">Water Bath Canning</CardTitle>
                <CardDescription>High-acid foods only</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground"><strong className="text-foreground">Safe for:</strong> Tomatoes (with added acid), pickles, jams, jellies, fruit, applesauce, salsa</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Equipment:</strong> Large stockpot with rack, canning jars with new lids</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Process:</strong> Bring to boil, process 10–45 min depending on recipe</p>
                <div className="rounded-md bg-amber-50 border border-amber-200 p-2 text-xs text-amber-700">
                  Never water bath can low-acid foods (beans, corn, meat, potatoes) — risk of botulism.
                </div>
                <ol className="space-y-1 text-muted-foreground text-xs">
                  <li>1. Sterilize jars in simmering water</li>
                  <li>2. Fill hot jars with hot product, leaving correct headspace</li>
                  <li>3. Wipe rims, apply new lids and rings</li>
                  <li>4. Process in boiling water per tested recipe time</li>
                  <li>5. Remove, cool 24 hours undisturbed, check seals</li>
                </ol>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-800">Pressure Canning</CardTitle>
                <CardDescription>Required for ALL low-acid foods</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground"><strong className="text-foreground">Required for:</strong> Green beans, corn, meat, poultry, fish, potatoes, soups, stews</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Equipment:</strong> Pressure canner ($80–200), canning jars with new lids, jar lifter</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Process:</strong> 10–15 psi for 20–90 min depending on food and altitude</p>
                <div className="rounded-md bg-green-50 border border-green-200 p-2 text-xs text-green-700">
                  A pressure canner is the single most important piece of preservation equipment for self-reliance. It lets you safely preserve meat, beans, and low-acid vegetables.
                </div>
                <ol className="space-y-1 text-muted-foreground text-xs">
                  <li>1. Vent steam 10 min before closing petcock</li>
                  <li>2. Bring to correct pressure per tested recipe</li>
                  <li>3. Process for required time at stable pressure</li>
                  <li>4. Let depressurize naturally — never force cool</li>
                  <li>5. Remove jars, cool 24 hours, check seals</li>
                </ol>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Trusted Canning Resources</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Ball Complete Book of Home Preserving</strong> — the authoritative canning reference</p>
              <p>• <strong>USDA Complete Guide to Home Canning</strong> — free at nchfp.uga.edu (tested, safe recipes only)</p>
              <p>• <strong>National Center for Home Food Preservation</strong> — nchfp.uga.edu</p>
              <p>• Always use tested recipes — do not adjust ratios of low-acid ingredients in canned recipes</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ferments" className="space-y-3">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4 text-sm text-green-700">
              <p><strong>Why ferment?</strong> Lacto-fermentation requires no special equipment, no heat, and produces probiotic-rich food that often has longer shelf life than fresh. Salt + vegetables + time = preserved food.</p>
            </CardContent>
          </Card>
          {FERMENTS.map((f) => (
            <Card key={f.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{f.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">{f.difficulty}</Badge>
                    <Badge variant="outline" className="text-xs">{f.time}</Badge>
                  </div>
                </div>
                <CardDescription>{f.ingredients}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-1 text-sm text-muted-foreground">
                  {f.steps.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}
                </ol>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dehydrating" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Dehydrating Guide</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">Dehydrating removes 90–95% of water, extending shelf life to 1–3 years. Easiest preservation method with no special safety concerns.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-1">Equipment Options</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Electric dehydrator ($40–300) — easiest, most consistent</li>
                    <li>• Oven at lowest setting (150–170°F) — works well, uses more energy</li>
                    <li>• Solar dehydrator (DIY $20–50) — free energy, slower</li>
                    <li>• Air drying (herbs, peppers) — free, takes longer</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">Temperature Guide</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Herbs: 95–115°F (4–8 hrs)</li>
                    <li>• Vegetables: 125–135°F (6–12 hrs)</li>
                    <li>• Fruits: 135–145°F (6–16 hrs)</li>
                    <li>• Meat/jerky: 160–165°F (4–8 hrs)</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Best Foods to Dehydrate</p>
                <div className="flex flex-wrap gap-2">
                  {['Tomatoes', 'Herbs (all)', 'Hot peppers', 'Mushrooms', 'Onions', 'Garlic', 'Zucchini chips', 'Apple slices', 'Berries', 'Corn', 'Green beans', 'Kale chips', 'Beets'].map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cellar" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Root Cellar Basics</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">A root cellar is the original refrigerator — cool, dark, and humid enough to store produce for months with zero energy cost.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-1">Ideal Conditions</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Temperature: 32–40°F (cool storage)</li>
                    <li>• Humidity: 85–95% for most vegetables</li>
                    <li>• Dark: no light promotes dormancy</li>
                    <li>• Ventilated: some air circulation prevents mold</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">What Stores Well</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Potatoes: 38–40°F, high humidity, dark</li>
                    <li>• Carrots in moist sand: 32–40°F, 95% humidity</li>
                    <li>• Beets in moist sawdust: 32–40°F</li>
                    <li>• Cabbage: 32°F, very humid (smelly — isolate)</li>
                    <li>• Winter squash: 50–55°F, lower humidity</li>
                    <li>• Garlic & onion: 32–40°F, low humidity, good airflow</li>
                    <li>• Apples: 32–40°F (keep away from potatoes)</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-md bg-blue-50 border border-blue-200 p-2 text-xs text-blue-700">
                <strong>No basement? No problem:</strong> A buried garbage can, an insulated corner of a garage, or a trash can buried in a hillside works as a mini root cellar. Dig 4–6 ft down below frost line.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
