import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import type { HomesteadAnimal } from '@/types/garden'

export function useHomesteadAnimals() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['homestead-animals', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homestead_animals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at')
      if (error) throw error
      return data as HomesteadAnimal[]
    },
  })

  const create = useMutation({
    mutationFn: async (animal: Omit<HomesteadAnimal, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('homestead_animals')
        .insert({ ...animal, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homestead-animals'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('homestead_animals')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homestead-animals'] }),
  })

  return { animals: query.data ?? [], isLoading: query.isLoading, create, remove }
}
