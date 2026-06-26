import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGardenBeds } from '@/hooks/use-garden-beds'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { PLANT_FAMILY_COLORS } from '@/types/garden'
import type { GardenPlanting, PlantFamily } from '@/types/garden'
import { Plus, Trash2 } from 'lucide-react'

const FAMILIES: PlantFamily[] = ['nightshade', 'brassica', 'legume', 'allium', 'cucurbit', 'root', 'herb', 'fruit', 'grain', 'other']

const ROTATION_RULES: Record<string, string> = {
  nightshade: 'Follow with legumes (fix nitrogen) or root crops. Avoid planting nightshades in the same bed within 3 years.',
  brassica: 'Follow with legumes. Avoid following other brassicas — they share clubroot disease. Never plant after nightshades.',
  legume: 'Plant before heavy feeders (corn, tomatoes). They leave nitrogen deposits in the soil for the following crop.',
  allium: 'Follow with most crops. Avoid following other alliums due to white rot buildup. Don\'t follow with legumes.',
  cucurbit: 'Follow with brassicas or legumes. Avoid same-family succession — cucumber beetles and powdery mildew persist.',
  root: 'Good after heavy feeders. Improve soil structure. Carrots after onions (repels carrot fly).',
  herb: 'Herbs are flexible. Many perennial herbs don\'t need rotation — keep in a dedicated zone.',
  fruit: 'Perennial fruit trees and bushes don\'t rotate. Keep in dedicated permanent zones.',
  grain: 'Good for breaking disease cycles. Corn follows legumes well. Small grains follow heavy feeders.',
  other: 'Track carefully and avoid planting the same species in the same bed in consecutive years.',
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3]

function useGardenPlantings() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['garden-plantings', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garden_plantings')
        .select('*')
        .eq('user_id', user!.id)
        .order('year', { ascending: false })
      if (error) throw error
      return data as GardenPlanting[]
    },
  })

  const create = useMutation({
    mutationFn: async (p: Omit<GardenPlanting, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('garden_plantings')
        .insert({ ...p, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-plantings'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('garden_plantings').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-plantings'] }),
  })

  return { plantings: query.data ?? [], isLoading: query.isLoading, create, remove }
}

export default function RotationPage() {
  const { beds } = useGardenBeds()
  const { plantings, create, remove } = useGardenPlantings()
  const [addOpen, setAddOpen] = useState(false)
  const [selectedBed, setSelectedBed] = useState('')
  const [plantName, setPlantName] = useState('')
  const [family, setFamily] = useState<PlantFamily>('nightshade')
  const [plantType, setPlantType] = useState<'annual' | 'perennial'>('annual')
  const [year, setYear] = useState(String(CURRENT_YEAR))

  async function handleAdd() {
    await create.mutateAsync({
      bed_id: selectedBed || null,
      plant_name: plantName,
      plant_family: family,
      plant_type: plantType,
      year: parseInt(year),
      season: null,
      start_date: null,
      harvest_date: null,
      notes: null,
    })
    setAddOpen(false)
    setPlantName('')
  }

  function getNextRecommendation(bedId: string): string {
    const recent = plantings
      .filter((p) => p.bed_id === bedId)
      .sort((a, b) => b.year - a.year)
    if (recent.length === 0) return 'No history — plant what you need most.'
    const lastFamily = recent[0].plant_family
    const suggestions: Record<string, string> = {
      nightshade: 'Legumes or root crops',
      brassica: 'Legumes or alliums',
      legume: 'Nightshades, corn, or brassicas (they love the nitrogen!)',
      allium: 'Brassicas or root crops',
      cucurbit: 'Legumes or brassicas',
      root: 'Heavy feeders (nightshades, cucurbits)',
      grain: 'Legumes or brassicas',
    }
    return suggestions[lastFamily ?? ''] ?? 'Rotate to a different plant family'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crop Rotation Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            Never plant the same family in the same bed two years in a row. Breaks disease and pest cycles.
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Record Planting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record a Planting</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Plant Name</Label>
                <Input placeholder="e.g. Cherokee Purple Tomato" value={plantName} onChange={(e) => setPlantName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Plant Family</Label>
                  <Select value={family} onValueChange={(v) => setFamily(v as PlantFamily)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FAMILIES.map((f) => <SelectItem key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Garden Bed</Label>
                <Select value={selectedBed} onValueChange={setSelectedBed}>
                  <SelectTrigger><SelectValue placeholder="Select a bed (optional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific bed</SelectItem>
                    {beds.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={plantType} onValueChange={(v) => setPlantType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="perennial">Perennial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} disabled={!plantName || create.isPending} className="w-full">
                Save Planting
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="beds">
        <TabsList>
          <TabsTrigger value="beds">By Bed</TabsTrigger>
          <TabsTrigger value="all">All Plantings</TabsTrigger>
          <TabsTrigger value="rules">Rotation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="beds" className="space-y-4">
          {beds.length === 0 && (
            <p className="text-muted-foreground text-sm">Add beds in the Layout Builder to track per-bed rotation.</p>
          )}
          {beds.map((bed) => {
            const bedPlantings = plantings.filter((p) => p.bed_id === bed.id)
            const byYear = YEARS.map((y) => ({
              year: y,
              plants: bedPlantings.filter((p) => p.year === y),
            }))
            const nextRec = getNextRecommendation(bed.id)
            return (
              <Card key={bed.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{bed.name}</CardTitle>
                  <CardDescription className="text-green-700">Next year: {nextRec}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {byYear.map(({ year, plants }) => (
                      <div key={year}>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{year}</p>
                        {plants.length === 0
                          ? <p className="text-xs text-muted-foreground italic">—</p>
                          : plants.map((p) => (
                            <Badge
                              key={p.id}
                              variant="outline"
                              className={`text-xs mb-1 block truncate ${p.plant_family ? PLANT_FAMILY_COLORS[p.plant_family] : ''}`}
                            >
                              {p.plant_name}
                            </Badge>
                          ))
                        }
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="all" className="space-y-2">
          {plantings.length === 0 && (
            <p className="text-muted-foreground text-sm">No plantings recorded yet.</p>
          )}
          {YEARS.map((y) => {
            const yp = plantings.filter((p) => p.year === y)
            if (yp.length === 0) return null
            return (
              <div key={y}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">{y}</h3>
                <div className="space-y-1">
                  {yp.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className={`text-xs ${p.plant_family ? PLANT_FAMILY_COLORS[p.plant_family] : ''}`}>
                        {p.plant_family ?? 'other'}
                      </Badge>
                      <span className="flex-1">{p.plant_name}</span>
                      {p.bed_id && <span className="text-xs text-muted-foreground">{beds.find((b) => b.id === p.bed_id)?.name}</span>}
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove.mutate(p.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </TabsContent>

        <TabsContent value="rules" className="space-y-3">
          <p className="text-sm text-muted-foreground">Rotate plant families, not individual plants. These rules prevent disease buildup and nutrient depletion.</p>
          {FAMILIES.filter((f) => ROTATION_RULES[f]).map((f) => (
            <Card key={f}>
              <CardHeader className="pb-1">
                <Badge className={`w-fit text-xs ${PLANT_FAMILY_COLORS[f]}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{ROTATION_RULES[f]}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
