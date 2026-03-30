'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRegistrationStatus(id: string, status: 'verified' | 'rejected') {
  const supabase = await createClient()

  // Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}
