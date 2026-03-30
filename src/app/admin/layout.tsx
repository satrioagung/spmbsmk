import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/auth/actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="flex h-16 items-center px-6 lg:px-12 bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center font-bold tracking-tight text-white text-xl">
          SPMB<span className="text-blue-500 ml-1">Admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400 hidden sm:block">
            {user.email}
          </span>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm" className="rounded-full text-slate-300 hover:text-white hover:bg-slate-800">
              Keluar
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
