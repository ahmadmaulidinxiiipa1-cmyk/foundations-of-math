"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function IntiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Menarik seluruh jejak pilihan siswa dari URL
  const jenjang = searchParams.get("jenjang") || "Umum";
  const metode = searchParams.get("metode") || "Video";
  const bab = searchParams.get("bab") || "Umum";
  const subbab = searchParams.get("subbab") || "Umum";

  // State Halaman
  const [materi, setMateri] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [porsi, setPorsi] = useState("Sedang"); // State Porsi: Singkat / Sedang / Panjang

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "materi_belajar"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      
      // Filter super spesifik untuk mencari 1 materi inti
      const materiDitemukan = data.find(m => 
        m.format === metode && 
        m.mapel === bab && 
        (m.bab || "Umum") === subbab
      );
      
      setMateri(materiDitemukan || null);
      setLoading(false);
    });
    return () => unsub();
  }, [metode, bab, subbab]);

  // Fungsi mengubah link YouTube biasa menjadi Link Embed agar bisa diputar di dalam Web
  const dapatkanEmbedYoutube = (url: string) => {
    if (!url) return "";
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const tanganiKembali = () => {
    router.push(`/subbab?jenjang=${jenjang}&metode=${metode}&bab=${bab}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-emerald-50 flex justify-center items-center font-black text-2xl">Membuka Ruang Kelas... ⏳</div>;
  }

  if (!materi) {
    return (
      <main className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white border-4 border-slate-900 p-8 rounded-3xl max-w-sm shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
          <div className="text-6xl mb-4">🏜️</div>
          <h2 className="text-2xl font-black text-slate-900">Materi Belum Siap</h2>
          <p className="font-bold text-slate-500 mt-2 mb-6">Isi materi utama atau link tautannya terlebih dahulu di dapur admin ya!</p>
          <button onClick={tanganiKembali} className="w-full bg-yellow-300 border-4 border-slate-900 py-3 rounded-xl font-black shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1">⬅️ Kembali</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50 p-4 md:p-6 font-sans flex flex-col items-center py-20 relative">
      
      {/* Tombol Kembali ke Sub-bab */}
      <button 
        onClick={tanganiKembali} 
        className="absolute top-6 left-6 z-50 bg-white border-4 border-slate-900 px-4 py-2 rounded-xl font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer text-sm md:text-base"
      >
        <span>⬅️</span> <span>Kembali</span>
      </button>

      <div className="w-full max-w-4xl z-10 space-y-6">
        
        {/* Header Ruang Belajar */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 leading-tight">{materi.judul}</h1>
          <p className="font-black text-pink-500 text-sm md:text-base bg-pink-50 px-4 py-1.5 rounded-xl border-2 border-pink-300 inline-block mt-2">
            📂 {bab} ➔ {subbab} ({jenjang})
          </p>
        </div>

        {/* TAB PILIHAN PORSI MATERI (Student-Centered Learning) */}
        <div className="bg-white border-4 border-slate-900 p-2 rounded-2xl max-w-md mx-auto grid grid-cols-3 gap-2 shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
          {["Singkat", "Sedang", "Detail"].map((p) => (
            <button 
              key={p} 
              onClick={() => setPorsi(p)} 
              className={`py-2 text-xs md:text-sm font-black rounded-xl border-2 transition-all cursor-pointer ${porsi === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'}`}
            >
              {p === "Singkat" ? "⚡ Singkat" : p === "Sedang" ? "📚 Sedang" : "🧠 Detail"}
            </button>
          ))}
        </div>

        {/* AREA INTI KONTEN UTAMA */}
        <div className="bg-white border-4 md:border-8 border-slate-900 rounded-[2rem] p-4 md:p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] md:shadow-[12px_12px_0_0_rgba(15,23,42,1)] overflow-hidden">
          
          {/* Tampilan Kondisional Berdasarkan Porsi yang Dipilih */}
          {porsi === "Singkat" && (
            <div className="bg-yellow-50 border-4 border-dashed border-yellow-400 p-4 rounded-2xl mb-4 font-bold text-slate-700 text-sm md:text-base leading-relaxed">
              🚀 <span className="font-black text-slate-900">Rangkuman Kilat (1-2 Menit):</span>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Fokus pada inti rumus utama dan konsep kilat.</li>
                <li>Gunakan visualisasi dasar untuk pemahaman cepat.</li>
                <li>Tonton video utama di bawah bagian poin-poin penting ini!</li>
              </ul>
            </div>
          )}

          {porsi === "Detail" && (
            <div className="bg-purple-50 border-4 border-dashed border-purple-400 p-4 rounded-2xl mb-4 font-bold text-slate-700 text-sm md:text-base leading-relaxed">
              🧠 <span className="font-black text-slate-900">Kupas Tuntas Rumus & Contoh Soal Lengkap:</span>
              <p className="mt-1">Sangat disarankan untuk mencatat pembuktian rumus dan trik pengerjaan yang ada di dalam materi penuh di bawah ini.</p>
            </div>
          )}

          {/* AREA BOX PLAYER / TAMPILAN MEDIA */}
          <div className="w-full aspect-video bg-slate-900 rounded-xl border-4 border-slate-900 overflow-hidden relative shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
            {metode === "Video" && materi.link.includes("youtube.com") || materi.link.includes("youtu.be") ? (
              <iframe 
                src={dapatkanEmbedYoutube(materi.link)} 
                title={materi.judul}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-800 text-white">
                <span className="text-5xl mb-2">{metode === "Artikel" ? "📄" : "⚙️"}</span>
                <p className="font-black text-lg md:text-xl mb-4">Materi siap dipelajari secara interaktif!</p>
                <a 
                  href={materi.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-green-400 hover:bg-green-500 text-slate-900 font-black px-6 py-3 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 transition-all uppercase text-sm"
                >
                  Buka {metode} Sekarang 🚀
                </a>
              </div>
            )}
          </div>
        </div>

        {/* SEKSI KUIS MANDIRI (Asynchronous Learning) */}
        <div className="bg-yellow-100 border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
            <span>🎮</span> Uji Pemahamanmu! (Kuis Mandiri)
          </h2>
          <p className="font-bold text-slate-600 text-xs md:text-sm mb-4 leading-relaxed">
            Pilih tipe tantangan di bawah untuk menguji seberapa hebat kamu menaklukkan bab ini tanpa perlu diawasi admin secara live!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Kuis Santai */}
            <a 
              href="https://blooket.com" // Tempat tautan kuis santai (Blooket/Wordwall)
              target="_blank" 
              rel="noreferrer" 
              className="bg-white hover:bg-orange-50 text-slate-900 p-4 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-3 group text-left"
            >
              <div className="bg-orange-300 border-2 border-slate-900 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0_0_rgba(15,23,42,1)] group-hover:rotate-12 transition-transform">🥳</div>
              <div>
                <h3 className="font-black text-base md:text-lg">Kuis Santai (Mode Game)</h3>
                <p className="text-xs font-bold text-slate-500">Main di Blooket / Wordwall</p>
              </div>
            </a>

            {/* Kuis Serius */}
            <a 
              href="https://quizizz.com" // Tempat tautan kuis serius (Quizizz/Google Form)
              target="_blank" 
              rel="noreferrer" 
              className="bg-white hover:bg-purple-50 text-slate-900 p-4 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-3 group text-left"
            >
              <div className="bg-purple-300 border-2 border-slate-900 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0_0_rgba(15,23,42,1)] group-hover:rotate-12 transition-transform">📝</div>
              <div>
                <h3 className="font-black text-base md:text-lg">Kuis Serius (Mode Fokus)</h3>
                <p className="text-xs font-bold text-slate-500">Evaluasi Tenang di Quizizz / GForms</p>
              </div>
            </a>

          </div>
        </div>

      </div>
    </main>
  );
}

export default function IntiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-emerald-50 flex justify-center items-center font-black text-2xl">Memuat... ⏳</div>}>
      <IntiContent />
    </Suspense>
  );
}