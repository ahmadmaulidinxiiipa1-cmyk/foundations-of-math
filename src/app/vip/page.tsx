"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VipPage() {
  const router = useRouter();
  
  const [inputSandi, setInputSandi] = useState("");
  const [sandiAsli, setSandiAsli] = useState<string | null>(null);
  const [pesanError, setPesanError] = useState("");
  const [loading, setLoading] = useState(true);

  const [links, setLinks] = useState({ youtube: "", instagram: "", tiktok: "", facebook: "" });

  useEffect(() => {
    const unsubVip = onSnapshot(doc(db, "pengaturan", "vip"), (docSnap) => {
      if (docSnap.exists()) {
        const sandiTerbaru = docSnap.data().kode;
        setSandiAsli(sandiTerbaru);
        
        const sandiTersimpan = localStorage.getItem("kunci_vip_matfilm");
        if (sandiTersimpan === sandiTerbaru) {
          router.push("/dasbor");
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    const unsubMedsos = onSnapshot(doc(db, "pengaturan", "medsos"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLinks({
          youtube: data.youtube || "",
          instagram: data.instagram || "",
          tiktok: data.tiktok || "",
          facebook: data.facebook || ""
        });
      }
    });

    return () => { unsubVip(); unsubMedsos(); };
  }, [router]);

  const cekSandi = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSandi === sandiAsli) {
      localStorage.setItem("kunci_vip_matfilm", sandiAsli);
      router.push("/dasbor");
    } else {
      setPesanError("Sandi salah! Coba cek lagi konten terbaru Mat Film ya 🙈");
      setInputSandi("");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-pink-100 flex justify-center items-center font-black text-2xl">Memuat Gerbang VIP... ⏳</div>;
  }

  return (
    <main className="min-h-screen bg-pink-100 flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      
      <Link href="/" className="absolute top-6 left-6 z-50 bg-white border-4 border-slate-900 px-4 py-2 rounded-xl font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2">
        <span>⬅️</span> <span className="hidden md:inline">Kembali</span>
      </Link>

      <div className="bg-white border-4 md:border-8 border-slate-900 p-6 md:p-10 rounded-3xl md:rounded-[3rem] w-full max-w-md md:max-w-lg text-center shadow-[8px_8px_0_0_rgba(15,23,42,1)] md:shadow-[12px_12px_0_0_rgba(15,23,42,1)] z-10 relative mt-8 md:mt-0">
        
        <div className="text-6xl mb-4">🎟️</div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">Area Khusus VIP</h1>
        
        {/* KOTAK PENGUMUMAN BARU YANG LEBIH MENARIK */}
        <div className="font-bold text-slate-600 mb-6 text-sm md:text-base text-left bg-yellow-50 p-4 md:p-5 border-4 border-dashed border-slate-900 rounded-2xl shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
          <p className="mb-3 leading-relaxed">
            🔒 <span className="text-slate-900 font-black text-lg">Akses Terkunci!</span> 
            <br/>
            Untuk menjaga keeksklusifan, sandi masuk ke ruang belajar ini <span className="text-red-500 font-black border-b-2 border-red-500">diubah sewaktu-waktu</span>.
          </p>
          <div className="bg-white p-3 border-2 border-slate-900 rounded-xl leading-relaxed">
            💡 <span className="text-pink-600 font-black">Cara Dapat Sandi Terbarunya:</span> 
            <br/>
            Kunci rahasia terbaru selalu dibagikan diam-diam di dalam konten video/postingan. Pastikan kamu sudah <em>follow</em> & <em>subscribe</em> biar nggak ketinggalan sandi barunya! 👇
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          {links.youtube && (
            <a href={links.youtube} target="_blank" rel="noreferrer" className="bg-red-500 hover:bg-red-600 text-white font-black py-2.5 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 transition-all text-sm md:text-base">
              ▶️ Cek YouTube Kami
            </a>
          )}
          {links.instagram && (
            <a href={links.instagram} target="_blank" rel="noreferrer" className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-black py-2.5 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 transition-all text-sm md:text-base">
              📸 Follow Instagram
            </a>
          )}
          {links.tiktok && (
            <a href={links.tiktok} target="_blank" rel="noreferrer" className="bg-black hover:bg-slate-900 text-white font-black py-2.5 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 transition-all text-sm md:text-base">
              🎵 Pantau TikTok
            </a>
          )}
          {links.facebook && (
            <a href={links.facebook} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 transition-all text-sm md:text-base">
              👥 Gabung Facebook
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6 opacity-50">
          <div className="h-1 flex-1 bg-slate-900 rounded-full"></div>
          <span className="font-black text-slate-900 text-xs uppercase tracking-widest">Gembok Masuk</span>
          <div className="h-1 flex-1 bg-slate-900 rounded-full"></div>
        </div>

        {pesanError && <div className="bg-red-400 text-slate-900 font-bold p-3 rounded-xl border-4 border-slate-900 mb-4 text-sm animate-bounce">{pesanError}</div>}

        <form onSubmit={cekSandi} className="flex flex-col gap-4">
          <input 
            type="text" 
            value={inputSandi}
            onChange={(e) => setInputSandi(e.target.value)}
            placeholder="Ketik Sandi Rahasia..." 
            className="w-full p-4 rounded-2xl border-4 border-slate-900 bg-slate-50 focus:bg-white text-center font-black text-lg md:text-xl outline-none focus:border-pink-500 uppercase"
          />
          <button type="submit" className="w-full bg-green-400 hover:bg-green-500 text-slate-900 text-lg md:text-xl font-black py-4 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">
            BUKA GERBANG 🚀
          </button>
        </form>

      </div>
    </main>
  );
}