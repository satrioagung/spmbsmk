'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function DownloadDataButton({ registrations }: { registrations: any[] }) {
  const handleDownload = () => {
    if (!registrations || registrations.length === 0) return

    // Define CSV headers
    const headers = [
      'ID Pendaftaran',
      'Tanggal Daftar',
      'Status Verifikasi',
      'Nama Lengkap',
      'NISN',
      'NIK Siswa',
      'Nomor KK',
      'Asal Sekolah',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Agama',
      'Nama Ayah',
      'NIK Ayah',
      'Pekerjaan Ayah',
      'Pendidikan Ayah',
      'Nama Ibu',
      'NIK Ibu',
      'Pekerjaan Ibu',
      'Pendidikan Ibu'
    ]

    // Construct CSV rows
    const rows = registrations.map(reg => {
      // Helper to safely format string to avoid CSV breakages (escape quotes, wrap in quotes)
      const sanitize = (val: any) => {
        if (val === null || val === undefined) return '""'
        const str = String(val).replace(/"/g, '""')
        return `"${str}"`
      }

      return [
        sanitize(reg.id),
        sanitize(new Date(reg.created_at).toLocaleString('id-ID')),
        sanitize(reg.status),
        sanitize(reg.profiles?.full_name || ''),
        sanitize(reg.nisn),
        sanitize(reg.nik),
        sanitize(reg.kk_number),
        sanitize(reg.origin_school),
        sanitize(reg.birthplace),
        sanitize(reg.birthdate),
        sanitize(reg.religion),
        sanitize(reg.father_name),
        sanitize(reg.father_nik),
        sanitize(reg.father_job),
        sanitize(reg.father_education),
        sanitize(reg.mother_name),
        sanitize(reg.mother_nik),
        sanitize(reg.mother_job),
        sanitize(reg.mother_education),
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Data_Pendaftar_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleDownload} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
      <Download className="w-4 h-4 mr-2" /> Unduh Seluruh Data (.csv)
    </Button>
  )
}
