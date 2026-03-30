import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, FileText, Clock, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch registration
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('profile_id', user?.id)
    .single()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dasbor</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola pendaftaran Anda dan periksa pembaruan.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Registration Status Card */}
        <Card className="shadow-sm border-slate-200 w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Status Pendaftaran</CardTitle>
            <CardDescription>Progres pendaftaran Anda saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            {!registration ? (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <FileText size={28} />
                </div>
                <div className="text-center px-4">
                  <h3 className="font-semibold text-slate-900 text-base">Belum Mendaftar</h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-[250px] mx-auto leading-relaxed">
                    Anda perlu menyelesaikan formulir pendaftaran berbantuan AI yang memindai Kartu Keluarga (KK) Anda.
                  </p>
                </div>
                <Link href="/enroll">
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 mt-2 shadow-lg shadow-blue-500/20 text-sm h-10">
                    Mulai Pemindaian AI
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center sm:items-start p-5 bg-white border border-slate-200 rounded-xl shadow-sm text-center sm:text-left">
                {registration.status === 'verified' ? (
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                ) : registration.status === 'rejected' ? (
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle size={24} />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                )}

                <div className="flex-1 w-full">
                  <h3 className="font-semibold text-slate-900 text-lg capitalize">{registration.status === 'pending' ? 'Menunggu' : registration.status === 'verified' ? 'Terverifikasi' : 'Ditolak'}</h3>
                  <p className="text-slate-500 mt-1 text-sm">
                    {registration.status === 'verified'
                      ? 'Dokumen Anda telah diverifikasi. Anda sekarang dapat mengunduh kartu ujian Anda.'
                      : registration.status === 'rejected'
                        ? 'Pendaftaran Anda ditolak. Silakan hubungi administrator.'
                        : 'Pendaftaran Anda sedang ditinjau oleh tim administrasi.'}
                  </p>
                </div>

                {registration.status === 'verified' && (
                  <Link href="/dashboard/exam-card" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full shrink-0 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full font-medium h-10 px-6">
                      Lihat Kartu Ujian
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="shadow-sm border-slate-200 w-full mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Detail Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Nama Lengkap</p>
              <p className="text-slate-900 font-medium text-sm">
                {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Tidak Ada Nama'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Alamat Email</p>
              <p className="text-slate-900 font-medium text-sm truncate">{user?.email}</p>
            </div>
            {registration && (
              <>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500">NISN</p>
                  <p className="text-slate-900 font-medium text-sm">{registration.nisn}</p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500">Nama Lengkap (Berdasarkan KK)</p>
                  <p className="text-slate-900 font-medium text-sm">{registration.full_name || 'N/A'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
