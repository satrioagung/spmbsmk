import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ExamCard from './CardClient'

export default async function ExamCardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  if (!registration || registration.status !== 'verified') {
    redirect('/dashboard')
  }

  return <ExamCard registration={registration} profile={profile} />
}
