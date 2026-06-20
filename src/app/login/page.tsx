"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Mengecek kecocokan data ke Firebase
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Berhasil! Mengalihkan ke Dapur...");
      router.push("/admin"); // Pindah ke halaman admin
    } catch (err) {
      setError("Email atau Password salah! Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-sky-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Latar Belakang Hidup */}
      <div className="absolute top-10 left-10 text-6xl text-blue-400 opacity-60 animate-bounce">✖️</div>
      <div className="absolute bottom-20 left-20 text-7xl text-pink-400 opacity-60 animate-pulse">➕</div>
      <div className="absolute top-20 right-20 text-8xl text-yellow-400 opacity-60 animate-bounce" style={{ animationDelay: '1s' }}>➗</div>
      <div className="absolute bottom-10 right-10 text-6xl text-green-400 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>➖</div>
      <div className="absolute top-1/2 left-5 text-7xl text-purple-400 opacity-50 -translate-y-1/2 font-black">π</div>
      <div className="absolute top-1/3 right-1/4 text-6xl text-orange-400 opacity-50 rotate-12 font-black">∑</div>
      <div className="absolute bottom-1/3 left-1/4 text-6xl text-teal-400 opacity-50 -rotate-12 font-black">√</div>

      {/* Kotak Login */}
      <div className="bg-white border-4 border-slate-900 rounded-[2rem] p-8 w-full max-w-md z-10 shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
        
        <div className="text-center mb-8">
          <div className="bg-yellow-300 border-4 border-slate-900 p-4 rounded-full inline-block mb-4 shadow-[4px_4px_0_0_rgba(15,23,42,1)] rotate-[-10deg] hover:rotate-0 transition-transform">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-wide">
            Halo, Admin!
          </h1>
          <p className="text-slate-600 font-bold text-sm">
            Yuk, siapkan materi Mat Film yang seru hari ini.
          </p>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="bg-red-400 border-4 border-slate-900 text-slate-900 font-bold p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {/* Formulir (Sekarang menggunakan onSubmit) */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-base font-black text-slate-900 mb-2">
              Email Kamu
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@matfilm.com"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-4 border-slate-200 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-base font-black text-slate-900 mb-2">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-4 border-slate-200 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-8 ${loading ? 'bg-slate-400' : 'bg-green-400 hover:bg-green-500'} text-slate-900 text-xl font-black py-4 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-2 active:translate-x-2 transition-all`}
          >
            {loading ? "MEMERIKSA..." : "MASUK SEKARANG!"}
          </button>
        </form>

      </div>
    </main>
  );
}