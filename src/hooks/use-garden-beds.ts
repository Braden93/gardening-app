import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import type { GardenBed } from '@/types/garden'

export function useGardenBeds() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['garden-beds', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garden_beds')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at')
      if (error) throw error
      return data as GardenBed[]
    },
  })

  const create = useMutation({
    mutationFn: async (bed: Omit<GardenBed, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('garden_beds')
        .insert({ ...bed, user_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-beds'] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GardenBed> & { id: string }) => {
      const { data, error } = await supabase
        .from('garden_beds')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-beds'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('garden_beds')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-beds'] }),
  })

  return { beds: query.data ?? [], isLoading: query.isLoading, create, update, remove }
}
