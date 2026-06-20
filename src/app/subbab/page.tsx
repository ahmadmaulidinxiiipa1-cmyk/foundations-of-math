"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function SubBabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const jenjang = searchParams.get("jenjang") || "Umum";
  const metode = searchParams.get("metode") || "Video";
  const bab = searchParams.get("bab") || "Umum";

  const [materiList, setMateriList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "materi_belajar"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      const materiSesuai = data.filter(m => m.format === metode && m.mapel === bab);
      setMateriList(materiSesuai);
      setLoading(false);
    });
    return () => unsub();
  }, [metode, bab]);

  const daftarSubBabUnik = Array.from(new Set(materiList.map(m => m.bab || "Umum")));

  const pilihSubBab = (subBabPilihan: string) => {
    router.push(`/inti?jenjang=${jenjang}&metode=${metode}&bab=${bab}&subbab=${subBabPilihan}`);
  };

  const tanganiKembali = () => {
    router.push(`/bab?jenjang=${jenjang}&metode=${metode}`);
  };

  return (
    // Menggunakan pt-28 agar tag-tag pilihan di atas tidak tertutup tombol kembali di HP
    <main className="min-h-screen bg-teal-50 p-4 pt-28 md:p-6 md:pt-24 relative overflow-x-hidden overflow-y-auto font-sans flex flex-col items-center">
      
      {/* Tombol Kembali (left-4 untuk HP) */}
      <button 
        onClick={tanganiKembali} 
        className="absolute top-6 left-4 md:left-6 z-50 bg-white border-4 border-slate-900 px-4 py-2 rounded-xl font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
      >
        <span>⬅️</span> <span className="hidden md:inline">Ganti Bab</span>
      </button>

      <div className="w-full max-w-4xl z-10 mt-4 md:mt-0">
        
        <div className="text-center mb-10">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="bg-pink-200 border-4 border-slate-900 px-3 py-1 rounded-xl font-black text-slate-900 text-xs md:text-sm shadow-[2px_2px_0_0_rgba(15,23,42,1)]">🎓 {jenjang}</span>
            <span className="bg-yellow-200 border-4 border-slate-900 px-3 py-1 rounded-xl font-black text-slate-900 text-xs md:text-sm shadow-[2px_2px_0_0_rgba(15,23,42,1)]">📺 {metode}</span>
            <span className="bg-blue-200 border-4 border-slate-900 px-3 py-1 rounded-xl font-black text-slate-900 text-xs md:text-sm shadow-[2px_2px_0_0_rgba(15,23,42,1)]">📘 {bab}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">Pilih Sub-Materi</h1>
          <p className="font-bold text-slate-600">Mari kita pecah materinya jadi lebih kecil dan gampang dicerna! 🍕</p>
        </div>

        {loading ? (
          <div className="text-center font-black text-xl animate-pulse">Memuat daftar sub-materi... ⏳</div>
        ) : daftarSubBabUnik.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-slate-400 p-10 rounded-3xl text-center shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
            <div className="text-6xl mb-4 grayscale opacity-50">🚧</div>
            <h2 className="text-2xl font-black text-slate-500">Sub-materi Kosong</h2>
            <p className="font-bold text-slate-400 mt-2">Sepertinya admin belum memecah materi untuk bab ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {daftarSubBabUnik.map((subBab) => (
              <button key={subBab as string} onClick={() => pilihSubBab(subBab as string)} className="bg-white hover:bg-teal-100 text-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-2 active:translate-x-2 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-teal-300 border-4 border-slate-900 w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center text-2xl shadow-[4px_4px_0_0_rgba(15,23,42,1)] group-hover:scale-110 transition-transform">🧩</div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black">{subBab}</h3>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Topik Spesifik</p>
                  </div>
                </div>
                <div className="text-2xl font-black opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">➔</div>
              </button>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default function SubBabPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-teal-50 flex justify-center items-center font-black text-2xl">Memuat... ⏳</div>}>
      <SubBabContent />
    </Suspense>
  );
}