import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import type { RoadmapCompletion } from '@/types/garden'

export function useRoadmap() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['roadmap', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap_completions')
        .select('*')
        .eq('user_id', user!.id)
      if (error) throw error
      return data as RoadmapCompletion[]
    },
  })

  const toggle = useMutation({
    mutationFn: async ({ phase, item_key, completed }: { phase: number; item_key: string; completed: boolean }) => {
      if (completed) {
        const { error } = await supabase
          .from('roadmap_completions')
          .delete()
          .eq('user_id', user!.id)
          .eq('phase', phase)
          .eq('item_key', item_key)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('roadmap_completions')
          .insert({ user_id: user!.id, phase, item_key })
        if (error) throw error
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roadmap'] }),
  })

  const completedKeys = new Set(query.data?.map((r) => `${r.phase}:${r.item_key}`) ?? [])
  const isComplete = (phase: number, key: string) => completedKeys.has(`${phase}:${key}`)

  return { completions: query.data ?? [], isLoading: query.isLoading, isComplete, toggle }
}
