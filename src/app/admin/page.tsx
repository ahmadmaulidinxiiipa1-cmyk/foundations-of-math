"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  
  // State Form Materi Utama
  const [judul, setJudul] = useState("");
  const [jenjang, setJenjang] = useState("Umum"); // State Baru
  const [mapel, setMapel] = useState("Aljabar"); // Ini Bab Utama/Cabang MTK
  const [bab, setBab] = useState(""); // Ini Sub-bab Spesifik
  const [format, setFormat] = useState("Video"); // Ini Metode Belajar
  const [link, setLink] = useState("");
  const [linkKuisSantai, setLinkKuisSantai] = useState(""); // State Baru
  const [linkKuisSerius, setLinkKuisSerius] = useState(""); // State Baru
  const [loading, setLoading] = useState(false);
  
  // State List Data
  const [materiList, setMateriList] = useState<any[]>([]);
  const [pesanList, setPesanList] = useState<any[]>([]); // State Baru untuk Pesan Masuk
  
  // State VIP
  const [kodeVipAktif, setKodeVipAktif] = useState("Memuat...");
  const [kodeVipBaru, setKodeVipBaru] = useState("");

  // State Tautan Media Sosial Gerbang
  const [ytLink, setYtLink] = useState("");
  const [igLink, setIgLink] = useState("");
  const [ttLink, setTtLink] = useState("");
  const [fbLink, setFbLink] = useState("");
  const [loadingMedsos, setLoadingMedsos] = useState(false);

  const daftarMapel = ["Aljabar", "Kalkulus", "Trigonometri", "Statistika", "Geometri", "Bilangan", "Peluang", "Vektor & Matriks", "Logika"];
  const daftarJenjang = ["Umum", "SD", "SMP", "SMA"];

  useEffect(() => {
    // 1. Ambil Data Materi Terjadwal
    const qMateri = query(collection(db, "materi_belajar"), orderBy("tanggal", "desc"));
    const unsubMateri = onSnapshot(qMateri, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMateriList(data);
    });

    // 2. Ambil Data Kunci VIP
    const unsubVip = onSnapshot(doc(db, "pengaturan", "vip"), (docSnap) => {
      if (docSnap.exists()) setKodeVipAktif(docSnap.data().kode);
      else setKodeVipAktif("Belum Diatur!");
    });

    // 3. Ambil Tautan Media Sosial Gerbang
    const unsubMedsos = onSnapshot(doc(db, "pengaturan", "medsos"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setYtLink(data.youtube || "");
        setIgLink(data.instagram || "");
        setTtLink(data.tiktok || "");
        setFbLink(data.facebook || "");
      }
    });

    // 4. Ambil Data Pesan Masuk Siswa secara Real-time
    const qPesan = query(collection(db, "pesan_masuk"), orderBy("tanggal", "desc"));
    const unsubPesan = onSnapshot(qPesan, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPesanList(data);
    });

    return () => { unsubMateri(); unsubVip(); unsubMedsos(); unsubPesan(); };
  }, []);

  // Fungsi Menyimpan Materi Baru
  const simpanMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !link) return alert("Judul materi dan Link utama wajib diisi!");
    setLoading(true);
    try {
      await addDoc(collection(db, "materi_belajar"), { 
        judul, 
        jenjang,
        mapel, 
        bab: bab || "Umum", 
        format, 
        link, 
        linkKuisSantai: linkKuisSantai || "https://blooket.com",
        linkKuisSerius: linkKuisSerius || "https://quizizz.com",
        tanggal: new Date().toISOString() 
      });
      alert("📚 Materi Baru Berhasil Ditambahkan!");
      setJudul(""); setBab(""); setLink(""); setLinkKuisSantai(""); setLinkKuisSerius("");
    } catch (error) { alert("Gagal menyimpan materi."); } finally { setLoading(false); }
  };

  const hapusMateri = async (id: string) => {
    if(confirm("Yakin mau hapus materi ini?")) await deleteDoc(doc(db, "materi_belajar", id));
  };

  const hapusPesan = async (id: string) => {
    if(confirm("Hapus pesan masuk ini?")) await deleteDoc(doc(db, "pesan_masuk", id));
  };

  const ubahKodeVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!kodeVipBaru) return;
    try {
      await setDoc(doc(db, "pengaturan", "vip"), { kode: kodeVipBaru });
      alert("🎟️ Kode VIP Berhasil Diubah!");
      setKodeVipBaru("");
    } catch (error) { alert("Gagal mengubah kode VIP."); }
  };

  const simpanMedsos = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMedsos(true);
    try {
      await setDoc(doc(db, "pengaturan", "medsos"), {
        youtube: ytLink, instagram: igLink, tiktok: ttLink, facebook: fbLink
      });
      alert("📱 Tautan Media Sosial Berhasil Diperbarui!");
    } catch (error) { alert("Gagal memperbarui media sosial."); } finally { setLoadingMedsos(false); }
  };

  const handleLogout = async () => {
    if (confirm("Ingin keluar dari Dapur Admin?")) {
      await signOut(auth);
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-sky-50 p-4 md:p-6 font-sans">
      
      {/* Navbar Atas */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center bg-white border-4 border-slate-900 p-4 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)] mb-8">
        <div className="font-black text-xl md:text-2xl text-slate-900 flex items-center gap-2">
          <span className="bg-yellow-300 border-2 border-slate-900 p-1 rounded-xl">⚙️</span> Dapur Admin Mat Film
        </div>
        <button onClick={handleLogout} className="bg-red-400 hover:bg-red-500 text-slate-900 font-bold px-4 py-2 rounded-xl border-4 border-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer text-sm">Keluar</button>
      </nav>

      {/* Main Grid Konten */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (Pengaturan Pengaman & Medsos) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Gembok VIP */}
          <div className="bg-pink-100 border-4 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
            <h2 className="text-lg font-black text-slate-900 mb-1">🎟️ Sandi Gerbang VIP</h2>
            <p className="font-bold text-slate-600 mb-3 text-xs">Sandi aktif: <span className="bg-white px-2 py-0.5 rounded border-2 border-slate-900 text-pink-600 font-black">{kodeVipAktif}</span></p>
            <form onSubmit={ubahKodeVip} className="flex gap-2">
              <input type="text" value={kodeVipBaru} onChange={(e) => setKodeVipBaru(e.target.value)} placeholder="Sandi baru..." className="w-full p-2.5 text-sm rounded-xl border-4 border-slate-900 bg-white font-bold outline-none" />
              <button type="submit" className="bg-pink-400 hover:bg-pink-500 text-slate-900 font-black px-4 rounded-xl border-4 border-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5">UBAH</button>
            </form>
          </div>

          {/* Pengaturan Medsos */}
          <div className="bg-purple-100 border-4 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
            <h2 className="text-lg font-black text-slate-900 mb-3">📱 Tautan Syarat VIP</h2>
            <form onSubmit={simpanMedsos} className="space-y-2.5">
              {/* Kolom medsos input */}
              { [["YouTube", ytLink, setYtLink], ["Instagram", igLink, setIgLink], ["TikTok", ttLink, setTtLink], ["Facebook", fbLink, setFbLink]].map(([label, val, setVal]: any) => (
                <div key={label}>
                  <label className="block text-[10px] font-black text-slate-700 mb-0.5 uppercase">LINK {label}</label>
                  <input type="url" value={val} onChange={(e) => setVal(e.target.value)} placeholder={`Link ${label} resmi...`} className="w-full p-2 text-xs rounded-lg border-2 border-slate-900 font-bold bg-white" />
                </div>
              ))}
              <button type="submit" disabled={loadingMedsos} className="w-full bg-purple-400 hover:bg-purple-500 text-slate-900 font-black py-2.5 text-sm rounded-xl border-4 border-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 uppercase cursor-pointer">
                {loadingMedsos ? "Menyimpan..." : "Simpan Tautan"}
              </button>
            </form>
          </div>

          {/* INBOX KOTAK MASUK PESAN SISWA (FITUR BARU) */}
          <div className="bg-emerald-100 border-4 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
            <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
              <span>📥</span> Kotak Masuk Pesan Siswa ({pesanList.length})
            </h2>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {pesanList.length === 0 ? (
                <p className="text-xs font-bold text-slate-500 text-center bg-white border-2 border-dashed border-slate-300 p-4 rounded-xl">Belum ada pesan masuk dari siswa 📭</p>
              ) : (
                pesanList.map((p) => (
                  <div key={p.id} className="bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[2px_2px_0_0_rgba(15,23,42,1)] relative group">
                    <button onClick={() => hapusPesan(p.id)} className="absolute top-2 right-2 text-xs bg-red-200 border border-slate-900 px-1 rounded hover:bg-red-300 font-black cursor-pointer">✕</button>
                    <p className="text-xs font-black text-pink-600">👤 {p.nama}</p>
                    <p className="text-xs font-bold text-slate-800 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-relaxed break-words">"{p.pesan}"</p>
                    <span className="text-[9px] font-bold text-slate-400 block mt-1 text-right">{new Date(p.tanggal).toLocaleDateString("id-ID")}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* KOLOM TENGAH (Form Tambah Materi Detail) */}
        <div className="lg:col-span-1">
          <div className="bg-white border-4 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)] h-fit">
            <h2 className="text-lg font-black text-slate-900 mb-4 border-b-4 border-slate-900 pb-1.5 flex items-center gap-2"><span>➕</span> Tambah Materi Hub</h2>
            <form onSubmit={simpanMateri} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-0.5">Judul Video / Artikel</label>
                <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Misal: Cara Cepat Berhitung Pecahan" className="w-full p-2.5 text-xs rounded-xl border-2 border-slate-900 bg-slate-50 font-bold" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-0.5">Target Jenjang</label>
                  <select value={jenjang} onChange={(e) => setJenjang(e.target.value)} className="w-full p-2 text-xs rounded-xl border-2 border-slate-900 bg-slate-50 font-bold cursor-pointer">
                    {daftarJenjang.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-0.5">Bab Utama (Cabang)</label>
                  <select value={mapel} onChange={(e) => setMapel(e.target.value)} className="w-full p-2 text-xs rounded-xl border-2 border-slate-900 bg-slate-50 font-bold cursor-pointer">
                    {daftarMapel.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-0.5">Sub-bab Spesifik Topic</label>
                <input type="text" value={bab} onChange={(e) => setBab(e.target.value)} placeholder="Misal: Perkalian Silang Pecahan" className="w-full p-2.5 text-xs rounded-xl border-2 border-slate-900 bg-slate-50 font-bold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-0.5">Metode Pembelajaran</label>
                <div className="flex gap-1.5 text-xs">
                  { [["Video", "📺"], ["Artikel", "📄"], ["PhET", "⚙️"]].map(([fmt, ico]) => (
                    <label key={fmt} className={`flex-1 text-center border-2 border-slate-900 p-1.5 rounded-xl cursor-pointer font-black text-[11px] ${format === fmt ? "bg-yellow-300 shadow-[2px_2px_0_0_rgba(15,23,42,1)]" : "bg-white"}`}>
                      <input type="radio" value={fmt} checked={format === fmt} onChange={(e) => setFormat(e.target.value)} className="hidden" />
                      {ico} {fmt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-0.5">Link Materi Utama</label>
                <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link YouTube / Blog Utama..." className="w-full p-2.5 text-xs rounded-xl border-2 border-slate-900 bg-slate-50 font-bold" />
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-2 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-black text-orange-600 mb-0.5">LINK KUIS SANTAI (GAME MODE)</label>
                  <input type="url" value={linkKuisSantai} onChange={(e) => setLinkKuisSantai(e.target.value)} placeholder="Link Blooket / Wordwall..." className="w-full p-2 text-xs rounded-xl border-2 border-orange-400 bg-orange-50 font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-purple-600 mb-0.5">LINK KUIS SERIUS (FOCUS MODE)</label>
                  <input type="url" value={linkKuisSerius} onChange={(e) => setLinkKuisSerius(e.target.value)} placeholder="Link Quizizz / Google Forms..." className="w-full p-2 text-xs rounded-xl border-2 border-purple-400 bg-purple-50 font-bold" />
                </div>
              </div>

              <button type="submit" disabled={loading} className={`w-full text-slate-900 font-black py-3 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 uppercase text-sm cursor-pointer ${loading ? 'bg-slate-300' : 'bg-blue-400 hover:bg-blue-500'}`}>
                {loading ? "Menyimpan..." : "Simpan Materi 🚀"}
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN (Daftar Materi yang Sudah Disimpan) */}
        <div className="lg:col-span-1">
          <div className="bg-white border-4 border-slate-900 p-5 rounded-2xl shadow-[6px_6px_0_0_rgba(15,23,42,1)] h-fit">
            <h2 className="text-lg font-black text-slate-900 mb-4 border-b-4 border-slate-900 pb-1.5 flex items-center gap-2"><span>📚</span> Katalog Data ({materiList.length})</h2>
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {materiList.length === 0 ? (
                <p className="text-xs font-bold text-slate-400 text-center py-6">Belum ada materi terdaftar.</p>
              ) : (
                materiList.map((m) => (
                  <div key={m.id} className={`border-2 border-slate-900 p-3 rounded-xl flex items-start justify-between gap-2 ${m.format === 'Video' ? 'bg-yellow-50' : m.format === 'Artikel' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                    <div className="text-left">
                      <span className="inline-block text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 mr-1">
                        {m.jenjang || "Umum"}
                      </span>
                      <span className="inline-block text-[9px] font-black bg-pink-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                        {m.format}
                      </span>
                      <h3 className="font-black text-slate-900 text-sm leading-tight">{m.judul}</h3>
                      <p className="text-[11px] font-bold text-slate-500 mt-1">
                        {m.mapel} ➔ <span className="text-pink-600">{m.bab}</span>
                      </p>
                    </div>
                    <button onClick={() => hapusMateri(m.id)} className="bg-red-200 border-2 border-slate-900 p-1 text-xs rounded-lg font-bold hover:bg-red-300 shadow-[1px_1px_0_0_rgba(15,23,42,1)] active:shadow-none cursor-pointer">🗑️</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}