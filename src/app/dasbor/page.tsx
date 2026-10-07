"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function DasborPage() {
  const router = useRouter();
  
  const [pengumuman, setPengumuman] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "pengaturan", "pengumuman"), (docSnap) => {
      if (docSnap.exists()) {
        setPengumuman(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  const pilihJenjang = (jenjang: string) => {
    router.push(`/metode?jenjang=${jenjang}`);
  };

  return (
    // Tambahan pt-24 (padding top) agar konten tidak menabrak tombol kembali di layar HP
    <main className="min-h-screen bg-green-50 p-4 pt-24 md:p-6 md:pt-24 relative overflow-x-hidden overflow-y-auto font-sans flex flex-col items-center justify-center">
      
      {/* Tombol Kembali ke Beranda */}
      <Link href="/" className="absolute top-6 left-4 md:left-6 z-50 bg-white border-4 border-slate-900 px-4 py-2 rounded-xl font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2">
        <span>⬅️</span> <span className="hidden md:inline">Keluar Kelas</span>
      </Link>

      {/* Dekorasi Latar Belakang */}
      <div className="absolute top-10 right-10 text-6xl opacity-30 animate-bounce">🎓</div>
      <div className="absolute bottom-20 left-10 text-7xl opacity-30 animate-pulse">📚</div>

      {/* Kotak Utama - Tambahan mt-4 agar lebih turun sedikit */}
      <div className="w-full max-w-6xl z-10 relative mt-4 md:mt-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: Pengumuman & Leaderboard */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Widget Pengumuman */}
          {pengumuman && pengumuman.aktif && (
            <div className="bg-yellow-200 border-4 border-slate-900 p-5 rounded-3xl shadow-[6px_6px_0_0_rgba(15,23,42,1)] animate-fade-in text-left">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
                <span>📢</span> Pengumuman
              </h2>
              <p className="font-bold text-slate-700 text-sm">{pengumuman.teks}</p>
              {pengumuman.link && (
                <a href={pengumuman.link} target="_blank" rel="noreferrer" className="inline-block mt-3 bg-slate-900 text-white text-xs font-black px-4 py-2 rounded-xl active:translate-y-1">
                  Cek Sekarang ➔
                </a>
              )}
            </div>
          )}

          {/* Widget Leaderboard (Dummy for MVP) */}
          <div className="bg-white border-4 border-slate-900 p-5 rounded-3xl shadow-[6px_6px_0_0_rgba(15,23,42,1)] text-left">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-4 border-b-2 border-slate-100 pb-2">
              <span>🏆</span> Papan Peringkat
            </h2>
            <div className="space-y-3">
              {[
                { nama: "Budi Santoso", poin: 1250, medali: "🥇" },
                { nama: "Siti Aminah", poin: 980, medali: "🥈" },
                { nama: "Andi Saputra", poin: 840, medali: "🥉" },
                { nama: "Rini Wati", poin: 720, medali: "✨" },
              ].map((user, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border-2 border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                    <span className="text-lg">{user.medali}</span> {user.nama}
                  </div>
                  <span className="font-black text-pink-500 text-xs bg-pink-100 px-2 py-1 rounded-md">{user.poin} XP</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs font-bold text-slate-400">Belajar lebih giat untuk naik peringkat!</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Kotak Utama Pilih Jenjang */}
        <div className="lg:col-span-2 bg-white border-4 md:border-8 border-slate-900 p-6 md:p-10 rounded-3xl md:rounded-[3rem] text-center shadow-[8px_8px_0_0_rgba(15,23,42,1)] md:shadow-[12px_12px_0_0_rgba(15,23,42,1)]">
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">Pilih Jenjangmu!</h1>
          <p className="font-bold text-slate-600 mb-8 text-sm md:text-lg">
            Sesuaikan materi dengan tingkat pendidikanmu sekarang 👇
          </p>

          {/* Grid Tombol Pilihan Jenjang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <button onClick={() => pilihJenjang("Umum")} className="bg-yellow-300 hover:bg-yellow-400 text-slate-900 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all group">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🌍</div>
              <h2 className="text-xl font-black">Umum (Semua)</h2>
              <p className="text-xs font-bold mt-1 opacity-80">Jelajahi seluruh materi</p>
            </button>
            <button onClick={() => pilihJenjang("SD")} className="bg-red-300 hover:bg-red-400 text-slate-900 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all group">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎒</div>
              <h2 className="text-xl font-black">Tingkat SD</h2>
              <p className="text-xs font-bold mt-1 opacity-80">Kelas 1 s.d. 6</p>
            </button>
            <button onClick={() => pilihJenjang("SMP")} className="bg-blue-300 hover:bg-blue-400 text-slate-900 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all group">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏫</div>
              <h2 className="text-xl font-black">Tingkat SMP</h2>
              <p className="text-xs font-bold mt-1 opacity-80">Kelas 7 s.d. 9</p>
            </button>
            <button onClick={() => pilihJenjang("SMA")} className="bg-slate-300 hover:bg-slate-400 text-slate-900 p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all group">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎓</div>
              <h2 className="text-xl font-black">Tingkat SMA</h2>
              <p className="text-xs font-bold mt-1 opacity-80">Kelas 10 s.d. 12</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}