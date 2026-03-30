'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { EnrollmentData } from './EnrollmentWizard'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'

// Extended schema handling all required fields
const step3Schema = z.object({
  nisn: z.string().min(10, 'NISN must be at least 10 digits'),
  origin_school: z.string().min(3, 'Origin school is required'),
  kk_number: z.string().min(16, 'KK Number is usually 16 digits'),
  nik: z.string().min(16, 'NIK is usually 16 digits'),
  birthplace: z.string().min(3),
  birthdate: z.string(), // standard yyyy-mm-dd
  religion: z.string().min(3),
  father_name: z.string().min(3),
  father_nik: z.string().min(16),
  father_job: z.string().min(2),
  father_education: z.string().min(2),
  mother_name: z.string().min(3),
  mother_nik: z.string().min(16),
  mother_job: z.string().min(2),
  mother_education: z.string().min(2),
})

export default function Step3ReviewForm({
  initialData,
  onSubmit,
  onPrev,
  isSubmitting
}: {
  initialData: EnrollmentData
  onSubmit: (data: EnrollmentData) => void
  onPrev: () => void
  isSubmitting: boolean
}) {
  const form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      nisn: initialData.nisn || '',
      origin_school: initialData.origin_school || '',
      kk_number: initialData.kk_number || '',
      nik: initialData.nik || '',
      birthplace: initialData.birthplace || '',
      birthdate: initialData.birthdate || new Date().toISOString().split('T')[0],
      religion: initialData.religion || '',
      father_name: initialData.father_name || '',
      father_nik: initialData.father_nik || '',
      father_job: initialData.father_job || '',
      father_education: initialData.father_education || '',
      mother_name: initialData.mother_name || '',
      mother_nik: initialData.mother_nik || '',
      mother_job: initialData.mother_job || '',
      mother_education: initialData.mother_education || '',
    }
  })

  function handleFinalSubmit(values: z.infer<typeof step3Schema>) {
    onSubmit(values as EnrollmentData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Tinjau & Kirim</h2>
        <p className="text-slate-500 mt-1 text-sm">Harap verifikasi data yang diekstrak AI dengan dokumen fisik Anda. Anda dapat mengedit bagian yang salah.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700 border-b pb-2 text-sm">Identitas Siswa</h3>
              <FormField control={form.control} name="nisn" render={({ field }: { field: any }) => (
                <FormItem><Label>NISN</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="origin_school" render={({ field }: { field: any }) => (
                <FormItem><Label>Asal Sekolah</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="nik" render={({ field }: { field: any }) => (
                <FormItem><Label>NIK</Label><FormControl><Input {...field} className="border-blue-300 bg-blue-50" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="kk_number" render={({ field }: { field: any }) => (
                <FormItem><Label>Nomor KK</Label><FormControl><Input {...field} className="border-blue-300 bg-blue-50" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="birthplace" render={({ field }: { field: any }) => (
                  <FormItem><Label>Tempat Lahir</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="birthdate" render={({ field }: { field: any }) => (
                  <FormItem><Label>Tanggal Lahir</Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="religion" render={({ field }: { field: any }) => (
                <FormItem><Label>Agama</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700 border-b pb-2 text-sm">Detail Orang Tua</h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ayah</h4>
                <FormField control={form.control} name="father_name" render={({ field }: { field: any }) => (
                  <FormItem><Label>Nama</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="father_nik" render={({ field }: { field: any }) => (
                  <FormItem><Label>NIK</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="father_job" render={({ field }: { field: any }) => (
                    <FormItem><Label>Pekerjaan</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="father_education" render={({ field }: { field: any }) => (
                    <FormItem><Label>Pendidikan</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ibu</h4>
                <FormField control={form.control} name="mother_name" render={({ field }: { field: any }) => (
                  <FormItem><Label>Nama</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="mother_nik" render={({ field }: { field: any }) => (
                  <FormItem><Label>NIK</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="mother_job" render={({ field }: { field: any }) => (
                    <FormItem><Label>Pekerjaan</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="mother_education" render={({ field }: { field: any }) => (
                    <FormItem><Label>Pendidikan</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-100 mt-8">
            <Button variant="outline" type="button" onClick={onPrev} disabled={isSubmitting} className="rounded-full px-6">
              <ArrowLeft className="mr-2 w-4 h-4" /> Kembali Kamera
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 h-11 shadow-lg shadow-blue-500/30">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim...</>
              ) : (
                <><CheckCircle2 className="w-5 h-5 mr-2" /> Selesaikan Pendaftaran</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
