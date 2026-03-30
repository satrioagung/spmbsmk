'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { EnrollmentData } from './EnrollmentWizard'
import { ArrowRight } from 'lucide-react'

const step1Schema = z.object({
  nisn: z.string().min(10, 'NISN must be at least 10 digits'),
  origin_school: z.string().min(3, 'Origin school is required'),
})

export default function Step1BasicInfo({
  initialData,
  onNext
}: {
  initialData: Partial<EnrollmentData>
  onNext: (data: Partial<EnrollmentData>) => void
}) {
  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nisn: initialData.nisn || '',
      origin_school: initialData.origin_school || '',
    }
  })

  function onSubmit(values: z.infer<typeof step1Schema>) {
    onNext(values)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Informasi Dasar</h2>
        <p className="text-slate-500 mt-1 text-sm">Silakan masukkan detail akademik dasar Anda untuk melanjutkan.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nisn"
            render={({ field }: { field: any }) => (
              <FormItem>
                <Label>NISN (Nomor Induk Siswa Nasional)</Label>
                <FormControl>
                  <Input placeholder="Masukkan 10 digit NISN Anda" className="h-11 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="origin_school"
            render={({ field }: { field: any }) => (
              <FormItem>
                <Label>Asal Sekolah (SMP/MTs)</Label>
                <FormControl>
                  <Input placeholder="Contoh: SMPN 1 Jakarta" className="h-11 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-11 shadow-lg shadow-blue-500/20">
              Lanjutkan <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
