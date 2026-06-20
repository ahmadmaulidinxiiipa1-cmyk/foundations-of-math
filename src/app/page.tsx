"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import Link from "next/link";

export default function HomePage() {
  const [materiList, setMateriList] = useState<any[]>([]);
  const [filter, setFilter] = useState("Semua");
  
  // State untuk VIP
  const [aksesDiberikan, setAksesDiberikan] = useState(false);
  const [inputSandi, setInputSandi] = useState("");
  const [sandiAsli, setSandiAsli] = useState("");
  const [pesanError, setPesanError] = useState("");

  useEffect(() => {
    // 1. Cek apakah HP/Browser ini sudah pernah masuk VIP sebelumnya
    if (localStorage.getItem("vip_foundations_math") === "lulus") {
      setAksesDiberikan(true);
    }

    // 2. Ambil Sandi Rahasia terbaru dari Firebase
    const unsubVip = onSnapshot(doc(db, "pengaturan", "vip"), (docSnap) => {
      if (docSnap.exists()) setSandiAsli(docSnap.data().kode);
    });

    // 3. Ambil Daftar Materi
    const q = query(collection(db, "materi_belajar"), orderBy("tanggal", "desc"));
    const unsubMateri = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMateriList(data);
    });

    return () => { unsubVip(); unsubMateri(); };
  }, []);

  // Fungsi Mengecek Sandi yang dimasukkan Pengunjung
  const cekSandi = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSandi === sandiAsli) {
      // Jika benar, simpan di ingatan browser supaya besok tidak usah masukin lagi
      localStorage.setItem("vip_foundations_math", "lulus");
      setAksesDiberikan(true);
    } else {
      setPesanError("Sandi salah, hayo belum nonton Mat Film ya? 🙈");
      setInputSandi("");
    }
  };

  const materiTampil = filter === "Semua" ? materiList : materiList.filter(m => m.mapel === filter);

  // ==========================================
  // TAMPILAN 1: GERBANG VIP (Jika Belum Akses)
  // ==========================================
  if (!aksesDiberikan) {
    return (
      <main className="min-h-screen bg-pink-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Dekorasi Layar VIP */}
        <div className="absolute top-10 left-10 text-6xl opacity-30 animate-bounce">🎬</div>
        <div className="absolute bottom-20 right-10 text-7xl opacity-30 animate-pulse">🍿</div>

        <div className="bg-white border-4 border-slate-900 p-8 rounded-3xl w-full max-w-md text-center shadow-[8px_8px_0_0_rgba(15,23,42,1)] z-10">
          <div className="text-6xl mb-4">🎟️</div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Area Khusus VIP</h1>
          <p className="font-bold text-slate-600 mb-6 text-sm">
            Website ini terkunci! Masukkan kode rahasia dari YouTube <span className="text-pink-600">Mat Film</span> untuk masuk.
          </p>

          {pesanError && <div className="bg-red-400 text-slate-900 font-bold p-3 rounded-xl border-4 border-slate-900 mb-4 animate-shake">{pesanError}</div>}

          <form onSubmit={cekSandi} className="flex flex-col gap-4">
            <input 
              type="text" 
              value={inputSandi}
              onChange={(e) => setInputSandi(e.target.value)}
              placeholder="Ketik Sandi Rahasia..." 
              className="w-full p-4 rounded-2xl border-4 border-slate-900 bg-slate-50 focus:bg-white text-center font-black text-xl outline-none focus:border-pink-500 uppercase"
            />
            <button type="submit" className="w-full bg-green-400 hover:bg-green-500 text-slate-900 text-xl font-black py-4 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">
              BUKA GERBANG 🚀
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ==========================================
  // TAMPILAN 2: HALAMAN UTAMA (Jika Lulus VIP)
  // ==========================================
  return (
    <main className="min-h-screen bg-yellow-50 p-6 font-sans relative overflow-hidden">
      <div className="absolute top-10 left-10 text-6xl text-blue-400 opacity-20 rotate-12">✖️</div>
      <div className="absolute bottom-20 right-20 text-8xl text-pink-400 opacity-20 -rotate-12">➗</div>

      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)] mb-10 z-10 relative mt-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">🎬 Foundations of Math</h1>
          <p className="text-lg font-bold text-slate-600">Katalog belajar eksklusif untuk VIP Mat Film!</p>
        </div>
        <Link href="/login" className="mt-4 md:mt-0 bg-teal-400 hover:bg-teal-500 text-slate-900 font-black px-6 py-3 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">
          🔐 Portal Admin
        </Link>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {["Semua", "Aljabar", "Kalkulus", "Trigonometri", "Statistika"].map((kategori) => (
            <button key={kategori} onClick={() => setFilter(kategori)} className={`px-6 py-3 font-black rounded-xl border-4 border-slate-900 transition-all ${filter === kategori ? 'bg-slate-900 text-white shadow-none translate-y-1 translate-x-1' : 'bg-white text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:bg-slate-100'}`}>
              {kategori}
            </button>
          ))}
        </div>

        {materiTampil.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-slate-400 p-10 rounded-3xl text-center"><h2 className="text-2xl font-black text-slate-400">Belum ada materi di sini 🙈</h2></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materiTampil.map((materi) => (
              <div key={materi.id} className="bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:-translate-y-2 transition-transform flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-3xl w-12 h-12 flex items-center justify-center rounded-xl border-4 border-slate-900 ${materi.format === 'Video' ? 'bg-yellow-300' : materi.format === 'Artikel' ? 'bg-blue-300' : 'bg-orange-300'}`}>
                    {materi.format === 'Video' ? '📺' : materi.format === 'Artikel' ? '📄' : '⚙️'}
                  </span>
                  <span className="font-bold text-slate-500 text-sm uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg border-2 border-slate-200">{materi.mapel}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 line-clamp-2">{materi.judul}</h3>
                <p className="text-slate-600 font-bold mb-6 flex-grow">Format: {materi.format}</p>
                <a href={materi.link} target="_blank" rel="noreferrer" className={`block w-full text-center font-black py-3 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all ${materi.format === 'Video' ? 'bg-yellow-400 hover:bg-yellow-500' : materi.format === 'Artikel' ? 'bg-blue-400 hover:bg-blue-500' : 'bg-orange-400 hover:bg-orange-500'} text-slate-900`}>
                  MULAI BELAJAR 🚀
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}