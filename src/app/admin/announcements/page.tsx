import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAnnouncement, deleteAnnouncement } from './actions'
import { Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .order('published_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Pengumuman</h1>
          <p className="text-slate-400 mt-1">Siarkan informasi penting ke portal siswa.</p>
        </div>
        <Link href="/admin">
          <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-full">
            Kembali ke Dasbor
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Create Form */}
        <Card className="bg-slate-950 border-slate-800 shadow-xl shadow-black/20 md:col-span-1 h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-xl text-white">Buat Baru</CardTitle>
            <CardDescription className="text-slate-400">Posting pengumuman ke halaman utama.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
              'use server'
              await createAnnouncement(formData)
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Judul</Label>
                <Input id="title" name="title" required className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-300">Konten</Label>
                <textarea 
                  id="content" 
                  name="content" 
                  required 
                  rows={4}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" 
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40">
                Terbitkan Pengumuman
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              Gagal memuat pengumuman: {error.message}
            </div>
          )}
          
          {!announcements?.length ? (
            <div className="text-center p-12 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-600 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-300">Belum Ada Pengumuman</h3>
              <p className="text-slate-500 max-w-sm mt-2">Anda belum menerbitkan pengumuman apapun.</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-slate-950 border-slate-800 shadow-xl shadow-black/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        Diterbitkan pada {new Date(announcement.published_at).toLocaleString('id-ID')}
                      </p>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">{announcement.content}</p>
                    </div>
                    <form action={async () => {
                      'use server'
                      await deleteAnnouncement(announcement.id)
                    }}>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400 hover:bg-red-400/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
