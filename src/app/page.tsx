"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import Link from "next/link";

export default function HomePage() {
  const [materiList, setMateriList] = useState<any[]>([]);
  const [filter, setFilter] = useState("Semua");
  
  const [aksesDiberikan, setAksesDiberikan] = useState(false);
  const [sedangMemuatVIP, setSedangMemuatVIP] = useState(true);
  const [inputSandi, setInputSandi] = useState("");
  const [sandiAsli, setSandiAsli] = useState<string | null>(null);
  const [pesanError, setPesanError] = useState("");

  const daftarKategori = ["Semua", "Aljabar", "Kalkulus", "Trigonometri", "Statistika", "Geometri", "Bilangan", "Peluang", "Vektor & Matriks", "Logika"];

  useEffect(() => {
    // Memantau perubahan sandi VIP secara REAL-TIME
    const unsubVip = onSnapshot(doc(db, "pengaturan", "vip"), (docSnap) => {
      if (docSnap.exists()) {
        const sandiTerbaru = docSnap.data().kode;
        setSandiAsli(sandiTerbaru);
        
        // Cek ketat: Cocokkan sandi HP dengan sandi terbaru di server
        const sandiTersimpan = localStorage.getItem("kunci_vip_matfilm");
        if (sandiTersimpan === sandiTerbaru) {
          setAksesDiberikan(true);
        } else {
          setAksesDiberikan(false); // Otomatis tendang keluar kalau admin ubah sandi
        }
      }
      setSedangMemuatVIP(false);
    });

    const q = query(collection(db, "materi_belajar"), orderBy("tanggal", "desc"));
    const unsubMateri = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMateriList(data);
    });

    return () => { unsubVip(); unsubMateri(); };
  }, []);

  const cekSandi = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSandi === sandiAsli) {
      localStorage.setItem("kunci_vip_matfilm", sandiAsli); // Simpan KATA SANDI, bukan status lulus
      setAksesDiberikan(true);
    } else {
      setPesanError("Sandi salah! Pastikan kamu nonton video Mat Film terbaru ya 🙈");
      setInputSandi("");
    }
  };

  const materiTampil = filter === "Semua" ? materiList : materiList.filter(m => m.mapel === filter);

  if (sedangMemuatVIP) {
    return <div className="min-h-screen bg-pink-100 flex justify-center items-center font-black text-2xl">Memuat Gerbang...</div>;
  }

  if (!aksesDiberikan) {
    return (
      <main className="min-h-screen bg-pink-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
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
            <input type="text" value={inputSandi} onChange={(e) => setInputSandi(e.target.value)} placeholder="Ketik Sandi Rahasia..." className="w-full p-4 rounded-2xl border-4 border-slate-900 bg-slate-50 focus:bg-white text-center font-black text-xl outline-none focus:border-pink-500 uppercase" />
            <button type="submit" className="w-full bg-green-400 hover:bg-green-500 text-slate-900 text-xl font-black py-4 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">BUKA GERBANG 🚀</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-50 p-6 font-sans relative overflow-hidden">
      <div className="absolute top-10 left-10 text-6xl text-blue-400 opacity-20 rotate-12">✖️</div>
      <div className="absolute bottom-20 right-20 text-8xl text-pink-400 opacity-20 -rotate-12">➗</div>

      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)] mb-10 z-10 relative mt-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">🎬 Foundations of Math</h1>
          <p className="text-lg font-bold text-slate-600">Katalog referensi sekolah khusus VIP Mat Film!</p>
        </div>
        <Link href="/admin" className="mt-4 md:mt-0 bg-teal-400 hover:bg-teal-500 text-slate-900 font-black px-6 py-3 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">
          ⚙️ Dapur Admin
        </Link>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {daftarKategori.map((kategori) => (
            <button key={kategori} onClick={() => setFilter(kategori)} className={`px-4 py-2 font-black rounded-xl border-4 border-slate-900 transition-all text-sm md:text-base ${filter === kategori ? 'bg-slate-900 text-white shadow-none translate-y-1 translate-x-1' : 'bg-white text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:bg-slate-100'}`}>
              {kategori}
            </button>
          ))}
        </div>

        {materiTampil.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-slate-400 p-10 rounded-3xl text-center"><h2 className="text-2xl font-black text-slate-400">Belum ada materi di cabang ini 🙈</h2></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
            {materiTampil.map((materi) => (
              <div key={materi.id} className="bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:-translate-y-2 transition-transform flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-3xl w-12 h-12 flex items-center justify-center rounded-xl border-4 border-slate-900 ${materi.format === 'Video' ? 'bg-yellow-300' : materi.format === 'Artikel' ? 'bg-blue-300' : 'bg-orange-300'}`}>
                    {materi.format === 'Video' ? '📺' : materi.format === 'Artikel' ? '📄' : '⚙️'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-500 text-xs uppercase tracking-wider">{materi.mapel}</span>
                    <span className="font-black text-pink-500 text-sm">{materi.bab || "Umum"}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex-grow">{materi.judul}</h3>
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