"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function BabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const jenjang = searchParams.get("jenjang") || "Umum";
  const metode = searchParams.get("metode") || "Video";

  const [materiList, setMateriList] = useState<any[]>([]);
  const [kataKunci, setKataKunci] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "materi_belajar"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      const materiSesuaiMetode = data.filter(m => m.format === metode);
      setMateriList(materiSesuaiMetode);
      setLoading(false);
    });
    return () => unsub();
  }, [metode]);

  const daftarBabUnik = Array.from(new Set(materiList.map(m => m.mapel)));
  const babTampil = daftarBabUnik.filter(bab => 
    bab.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const pilihBab = (babPilihan: string) => {
    router.push(`/subbab?jenjang=${jenjang}&metode=${metode}&bab=${babPilihan}`);
  };

  const tanganiKembali = () => {
    router.push(`/metode?jenjang=${jenjang}`);
  };

  return (
    // Menggunakan pt-28 agar konten turun dan aman dari tombol kembali di HP
    <main className="min-h-screen bg-blue-50 p-4 pt-28 md:p-6 md:pt-24 relative overflow-x-hidden overflow-y-auto font-sans flex flex-col items-center">
      
      {/* Tombol Kembali (left-4 untuk HP) */}
      <button 
        onClick={tanganiKembali} 
        className="absolute top-6 left-4 md:left-6 z-50 bg-white border-4 border-slate-900 px-4 py-2 rounded-xl font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
      >
        <span>⬅️</span> <span className="hidden md:inline">Ganti Metode</span>
      </button>

      <div className="w-full max-w-4xl z-10 mt-4 md:mt-0">
        
        <div className="text-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="bg-pink-200 border-4 border-slate-900 px-3 py-1 rounded-xl font-black text-slate-900 text-sm shadow-[2px_2px_0_0_rgba(15,23,42,1)]">🎓 {jenjang}</span>
            <span className="bg-yellow-200 border-4 border-slate-900 px-3 py-1 rounded-xl font-black text-slate-900 text-sm shadow-[2px_2px_0_0_rgba(15,23,42,1)]">📺 {metode}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">Pilih Bab Materi</h1>
          <p className="font-bold text-slate-600">Mau belajar materi apa hari ini?</p>
        </div>

        <div className="mb-8 relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-2xl">🔍</div>
          <input 
            type="text" 
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            placeholder="Cari bab matematika..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-slate-900 bg-white focus:outline-none focus:border-blue-500 font-black text-lg shadow-[6px_6px_0_0_rgba(15,23,42,1)]"
          />
        </div>

        {loading ? (
          <div className="text-center font-black text-xl animate-pulse">Mencari materi... 📚</div>
        ) : babTampil.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-slate-400 p-10 rounded-3xl text-center shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
            <div className="text-6xl mb-4 grayscale opacity-50">🙈</div>
            <h2 className="text-2xl font-black text-slate-500">Waduh!</h2>
            <p className="font-bold text-slate-400 mt-2">Belum ada materi {metode} untuk pencarian ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {babTampil.map((bab) => (
              <button key={bab} onClick={() => pilihBab(bab as string)} className="bg-white hover:bg-blue-100 text-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-2 active:translate-x-2 transition-all flex flex-col items-start text-left group">
                <div className="bg-blue-300 border-4 border-slate-900 w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl shadow-[4px_4px_0_0_rgba(15,23,42,1)] group-hover:-rotate-12 transition-transform">📘</div>
                <h3 className="text-2xl font-black">{bab}</h3>
                <p className="text-sm font-bold text-slate-500 mt-2">Lihat daftar sub-materi ➔</p>
              </button>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default function BabPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blue-50 flex justify-center items-center font-black text-2xl">Memuat... ⏳</div>}>
      <BabContent />
    </Suspense>
  );
}