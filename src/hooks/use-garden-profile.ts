import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import type { GardenProfile } from '@/types/garden'

export function useGardenProfile() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['garden-profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garden_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle()
      if (error) throw error
      return data as GardenProfile | null
    },
  })

  const upsert = useMutation({
    mutationFn: async (profile: Partial<GardenProfile>) => {
      const payload = { ...profile, user_id: user!.id, updated_at: new Date().toISOString() }
      const { data, error } = await supabase
        .from('garden_profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['garden-profile'] }),
  })

  return { profile: query.data, isLoading: query.isLoading, upsert }
}
