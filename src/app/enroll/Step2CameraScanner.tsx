'use client'

import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import Tesseract from 'tesseract.js'
import { Button } from '@/components/ui/button'
import { Scan, ArrowLeft, RefreshCw, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { EnrollmentData } from './EnrollmentWizard'

export default function Step2CameraScanner({ 
  onNext, onPrev 
}: { 
  onNext: (data: Partial<EnrollmentData>) => void,
  onPrev: () => void 
}) {
  const webcamRef = useRef<Webcam>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) setImage(imageSrc)
  }, [webcamRef])

  const processImage = async () => {
    if (!image) return
    
    setIsProcessing(true)
    try {
      const worker = await Tesseract.createWorker('ind', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(image);
      await worker.terminate();

      // Simple Regex extraction based on Indonesian KK format
      // In a real app, this needs robust parsing heuristics per region
      const parsedData: Partial<EnrollmentData> = {}
      
      const kkMatch = text.match(/No\.\s*([\d]{16})/i)
      if (kkMatch) parsedData.kk_number = kkMatch[1]
      
      const nikMatch = text.match(/NIK\s*([\d]{16})/i)
      if (nikMatch) parsedData.nik = nikMatch[1]

      toast.success('Dokumen berhasil dipindai')
      onNext(parsedData)
    } catch (error) {
      console.error(error)
      toast.error('Gagal memproses gambar. Silakan coba lagi atau lewati.')
      // even if fail, we move to next screen but without data so they manually fill forms
      onNext({})
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Pindai Kartu Keluarga (KK)</h2>
        <p className="text-slate-500 mt-1 text-sm">Sejajarkan KK fisik Anda di dalam bingkai. Semua pemrosesan terjadi dengan aman di perangkat Anda.</p>
      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner aspect-[4/5] sm:aspect-video flex items-center justify-center">
        {!image ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover opacity-80"
            />
            {/* Overlay Guides */}
            <div className="absolute inset-0 border-[6px] border-blue-500/50 m-8 rounded-xl pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 h-[2px] bg-red-500/50 shadow-[0_0_10px_red] animate-[scan_2s_ease-in-out_infinite]" />
          </>
        ) : (
          <img src={image} alt="Captured KK" className="w-full h-full object-cover" />
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-lg font-bold mb-2">Menganalisis Dokumen...</h3>
            <div className="w-full max-w-[200px] bg-slate-700 rounded-full h-3 overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-slate-400 text-sm">{progress}% selesai</p>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onPrev} disabled={isProcessing} className="rounded-full px-6">
          <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
        </Button>
        
        {!image ? (
          <div className="flex gap-2">
            <Button variant="ghost" className="text-slate-500 text-sm" onClick={() => onNext({})}>
              Lewati
            </Button>
            <Button onClick={capture} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/30">
              <Scan className="mr-2 w-4 h-4" /> Ambil Foto
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImage(null)} disabled={isProcessing} className="rounded-full px-4">
              <RefreshCw className="mr-2 w-4 h-4" /> Ulangi
            </Button>
            <Button onClick={processImage} disabled={isProcessing} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-500/30">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Ekstrak Data
            </Button>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}} />
    </div>
  )
}
