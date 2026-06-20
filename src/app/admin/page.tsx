"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase"; // Tambah auth
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth"; // Fitur keluar
import { useRouter } from "next/navigation"; // Fitur pindah halaman

export default function AdminPage() {
  const router = useRouter();
  
  const [judul, setJudul] = useState("");
  const [mapel, setMapel] = useState("Aljabar");
  const [bab, setBab] = useState(""); // State baru untuk Sub-materi/Bab
  const [format, setFormat] = useState("Video");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [materiList, setMateriList] = useState<any[]>([]);
  
  const [kodeVipAktif, setKodeVipAktif] = useState("Memuat...");
  const [kodeVipBaru, setKodeVipBaru] = useState("");

  const daftarMapel = ["Aljabar", "Kalkulus", "Trigonometri", "Statistika", "Geometri", "Bilangan", "Peluang", "Vektor & Matriks", "Logika"];

  useEffect(() => {
    const q = query(collection(db, "materi_belajar"), orderBy("tanggal", "desc"));
    const unsubMateri = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMateriList(data);
    });

    const unsubVip = onSnapshot(doc(db, "pengaturan", "vip"), (docSnap) => {
      if (docSnap.exists()) setKodeVipAktif(docSnap.data().kode);
      else setKodeVipAktif("Belum Diatur!");
    });

    return () => { unsubMateri(); unsubVip(); };
  }, []);

  const simpanMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !link) return alert("Judul dan Link wajib diisi!");
    setLoading(true);
    try {
      await addDoc(collection(db, "materi_belajar"), { 
        judul, mapel, bab: bab || "Umum", format, link, tanggal: new Date().toISOString() 
      });
      setJudul(""); setBab(""); setLink("");
    } catch (error) { alert("Gagal menyimpan materi."); } finally { setLoading(false); }
  };

  const hapusMateri = async (id: string) => {
    if(confirm("Yakin mau hapus?")) await deleteDoc(doc(db, "materi_belajar", id));
  };

  const ubahKodeVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!kodeVipBaru) return;
    try {
      await setDoc(doc(db, "pengaturan", "vip"), { kode: kodeVipBaru });
      alert("🎟️ Kode VIP Berhasil Diubah! Semua penonton akan diminta login ulang.");
      setKodeVipBaru("");
    } catch (error) { alert("Gagal mengubah kode VIP."); }
  };

  // Fungsi Tombol Keluar
  const handleLogout = async () => {
    if (confirm("Ingin keluar dari Dapur Admin?")) {
      await signOut(auth);
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-sky-50 p-6 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center bg-white border-4 border-slate-900 p-4 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)] mb-8">
        <div className="font-black text-2xl text-slate-900 flex items-center gap-3">
          <span className="text-3xl bg-yellow-300 border-2 border-slate-900 p-1 rounded-xl">⚙️</span> Ruang Dapur Admin
        </div>
        <button onClick={handleLogout} className="bg-red-400 hover:bg-red-500 text-slate-900 font-bold px-5 py-2 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all">Keluar</button>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          
          <div className="bg-pink-100 border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
            <h2 className="text-xl font-black text-slate-900 mb-2">🎟️ Sandi Gerbang VIP</h2>
            <p className="font-bold text-slate-600 mb-4 text-sm">Sandi saat ini: <span className="bg-white px-2 py-1 rounded border-2 border-slate-900 text-pink-600 font-black">{kodeVipAktif}</span></p>
            <form onSubmit={ubahKodeVip} className="flex gap-2">
              <input type="text" value={kodeVipBaru} onChange={(e) => setKodeVipBaru(e.target.value)} placeholder="Sandi baru..." className="w-full p-3 rounded-xl border-4 border-slate-900 bg-white focus:outline-none focus:border-pink-500 font-bold" />
              <button type="submit" className="bg-pink-400 hover:bg-pink-500 text-slate-900 font-black px-4 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1">UBAH</button>
            </form>
          </div>

          <div className="bg-white border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
            <h2 className="text-xl font-black text-slate-900 mb-6 border-b-4 border-slate-900 pb-2">➕ Tambah Materi</h2>
            <form onSubmit={simpanMateri} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Judul Video/Materi</label>
                <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full p-3 rounded-xl border-4 border-slate-900 bg-slate-50 font-bold focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Cabang Matematika</label>
                <select value={mapel} onChange={(e) => setMapel(e.target.value)} className="w-full p-3 rounded-xl border-4 border-slate-900 bg-slate-50 font-bold cursor-pointer">
                  {daftarMapel.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Bab / Sub-materi</label>
                <input type="text" value={bab} onChange={(e) => setBab(e.target.value)} placeholder="Misal: Turunan Lanjut..." className="w-full p-3 rounded-xl border-4 border-slate-900 bg-slate-50 font-bold focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Format</label>
                <div className="flex gap-2 text-sm">
                  <label className={`flex-1 text-center border-4 border-slate-900 p-2 rounded-xl cursor-pointer font-bold ${format === "Video" ? "bg-yellow-300" : "bg-white"}`}><input type="radio" value="Video" checked={format === "Video"} onChange={(e) => setFormat(e.target.value)} className="hidden" />📺 Video</label>
                  <label className={`flex-1 text-center border-4 border-slate-900 p-2 rounded-xl cursor-pointer font-bold ${format === "Artikel" ? "bg-blue-300" : "bg-white"}`}><input type="radio" value="Artikel" checked={format === "Artikel"} onChange={(e) => setFormat(e.target.value)} className="hidden" />📄 Teks</label>
                  <label className={`flex-1 text-center border-4 border-slate-900 p-2 rounded-xl cursor-pointer font-bold ${format === "PhET" ? "bg-orange-300" : "bg-white"}`}><input type="radio" value="PhET" checked={format === "PhET"} onChange={(e) => setFormat(e.target.value)} className="hidden" />⚙️ PhET</label>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Link Tautan</label>
                <input type="url" value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-3 rounded-xl border-4 border-slate-900 bg-slate-50 font-bold focus:outline-none focus:border-pink-500" />
              </div>
              <button type="submit" disabled={loading} className={`w-full text-slate-900 text-lg font-black py-4 rounded-xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1 active:translate-x-1 uppercase ${loading ? 'bg-slate-300' : 'bg-blue-400 hover:bg-blue-500'}`}>Simpan Materi</button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)] h-fit">
          <h2 className="text-xl font-black text-slate-900 mb-6 border-b-4 border-slate-900 pb-2">📚 Daftar Materi Tersimpan</h2>
          <div className="space-y-4">
            {materiList.map((materi) => (
              <div key={materi.id} className={`flex items-center justify-between border-4 border-slate-900 p-4 rounded-2xl ${materi.format === 'Video' ? 'bg-yellow-100' : materi.format === 'Artikel' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white border-4 border-slate-900 w-14 h-14 flex items-center justify-center rounded-xl text-3xl shadow-[2px_2px_0_0_rgba(15,23,42,1)]">{materi.format === 'Video' ? '📺' : materi.format === 'Artikel' ? '📄' : '⚙️'}</div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{materi.judul}</h3>
                    <p className="text-sm font-bold text-slate-600">{materi.mapel} ➔ Bab: {materi.bab || "Umum"} ({materi.format})</p>
                  </div>
                </div>
                <button onClick={() => hapusMateri(materi.id)} className="bg-red-400 border-4 border-slate-900 p-2 rounded-lg font-bold shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1">🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}