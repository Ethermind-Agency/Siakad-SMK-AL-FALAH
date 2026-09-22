import React from "react";
import Link from "next/link";
import {
  School,
  Target,
  History,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Wrench,
  TrendingUp,
  Sparkles,
  FileText,
  UserCheck,
  Quote,
  Contact,
  Store,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProfilPage() {
  return (
    <div className="flex flex-col py-10 sm:py-16 space-y-12 sm:space-y-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. Header Title Banner (Clean Kicker / Eyebrow Text Without Capsule Pill Badge) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            TENTANG SEKOLAH
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Profil & Visi Misi Sekolah
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Mengenal lebih dekat sejarah pendirian, visi misi kelembagaan, legalitas resmi Dapodik, dan susunan organisasi SMKS AL-FALAH Telok Pakedai, Kabupaten Kubu Raya.
          </p>
        </div>

        {/* 2. Identity Specification Sheet (Clean Rows with Zebra Striping, Dividers & Full-Width Address) */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-5 sm:p-6 border-b border-border bg-secondary/40">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Data Pokok Pendidikan Sekolah (Dapodik)
                </CardTitle>
                <CardDescription className="text-xs">
                  Legalitas dan identitas resmi yang terdaftar di Kementerian Pendidikan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/70 text-xs">
              {/* Row 1: Nama & NPSN */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/70 bg-background">
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/20 transition-colors">
                  <span className="text-muted-foreground font-medium">Nama Resmi Sekolah</span>
                  <span className="font-bold text-foreground text-sm">SMKS AL-FALAH</span>
                </div>
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/20 transition-colors">
                  <span className="text-muted-foreground font-medium">Nomor Pokok Sekolah Nasional (NPSN)</span>
                  <span className="font-mono font-bold text-primary text-sm">69984368</span>
                </div>
              </div>

              {/* Row 2: Bentuk Pendidikan & Akreditasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/70 bg-secondary/15">
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/25 transition-colors">
                  <span className="text-muted-foreground font-medium">Bentuk Pendidikan</span>
                  <span className="font-semibold text-foreground">SMK Swasta (Kejuruan Otomotif TBSM)</span>
                </div>
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/25 transition-colors">
                  <span className="text-muted-foreground font-medium">Status Akreditasi</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      Akreditasi BAN-PDM (C)
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">SK 1297/BAN-SM/SK/2021</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Yayasan & Waktu Belajar */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/70 bg-background">
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/20 transition-colors">
                  <span className="text-muted-foreground font-medium">Naungan Lembaga</span>
                  <span className="font-semibold text-foreground">Yayasan Pondok Pesantren Al-Falah</span>
                </div>
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/20 transition-colors">
                  <span className="text-muted-foreground font-medium">Waktu Penyelenggaraan</span>
                  <span className="font-semibold text-foreground">Siang Hari (6 Hari Belajar)</span>
                </div>
              </div>

              {/* Row 4: Pimpinan Sekolah & Program Kejuruan */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/70 bg-secondary/15">
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/25 transition-colors">
                  <span className="text-muted-foreground font-medium">Pimpinan Sekolah</span>
                  <span className="font-semibold text-foreground">Dedi Irawan (Kepala Sekolah)</span>
                </div>
                <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-secondary/25 transition-colors">
                  <span className="text-muted-foreground font-medium">Program Keahlian Utama</span>
                  <span className="font-semibold text-primary">Teknik & Bisnis Sepeda Motor (TBSM)</span>
                </div>
              </div>

              {/* Row 5: Alamat Lengkap (Full Width / Span 2 Columns) */}
              <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-start justify-between gap-2 bg-background hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>Alamat Lengkap</span>
                </div>
                <span className="font-semibold text-foreground text-left sm:text-right leading-relaxed max-w-2xl">
                  Desa Sungai Deras, Kecamatan Telok Pakedai, Kabupaten Kubu Raya, Kalimantan Barat, Kode Pos 78383
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Visi (Inspiring Central Quote Card) & Misi (Thematic Meaningful Icons) */}
        <div className="space-y-8">
          {/* Visi Sekolah - Prominent Central Statement with Thick Border & Soft Background */}
          <div className="rounded-2xl border-l-4 border-l-primary border-t border-r border-b border-primary/20 bg-gradient-to-br from-blue-50/80 via-background to-secondary/30 dark:from-secondary/40 dark:via-background dark:to-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <Quote className="absolute right-6 bottom-4 h-24 w-24 text-primary/10 pointer-events-none" />
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Target className="h-4 w-4" />
                <span>VISI SMKS AL-FALAH</span>
              </div>
              <blockquote className="text-lg sm:text-2xl font-bold tracking-tight text-foreground leading-snug italic">
                &ldquo;Menjadi Sekolah Menengah Kejuruan yang unggul, berakhlak mulia, berjiwa wirausaha, dan siap bersaing di dunia industri otomotif tingkat regional maupun nasional.&rdquo;
              </blockquote>
              <p className="text-xs text-muted-foreground pt-1">
                Landasan arah mutu pendidikan kejuruan berbasis karakter pesantren di Telok Pakedai.
              </p>
            </div>
          </div>

          {/* Misi Sekolah - Thematic Grid with Meaningful Icons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Misi Lembaga Pendidikan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Misi 1: TBSM / Otomotif */}
              <Card className="border border-border bg-card shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Pendidikan Vokasi TBSM</h4>
                    <p className="text-[11px] text-primary font-medium">Standar Industri Otomotif</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Menyelenggarakan pendidikan kejuruan <strong className="text-foreground">Teknik dan Bisnis Sepeda Motor (TBSM)</strong> yang relevan dengan kebutuhan industri roda dua modern.
                </p>
              </Card>

              {/* Misi 2: Karakter Santri & Pesantren */}
              <Card className="border border-border bg-card shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Karakter & Nilai Pesantren</h4>
                    <p className="text-[11px] text-emerald-600 font-medium">Akhlak & Kedisiplinan Spiritual</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Menanamkan nilai-nilai keimanan, ketakwaan, kejujuran, dan budi pekerti luhur yang terintegrasi erat dengan kultur Yayasan Pondok Pesantren Al-Falah.
                </p>
              </Card>

              {/* Misi 3: Kewirausahaan Mandiri / Bengkel */}
              <Card className="border border-border bg-card shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Kewirausahaan Mandiri</h4>
                    <p className="text-[11px] text-amber-600 font-medium">Kemandirian Usaha Bengkel</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mengembangkan jiwa <em>entrepreneurship</em> agar para lulusan mampu membuka usaha mandiri di bidang perbengkelan, servis motor, dan layanan otomotif.
                </p>
              </Card>

              {/* Misi 4: Tata Kelola SIMS & E-Office */}
              <Card className="border border-border bg-card shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Tata Kelola & SIMS Digital</h4>
                    <p className="text-[11px] text-blue-600 font-medium">Transparansi & Akuntabilitas</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Menerapkan tata kelola kelembagaan modern, persuratan <em>paperless</em>, dan transparansi kehadiran siswa melalui Sistem Informasi Manajemen Sekolah (SIMS).
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* 4. Sejarah Singkat */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="pb-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-bold">Sejarah Singkat Pendirian</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Latar belakang berdirinya SMKS AL-FALAH di Desa Sungai Deras
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              SMKS AL-FALAH didirikan atas prakarsa Yayasan Pondok Pesantren Al-Falah Teluk Pakedai untuk menjawab tantangan ketersediaan akses pendidikan kejuruan menengah bagi putra-putri daerah di wilayah Desa Sungai Deras dan sekitarnya di Kabupaten Kubu Raya, Kalimantan Barat.
            </p>
            <p>
              Melihat tingginya potensi mobilitas dan kebutuhan tenaga terampil di bidang perbengkelan motor di Kalimantan Barat, sekolah memfokuskan program keahlian pada <strong>Teknik dan Bisnis Sepeda Motor (TBSM)</strong> yang dipadukan secara harmonis dengan pembinaan karakter santri pesantren.
            </p>
            <p>
              Melalui transformasi digital terpadu dengan sistem SIMS, SMKS AL-FALAH kini menghadirkan layanan administrasi persuratan yang cepat serta transparansi absensi harian yang dapat dipantau langsung oleh orang tua siswa.
            </p>
          </CardContent>
        </Card>

        {/* 5. Struktur Organisasi Sekolah (Official Role Icons, No Flat Initial Avatars) */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Struktur Organisasi & Tenaga Pendidik
            </h2>
            <p className="text-xs text-muted-foreground">
              Jajaran pimpinan, staf tata usaha, dan dewan guru SMKS AL-FALAH
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Person 1: Kepala Sekolah (Toga/Graduation Cap Icon) */}
            <Card className="border border-border bg-card text-center p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">Dedi Irawan</h4>
                <Badge variant="default" className="text-[10px] px-2 py-0">
                  Kepala Sekolah
                </Badge>
                <p className="text-[11px] text-muted-foreground pt-1.5 leading-relaxed">
                  Penanggung Jawab Kebijakan & Mutu Pendidikan Sekolah
                </p>
              </div>
            </Card>

            {/* Person 2: Operator TU (ID Card / Contact Icon) */}
            <Card className="border border-border bg-card text-center p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 shadow-sm">
                <Contact className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">Ibrahim</h4>
                <Badge variant="secondary" className="text-[10px] px-2 py-0">
                  Staf Tata Usaha
                </Badge>
                <p className="text-[11px] text-muted-foreground pt-1.5 leading-relaxed">
                  Pengelola Dapodik, E-Office & Layanan Administrasi
                </p>
              </div>
            </Card>

            {/* Person 3: Wali Kelas & Kaprog (Wrench / Mechanic Icon) */}
            <Card className="border border-border bg-card text-center p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shadow-sm">
                <Wrench className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">M. Syaifullah, S.Pd</h4>
                <Badge variant="secondary" className="text-[10px] px-2 py-0">
                  Kaprog TBSM
                </Badge>
                <p className="text-[11px] text-muted-foreground pt-1.5 leading-relaxed">
                  Wali Kelas XII & Instruktur Kejuruan Otomotif Sepeda Motor
                </p>
              </div>
            </Card>

            {/* Person 4: Dewan Guru (Users / Teaching Staff Icon) */}
            <Card className="border border-border bg-card text-center p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 shadow-sm">
                <Users className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">Dewan Guru & Staf</h4>
                <Badge variant="outline" className="text-[10px] px-2 py-0">
                  18 Tenaga Pendidik
                </Badge>
                <p className="text-[11px] text-muted-foreground pt-1.5 leading-relaxed">
                  Pengampu Mata Pelajaran Normatif, Adaptif, Kejuruan & Pesantren
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
