import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Wrench,
  BookOpen,
  Building2,
  Newspaper,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogIn,
  Users,
  Mail,
  Send,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION WITH WARM, NATURAL & EDUCATIF AESTHETIC */}
      <section className="relative bg-gradient-to-b from-slate-50/80 via-background to-background border-b border-border py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Col: Hero Typography & CTAs */}
            <div className="space-y-6 lg:col-span-7">
              {/* Elegant Eyebrow / Kicker */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <span className="flex h-2 w-2 rounded-full bg-primary" />
                <span>Pendidikan Vokasi TBSM & Pondok Pesantren</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                Membentuk Generasi Berkarakter, Terampil, dan Siap Kerja
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Selamat datang di <strong className="text-foreground font-semibold">SMKS AL-FALAH</strong> — Lembaga pendidikan kejuruan berbasis Teknik & Bisnis Sepeda Motor (TBSM) di bawah naungan Yayasan Pondok Pesantren Al-Falah Teluk Pakedai, Kabupaten Kubu Raya.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button asChild size="lg" className="bg-primary text-primary-foreground shadow-sm font-semibold">
                  <Link href="/profil">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Jelajahi Profil Sekolah
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-secondary font-semibold"
                >
                  <Link href="/dashboard">
                    <LogIn className="mr-2 h-4 w-4 text-primary" />
                    Akses Portal SIMS
                  </Link>
                </Button>
              </div>

              {/* Natural Inline Highlights (No Heavy Pill Capsules) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-foreground">Praktik Vokasi TBSM</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-foreground">Karakter Santri Pesantren</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-foreground">Mitra Industri Bengkel</span>
                </div>
              </div>
            </div>

            {/* Right Col: School Showcase & Key Educational Achievements Card */}
            <div className="lg:col-span-5">
              <Card className="border border-border bg-card shadow-sm overflow-hidden">
                <div className="relative h-48 sm:h-52 overflow-hidden bg-muted">
                  <img
                    src="/images/hero-school.jpg"
                    alt="Gedung SMKS AL-FALAH Telok Pakedai"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                    <div>
                      <p className="text-white font-bold text-sm drop-shadow-sm">Gedung Utama SMKS AL-FALAH</p>
                      <p className="text-white/85 text-[11px]">Desa Sungai Deras, Kec. Telok Pakedai, Kab. Kubu Raya</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/60 p-3 border border-border/60">
                      <p className="text-[11px] text-muted-foreground font-medium">Peserta Didik</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">104+ Siswa</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Kelas X, XI, XII TBSM</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 p-3 border border-border/60">
                      <p className="text-[11px] text-muted-foreground font-medium">Tenaga Pendidik</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">18 Guru & Staf</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Pengajar Berpengalaman</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 p-3 border border-border/60">
                      <p className="text-[11px] text-muted-foreground font-medium">Program Keahlian</p>
                      <p className="text-base font-bold text-primary mt-0.5">TBSM Otomotif</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Teknik Sepeda Motor</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 p-3 border border-border/60">
                      <p className="text-[11px] text-muted-foreground font-medium">Kultur Pembinaan</p>
                      <p className="text-base font-bold text-emerald-600 mt-0.5">Nilai Pesantren</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Yayasan Ponpes Al-Falah</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary/40 p-3 flex items-center justify-between text-xs border border-border/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Waktu Belajar: Siang Hari</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      6 Hari Belajar
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SAMBUTAN KEPALA SEKOLAH (SOLID CLEAN BACKGROUND) */}
      <section className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="bg-secondary/70 p-8 lg:col-span-4 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-border">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4 shadow-sm">
                  DI
                </div>
                <h3 className="text-base font-bold text-foreground">Dedi Irawan</h3>
                <p className="text-xs text-muted-foreground">Kepala Sekolah SMKS AL-FALAH</p>
                <Badge variant="outline" className="mt-3 text-[10px]">
                  Yayasan Ponpes Al-Falah
                </Badge>
              </div>

              <div className="p-8 lg:col-span-8 flex flex-col justify-center space-y-4">
                <Badge variant="secondary" className="self-start text-xs">
                  Sambutan Pimpinan Sekolah
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  "Menghadirkan Pendidikan Vokasi yang Relevan dan Berintegritas di Desa Sungai Deras"
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Puji syukur kita panjatkan ke hadirat Allah SWT. SMKS AL-FALAH terus berkomitmen mendidik putra-putri daerah menjadi insan yang tidak hanya mahir dalam keterampilan teknik otomotif, namun juga berintegritas tinggi dengan pondasi moral pesantren.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Melalui sistem digital SIMS, kami membuka akses transparansi kehadiran siswa kepada orang tua serta mempercepat tata kelola administrasi demi mewujudkan sekolah yang modern, tertib, dan akuntabel.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. PROGRAM KEAHLIAN & PILAR PENDIDIKAN (SOLID BACKGROUND) */}
      <section className="py-16 sm:py-20 bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="default" className="text-xs">
              Keunggulan Kami
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Pilar Pendidikan & Program Keahlian
            </h2>
            <p className="text-sm text-muted-foreground">
              Fokus pembelajaran dirancang untuk menjawab kebutuhan dunia industri otomotif dan penguatan akhlak peserta didik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-3">
                  <Wrench className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold">Teknik & Bisnis Sepeda Motor</CardTitle>
                <CardDescription className="text-xs">
                  Program Kejuruan Utama (TBSM)
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  Siswa dilatih menguasai pemeliharaan mesin sepeda motor, sistem injeksi modern, kelistrikan bodi, perbaikan sasis, serta manajemen operasional bengkel mandiri.
                </p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-primary">
                  <span>Praktik Bengkel Rutin</span>
                  <span>Siap Kerja & Wirausaha</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-3">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold">Pendidikan Nilai Pesantren</CardTitle>
                <CardDescription className="text-xs">
                  Karakter & Kedisiplinan Spiritual
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  Terintegrasi dengan lingkungan Yayasan Pondok Pesantren Al-Falah. Membiasakan sholat berjamaah, pembinaan akhlak mulia, dan etika kerja yang jujur serta bertanggung jawab.
                </p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-primary">
                  <span>Pembinaan Karakter</span>
                  <span>Kultur Santun & Disiplin</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-3">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold">Digitalisasi & Transparansi</CardTitle>
                <CardDescription className="text-xs">
                  Sistem Informasi Manajemen Sekolah
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  Pencatatan presensi digital langsung oleh wali kelas yang dapat dicek orang tua secara transparan, serta sistem administrasi surat paperless yang cepat dan tertib arsip.
                </p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-primary">
                  <span>Real-Time Monitoring</span>
                  <span>Paperless Office</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. SARANA & FASILITAS SEKOLAH DENGAN FOTO ASLI (SOLID BACKGROUND) */}
      <section className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Badge variant="secondary" className="text-xs mb-2">
                Fasilitas Unggulan
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Fasilitas & Sarana Pembelajaran
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Dokumentasi sarana dan prasarana penunjang kegiatan belajar mengajar kejuruan dan keagamaan di SMKS AL-FALAH.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/fasilitas">
                Lihat Semua Fasilitas &rarr;
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Facility 1 */}
            <Card className="border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-44 overflow-hidden border-b border-border bg-muted">
                <img
                  src="/images/facility-bengkel.jpg"
                  alt="Bengkel Praktik TBSM SMKS AL-FALAH"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Bengkel Praktik TBSM</h4>
                  <Badge variant="success" className="text-[9px] px-1.5 py-0">
                    Standar Industri
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px] line-clamp-2">
                  Dilengkapi toolkit servis otomotif, bike lift, kompresor, dan unit motor praktik kejuruan.
                </p>
              </CardContent>
            </Card>

            {/* Facility 2 */}
            <Card className="border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-44 overflow-hidden border-b border-border bg-muted">
                <img
                  src="/images/facility-kelas.jpg"
                  alt="Ruang Kelas Pembelajaran Teori"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Ruang Kelas Teori</h4>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                    3 Ruang Aktif
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px] line-clamp-2">
                  Ruang pembelajaran teori umum dan kejuruan siswa kelas X s.d XII dengan pencahayaan dan sirkulasi alami.
                </p>
              </CardContent>
            </Card>

            {/* Facility 3 */}
            <Card className="border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-44 overflow-hidden border-b border-border bg-muted">
                <img
                  src="/images/facility-perpus.jpg"
                  alt="Perpustakaan & Ruang Baca Sekolah"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Ruang Perpustakaan</h4>
                  <Badge variant="success" className="text-[9px] px-1.5 py-0">
                    Koleksi Lengkap
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px] line-clamp-2">
                  Koleksi buku teks kejuruan otomotif, modul pelajaran, dan buku referensi keagamaan santri.
                </p>
              </CardContent>
            </Card>

            {/* Facility 4 */}
            <Card className="border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-44 overflow-hidden border-b border-border bg-muted">
                <img
                  src="/images/facility-masjid.jpg"
                  alt="Masjid Yayasan Ponpes Al-Falah"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Masjid Yayasan Ponpes</h4>
                  <Badge variant="success" className="text-[9px] px-1.5 py-0">
                    Pusat Ibadah
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px] line-clamp-2">
                  Pusat kegiatan ibadah harian, sholat dhuhur berjamaah, dan pembinaan karakter santri & siswa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. BERITA & AGENDA SEKOLAH (SOLID BACKGROUND) */}
      <section className="py-16 sm:py-20 bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Badge variant="default" className="text-xs mb-2">
                Informasi Publik
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Warta & Pengumuman Terbaru
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Kabar terkini seputar kegiatan akademik, kejuruan, dan agenda sekolah SMKS AL-FALAH.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/berita">
                Lihat Semua Berita &rarr;
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* News 1 */}
            <Card className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-[10px]">
                    Kejuruan TBSM
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    21 Sep 2026
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-foreground line-clamp-2">
                  Persiapan Kunjungan Industri Siswa TBSM ke Mitra Bengkel Resmi Astra Motor
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-4">
                <p className="line-clamp-3">
                  SMKS AL-FALAH menjalin koordinasi untuk program pengenalan standar industri roda dua bagi siswa kelas XI dan XII guna memperkuat kesiapan kerja.
                </p>
                <Link
                  href="/berita/persiapan-kunjungan-industri-astra-motor"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                >
                  Baca Selengkapnya &rarr;
                </Link>
              </CardContent>
            </Card>

            {/* News 2 */}
            <Card className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-[10px]">
                    Akademik
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    15 Sep 2026
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-foreground line-clamp-2">
                  Jadwal Penilaian Tengah Semester (PTS) Ganjil Tahun Ajaran 2026/2027
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-4">
                <p className="line-clamp-3">
                  Pemberitahuan resmi kepada seluruh wali murid terkait agenda pelaksanaan evaluasi tengah semester untuk kelas X, XI, dan XII TBSM.
                </p>
                <Link
                  href="/berita/jadwal-pts-ganjil-2026-2027"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                >
                  Baca Selengkapnya &rarr;
                </Link>
              </CardContent>
            </Card>

            {/* News 3 */}
            <Card className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-[10px]">
                    Inovasi SIMS
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    10 Sep 2026
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-foreground line-clamp-2">
                  Penerapan Sistem Informasi Manajemen Sekolah (SIMS) Berbasis Digital
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-4">
                <p className="line-clamp-3">
                  Digitalisasi tata kelola persuratan dinas dan transparansi kehadiran siswa kini dapat diakses secara real-time oleh para orang tua.
                </p>
                <Link
                  href="/berita/penerapan-sims-digital-alfalah"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                >
                  Baca Selengkapnya &rarr;
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION PORTAL SIMS (SOLID BACKGROUND) */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-sm">
            <Badge variant="default" className="text-xs">
              Portal Terpadu
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto">
              Akses Layanan SIMS SMKS AL-FALAH
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Masuk ke portal internal untuk guru mengisi presensi, siswa/orang tua memantau kehadiran, dan staf mengelola administrasi surat menyurat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="bg-primary text-primary-foreground shadow-sm px-8">
                <Link href="/dashboard">
                  <LogIn className="mr-2 h-4 w-4" />
                  Masuk ke Portal Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/profil">
                  Hubungi Tata Usaha Sekolah
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
