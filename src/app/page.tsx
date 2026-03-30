import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3);
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden max-w-md mx-auto sm:border-x sm:border-slate-200 sm:shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

      {/* Navbar */}
      <header className="flex h-16 items-center px-4 backdrop-blur-md bg-white/70 border-b border-white/20 sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center font-bold text-xl tracking-tight text-blue-900">
          SPMB<span className="text-blue-600 ml-1">SMK</span>
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Link href="/auth/login">
            <Button variant="ghost" className="font-medium text-sm px-3">Masuk</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 rounded-full px-4 text-sm">
              Daftar
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-20">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          Pendaftaran 2026/2027 Dibuka
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Wujudkan Masa Depan <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Lebih Cerah
          </span>
        </h1>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Selamat datang di Sistem Penerimaan Murid Baru (SPMB). Amankan kursi Anda di SMK kami melalui pendaftaran terpadu dengan Pemindaian Dokumen AI instan.
        </p>
        <div className="mt-8 flex flex-col gap-3 w-full">
          <Link href="/auth/register" className="w-full">
            <Button className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02]">
              Mulai Pendaftaran
            </Button>
          </Link>
          <Link href="#features" className="w-full">
            <Button variant="outline" className="w-full h-12 text-base rounded-full border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all">
              Pelajari Lebih Lanjut
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <section id="features" className="w-full mt-24 flex flex-col gap-6 text-left">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pemindaian Dokumen Cerdas</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Ekstrak detail Kartu Keluarga (KK) Anda langsung dengan AI kami tanpa harus mengunggah foto ke server.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">100% Aman</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Privasi Anda terlindungi. Kami menggunakan pemrosesan di sisi klien untuk memastikan dokumen sensitif tetap berada di perangkat Anda.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dasbor Real-time</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Pantau status pendaftaran secara langsung, unduh kartu ujian resmi, dan akses berbagai pengumuman penting.</p>
          </div>
        </section>

        {announcements && announcements.length > 0 && (
          <section className="w-full mt-24 text-left mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">📢</span>
              Pengumuman Terbaru
            </h2>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/40">
                  <div className="flex flex-col gap-1 mb-3">
                    <h3 className="text-lg font-bold text-blue-900 leading-snug">{ann.title}</h3>
                    <span className="text-xs font-medium text-slate-500 w-fit">
                      {new Date(ann.published_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/50">
        © {new Date().getFullYear()} SPMB SMK Online. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}

