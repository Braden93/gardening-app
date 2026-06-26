import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import type { GardenTask } from '@/types/garden'

export function useGardenTasks() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['garden-tasks', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garden_tasks')
        .select('*')
        .eq('user_id', user!.id)
        .order('due_date')
      if (error) throw error
      return data as GardenTask[]
    },
  })

  const create = useMutation({
    mutationFn: async (task: Omit<GardenTask, 'id' | 'user_id' | 'created_at' | 'completed_at'>) => {
      const { data, error } = await supabase
        .from('garden_tasks')
        .insert({ ...task, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-tasks'] }),
  })

  const complete = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('garden_tasks')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-tasks'] }),
  })

  const uncomplete = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('garden_tasks')
        .update({ completed_at: null })
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-tasks'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('garden_tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-tasks'] }),
  })

  return { tasks: query.data ?? [], isLoading: query.isLoading, create, complete, uncomplete, remove }
}
