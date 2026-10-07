"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function BerandaPage() {
  const router = useRouter();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [kontak, setKontak] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [terkirim, setTerkirim] = useState(false);

  const tanganiKirimPesan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Coba interpretasikan sebagai kredensial admin (email:password yang dipisah | )
    const parts = pesan.split("|");
    if (parts.length === 2 && kontak.includes("@")) {
      try {
        await signInWithEmailAndPassword(auth, kontak, parts[1].trim());
        router.push("/admin");
        return;
      } catch {
        // bukan admin, lanjut simpan sebagai pesan biasa
      }
    }

    try {
      await addDoc(collection(db, "pesan_masuk"), {
        nama,
        email: kontak,
        pesan,
        tanggal: new Date().toISOString()
      });
      setTerkirim(true);
      setNama(""); setKontak(""); setPesan("");
      setTimeout(() => { setTerkirim(false); setIsChatOpen(false); }, 2500);
    } catch {
      alert("Gagal mengirim pesan. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden font-sans flex flex-col items-center justify-center p-4">
      
      {/* Ornamen Latar Belakang Geometris */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="z-10 text-center max-w-3xl mx-auto px-4">
        <div className="inline-block bg-slate-900 text-white font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-md border-2 border-slate-900">
          Platform Belajar Digital ✨
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Foundations of <span className="text-blue-600 underline decoration-wavy decoration-yellow-400 underline-offset-8">Math</span>
        </h1>
        <p className="font-bold text-slate-600 mb-10 text-base md:text-xl leading-relaxed">
          Membangun pemahaman logika matematika dari dasar hingga mahir dengan metode interaktif, terstruktur, dan mudah dipahami.
        </p>
        
        <Link href="/vip" className="bg-white hover:bg-slate-100 text-slate-900 text-lg md:text-xl font-black px-8 py-4 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1.5 active:translate-x-1.5 transition-all inline-flex items-center gap-3">
          <span>Mulai Belajar</span> <span>➔</span>
        </Link>
      </div>

      {/* FLOATING CHAT BUTTON */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end">
        
        {isChatOpen && (
          <div className="bg-white border-4 border-slate-900 p-5 md:p-6 rounded-2xl mb-4 w-[calc(100vw-3rem)] max-w-sm shadow-[8px_8px_0_0_rgba(15,23,42,1)] animate-fade-in origin-bottom-right">
            <div className="flex justify-between items-center mb-4 border-b-2 border-slate-100 pb-2">
              <h3 className="font-black text-slate-900 text-lg">💬 Hubungi Kami</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-red-500 font-black text-xl leading-none">✕</button>
            </div>
            
            {terkirim ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-black text-green-600">Pesan Terkirim!</p>
                <p className="text-sm font-bold text-slate-500 mt-1">Terima kasih atas masukannya.</p>
              </div>
            ) : (
              <form onSubmit={tanganiKirimPesan} className="space-y-3">
                <input 
                  type="text" 
                  value={nama} 
                  onChange={(e) => setNama(e.target.value)} 
                  placeholder="Nama Lengkap" 
                  required 
                  className="w-full p-2.5 text-sm rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white" 
                />
                <input 
                  type="text" 
                  value={kontak} 
                  onChange={(e) => setKontak(e.target.value)} 
                  placeholder="Email / Nomor HP" 
                  required 
                  className="w-full p-2.5 text-sm rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white" 
                />
                <textarea 
                  value={pesan} 
                  onChange={(e) => setPesan(e.target.value)} 
                  placeholder="Tulis masukan, pertanyaan, atau kendala..." 
                  required 
                  rows={3} 
                  className="w-full p-2.5 text-sm rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white resize-none"
                ></textarea>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(148,163,184,1)] active:shadow-none active:translate-y-1 transition-all text-sm"
                >
                  {loading ? "Mengirim..." : "Kirim Pesan 🚀"}
                </button>
              </form>
            )}
          </div>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all flex items-center justify-center text-2xl md:text-3xl"
        >
          {isChatOpen ? "✕" : "✉️"}
        </button>
      </div>

    </main>
  );
}