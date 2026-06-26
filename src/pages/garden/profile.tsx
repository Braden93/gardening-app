import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useGardenProfile } from '@/hooks/use-garden-profile'
import { zipToZone, HARDINESS_ZONES } from '@/types/garden'
import { CheckCircle2, MapPin, Users, Ruler, Lightbulb, Target, Droplets } from 'lucide-react'

const ALL_GOALS = [
  { key: 'vegetables', label: 'Vegetables' },
  { key: 'fruit', label: 'Fruit Trees & Berries' },
  { key: 'herbs', label: 'Culinary Herbs' },
  { key: 'medicinal', label: 'Medicinal Plants' },
  { key: 'chickens', label: 'Chickens (Eggs)' },
  { key: 'cows', label: 'Dairy Cow' },
  { key: 'rabbits', label: 'Meat Rabbits' },
  { key: 'fish', label: 'Fish Farm / Aquaponics' },
  { key: 'ducks', label: 'Ducks' },
  { key: 'quail', label: 'Quail' },
  { key: 'goats', label: 'Goats' },
  { key: 'pigs', label: 'Pigs' },
  { key: 'bees', label: 'Beekeeping' },
  { key: 'preservation', label: 'Food Preservation' },
  { key: 'seed_saving', label: 'Seed Saving' },
]

export default function GardenProfilePage() {
  const { profile, isLoading, upsert } = useGardenProfile()
  const [saved, setSaved] = useState(false)

  const [zip, setZip] = useState('')
  const [familySize, setFamilySize] = useState('4')
  const [gardenSqft, setGardenSqft] = useState('')
  const [pastureAcres, setPastureAcres] = useState('')
  const [spaceType, setSpaceType] = useState<string>('backyard')
  const [experience, setExperience] = useState<string>('beginner')
  const [goals, setGoals] = useState<string[]>([])
  const [waterSource, setWaterSource] = useState<string>('municipal')

  useEffect(() => {
    if (profile) {
      setZip(profile.zip_code ?? '')
      setFamilySize(String(profile.family_size))
      setGardenSqft(String(profile.garden_sqft ?? ''))
      setPastureAcres(String(profile.pasture_acres ?? ''))
      setSpaceType(profile.space_type)
      setExperience(profile.experience_level)
      setGoals(profile.goals ?? [])
      setWaterSource(profile.water_source)
    }
  }, [profile])

  const zone = zip.length >= 5 ? zipToZone(zip) : null
  const zoneInfo = zone ? HARDINESS_ZONES[zone] : null

  function toggleGoal(key: string) {
    setGoals((prev) => prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key])
  }

  async function handleSave() {
    await upsert.mutateAsync({
      zip_code: zip || null,
      hardiness_zone: zone,
      frost_date_last: zoneInfo?.lastFrost ?? null,
      frost_date_first: zoneInfo?.firstFrost ?? null,
      family_size: parseInt(familySize) || 4,
      garden_sqft: gardenSqft ? parseInt(gardenSqft) : null,
      pasture_acres: pastureAcres ? parseFloat(pastureAcres) : null,
      space_type: spaceType as any,
      experience_level: experience as any,
      goals,
      water_source: waterSource as any,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Homestead Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Your location and goals shape every recommendation in the app.
        </p>
      </div>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-primary" />
            Location
          </CardTitle>
          <CardDescription>Used to determine your hardiness zone and frost dates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>ZIP Code</Label>
            <Input
              placeholder="e.g. 84601"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              maxLength={5}
            />
          </div>
          {zoneInfo && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 space-y-1 text-sm">
              <p className="font-medium text-green-800">USDA Hardiness Zone {zoneInfo.zone}</p>
              <p className="text-green-700">Last frost: <strong>{zoneInfo.lastFrost}</strong></p>
              <p className="text-green-700">First frost: <strong>{zoneInfo.firstFrost}</strong></p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Household */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            Household
          </CardTitle>
          <CardDescription>Determines how much to plant and raise.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Family Size</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={familySize}
              onChange={(e) => setFamilySize(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Experience Level</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Complete Beginner</SelectItem>
                <SelectItem value="intermediate">Some Experience</SelectItem>
                <SelectItem value="experienced">Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Land */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Ruler className="h-4 w-4 text-primary" />
            Land & Space
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select value={spaceType} onValueChange={setSpaceType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="urban">Urban / Apartment (containers/rooftop)</SelectItem>
                <SelectItem value="backyard">Suburban Backyard (&lt;1 acre)</SelectItem>
                <SelectItem value="small_farm">Small Farm (1–10 acres)</SelectItem>
                <SelectItem value="large_farm">Large Farm (10+ acres)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Garden Area (sq ft)</Label>
              <Input
                type="number"
                placeholder="e.g. 400"
                value={gardenSqft}
                onChange={(e) => setGardenSqft(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Pasture / Open Land (acres)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g. 2.5"
                value={pastureAcres}
                onChange={(e) => setPastureAcres(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Droplets className="h-4 w-4 text-primary" />
            Water Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={waterSource} onValueChange={setWaterSource}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="municipal">Municipal / City Water</SelectItem>
              <SelectItem value="well">Private Well</SelectItem>
              <SelectItem value="rainwater">Rainwater Collection (primary)</SelectItem>
              <SelectItem value="creek">Creek / Pond</SelectItem>
              <SelectItem value="mixed">Mixed Sources</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            Self-Reliance Goals
          </CardTitle>
          <CardDescription>Select everything you want to work toward.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ALL_GOALS.map((g) => (
              <Badge
                key={g.key}
                variant={goals.includes(g.key) ? 'default' : 'outline'}
                className="cursor-pointer select-none transition-colors"
                onClick={() => toggleGoal(g.key)}
              >
                {goals.includes(g.key) && <CheckCircle2 className="mr-1 h-3 w-3" />}
                {g.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips based on goals */}
      {goals.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-blue-800">
              <Lightbulb className="h-4 w-4" />
              Quick Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 space-y-1">
            {goals.includes('chickens') && <p>• Chickens: Start with 4–6 hens — they produce 300+ eggs/year and their manure feeds your garden.</p>}
            {goals.includes('bees') && <p>• Bees: One hive pollinates up to a 2-mile radius and produces 60+ lbs of honey per year.</p>}
            {goals.includes('preservation') && <p>• Preservation: A pressure canner ($80) pays for itself the first season you preserve beans or meat.</p>}
            {goals.includes('fish') && <p>• Fish: A 275-gallon IBC tote aquaponics system can produce 50+ lbs of tilapia per year.</p>}
            {goals.includes('rabbits') && <p>• Rabbits: 3 does + 1 buck = up to 150 lbs of meat per year, plus the best garden fertilizer available.</p>}
            {goals.includes('seed_saving') && <p>• Seeds: Only save from open-pollinated/heirloom varieties — hybrids don't breed true.</p>}
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave} disabled={upsert.isPending} className="w-full">
        {upsert.isPending ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
      </Button>
    </div>
  )
}
