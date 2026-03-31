'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { CheckCircle2, Loader2, Save } from 'lucide-react'
import { submitRegistration } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export type EnrollmentData = {
  full_name: string;
  nisn: string;
  origin_school: string;
  kk_number: string;
  nik: string;
  birthplace: string;
  birthdate: string;
  religion: string;
  father_name: string;
  father_nik: string;
  father_job: string;
  father_education: string;
  mother_name: string;
  mother_nik: string;
  mother_job: string;
  mother_education: string;
}

const formSchema = z.object({
  full_name: z.string().min(3, 'Nama lengkap wajib diisi'),
  nisn: z.string().min(10, 'NISN minimal 10 digit'),
  origin_school: z.string().min(3, 'Asal sekolah wajib diisi'),
  kk_number: z.string().min(16, 'Nomor KK biasanya 16 digit'),
  nik: z.string().min(16, 'NIK biasanya 16 digit'),
  birthplace: z.string().min(3, 'Tempat lahir wajib diisi'),
  birthdate: z.string(), // standard yyyy-mm-dd
  religion: z.string().min(3, 'Agama wajib diisi'),
  father_name: z.string().min(3, 'Nama ayah wajib diisi'),
  father_nik: z.string().min(16, 'NIK ayah wajib diisi'),
  father_job: z.string().min(2, 'Pekerjaan ayah wajib diisi'),
  father_education: z.string().min(2, 'Pendidikan ayah wajib diisi'),
  mother_name: z.string().min(3, 'Nama ibu wajib diisi'),
  mother_nik: z.string().min(16, 'NIK ibu wajib diisi'),
  mother_job: z.string().min(2, 'Pekerjaan ibu wajib diisi'),
  mother_education: z.string().min(2, 'Pendidikan ibu wajib diisi'),
})

export default function EnrollmentWizard({ initialName, userId }: { initialName: string, userId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: initialName || '',
      nisn: '',
      origin_school: '',
      kk_number: '',
      nik: '',
      birthplace: '',
      birthdate: new Date().toISOString().split('T')[0],
      religion: '',
      father_name: '',
      father_nik: '',
      father_job: '',
      father_education: '',
      mother_name: '',
      mother_nik: '',
      mother_job: '',
      mother_education: '',
    }
  })

  async function handleFinalSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const result = await submitRegistration({ ...values, profile_id: userId })
      if (result.error) {
        toast.error('Pendaftaran gagal', { description: result.error })
      } else {
        toast.success('Pendaftaran berhasil!', { description: 'Aplikasi Anda sekarang sedang ditinjau.' })
        router.push('/dashboard')
      }
    } catch (e: any) {
      toast.error('Terjadi kesalahan selama pengiriman.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-900">Formulir Pendaftaran Siswa Baru</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Silakan lengkapi seluruh data identitas Anda dan orang tua secara manual untuk keperluan pendaftaran.
        </p>
      </div>

      <div className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
            <div className="flex flex-col gap-6">
              {/* Identitas Diri */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span> 
                  Identitas Siswa
                </h3>
                <FormField control={form.control} name="full_name" render={({ field }) => (
                  <FormItem>
                    <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                    <FormControl><Input placeholder="Masukkan nama lengkap sesuai ijazah" {...field} className="border-blue-300 bg-blue-50 focus-visible:ring-blue-500" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="nisn" render={({ field }) => (
                    <FormItem><Label>NISN <span className="text-red-500">*</span></Label><FormControl><Input placeholder="10 Digit NISN" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="origin_school" render={({ field }) => (
                    <FormItem><Label>Asal Sekolah <span className="text-red-500">*</span></Label><FormControl><Input placeholder="Contoh: SMPN 1 Jakarta" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="nik" render={({ field }) => (
                    <FormItem><Label>NIK Siswa <span className="text-red-500">*</span></Label><FormControl><Input placeholder="16 Digit NIK di KK" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="kk_number" render={({ field }) => (
                    <FormItem><Label>Nomor Kartu Keluarga <span className="text-red-500">*</span></Label><FormControl><Input placeholder="16 Digit Nomor KK" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="birthplace" render={({ field }) => (
                    <FormItem><Label>Tempat Lahir <span className="text-red-500">*</span></Label><FormControl><Input placeholder="Contoh: Jakarta" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="birthdate" render={({ field }) => (
                    <FormItem><Label>Tanggal Lahir <span className="text-red-500">*</span></Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="religion" render={({ field }) => (
                  <FormItem><Label>Agama <span className="text-red-500">*</span></Label><FormControl><Input placeholder="Contoh: Islam" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              {/* Data Ayah */}
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span> 
                  Detail Orang Tua (Ayah)
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="father_name" render={({ field }) => (
                      <FormItem><Label>Nama Lengkap Ayah</Label><FormControl><Input placeholder="Nama Ayah (Kandung/Tiri/Angkat)" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="father_nik" render={({ field }) => (
                      <FormItem><Label>NIK Ayah</Label><FormControl><Input placeholder="16 Digit NIK" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="father_job" render={({ field }) => (
                      <FormItem><Label>Pekerjaan Ayah</Label><FormControl><Input placeholder="Contoh: Wiraswasta" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="father_education" render={({ field }) => (
                      <FormItem><Label>Pendidikan Ayah</Label><FormControl><Input placeholder="Contoh: SMA" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
              </div>

              {/* Data Ibu */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span> 
                  Detail Orang Tua (Ibu)
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="mother_name" render={({ field }) => (
                      <FormItem><Label>Nama Lengkap Ibu</Label><FormControl><Input placeholder="Nama Ibu (Kandung/Tiri/Angkat)" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="mother_nik" render={({ field }) => (
                      <FormItem><Label>NIK Ibu</Label><FormControl><Input placeholder="16 Digit NIK" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="mother_job" render={({ field }) => (
                      <FormItem><Label>Pekerjaan Ibu</Label><FormControl><Input placeholder="Contoh: Mengurus Rumah Tangga" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="mother_education" render={({ field }) => (
                      <FormItem><Label>Pendidikan Ibu</Label><FormControl><Input placeholder="Contoh: SMP" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 shadow-lg shadow-blue-500/30 text-sm w-full md:w-auto">
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mengirim Data...</>
                ) : (
                  <><Save className="w-5 h-5 mr-2" /> Simpan Form Pendaftaran</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
