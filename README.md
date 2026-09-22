# 🏫 SIMS SMKS AL-FALAH

> **Sistem Informasi Manajemen Sekolah & Portal E-Office Terpadu**  
> **SMKS AL-FALAH Teluk Pakedai, Kab. Kubu Raya, Kalimantan Barat**  
> *NPSN: 69984368 • Program Keahlian: Teknik & Bisnis Sepeda Motor (TBSM)*

---

## 📌 Ringkasan Sistem

**SIMS SMKS AL-FALAH** adalah platform web modern berbasis **Next.js 15 App Router** dan **Supabase** yang dirancang untuk mendigitalisasi operasional tata usaha, manajemen kurikulum kejuruan, rekapitulasi kehadiran siswa, disposisi pimpinan, serta publikasi informasi profil sekolah secara terpadu dan *paperless*.

---

## ✨ Fitur-Fitur Unggulan

### 1. 📬 Administrasi E-Office Persuratan (*Paperless*)
- **Surat Masuk Digital**: Pencatatan agenda surat dinas, penomoran otomatis, unggah berkas pindaian (PDF/gambar), dan tracking status disposisi.
- **Surat Keluar & Penomoran Resmi**: Generator nomor surat dinas otomatis sesuai kode klasifikasi kearsipan (contoh: `421/045/SMK-AF/IX/2026`).
- **Antrean Disposisi Kepala Sekolah**: Alur persetujuan, catatan arahan disposisi, dan delegasi tindak lanjut surat secara digital.

### 2. 📋 Presensi Harian & Mata Pelajaran Siswa
- **Absensi Kelas Real-Time**: Pencatatan kehadiran oleh Guru/Wali Kelas per jam pelajaran (Hadir, Sakit, Izin, Alpa).
- **Rekapitulasi Otomatis**: Menghitung persentase kehadiran per siswa, status rombel, dan deteksi dini siswa butuh pembinaan.
- **Ekspor Data CSV**: Laporan rekap kehadiran siap cetak dan olah data (Excel/Spreadsheet).

### 3. 📰 Manajemen Konten Sekolah (CMS & Portal Publik)
- **Warta Berita & Pengumuman**: Publikasi artikel kegiatan sekolah lengkap dengan **Fitur Upload Gambar Sampul** dan galeri dokumentasi sekolah.
- **Transparansi Sarana & Fasilitas**: Inventaris kondisi fisik bengkel TBSM, ruang kelas, laboratorium, perpustakaan, dan masjid ponpes.
- **Profil Resmi Sekolah**: Informasi identitas Dapodik, NPSN, SK Akreditasi BAN-PDM, dan visi-misi sekolah.

### 4. 👥 Manajemen Pengguna & Autentikasi Khusus Peran
- **Admin TU**: Login menggunakan Email & Kata Sandi.
- **Kepala Sekolah & Guru**: Login praktis menggunakan **NIP** dan kata sandi format tanggal lahir (`YYYYMMDD`).
- **Siswa / Orang Tua**: Login menggunakan **NISN** dan kata sandi format tanggal lahir (`YYYYMMDD`).
- **Fitur Intip Kata Sandi**: Tombol toggle (*Eye / EyeOff*) untuk memudahkan verifikasi format masukan sandi.

### 5. 📅 Manajemen Tahun Ajaran & Semester
- Konfigurasi tahun ajaran aktif (`2026/2027`, `2027/2028`, dst.) dan semester (`Ganjil`/`Genap`) yang tersinkronisasi langsung ke seluruh data rombel dan kop persuratan.

---

## 🛠️ Arsitektur & Teknologi

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components & Actions) |
| **UI Library** | [React 19](https://react.dev/), [Tailwind CSS v3](https://tailwindcss.com/) |
| **Komponen UI** | [Radix UI Primitives](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth Session) |
| **Validasi Skema** | [Zod](https://zod.dev/) |
| **Pengujian** | [Vitest](https://vitest.dev/) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat Sistem
- **Node.js**: versi `18.18.0` atau yang lebih baru
- **npm**, **pnpm**, atau **yarn**

### 2. Kloning Repositori & Instalasi Dependensi
```bash
# Masuk ke direktori proyek
cd SIAKAD-SMKS-AL-FALAH

# Instal dependensi
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel kredensial Supabase Anda di dalam `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda di alamat [http://localhost:3000](http://localhost:3000).

---

## 🔑 Kredensial Akun Demo

| Peran (Role) | Identitas (Email / NIP / NISN) | Format Kata Sandi | Halaman Utama |
| :--- | :--- | :--- | :--- |
| **Admin TU / Operator** | `tu@smk-alfalah.sch.id` | `password123` | `/admin` |
| **Kepala Sekolah** | `197509152005011002` *(NIP)* | `19750915` *(Tgl Lahir)* | `/kepala-sekolah` |
| **Guru / Wali Kelas** | `198509232010011003` *(NIP)* | `19850923` *(Tgl Lahir)* | `/guru` |
| **Siswa (Rizki Ramadhan)** | `0089876543` *(NISN)* | `20080512` *(Tgl Lahir)* | `/siswa` |

---

## 📁 Struktur Direktori Proyek

```plaintext
SIAKAD-SMKS-AL-FALAH/
├── app/
│   ├── (auth)/             # Autentikasi (login)
│   ├── (dashboard)/        # Portal Dashboard berbasis peran (Admin, Kepsek, Guru, Siswa)
│   │   ├── admin/          # Panel Admin TU & Master Data
│   │   ├── kepala-sekolah/ # Panel Kepala Sekolah & Disposisi
│   │   ├── guru/           # Panel Guru, Presensi & Rekap
│   │   └── siswa/          # Panel Siswa & Pengumuman
│   ├── (public)/           # Laman Portal Publik (Beranda, Profil, Berita, Fasilitas)
│   └── api/                # Endpoint REST API (Auth, CMS, Absensi, Siswa, Persuratan)
├── components/
│   ├── cms/                # Komponen pengunggah gambar berita & fasilitas
│   ├── dashboard/          # Sidebar, Header, StatCards, Dialog Tahun Ajaran
│   └── ui/                 # Komponen dasar Radix/Tailwind (Button, Card, Dialog, Input, dsb.)
├── lib/
│   ├── auth/               # Logika sesi cookie & autentikasi
│   ├── data/               # Data store lokal (Berita, Fasilitas, Kalender Akademik)
│   ├── supabase/           # Klien database Supabase (Client, Server, Admin)
│   ├── types/              # Deklarasi tipe data TypeScript
│   └── validators/         # Skema validasi Zod
├── public/                 # Aset statis & foto galeri sekolah
├── __tests__/              # Unit test dan integrasi (Vitest)
├── schema.sql              # Skema database PostgreSQL DDL lengkap
└── package.json            # Konfigurasi dependensi dan skrip proyek
```

---

## 🧪 Skrip Tersedia

- `npm run dev` : Menjalankan Next.js development server.
- `npm run build` : Membangun bundle produksi yang telah dioptimasi.
- `npm run start` : Menjalankan aplikasi hasil build produksi.
- `npm run test` : Menjalankan seluruh pengujian unit dengan Vitest.
- `npx tsc --noEmit` : Memeriksa validitas tipe data TypeScript.

---

## 📄 Lisensi

Dikembangkan untuk **SMKS AL-FALAH Kubu Raya**. Seluruh hak cipta dilindungi.
