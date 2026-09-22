# Product Requirements Document (PRD)
## Sistem Informasi Manajemen Sekolah (SIMS) — SMKS AL-FALAH

| | |
|---|---|
| **Versi** | 2.0 (Production-Grade) |
| **Status** | Approved for Development |
| **Tanggal** | 22 September 2026 |
| **Studi Kasus** | SMKS AL-FALAH — NPSN 69984368, Kab. Kubu Raya, Kalimantan Barat |
| **Target Skala** | ±100 siswa, ±15-20 staf/guru |
| **Klasifikasi** | Internal — Proyek Akhir / Capstone |

---

## 1. Ringkasan Eksekutif

SIMS adalah aplikasi web yang mendigitalisasi tiga fungsi inti operasional SMKS AL-FALAH: publikasi profil sekolah, administrasi surat-menyurat (paperless office), dan monitoring kehadiran siswa — dengan kontrol akses berbasis peran (RBAC) sebagai fondasi keamanan di seluruh modul.

**Masalah yang diselesaikan:**
- Profil sekolah tidak termutakhirkan dan tidak mudah diakses calon siswa/masyarakat.
- Surat masuk/keluar dikelola manual di buku agenda fisik — rawan hilang, sulit dilacak, dan lambat direkap.
- Absensi dicatat di atas kertas — rawan manipulasi, lambat direkap, tidak transparan ke orang tua.

**Target hasil:**
- Publikasi konten sekolah dapat dilakukan operator non-teknis dalam <5 menit tanpa bantuan developer.
- Waktu pencarian arsip surat turun dari (manual, bisa berjam-jam/hari) menjadi <1 menit.
- Orang tua dapat memeriksa kehadiran anak kapan saja tanpa harus menghubungi sekolah.

---

## 2. Latar Belakang & Konteks Studi Kasus

### 2.1 Profil Objek Studi Kasus

| Atribut | Data |
|---|---|
| Nama | SMKS AL-FALAH |
| NPSN | 69984368 |
| Bentuk/Status | SMK Swasta |
| Alamat | Desa Sungai Deras, Kec. Telok Pakedai, Kab. Kubu Raya, Kalbar, 78383 |
| Waktu Belajar | Siang / 6 hari |
| Kepala Sekolah | Dedi Irawan |
| Operator | Ibrahim |
| Akreditasi | C (BAN-PDM, SK 1297/BAN-SM/SK/2021, berlaku 2021–2026) |
| Yayasan | Yayasan Pondok Pesantren Al-Falah Teluk Pakedai |

### 2.2 Kendala Lingkungan yang Mempengaruhi Desain

| Kendala Nyata | Implikasi Desain |
|---|---|
| Akses internet terbatas (tercatat 500 Mb, tanpa langganan tetap) | UI harus **ringan** — target payload halaman publik <500KB, gambar terkompresi, minim JS di sisi klien |
| 3 ruang kelas kondisi rusak sedang, 0 kondisi baik | Tidak relevan langsung ke software, tapi jadi konten transparansi di halaman Fasilitas |
| Skala kecil (±100 siswa) | Tidak butuh arsitektur high-scale; cukup free-tier cloud (lihat TRD) |
| Operator non-teknis (staf TU) | Panel admin harus *zero-code*, UI sederhana, minim jargon teknis |

---

## 3. Tujuan Produk & Metrik Sukses

| Tujuan | Metrik Keberhasilan (Acceptance Target) |
|---|---|
| Transparansi informasi publik | 100% konten wajib (Visi/Misi, Sejarah, Fasilitas, Berita, Galeri) tayang tanpa login, load time <3s pada koneksi lambat |
| Paperless office | ≥90% surat masuk/keluar tercatat digital dalam 1 bulan pertama penggunaan |
| Anti-manipulasi absensi | 0 insiden input ganda/absensi diubah tanpa jejak audit |
| Adopsi non-teknis | Operator TU dapat publish berita baru tanpa bantuan developer, diverifikasi via user acceptance test |
| Transparansi ke orang tua | Orang tua dapat melihat rekap kehadiran anak sendiri dalam ≤3 klik setelah login |

---

## 4. Persona & Peran Pengguna

| Persona | Peran Sistem | Kebutuhan Utama | Level Teknis |
|---|---|---|---|
| Calon siswa / masyarakat umum | Publik (tanpa login) | Info sekolah, berita, kontak | Awam |
| Ibrahim (Operator/TU) | Admin TU | Kelola konten CMS, catat surat, unggah PDF | Non-teknis |
| Dedi Irawan (Kepala Sekolah) | Kepala Sekolah | Approve surat, disposisi, lihat rekap sekolah | Non-teknis |
| Wali kelas / Guru | Guru | Input absensi harian kelas yang diampu | Non-teknis |
| Siswa / Orang tua | Siswa/Ortu | Lihat rekap kehadiran pribadi | Awam |

---

## 5. Ruang Lingkup Produk

### 5.1 Dalam Lingkup (In-Scope)

| # | Modul | Ringkasan |
|---|---|---|
| 1 | Profil Sekolah (CMS) | Halaman publik + panel admin konten (teks, foto, berita, galeri) |
| 2 | Surat Menyurat (E-Office) | Surat masuk (upload PDF), surat keluar (draft + nomor otomatis + cetak PDF), status & disposisi |
| 3 | Absensi Digital | Input harian per kelas, rekap otomatis, dashboard siswa/ortu |
| 4 | Sistem & Keamanan | Auth multi-role, RBAC, cloud storage, environment-based config |

### 5.2 Luar Lingkup (Out-of-Scope — versi ini)

- Modul akademik (nilai, rapor, kurikulum/KBM)
- Modul keuangan/SPP
- Integrasi otomatis dua arah dengan Dapodik/Kemendikdasmen (data NPSN dkk. hanya referensi manual)
- Tanda tangan digital tersertifikasi (PDF surat bersifat representasi ber-kop resmi, bukan e-signature bersertifikat)
- Aplikasi mobile native (versi ini web-responsive saja)
- Notifikasi push/SMS/WhatsApp otomatis (dapat menjadi fase lanjutan)

---

## 6. Kebutuhan Fungsional

Kode kebutuhan: `[MODUL]-[NOMOR]`. Prioritas: **P0** (wajib rilis) / **P1** (penting) / **P2** (nice-to-have).

### 6.1 Modul Profil Sekolah (CMS)

#### Halaman Publik
| Kode | Kebutuhan | Prioritas |
|---|---|---|
| CMS-01 | Menampilkan Visi & Misi sekolah | P0 |
| CMS-02 | Menampilkan Sejarah sekolah | P0 |
| CMS-03 | Menampilkan Struktur Organisasi (Kepala Sekolah, Operator, guru) | P1 |
| CMS-04 | Menampilkan daftar Fasilitas Sekolah + foto + kondisi | P0 |
| CMS-05 | Menampilkan Berita/Pengumuman terbaru, terurut tanggal terbaru | P0 |
| CMS-06 | Menampilkan Galeri Foto per album kegiatan | P1 |
| CMS-07 | Seluruh halaman publik dapat diakses tanpa login & responsif mobile | P0 |
| CMS-08 | Halaman publik dioptimasi agar ringan (lihat NFR-Performance) | P0 |

#### Panel Admin
| Kode | Kebutuhan | Prioritas |
|---|---|---|
| CMS-09 | Operator dapat mengubah teks Visi/Misi/Sejarah via form editor | P0 |
| CMS-10 | Operator dapat unggah/ganti/hapus foto fasilitas + deskripsi + kondisi | P0 |
| CMS-11 | Operator dapat membuat/edit/menjadwalkan/publish berita | P0 |
| CMS-12 | Operator dapat unggah multi-foto ke galeri, dikelompokkan per album | P1 |
| CMS-13 | Sistem melakukan kompresi & resize otomatis pada gambar yang diunggah | P0 |
| CMS-14 | Konten dapat disimpan sebagai draft sebelum dipublikasikan | P2 |

### 6.2 Modul Surat Menyurat (E-Office)

| Kode | Kebutuhan | Prioritas |
|---|---|---|
| SRT-01 | Admin TU mencatat surat masuk (no. surat asli, tanggal, pengirim, perihal, klasifikasi) | P0 |
| SRT-02 | Admin TU mengunggah berkas fisik surat masuk (PDF) ke Cloud Storage | P0 |
| SRT-03 | Admin TU membuat draft surat keluar (tujuan, perihal, isi ringkas) | P0 |
| SRT-04 | Sistem menghasilkan nomor surat keluar otomatis berdasarkan kode klasifikasi, unik & berurutan per tahun | P0 |
| SRT-05 | Sistem mencetak/mengunduh surat keluar sebagai PDF sesuai template baku (kop sekolah) | P0 |
| SRT-06 | Setiap surat memiliki status: `pending → disetujui/ditolak → arsip` | P0 |
| SRT-07 | Kepala Sekolah dapat menambahkan disposisi/memo digital pada surat | P0 |
| SRT-08 | Pencarian & filter arsip surat (no., tanggal, klasifikasi, status) | P1 |
| SRT-09 | Riwayat perubahan status surat tercatat (audit trail: siapa, kapan, status apa) | P1 |
| SRT-10 | Validasi ukuran & format berkas unggahan (maks. 5MB, PDF only) | P0 |

### 6.3 Modul Absensi Digital

| Kode | Kebutuhan | Prioritas |
|---|---|---|
| ABS-01 | Guru mengisi status kehadiran (Hadir/Izin/Sakit/Alpa) per siswa, per tanggal, untuk kelas yang diampu | P0 |
| ABS-02 | Sistem mencegah input ganda untuk kombinasi kelas+tanggal yang sama; mencatat waktu & akun penginput | P0 |
| ABS-03 | Guru dapat mengedit input hari itu sebelum batas waktu (mis. sebelum 23:59), perubahan tercatat | P1 |
| ABS-04 | Siswa/Ortu login melihat rekap persentase kehadiran pribadi per periode | P0 |
| ABS-05 | Sistem menghitung rekap otomatis harian/bulanan/semesteran per siswa & per kelas | P0 |
| ABS-06 | Pihak kurikulum dapat mengunduh laporan rekap (PDF/Excel) | P1 |
| ABS-07 | Dashboard menampilkan indikator visual (progress bar/grafik) persentase kehadiran | P2 |

### 6.4 Sistem & Keamanan (RBAC)

| Kode | Kebutuhan | Prioritas |
|---|---|---|
| SYS-01 | Autentikasi (login/logout) untuk seluruh peran selain publik | P0 |
| SYS-02 | Satu akun = satu peran tetap yang menentukan menu yang tampil | P0 |
| SYS-03 | Admin TU tidak dapat mengakses modul absensi | P0 |
| SYS-04 | Guru hanya mengelola absensi kelas yang diampu, tidak dapat mengakses modul surat | P0 |
| SYS-05 | Siswa/Ortu hanya melihat data miliknya sendiri (tidak bisa lihat siswa lain) | P0 |
| SYS-06 | Seluruh berkas disimpan via Cloud Storage API, bukan filesystem server | P0 |
| SYS-07 | Kredensial layanan disimpan sebagai environment variable | P0 |
| SYS-08 | Log aktivitas penting tercatat untuk audit (login, ubah status surat, input absensi) | P1 |
| SYS-09 | Otorisasi ditegakkan di level database (RLS), bukan hanya UI/frontend | P0 |

---

## 7. Kebutuhan Non-Fungsional (NFR)

| Kategori | Kebutuhan | Target Terukur |
|---|---|---|
| **Performa (mobile-first)** | Halaman publik ringan & cepat dibuka di HP dengan koneksi lambat | LCP <2.5s, total payload halaman awal <500KB, Lighthouse Performance Score ≥90 (mobile) |
| **Keamanan** | Password ter-hash, sesi punya masa berlaku, RLS aktif di semua tabel sensitif | 0 akses lintas-role lolos saat security testing |
| **Ketersediaan** | Mengikuti SLA platform (Vercel/Supabase), tanpa server fisik | Uptime ≥99% (bergantung SLA provider) |
| **Skalabilitas data** | Skema mendukung penambahan tahun ajaran/kelas tanpa migrasi besar | Penambahan tahun ajaran baru tidak mengubah struktur tabel inti |
| **Usabilitas** | Operator non-teknis bisa publish konten tanpa training formal | Task completion rate ≥95% pada user acceptance test |
| **Portabilitas data** | Data absensi/surat dapat diekspor | Export PDF/Excel tersedia di modul terkait |
| **Efisiensi biaya** | Berjalan penuh di free-tier cloud untuk skala 100 siswa | $0 biaya infrastruktur bulanan (lihat TRD §2) |
| **Aksesibilitas** | Kontras warna & ukuran teks memadai untuk dibaca di layar kecil | Kontras WCAG AA minimum pada teks utama |

---

## 8. Alur Pengguna Utama (User Flow)

### 8.1 Operator TU — Publikasi Berita
1. Login → Panel Admin → Berita → Tambah Baru
2. Isi judul, isi, unggah foto (opsional, otomatis dikompresi)
3. Simpan sebagai draft **atau** publikasikan langsung
4. Berita tayang otomatis di halaman publik sesuai urutan tanggal

### 8.2 Admin TU + Kepala Sekolah — Surat Keluar
1. Admin TU: buat draft surat keluar (tujuan, perihal, isi, klasifikasi)
2. Sistem generate nomor surat otomatis → status `pending`
3. Kepala Sekolah: review, tambah disposisi, ubah status → `disetujui`/`ditolak`
4. Jika disetujui: Admin TU cetak PDF sesuai template baku → status → `arsip`

### 8.3 Guru — Absensi Harian
1. Login → sistem otomatis tampilkan kelas yang diampu
2. Pilih tanggal (default: hari ini)
3. Isi status kehadiran tiap siswa → simpan
4. Sistem menolak submit ganda untuk kelas+tanggal yang sama

### 8.4 Siswa/Ortu — Cek Kehadiran
1. Login
2. Dashboard otomatis tampilkan persentase kehadiran periode berjalan
3. Pilih periode (bulanan/semesteran) untuk detail

---

## 9. Matriks Hak Akses (RBAC) — Ringkasan

| Modul \ Peran | Publik | Admin TU | Kepala Sekolah | Guru | Siswa/Ortu |
|---|---|---|---|---|---|
| Profil Sekolah (lihat) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profil Sekolah (kelola) | ❌ | ✅ | Lihat | ❌ | ❌ |
| Surat Masuk & Keluar | ❌ | ✅ | Approval + disposisi | ❌ | ❌ |
| Absensi (input) | ❌ | ❌ | Lihat rekap | ✅ (kelas diampu) | ❌ |
| Rekap absensi pribadi | ❌ | ❌ | ❌ | ❌ | ✅ (diri sendiri) |
| Manajemen pengguna | ❌ | ✅ | ❌ | ❌ | ❌ |

> Detail kebijakan RLS per tabel ada di dokumen **Schema** (`03-SCHEMA.md`).

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Free-tier Supabase auto-pause setelah 7 hari idle | Sistem tidak dapat diakses saat dibutuhkan (mis. jelang sidang) | Keep-alive cron job (lihat TRD §8) |
| Operator TU gagap teknologi | Adopsi rendah, kembali ke cara manual | UI admin sesederhana mungkin, sesi onboarding singkat |
| Foto/berkas diunggah mentah berukuran besar | Storage 1GB cepat penuh, halaman lambat di HP | Kompresi otomatis sisi server sebelum simpan ke storage |
| Guru memanipulasi absensi | Data tidak akurat, tujuan anti-manipulasi gagal | RLS + audit trail (siapa, kapan) + kunci edit setelah batas waktu |
| Nomor surat duplikat/tidak konsisten | Masalah legal/administratif | Penomoran digenerate atomik di database (bukan di client) |

---

## 11. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Semua halaman publik dapat diakses tanpa login dan lulus target performa (§7).
- [ ] Operator dapat mengubah 1 jenis konten dan perubahan tayang tanpa deploy ulang kode.
- [ ] Surat masuk lengkap dengan PDF tersimpan di cloud storage dan dapat diunduh ulang.
- [ ] Surat keluar mendapat nomor otomatis tanpa duplikasi, dan dapat dicetak PDF sesuai template.
- [ ] Kepala Sekolah dapat memberi disposisi dan mengubah status surat.
- [ ] Guru dapat mengisi absensi 1 kelas 1 hari; submit kedua untuk kombinasi sama ditolak sistem.
- [ ] Siswa/Ortu yang login hanya bisa melihat data miliknya sendiri (diverifikasi via percobaan akses langsung ke data lain, bukan hanya via UI).
- [ ] Admin TU tidak bisa mengakses menu absensi; Guru tidak bisa mengakses menu surat — diuji dengan mencoba akses endpoint langsung, bukan hanya menyembunyikan tombol di UI.

---

## 12. Roadmap Rilis

| Fase | Fokus | Keluaran |
|---|---|---|
| Fase 0 | Setup infra: Next.js, Supabase, RLS dasar, deploy skeleton ke Vercel | Aplikasi kosong berjalan end-to-end dengan auth |
| Fase 1 | Sistem & Keamanan penuh (SYS-01 s.d. SYS-09) | Multi-role login & RBAC berfungsi |
| Fase 2 | Modul Profil Sekolah (CMS-01 s.d. CMS-14) | Halaman publik + panel admin konten live |
| Fase 3 | Modul Absensi Digital (ABS-01 s.d. ABS-07) | Input & rekap absensi berfungsi |
| Fase 4 | Modul Surat Menyurat (SRT-01 s.d. SRT-10) | E-office surat berfungsi end-to-end |
| Fase 5 | Hardening: testing, performance tuning mobile, dokumentasi | Siap demo/sidang capstone |

---

## 13. Lampiran

- Dokumen teknis pendamping: **`02-TRD.md`** (Technical Requirements Document)
- Dokumen skema data pendamping: **`03-SCHEMA.md`** (Database Schema & RLS Policies)
