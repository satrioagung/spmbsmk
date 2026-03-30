import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/auth/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto sm:border-x sm:border-slate-200 sm:shadow-2xl">
      <header className="flex h-16 items-center px-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <Link href="/" className="flex items-center font-bold tracking-tight text-blue-900 text-lg">
          SPMB<span className="text-blue-600 ml-1">SMK</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs font-medium text-slate-700 hidden sm:block truncate max-w-[100px]">
            {user.email}
          </span>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm" className="rounded-full text-xs px-3">
              Keluar
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
