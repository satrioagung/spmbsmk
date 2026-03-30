'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { updateRegistrationStatus } from './actions'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AdminRegistrationsTable({ registrations }: { registrations: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusUpdate = async (id: string, status: 'verified' | 'rejected') => {
    setLoadingId(id)
    try {
      const res = await updateRegistrationStatus(id, status)
      if (res.error) {
        toast.error('Gagal memperbarui status', { description: res.error })
      } else {
        toast.success(`Pendaftaran ditandai sebagai ${status === 'verified' ? 'terverifikasi' : 'ditolak'}`)
      }
    } catch {
      toast.error('Terjadi kesalahan yang tidak terduga')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="rounded-md border border-slate-800 bg-slate-900 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-950 hover:bg-slate-950">
          <TableRow className="border-slate-800">
            <TableHead className="text-slate-300">Peringkat.</TableHead>
            <TableHead className="text-slate-300">Nama Lengkap</TableHead>
            <TableHead className="text-slate-300">Asal Sekolah</TableHead>
            <TableHead className="text-slate-300">NISN / NIK</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.length === 0 ? (
            <TableRow className="border-slate-800">
              <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                Tidak ada pendaftaran ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            registrations.map((reg, index) => (
              <TableRow key={reg.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                <TableCell className="font-medium text-slate-300">#{index + 1}</TableCell>
                <TableCell>
                  <div className="font-semibold text-white">{reg.profiles?.full_name || 'N/A'}</div>
                  <div className="text-xs text-slate-500">{format(new Date(reg.created_at), 'PPP')}</div>
                </TableCell>
                <TableCell className="text-slate-300">{reg.origin_school}</TableCell>
                <TableCell className="text-slate-400">
                  <div className="text-sm">{reg.nisn}</div>
                  <div className="text-xs">{reg.nik}</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    reg.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    reg.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {reg.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {loadingId === reg.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                    ) : reg.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
                          onClick={() => handleStatusUpdate(reg.id, 'verified')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                          onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Tolak
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Selesai</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
