"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  
  // STATE KEAMANAN
  const [isAuthValid, setIsAuthValid] = useState(false);
  const [layarAktif, setLayarAktif] = useState("Dashboard"); 
  
  // STATE FORM MATERI
  const [judul, setJudul] = useState(""); const [jenjang, setJenjang] = useState("Umum");
  const [mapel, setMapel] = useState("Aljabar"); const [bab, setBab] = useState("");
  const [format, setFormat] = useState("Video"); const [link, setLink] = useState("");
  const [linkKuisSantai, setLinkKuisSantai] = useState(""); const [linkKuisSerius, setLinkKuisSerius] = useState("");
  const [loading, setLoading] = useState(false);
  
  // STATE DATABASE
  const [materiList, setMateriList] = useState<any[]>([]); 
  const [pesanList, setPesanList] = useState<any[]>([]);
  const [kodeVipAktif, setKodeVipAktif] = useState("Memuat..."); const [kodeVipBaru, setKodeVipBaru] = useState("");
  const [ytLink, setYtLink] = useState(""); const [igLink, setIgLink] = useState("");
  const [ttLink, setTtLink] = useState(""); const [fbLink, setFbLink] = useState("");

  // STATE FILTER & PENCARIAN (BARU!)
  const [kataKunci, setKataKunci] = useState(""); 
  const [tabStatus, setTabStatus] = useState("Aktif");
  const [filterJenjang, setFilterJenjang] = useState("Semua");
  const [filterFormat, setFilterFormat] = useState("Semua");

  const daftarMapel = ["Aljabar", "Kalkulus", "Trigonometri", "Statistika", "Geometri", "Bilangan", "Peluang", "Vektor & Matriks", "Logika"];
  
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) setIsAuthValid(true); else router.replace("/"); 
    });
    return () => unsubAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthValid) return; 

    const unsubMateri = onSnapshot(query(collection(db, "materi_belajar"), orderBy("tanggal", "desc")), (snapshot) => {
      setMateriList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubVip = onSnapshot(doc(db, "pengaturan", "vip"), (docSnap) => { if (docSnap.exists()) setKodeVipAktif(docSnap.data().kode); });
    const unsubMedsos = onSnapshot(doc(db, "pengaturan", "medsos"), (docSnap) => {
      if (docSnap.exists()) { const d = docSnap.data(); setYtLink(d.youtube||""); setIgLink(d.instagram||""); setTtLink(d.tiktok||""); setFbLink(d.facebook||""); }
    });
    const unsubPesan = onSnapshot(query(collection(db, "pesan_masuk"), orderBy("tanggal", "desc")), (snapshot) => {
      setPesanList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubMateri(); unsubVip(); unsubMedsos(); unsubPesan(); };
  }, [isAuthValid]);

  const simpanMateri = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await addDoc(collection(db, "materi_belajar"), { 
        judul, jenjang, mapel, bab: bab || "Umum", format, link, linkKuisSantai, linkKuisSerius, status: "Aktif", tanggal: new Date().toISOString() 
      });
      alert("📚 Materi Baru Berhasil Disimpan!");
      setJudul(""); setBab(""); setLink(""); setLinkKuisSantai(""); setLinkKuisSerius("");
      setLayarAktif("Dashboard"); 
    } catch (error) { alert("Gagal menyimpan materi."); } finally { setLoading(false); }
  };

  const toggleArsipMateri = async (id: string, statusSekarang: string) => {
    await updateDoc(doc(db, "materi_belajar", id), { status: statusSekarang === "Aktif" ? "Arsip" : "Aktif" });
  };
  const hapusMateri = async (id: string) => { if(confirm("Hapus permanen?")) await deleteDoc(doc(db, "materi_belajar", id)); };
  const hapusPesan = async (id: string) => { if(confirm("Hapus pesan?")) await deleteDoc(doc(db, "pesan_masuk", id)); };
  const ubahKodeVip = async (e: React.FormEvent) => { e.preventDefault(); await setDoc(doc(db, "pengaturan", "vip"), { kode: kodeVipBaru }); alert("🎟️ VIP Diubah!"); setKodeVipBaru(""); };
  const simpanMedsos = async (e: React.FormEvent) => { e.preventDefault(); await setDoc(doc(db, "pengaturan", "medsos"), { youtube: ytLink, instagram: igLink, tiktok: ttLink, facebook: fbLink }); alert("📱 Medsos Diperbarui!"); };
  
  const salinLink = (linkMateri: string) => {
    navigator.clipboard.writeText(linkMateri);
    alert("🔗 Link materi berhasil disalin!");
  };

  const handleLogout = async () => { if (confirm("Keluar admin?")) await signOut(auth); };

  // LOGIKA MULTI-FILTER SUPER CERDAS
  const materiTampil = materiList.filter(m => {
    const cekStatus = (m.status || "Aktif") === tabStatus;
    const pencarian = kataKunci.toLowerCase();
    const cekKataKunci = m.judul.toLowerCase().includes(pencarian) || m.mapel.toLowerCase().includes(pencarian) || (m.bab || "").toLowerCase().includes(pencarian);
    const cekJenjang = filterJenjang === "Semua" ? true : m.jenjang === filterJenjang;
    const cekFormat = filterFormat === "Semua" ? true : m.format === filterFormat;
    
    return cekStatus && cekKataKunci && cekJenjang && cekFormat;
  });

  if (!isAuthValid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col">
        <div className="text-6xl mb-4 animate-bounce">🔒</div><h1 className="text-2xl font-black text-slate-900">Memverifikasi Akses...</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-sky-50 p-4 md:p-6 font-sans">
      
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center bg-white border-4 border-slate-900 p-4 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)] mb-8 gap-4">
        <div className="font-black text-xl md:text-2xl text-slate-900 flex items-center gap-2">
          <span className="bg-yellow-300 border-2 border-slate-900 p-1 rounded-xl">⚙️</span> Ruang Admin Foundations
        </div>
        <div className="flex gap-2">
          {layarAktif === "Dashboard" ? (
            <button onClick={() => setLayarAktif("TambahMateri")} className="bg-blue-400 hover:bg-blue-500 text-slate-900 font-black px-4 py-2 rounded-xl border-4 border-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 cursor-pointer">➕ Tambah Materi</button>
          ) : (
            <button onClick={() => setLayarAktif("Dashboard")} className="bg-slate-300 hover:bg-slate-400 text-slate-900 font-black px-4 py-2 rounded-xl border-4 border-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 cursor-pointer">⬅️ Kembali ke Data</button>
          )}
          <button onClick={handleLogout} className="bg-red-400 hover:bg-red-500 text-slate-900 font-bold px-4 py-2 rounded-xl border-4 border-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 cursor-pointer">Keluar</button>
        </div>
      </nav>

      {layarAktif === "Dashboard" ? (
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-pink-100 border-4 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
                <h2 className="text-lg font-black text-slate-900 mb-1">🎟️ Sandi Gerbang VIP</h2>
                <form onSubmit={ubahKodeVip} className="flex gap-2 mt-3">
                  <input type="text" value={kodeVipBaru} onChange={(e) => setKodeVipBaru(e.target.value)} placeholder={kodeVipAktif} className="w-full p-2.5 text-sm rounded-xl border-4 border-slate-900 bg-white font-bold outline-none" />
                  <button type="submit" className="bg-pink-400 text-slate-900 font-black px-4 rounded-xl border-4 border-slate-900">UBAH</button>
                </form>
              </div>
              <div className="bg-emerald-100 border-4 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
                <h2 className="text-lg font-black text-slate-900 mb-3">📥 Pesan Siswa ({pesanList.length})</h2>
                <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1">
                  {pesanList.map((p) => (
                    <div key={p.id} className="bg-white border-2 border-slate-900 p-3 rounded-xl relative">
                      <button onClick={() => hapusPesan(p.id)} className="absolute top-2 right-2 text-xs font-black text-red-500">✕</button>
                      <p className="text-xs font-black text-pink-600">👤 {p.nama}</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">"{p.pesan}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border-4 border-slate-900 p-6 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
              <div className="flex flex-col mb-6 border-b-4 border-slate-900 pb-4 gap-4">
                
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    🗂️ Katalog Data <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-sm">{materiTampil.length} Item</span>
                  </h2>
                  <div className="flex bg-slate-100 border-2 border-slate-900 rounded-xl overflow-hidden shadow-[2px_2px_0_0_rgba(15,23,42,1)] flex-shrink-0">
                    <button onClick={() => setTabStatus("Aktif")} className={`px-4 py-2 text-sm font-black ${tabStatus === "Aktif" ? "bg-green-400" : "text-slate-500 hover:bg-slate-200"}`}>Aktif</button>
                    <button onClick={() => setTabStatus("Arsip")} className={`px-4 py-2 text-sm font-black border-l-2 border-slate-900 ${tabStatus === "Arsip" ? "bg-slate-700 text-white" : "text-slate-500 hover:bg-slate-200"}`}>Arsip 🗃️</button>
                  </div>
                </div>

                {/* AREA MULTI-FILTER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full bg-slate-50 p-3 rounded-xl border-2 border-slate-200">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm">🔍</span>
                    <input type="text" value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} placeholder="Cari judul/bab..." className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-slate-900 font-bold bg-white text-sm" />
                  </div>
                  <select value={filterJenjang} onChange={(e) => setFilterJenjang(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-bold bg-white text-sm cursor-pointer">
                    <option value="Semua">Semua Jenjang</option><option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option><option value="Umum">Umum</option>
                  </select>
                  <select value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-bold bg-white text-sm cursor-pointer">
                    <option value="Semua">Semua Format</option><option value="Video">📺 Video</option><option value="Artikel">📄 Artikel</option><option value="PhET">⚙️ PhET</option>
                  </select>
                </div>

              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {materiTampil.length === 0 ? (
                   <p className="text-center font-bold text-slate-400 py-10">Tidak ada materi yang sesuai filter.</p>
                ) : (
                  materiTampil.map((m) => (
                    <div key={m.id} className={`border-2 border-slate-900 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 ${m.status === 'Arsip' ? 'bg-slate-100 opacity-80' : 'bg-yellow-50'}`}>
                      <div>
                        <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded uppercase tracking-wider mr-2">{m.jenjang}</span>
                        <span className="text-[10px] font-black bg-pink-500 text-white px-2 py-1 rounded uppercase tracking-wider mr-2">{m.format}</span>
                        {m.status === "Arsip" && <span className="text-[10px] font-black bg-slate-400 text-white px-2 py-1 rounded uppercase mr-2">🗃️ Arsip</span>}
                        <h3 className="font-black text-slate-900 mt-2">{m.judul}</h3>
                        <p className="text-xs font-bold text-slate-600 mt-1">{m.mapel} ➔ {m.bab}</p>
                      </div>
                      <div className="flex gap-2 items-center flex-wrap">
                        {/* Tombol Salin Link */}
                        <button onClick={() => salinLink(m.link)} title="Salin Link Materi" className="px-3 py-2 border-2 border-slate-900 text-xs rounded-xl font-black bg-white hover:bg-slate-100 shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5">🔗</button>
                        {/* Tombol Arsip/Aktif */}
                        <button onClick={() => toggleArsipMateri(m.id, m.status || "Aktif")} className={`px-3 py-2 border-2 border-slate-900 text-xs rounded-xl font-black shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 ${m.status === 'Arsip' ? 'bg-green-300' : 'bg-slate-300'}`}>{m.status === 'Arsip' ? '⬆️ Terbitkan' : '⬇️ Arsipkan'}</button>
                        <button onClick={() => hapusMateri(m.id)} className="bg-red-300 border-2 border-slate-900 p-2 text-sm rounded-xl font-bold shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white border-4 border-slate-900 p-8 rounded-3xl shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
          <h2 className="text-2xl font-black text-slate-900 mb-6 border-b-4 border-slate-900 pb-2">🎬 Studio Tambah Materi</h2>
          <form onSubmit={simpanMateri} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-900 mb-1">Judul Video / Artikel</label>
              <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required className="w-full p-3 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-900 mb-1">Target Jenjang</label>
              <select value={jenjang} onChange={(e) => setJenjang(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold"><option>Umum</option><option>SD</option><option>SMP</option><option>SMA</option></select>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-900 mb-1">Bab (Cabang)</label>
              <select value={mapel} onChange={(e) => setMapel(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold">{daftarMapel.map(m=><option key={m}>{m}</option>)}</select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-900 mb-1">Topik Sub-bab Spesifik</label>
              <input type="text" value={bab} onChange={(e) => setBab(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-900 mb-1">Metode & Link Materi Utama</label>
              <div className="flex gap-2">
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="p-3 w-1/3 rounded-xl border-2 border-slate-900 bg-yellow-100 font-bold"><option value="Video">📺 Video</option><option value="Artikel">📄 Artikel</option><option value="PhET">⚙️ PhET</option></select>
                <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required placeholder="https://..." className="w-2/3 p-3 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-orange-600 mb-1">Link Kuis Santai (Opsional)</label>
              <input type="url" value={linkKuisSantai} onChange={(e) => setLinkKuisSantai(e.target.value)} className="w-full p-3 text-sm rounded-xl border-2 border-orange-400 bg-orange-50 font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black text-purple-600 mb-1">Link Kuis Serius (Opsional)</label>
              <input type="url" value={linkKuisSerius} onChange={(e) => setLinkKuisSerius(e.target.value)} className="w-full p-3 text-sm rounded-xl border-2 border-purple-400 bg-purple-50 font-bold" />
            </div>
            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={loading} className="w-full bg-blue-400 hover:bg-blue-500 text-slate-900 font-black py-4 rounded-xl border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:translate-y-1 text-lg">
                {loading ? "Menyimpan..." : "Upload Materi 🚀"}
              </button>
            </div>
          </form>
        </div>
      )}

    </main>
  );
}