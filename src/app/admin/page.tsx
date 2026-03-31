import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import AdminRegistrationsTable from './AdminRegistrationsTable'
import DownloadDataButton from './DownloadDataButton'
import { Users, FileCheck2, Clock, CheckCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch all registrations sorted by creation date (FIFO Ranking)
  const { data: registrations } = await supabase
    .from('registrations')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: true })

  const regs = registrations || []
  const total = regs.length
  const pending = regs.filter(r => r.status === 'pending').length
  const verified = regs.filter(r => r.status === 'verified').length
  const topRankedCount = Math.min(verified, 100) // Placeholder ranking quota

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ringkasan Dasbor</h1>
          <p className="text-slate-400 mt-1">Pantau statistik pendaftaran dan verifikasi pendaftar baru.</p>
        </div>
        <DownloadDataButton registrations={regs} />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Total Pendaftar</p>
              <p className="text-3xl font-bold text-white">{total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/20">
              <Users size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Menunggu Ulasan</p>
              <p className="text-3xl font-bold text-amber-400">{pending}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/20">
              <Clock size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Terverifikasi</p>
              <p className="text-3xl font-bold text-emerald-400">{verified}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
              <FileCheck2 size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">Kuota Terisi</p>
              <p className="text-3xl font-bold text-indigo-400">{topRankedCount} / 100</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/20">
              <CheckCircle size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations List */}
      <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-xl shadow-black/20 mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Antrean Pendaftaran</CardTitle>
          <CardDescription className="text-slate-400">Tinjau seluruh data dan verifikasi siswa baru yang telah mendaftar.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminRegistrationsTable registrations={regs} />
        </CardContent>
      </Card>
    </div>
  )
}
