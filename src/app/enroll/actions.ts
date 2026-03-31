'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitRegistration(data: any) {
  const supabase = await createClient()
  
  // Extract full_name before inserting into registrations
  const { full_name, profile_id, ...registrationData } = data

  // Provide initial validation (ensure we have profile_id)
  if (!profile_id) {
     return { error: 'Profil ID tidak ditemukan.' }
  }

  // 1. Update the profile with full_name to be certain
  if (full_name) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: full_name })
      .eq('id', profile_id)

    if (profileError) {
      console.error("Failed to update profile name:", profileError)
      return { error: 'Gagal memperbarui nama pengguna.' }
    }
  }

  // 2. Insert into registrations
  const { error } = await supabase
    .from('registrations')
    .insert([{
      ...registrationData,
      profile_id: profile_id,
      status: 'pending'
    }])

  if (error) {
    console.error("Failed to insert registration:", error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
