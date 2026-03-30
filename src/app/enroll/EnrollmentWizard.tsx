'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Step1BasicInfo from './Step1BasicInfo'
import Step2CameraScanner from './Step2CameraScanner'
import Step3ReviewForm from './Step3ReviewForm'
import { submitRegistration } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export type EnrollmentData = {
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

export default function EnrollmentWizard({ initialName, userId }: { initialName: string, userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<EnrollmentData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNextStep = (data: Partial<EnrollmentData>) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleFinalSubmit = async (data: EnrollmentData) => {
    setIsSubmitting(true)
    try {
      const result = await submitRegistration({ ...data, profile_id: userId })
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
      {/* Progress Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {s}
            </div>
            {s !== 3 && (
              <div className={`flex-1 h-1 mx-4 rounded-full transition-colors duration-300 ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1BasicInfo initialData={formData} onNext={handleNextStep} />}
            {step === 2 && <Step2CameraScanner onNext={handleNextStep} onPrev={handlePrevStep} />}
            {step === 3 && (
              <Step3ReviewForm 
                initialData={formData as EnrollmentData} 
                onSubmit={handleFinalSubmit} 
                onPrev={handlePrevStep} 
                isSubmitting={isSubmitting} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
