'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ExamCard({
  registration,
  profile
}: {
  registration: any;
  profile: any;
}) {
  const printRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPdf = async () => {
    const element = printRef.current
    if (!element) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(element, { scale: 2 })
      const data = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Exam_Card_${registration.nisn}.pdf`)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Kartu Ujian Anda</h1>
        <Button 
          onClick={downloadPdf} 
          disabled={isDownloading}
          className="ml-auto bg-blue-600 hover:bg-blue-700 shadow-md rounded-full text-xs h-9 px-3"
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? 'Membuat...' : 'Unduh PDF'}
        </Button>
      </div>

      <div className="flex justify-center border border-dashed border-slate-300 bg-slate-100 p-8 rounded-xl overflow-x-auto">
        {/* PDF Container */}
        <div 
          ref={printRef}
          className="w-[595px] h-[842px] bg-white text-black p-10 shadow-lg relative border border-slate-200"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest text-blue-900">Pendaftaran SPMB SMK</h2>
            <p className="text-sm font-medium text-slate-600 mt-1">Kartu Pendaftaran dan Ujian Resmi</p>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
              <div className="text-sm text-slate-500 font-semibold uppercase">ID Pendaftaran</div>
              <div className="col-span-2 font-mono font-bold text-lg">{registration.id.split('-')[0]}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
              <div className="text-sm text-slate-500 font-semibold uppercase">Nama Lengkap</div>
              <div className="col-span-2 font-bold text-lg">{profile?.full_name || 'N/A'}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
              <div className="text-sm text-slate-500 font-semibold uppercase">NISN</div>
              <div className="col-span-2 font-medium">{registration.nisn}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
              <div className="text-sm text-slate-500 font-semibold uppercase">Asal Sekolah</div>
              <div className="col-span-2 font-medium">{registration.origin_school}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
              <div className="text-sm text-slate-500 font-semibold uppercase">Status Verifikasi</div>
              <div className="col-span-2 font-bold text-emerald-600 uppercase">
                {registration.status === 'verified' ? 'Terverifikasi' : registration.status}
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end border-t border-slate-300 pt-6">
            <div className="text-xs text-slate-500">
              Dibuat pada {new Date().toLocaleDateString('id-ID')}<br/>
              Berlaku sebagai ID ujian fisik
            </div>
            <div className="text-center">
              <div className="w-24 h-24 border border-slate-400 mb-2 p-1 text-slate-300 flex items-center justify-center text-xs">
                QR Code
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{registration.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
