import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useGardenBeds } from '@/hooks/use-garden-beds'
import { Sun, CloudSun, Cloud, Plus, Trash2, Edit2 } from 'lucide-react'
import type { GardenBed } from '@/types/garden'

const LAYOUT_ICONS: Record<string, string> = {
  rows: '⬛',
  raised_bed: '📦',
  circular: '⭕',
  keyhole: '🔑',
  perennial_zone: '🌿',
}

const SUN_ICONS = {
  full_sun: Sun,
  partial_shade: CloudSun,
  full_shade: Cloud,
}

const SUN_COLORS = {
  full_sun: 'text-yellow-500',
  partial_shade: 'text-blue-400',
  full_shade: 'text-gray-400',
}

const COMPANION_TIPS: Record<string, string> = {
  rows: 'Traditional rows work best oriented N–S so plants don\'t shade each other. Tall crops (corn, sunflower) go on the north end.',
  raised_bed: 'Raised beds warm faster in spring. Plant in a grid pattern (square foot gardening) to maximize space.',
  circular: 'Circular/mandala gardens are beautiful and efficient. Place tall plants in the center, spreading plants at edges.',
  keyhole: 'Keyhole gardens are water-efficient. The center compost basket feeds the whole bed. Great for dry climates.',
  perennial_zone: 'Dedicate permanent zones to perennials so you never disrupt their roots. Edge your annual beds with perennial herbs.',
}

function BedForm({ initial, onSave, onCancel }: {
  initial?: Partial<GardenBed>
  onSave: (bed: Omit<GardenBed, 'id' | 'user_id' | 'created_at'>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [layoutType, setLayoutType] = useState(initial?.layout_type ?? 'raised_bed')
  const [width, setWidth] = useState(String(initial?.width_ft ?? '4'))
  const [length, setLength] = useState(String(initial?.length_ft ?? '8'))
  const [sun, setSun] = useState(initial?.sun_exposure ?? 'full_sun')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Bed Name</Label>
        <Input placeholder="e.g. Tomato Bed, West Raised Bed" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Layout Type</Label>
          <Select value={layoutType} onValueChange={setLayoutType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rows">Traditional Rows</SelectItem>
              <SelectItem value="raised_bed">Raised Bed</SelectItem>
              <SelectItem value="circular">Circular / Mandala</SelectItem>
              <SelectItem value="keyhole">Keyhole Garden</SelectItem>
              <SelectItem value="perennial_zone">Perennial Zone</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Sun Exposure</Label>
          <Select value={sun} onValueChange={setSun}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full_sun">Full Sun (6+ hrs)</SelectItem>
              <SelectItem value="partial_shade">Partial Shade (3–6 hrs)</SelectItem>
              <SelectItem value="full_shade">Full Shade (&lt;3 hrs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Width (ft)</Label>
          <Input type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Length (ft)</Label>
          <Input type="number" min="1" value={length} onChange={(e) => setLength(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Notes</Label>
        <Textarea placeholder="What are you planning to grow here? Any special conditions?" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </div>
      {layoutType && (
        <div className="rounded-md bg-blue-50 border border-blue-200 p-2 text-xs text-blue-700">
          {COMPANION_TIPS[layoutType]}
        </div>
      )}
      <div className="flex gap-2">
        <Button onClick={() => onSave({ name, layout_type: layoutType as any, width_ft: parseFloat(width), length_ft: parseFloat(length), sun_exposure: sun as any, notes: notes || null, position_x: initial?.position_x ?? 0, position_y: initial?.position_y ?? 0 })} className="flex-1">
          Save Bed
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

export default function LayoutPage() {
  const { beds, isLoading, create, remove } = useGardenBeds()
  const [addOpen, setAddOpen] = useState(false)

  const totalSqft = beds.reduce((s, b) => s + (b.width_ft * b.length_ft), 0)

  async function handleSave(bed: Omit<GardenBed, 'id' | 'user_id' | 'created_at'>) {
    await create.mutateAsync(bed)
    setAddOpen(false)
  }

  if (isLoading) return <div className="text-muted-foreground">Loading beds...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Garden Layout Builder</h1>
          <p className="mt-1 text-muted-foreground">
            {beds.length > 0
              ? `${beds.length} beds · ${totalSqft.toFixed(0)} total sq ft`
              : 'Add your first garden bed to start planning.'}
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Bed</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Garden Bed</DialogTitle></DialogHeader>
            <BedForm onSave={handleSave} onCancel={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Layout templates info */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(LAYOUT_ICONS).map(([type, icon]) => (
          <div key={type} className="rounded-lg border bg-card p-3 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs font-medium capitalize">{type.replace('_', ' ')}</div>
          </div>
        ))}
      </div>

      {/* Beds grid */}
      {beds.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">No beds yet</p>
            <p className="text-sm mt-1">Add your first garden bed to start building your layout.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beds.map((bed) => {
            const SunIcon = SUN_ICONS[bed.sun_exposure]
            const sqft = bed.width_ft * bed.length_ft
            return (
              <Card key={bed.id} className="relative group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>{LAYOUT_ICONS[bed.layout_type]}</span>
                      {bed.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                      onClick={() => remove.mutate(bed.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <SunIcon className={`h-3.5 w-3.5 ${SUN_COLORS[bed.sun_exposure]}`} />
                    {bed.sun_exposure.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size: </span>
                      <span className="font-medium">{bed.width_ft}′ × {bed.length_ft}′</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Area: </span>
                      <span className="font-medium">{sqft} sq ft</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {bed.layout_type.replace('_', ' ')}
                  </Badge>
                  {bed.notes && <p className="text-xs text-muted-foreground">{bed.notes}</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Tips */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-green-800">Layout Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 text-sm text-green-700">
          <p>• Place tall plants (corn, tomatoes, sunflowers) on the north side so they don't shade shorter crops.</p>
          <p>• Keep perennial zones at the permanent edges of your garden so annual rotation doesn't disturb them.</p>
          <p>• 4′ wide beds allow you to reach the center without stepping in — avoid compacting soil.</p>
          <p>• Orient row beds north–south for even sun distribution throughout the day.</p>
          <p>• Full shade beds work well for lettuce, spinach, herbs, and root crops in hot summers.</p>
          <p>• Keyhole and circular designs reduce walking paths and maximize growing space per sq ft.</p>
        </CardContent>
      </Card>
    </div>
  )
}
