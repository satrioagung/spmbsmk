'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  if (!title || !content) return { error: 'Missing fields' }

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
    .from('announcements')
    .insert([{ title, content }])

  if (error) {
    return { error: error.message }
  }

  // Revalidate landing page so students see it
  revalidatePath('/')
  revalidatePath('/admin/announcements')
  return { success: true }
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase.from('announcements').delete().eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/')
  revalidatePath('/admin/announcements')
  return { success: true }
}
