'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitRegistration(data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('registrations')
    .insert([{
      ...data,
      status: 'pending'
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
