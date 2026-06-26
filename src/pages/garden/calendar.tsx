import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useGardenTasks } from '@/hooks/use-garden-tasks'
import { useGardenBeds } from '@/hooks/use-garden-beds'
import { TASK_TYPE_LABELS } from '@/types/garden'
import type { TaskType } from '@/types/garden'
import { CheckCircle2, Circle, Plus, Trash2, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const TASK_COLORS: Record<TaskType, string> = {
  water:       'bg-blue-100 text-blue-800 border-blue-200',
  weed:        'bg-orange-100 text-orange-800 border-orange-200',
  fertilize:   'bg-green-100 text-green-800 border-green-200',
  harvest:     'bg-amber-100 text-amber-800 border-amber-200',
  start_seeds: 'bg-purple-100 text-purple-800 border-purple-200',
  transplant:  'bg-teal-100 text-teal-800 border-teal-200',
  custom:      'bg-gray-100 text-gray-800 border-gray-200',
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}


export default function CalendarPage() {
  const { tasks, isLoading, create, complete, uncomplete, remove } = useGardenTasks()
  const { beds } = useGardenBeds()
  const [addOpen, setAddOpen] = useState(false)
  const [filter, setFilter] = useState<string>('pending')

  const [title, setTitle] = useState('')
  const [taskType, setTaskType] = useState<TaskType>('water')
  const [dueDate, setDueDate] = useState('')
  const [bedId, setBedId] = useState('')
  const [notes, setNotes] = useState('')

  async function handleAdd() {
    await create.mutateAsync({
      title,
      task_type: taskType,
      due_date: dueDate,
      bed_id: bedId || null,
      planting_id: null,
      notes: notes || null,
    })
    setAddOpen(false)
    setTitle('')
    setDueDate('')
    setNotes('')
    setBedId('')
  }

  const today = new Date().toISOString().slice(0, 10)

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed_at
    if (filter === 'overdue') return !t.completed_at && t.due_date < today
    if (filter === 'today') return !t.completed_at && t.due_date === today
    if (filter === 'completed') return !!t.completed_at
    return true
  })

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, t) => {
    const key = t.completed_at ? 'Done' : t.due_date
    acc[key] = [...(acc[key] ?? []), t]
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (a === 'Done') return 1
    if (b === 'Done') return -1
    return a.localeCompare(b)
  })

  const pendingCount = tasks.filter((t) => !t.completed_at).length
  const overdueCount = tasks.filter((t) => !t.completed_at && t.due_date < today).length

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Garden Calendar</h1>
          <p className="mt-1 text-muted-foreground">
            {pendingCount} pending · {overdueCount > 0 && <span className="text-red-600">{overdueCount} overdue · </span>}
            {tasks.filter((t) => t.completed_at).length} completed
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Garden Task</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Task Title</Label>
                <Input placeholder="e.g. Water tomato beds" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Task Type</Label>
                  <Select value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((t) => (
                        <SelectItem key={t} value={t}>{TASK_TYPE_LABELS[t]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Due Date</Label>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Garden Bed (optional)</Label>
                <Select value={bedId} onValueChange={setBedId}>
                  <SelectTrigger><SelectValue placeholder="Any / all beds" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any / all beds</SelectItem>
                    {beds.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Notes</Label>
                <Textarea placeholder="Any extra details..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
              </div>
              <Button onClick={handleAdd} disabled={!title || !dueDate || create.isPending} className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick-add templates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Common Gardening Schedules
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>• <strong>Watering:</strong> Most vegetables need 1" of water/week. Deep, infrequent watering beats light daily watering.</p>
          <p>• <strong>Fertilizing:</strong> Feed heavy feeders (tomatoes, corn, squash) every 2–3 weeks with a balanced fertilizer during fruiting.</p>
          <p>• <strong>Weeding:</strong> Weed when small — weekly walk-throughs prevent any single weed from going to seed.</p>
          <p>• <strong>Succession planting:</strong> Add a new batch of fast-maturing crops (lettuce, radish, beans) every 2–3 weeks for continuous harvest.</p>
        </CardContent>
      </Card>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['pending', 'today', 'overdue', 'completed', 'all'].map((f) => (
          <Badge
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            className="cursor-pointer capitalize"
            onClick={() => setFilter(f)}
          >
            {f}
          </Badge>
        ))}
      </div>

      {/* Task list */}
      {sortedDates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">
            <p>No tasks here. Add your first task to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={cn(
                  'text-sm font-semibold',
                  dateKey === 'Done' ? 'text-green-600' :
                  dateKey < today ? 'text-red-600' :
                  dateKey === today ? 'text-amber-600' : 'text-foreground'
                )}>
                  {dateKey === 'Done' ? 'Completed' : formatDate(dateKey)}
                  {dateKey < today && dateKey !== 'Done' && ' — OVERDUE'}
                  {dateKey === today && ' — Today'}
                </h3>
                <div className="flex-1 border-t" />
              </div>
              <div className="space-y-2">
                {grouped[dateKey].map((task) => {
                  const bedName = task.bed_id ? beds.find((b) => b.id === task.bed_id)?.name : null
                  return (
                    <div key={task.id} className="flex items-start gap-3 rounded-lg border bg-card p-3 group">
                      <button
                        onClick={() => task.completed_at ? uncomplete.mutate(task.id) : complete.mutate(task.id)}
                        className="mt-0.5 shrink-0 text-green-500 hover:text-green-600"
                      >
                        {task.completed_at
                          ? <CheckCircle2 className="h-5 w-5" />
                          : <Circle className="h-5 w-5 text-muted-foreground hover:text-green-500" />
                        }
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn('text-sm', task.completed_at && 'line-through text-muted-foreground')}>
                            {task.title}
                          </span>
                          <Badge variant="outline" className={`text-xs ${TASK_COLORS[task.task_type]}`}>
                            {TASK_TYPE_LABELS[task.task_type]}
                          </Badge>
                          {bedName && <span className="text-xs text-muted-foreground">{bedName}</span>}
                        </div>
                        {task.notes && <p className="text-xs text-muted-foreground mt-0.5">{task.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-destructive"
                        onClick={() => remove.mutate(task.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
