import React from "react";
import Link from "next/link";
import {
  Wrench,
  Building2,
  BookOpen,
  School,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { FacilityCondition } from "@/lib/types/database";

interface FacilityItem {
  id: string;
  name: string;
  category: string;
  condition: FacilityCondition;
  description: string;
  image_url: string;
  capacity?: string;
}

const FACILITIES_DATA: FacilityItem[] = [
  {
    id: "fac-1",
    name: "Bengkel Praktik Teknik & Bisnis Sepeda Motor (TBSM)",
    category: "Sarana Praktik Kejuruan",
    condition: "baik",
    image_url: "/images/facility-bengkel.jpg",
    description:
      "Fasilitas bengkel kerja otomotif utama yang dilengkapi dengan toolkit servis, trainer sistem injeksi EFI, kompresor udara, mesin uji kelistrikan, dan unit motor praktik untuk siswa kelas X, XI, dan XII.",
    capacity: "Kapasitas 35 Siswa / Sesi",
  },
  {
    id: "fac-2",
    name: "Ruang Kelas Teori (3 Ruang Belajar)",
    category: "Sarana Pembelajaran Teori",
    condition: "rusak_sedang",
    image_url: "/images/facility-kelas.jpg",
    description:
      "Ruang kelas reguler untuk kegiatan pembelajaran teori mata pelajaran umum dan dasar kejuruan. Saat ini dalam proses pengajuan program renovasi berkala sarpras pendidikan.",
    capacity: "3 Rombel (Kelas X, XI, XII)",
  },
  {
    id: "fac-3",
    name: "Perpustakaan & Ruang Baca Sekolah",
    category: "Sumber Belajar",
    condition: "baik",
    image_url: "/images/facility-perpus.jpg",
    description:
      "Menyediakan koleksi buku teks pelajaran Kurikulum Merdeka/K13, modul teknik otomotif sepeda motor, majalah teknologi, serta buku-buku literatur keagamaan Islam.",
    capacity: "Koleksi 1.200+ Eksemplar",
  },
  {
    id: "fac-4",
    name: "Masjid Yayasan Ponpes Al-Falah",
    category: "Sarana Peribadatan & Karakter",
    condition: "baik",
    image_url: "/images/facility-masjid.jpg",
    description:
      "Pusat pembinaan keagamaan, sholat dhuhur berjamaah, pengajian santri, serta pembinaan akhlak mulia dan kedisiplinan spiritual seluruh siswa.",
    capacity: "Kapasitas 250 Jamaah",
  },
  {
    id: "fac-5",
    name: "Ruang Tata Usaha & Pusat Operasional SIMS",
    category: "Layanan Administrasi",
    condition: "baik",
    image_url: "/images/facility-tu.jpg",
    description:
      "Pusat pelayanan administrasi persuratan dinas, pengelolaan arsip digital sekolah, verifikasi data presensi siswa, dan layanan data induk kependidikan Dapodik.",
    capacity: "Staf TU & Operator Sekolah",
  },
  {
    id: "fac-6",
    name: "Lapangan Upacara & Olahraga",
    category: "Sarana Ekstrakurikuler",
    condition: "baik",
    image_url: "/images/facility-lapangan.jpg",
    description:
      "Area terbuka multifungsi untuk pelaksanaan upacara bendera setiap hari Senin, senam pagi bersama, serta aktivitas olahraga bola voli dan futsal antarsantri.",
    capacity: "Seluruh Siswa & Dewan Guru",
  },
];

const CONDITION_BADGE_MAP: Record<
  FacilityCondition,
  { label: string; variant: "success" | "warning" | "destructive" | "default" | "secondary" | "outline" }
> = {
  baik: { label: "Kondisi Baik", variant: "success" },
  rusak_ringan: { label: "Rusak Ringan", variant: "default" },
  rusak_sedang: { label: "Rusak Sedang", variant: "warning" },
  rusak_berat: { label: "Rusak Berat", variant: "destructive" },
};

export default function FasilitasPage() {
  return (
    <div className="flex flex-col py-10 sm:py-16 space-y-12 sm:space-y-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            SARANA & PRASARANA
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Fasilitas Pembelajaran SMKS AL-FALAH
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Daftar inventaris sarana dan prasarana penunjang kegiatan belajar mengajar kejuruan otomotif TBSM dan pembinaan karakter di SMKS AL-FALAH Telok Pakedai.
          </p>
        </div>

        {/* Transparency Disclaimer Alert (Clean Formal Language, No Software Engineering Jargon) */}
        <Alert variant="default" className="border border-border bg-secondary/40">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-xs font-semibold text-foreground">
            Transparansi & Akuntabilitas Sarana Prasarana Sekolah
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            Dokumentasi kondisi fisik sarana prasarana disajikan secara faktual dan transparan sebagai wujud akuntabilitas publik serta komitmen peningkatan mutu sekolah kepada masyarakat, orang tua siswa, dan dinas pendidikan.
          </AlertDescription>
        </Alert>

        {/* Facilities Grid with Unique Authentic Images per Facility */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES_DATA.map((fac) => {
            const badge = CONDITION_BADGE_MAP[fac.condition];
            return (
              <Card
                key={fac.id}
                className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="h-48 overflow-hidden border-b border-border bg-muted">
                    <img
                      src={fac.image_url}
                      alt={fac.name}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="p-5 pb-2 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {fac.category}
                      </span>
                      <Badge variant={badge.variant} className="text-[10px] px-2 py-0">
                        {badge.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground leading-snug">
                      {fac.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                    <p>{fac.description}</p>
                  </CardContent>
                </div>
                {fac.capacity && (
                  <div className="px-5 py-3 border-t border-border/60 bg-secondary/30 text-[11px] font-medium text-foreground flex items-center justify-between">
                    <span>Keterangan Kapasitas:</span>
                    <span className="text-primary font-semibold">{fac.capacity}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
