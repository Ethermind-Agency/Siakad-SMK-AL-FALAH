"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  BookOpen,
  School,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";

const FACILITIES_DATA = [
  {
    name: "Bengkel Praktik TBSM",
    condition: "baik",
    statusLabel: "Kondisi Baik (Prima)",
    variant: "success" as const,
    description: "Peralatan toolkit servis otomotif, bike lift, kompresor, dan unit motor praktik lengkap sesuai standar industri.",
    image_url: "/images/facility-bengkel.jpg",
  },
  {
    name: "Ruang Kelas Teori (3 Ruang)",
    condition: "rusak_sedang",
    statusLabel: "Perlu Perbaikan (Rusak Sedang)",
    variant: "warning" as const,
    description: "Ruang kelas aktif kelas X, XI, XII. Memerlukan pemeliharaan plafon dan ventilasi udara.",
    image_url: "/images/facility-kelas.jpg",
  },
  {
    name: "Ruang Perpustakaan",
    condition: "baik",
    statusLabel: "Kondisi Baik",
    variant: "success" as const,
    description: "Koleksi buku teks kejuruan otomotif, modul pelajaran, dan buku referensi keagamaan santri.",
    image_url: "/images/facility-perpus.jpg",
  },
  {
    name: "Masjid Yayasan Ponpes Al-Falah",
    condition: "baik",
    statusLabel: "Kondisi Baik",
    variant: "success" as const,
    description: "Pusat kegiatan ibadah harian, sholat dhuhur berjamaah, dan pembinaan karakter santri & siswa.",
    image_url: "/images/facility-masjid.jpg",
  },
];

export default function MonitoringProfilAsetPage() {
  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Kondisi Fasilitas
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit kelaikan sarana prasarana dan inventaris sekolah
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/fasilitas" target="_blank">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Laman Publik
          </Link>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Sarpras Layak Pakai"
          value="5 dari 6"
          icon={CheckCircle2}
        />
        <StatCard
          title="Perlu Pemeliharaan"
          value="1"
          badgeText="Prioritas 1"
          badgeVariant="warning"
          icon={AlertTriangle}
        />
        <StatCard
          title="Akreditasi BAN-PDM"
          value="C (Aktif)"
          icon={ShieldCheck}
        />
      </div>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {FACILITIES_DATA.map((fac, idx) => (
          <Card key={idx} className="border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden border-b border-border bg-muted relative">
                <img
                  src={fac.image_url}
                  alt={fac.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={fac.variant} className="text-[10px] shadow-md">
                    {fac.statusLabel}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold text-foreground">
                  {fac.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed">
                <p>{fac.description}</p>
              </CardContent>
            </div>

            <CardFooter className="border-t border-border p-3 bg-secondary/30 text-xs text-muted-foreground flex items-center justify-between">
              <span className="font-medium text-foreground">Status Audit: Terverifikasi</span>
              <span className="font-mono text-[11px]">Tahun 2026/2027</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
