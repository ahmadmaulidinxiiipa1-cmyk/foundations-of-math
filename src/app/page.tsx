"use client";

import Link from "next/link";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function BerandaPage() {
  const [bukaPesan, setBukaPesan] = useState(false);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  const kirimPesan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !pesan) return alert("Nama dan pesan tidak boleh kosong ya!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "pesan_masuk"), {
        nama: nama,
        pesan: pesan,
        tanggal: new Date().toISOString()
      });
      alert("Yey! Pesanmu berhasil terbang ke Admin 🚀");
      setNama("");
      setPesan("");
      setBukaPesan(false);
    } catch (error) {
      alert("Yah, pesan gagal dikirim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-sky-100 flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans">
      
      {/* Dekorasi Latar Belakang (Otomatis membesar dan bertambah banyak di Laptop) */}
      <div className="absolute top-10 left-5 md:top-20 md:left-20 text-5xl md:text-7xl text-blue-400 opacity-40 animate-bounce">✖️</div>
      <div className="absolute bottom-24 right-5 md:bottom-20 md:right-20 text-6xl md:text-8xl text-pink-400 opacity-40 animate-pulse">➗</div>
      <div className="absolute top-1/4 right-5 md:top-10 md:right-1/3 text-6xl md:text-7xl text-yellow-400 opacity-40 -rotate-12">➕</div>
      <div className="absolute bottom-1/4 left-5 md:bottom-10 md:left-1/3 text-5xl md:text-6xl text-green-400 opacity-40 rotate-12">➖</div>
      <div className="hidden md:block absolute top-1/2 left-10 text-6xl text-purple-400 opacity-30 font-black">π</div>
      <div className="hidden md:block absolute bottom-1/3 right-12 text-6xl text-orange-400 opacity-30 font-black">∑</div>

      {/* KOTAK UTAMA (Proporsional di HP, Melebar Menjadi 2 Kolom di Laptop) */}
      <div className="bg-white border-4 md:border-8 border-slate-900 p-6 md:p-12 rounded-3xl md:rounded-[3rem] w-full max-w-sm md:max-w-4xl shadow-[8px_8px_0_0_rgba(15,23,42,1)] md:shadow-[16px_16px_0_0_rgba(15,23,42,1)] z-10 relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center text-center md:text-left">
        
        {/* Kolom Kiri (Di Laptop) / Bagian Atas (Di HP) */}
        <div>
          <span className="hidden md:inline-block bg-yellow-300 border-4 border-slate-900 px-4 py-1.5 rounded-xl font-black text-slate-900 mb-4 -rotate-2">
            LEARNING HUB 🧑‍💻
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-snug md:leading-tight tracking-wide">
            Selamat Datang di <br/>
            <span className="text-pink-500 bg-pink-100 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl border-4 border-pink-500 inline-block mt-2 md:mt-3">
              Foundations of Math
            </span>
          </h1>
          <p className="text-base md:text-xl font-bold text-slate-600 mb-4 md:mb-0 leading-relaxed">
            Ruang belajar matematika yang super interaktif dan menyenangkan. 
            Siap menaklukkan angka dan rumus bersama Mat Film? 🚀
          </p>
        </div>

        {/* Kolom Kanan (Di Laptop) / Bagian Bawah (Di HP) */}
        <div className="bg-slate-50 md:bg-yellow-100 border-4 border-dashed md:border-4 md:border-solid border-slate-300 md:border-slate-900 p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col justify-center h-full md:shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
          <p className="hidden md:block text-center font-black text-slate-800 text-lg mb-6">
            Sudah siap mendapatkan akses materi eksklusif? Yuk masuk ke kelas! 👇
          </p>
          <Link href="/vip" className="block w-full bg-green-400 hover:bg-green-500 text-slate-900 text-lg md:text-2xl font-black p-4 md:p-6 rounded-2xl border-4 border-slate-900 text-center shadow-[6px_6px_0_0_rgba(15,23,42,1)] md:shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all uppercase tracking-wide">
            Mulai Belajar Sekarang!
          </Link>
        </div>

      </div>

      {/* Tombol Melayang untuk Buka Kotak Pesan */}
      <button 
        onClick={() => setBukaPesan(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-white hover:bg-slate-100 text-3xl md:text-4xl p-4 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
        title="Pesan untuk Admin"
      >
        💬
      </button>

      {/* KOTAK PESAN (POPUP MODAL) */}
      {bukaPesan && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border-4 border-slate-900 p-6 rounded-3xl w-full max-w-sm relative shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
            <button 
              onClick={() => setBukaPesan(false)}
              className="absolute -top-3 -right-3 bg-red-400 hover:bg-red-500 text-slate-900 border-4 border-slate-900 w-10 h-10 rounded-full font-black text-xl flex items-center justify-center shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              X
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <span>📬</span> Kirim Pesan ke Admin
            </h2>
            <form onSubmit={kirimPesan} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-sm">Nama Panggilan</label>
                <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Misal: Budi" className="w-full p-3 rounded-xl border-4 border-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 font-bold" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-sm">Pesan / Saran</label>
                <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} placeholder="Tulis pesan atau kendalamu di sini..." rows={4} className="w-full p-3 rounded-xl border-4 border-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-pink-500 font-bold resize-none" />
              </div>
              <button type="submit" disabled={loading} className={`w-full text-slate-900 text-lg font-black py-3 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 uppercase transition-all ${loading ? 'bg-slate-300' : 'bg-pink-400 hover:bg-pink-500'}`}>
                {loading ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}