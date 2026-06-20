"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MetodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const jenjang = searchParams.get("jenjang") || "Umum";

  const pilihMetode = (metode: string) => {
    router.push(`/bab?jenjang=${jenjang}&metode=${metode}`);
  };

  return (
    // Tambahan pt-28 (padding top) agar konten sangat aman dari tombol di layar HP
    <main className="min-h-screen bg-purple-50 p-4 pt-28 md:p-6 md:pt-24 relative overflow-x-hidden overflow-y-auto font-sans flex flex-col items-center justify-center">
      
      {/* Tombol Kembali (Posisi disesuaikan jadi left-4 di HP) */}
      <Link href="/dasbor" className="absolute top-6 left-4 md:left-6 z-50 bg-white border-4 border-slate-900 px-4 py-2 rounded-xl font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2">
        <span>⬅️</span> <span className="hidden md:inline">Kembali</span>
      </Link>

      {/* Dekorasi Latar */}
      <div className="absolute top-10 right-10 text-6xl opacity-30 animate-bounce">🎨</div>
      <div className="absolute bottom-20 left-10 text-7xl opacity-30 animate-pulse">🎧</div>

      {/* Kotak Utama - Tambahan mt-6 untuk memberi jarak ekstra dari atas */}
      <div className="bg-white border-4 md:border-8 border-slate-900 p-6 md:p-10 rounded-3xl md:rounded-[3rem] w-full max-w-md md:max-w-4xl text-center shadow-[8px_8px_0_0_rgba(15,23,42,1)] md:shadow-[12px_12px_0_0_rgba(15,23,42,1)] z-10 relative mt-6 md:mt-0">
        
        {/* Label Jenjang */}
        <div className="inline-block bg-pink-200 border-4 border-slate-900 px-4 py-1.5 rounded-xl font-black text-slate-900 mb-6 -rotate-2 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
          Target Materi: {jenjang} 🎓
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">Gimana Cara Belajarmu?</h1>
        <p className="font-bold text-slate-600 mb-8 text-sm md:text-lg">
          Setiap orang punya gaya belajar yang unik. Pilih yang paling nyaman buat otakmu! 👇
        </p>

        {/* Grid Pilihan Metode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          <button onClick={() => pilihMetode("Video")} className="bg-yellow-300 hover:bg-yellow-400 text-slate-900 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all group flex flex-col items-center">
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📺</div>
            <h2 className="text-xl font-black">Video</h2>
            <p className="text-xs font-bold mt-1 opacity-80 text-center">Nonton penjelasan bergambar</p>
          </button>

          <button onClick={() => pilihMetode("Artikel")} className="bg-blue-300 hover:bg-blue-400 text-slate-900 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all group flex flex-col items-center">
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📄</div>
            <h2 className="text-xl font-black">Teks Blog</h2>
            <p className="text-xs font-bold mt-1 opacity-80 text-center">Baca artikel santai</p>
          </button>

          <button onClick={() => pilihMetode("PhET")} className="bg-orange-300 hover:bg-orange-400 text-slate-900 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all group flex flex-col items-center">
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
            <h2 className="text-xl font-black">Simulasi</h2>
            <p className="text-xs font-bold mt-1 opacity-80 text-center">Praktek peraga digital</p>
          </button>

          <button disabled className="bg-slate-100 text-slate-400 p-6 rounded-2xl border-4 border-slate-300 transition-all cursor-not-allowed flex flex-col items-center">
            <div className="text-5xl mb-3 grayscale opacity-50">🎧</div>
            <h2 className="text-xl font-black">Podcast</h2>
            <p className="text-xs font-bold mt-1">Segera hadir!</p>
          </button>

        </div>
      </div>
    </main>
  );
}

export default function MetodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-50 flex justify-center items-center font-black text-2xl">Memuat... ⏳</div>}>
      <MetodeContent />
    </Suspense>
  );
}