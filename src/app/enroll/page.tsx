import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EnrollmentWizard from './EnrollmentWizard'

export default async function EnrollPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if already registered
  const { data: registration } = await supabase
    .from('registrations')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (registration) {
    redirect('/dashboard') // Already enrolled
  }

  // Fetch auth profile for pre-filling name
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 max-w-md mx-auto sm:border-x sm:border-slate-200 sm:shadow-2xl">
      <div className="w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Wisaya Pendaftaran</h1>
          <p className="mt-2 text-sm text-slate-600">Selesaikan langkah-langkah di bawah untuk mendaftar. Pastikan Kartu Keluarga (KK) Anda siap dipindai.</p>
        </div>
        <EnrollmentWizard initialName={profile?.full_name || ''} userId={user.id} />
      </div>
    </div>
  )
}
