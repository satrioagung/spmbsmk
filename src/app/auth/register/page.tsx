import Link from 'next/link'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const error = (await searchParams).error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 max-w-md mx-auto sm:border-x sm:border-slate-200 sm:shadow-2xl">
      <div className="w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center">
          <Link href="/" className="inline-block font-bold text-2xl tracking-tight text-blue-900 mb-6">
            SPMB<span className="text-blue-600 ml-1">SMK</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Mulai Perjalanan Anda</h2>
          <p className="mt-2 text-sm text-slate-600">Buat akun untuk mendaftar</p>
        </div>

        <form className="mt-8 space-y-6" action={signup}>
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input id="full_name" name="full_name" type="text" required placeholder="Budi Santoso" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" name="email" type="email" required placeholder="email@contoh.com" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" name="password" type="password" required className="h-11 rounded-xl" minLength={6} />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
            Daftar
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
