"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  Search,
  Tag,
  Clock,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface AnnouncementItem {
  id: string;
  title: string;
  category: "Akademik" | "PKL / Industri" | "Kesiswaan" | "Umum";
  date: string;
  author: string;
  content: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Jadwal Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil TA 2026/2027",
    category: "Akademik",
    date: "2026-09-20",
    author: "Waka Kurikulum",
    content:
      "Diberitahukan kepada seluruh peserta didik kelas X, XI, dan XII SMKS AL-FALAH bahwa Penilaian Tengah Semester (PTS) Ganjil akan diselenggarakan mulai hari Senin, 28 September 2026 hingga 03 Oktober 2026. Seluruh siswa diharapkan telah menyelesaikan kewajiban administrasi dan presensi minimal 85%.",
    hasAttachment: true,
    attachmentName: "Jadwal_PTS_Ganjil_2026_SMK_ALFALAH.pdf",
  },
  {
    id: "ann-2",
    title: "Sosialisasi & Penempatan Program Praktik Kerja Lapangan (PKL) Astra Motor",
    category: "PKL / Industri",
    date: "2026-09-18",
    author: "Kaprog TBSM (Ketua Kompetensi Keahlian)",
    content:
      "Khusus siswa kelas XII TBSM yang telah terdaftar penempatan magang di jaringan bengkel resmi AHASS Astra Motor Pontianak dan sekitarnya, wajib menghadiri briefing pembekalan K3 (Kesehatan dan Keselamatan Kerja) bengkel otomotif pada hari Sabtu pukul 09.00 WIB di Bengkel Praktik TBSM.",
    hasAttachment: true,
    attachmentName: "Daftar_Plotting_PKL_Astra_2026.pdf",
  },
  {
    id: "ann-3",
    title: "Peringatan Maulid Nabi Muhammad SAW 1448 H & Doa Bersama",
    category: "Kesiswaan",
    date: "2026-09-15",
    author: "Pembina OSIS & Rohis",
    content:
      "Dalam rangka memperingati Maulid Nabi Muhammad SAW, sekolah akan mengadakan doa bersama dan ceramah agama pada hari Jumat bertempat di Masjid Utama Pondok Pesantren Al-Falah Telok Pakedai. Siswa diimbau mengenakan busana muslim rapi.",
  },
  {
    id: "ann-4",
    title: "Pemberitahuan Layanan Konseling & Helpdesk SIMS Sekolah",
    category: "Umum",
    date: "2026-09-10",
    author: "Operator Tata Usaha",
    content:
      "Bagi siswa dan wali murid yang memiliki kendala akses portal digital SIMS atau membutuhkan konsultasi pembaruan data NISN/Dapodik, silakan mengunjungi loket Tata Usaha setiap hari kerja pukul 08.00 - 14.00 WIB.",
  },
];

export default function SiswaPengumumanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered = ANNOUNCEMENTS.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || ann.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/siswa">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Pengumuman & Informasi Sekolah
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Warta resmi agenda akademik, praktik kejuruan, dan kegiatan kesiswaan SMKS AL-FALAH
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <Card className="border border-border bg-card p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="h-8 text-xs"
            >
              Semua
            </Button>
            <Button
              variant={selectedCategory === "Akademik" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("Akademik")}
              className="h-8 text-xs"
            >
              Akademik
            </Button>
            <Button
              variant={selectedCategory === "PKL / Industri" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("PKL / Industri")}
              className="h-8 text-xs"
            >
              PKL Industri
            </Button>
            <Button
              variant={selectedCategory === "Kesiswaan" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("Kesiswaan")}
              className="h-8 text-xs"
            >
              Kesiswaan
            </Button>
          </div>
        </div>
      </Card>

      {/* Announcement List Cards */}
      <div className="space-y-4">
        {filtered.map((ann) => (
          <Card key={ann.id} className="border border-border bg-card hover:border-primary/40 transition-colors">
            <CardHeader className="p-4 sm:p-5 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={ann.category === "Akademik" ? "default" : ann.category === "PKL / Industri" ? "success" : "secondary"} className="text-[10px]">
                    {ann.category}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ann.date}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Oleh: {ann.author}
                </span>
              </div>
              <CardTitle className="text-base font-semibold text-foreground mt-2">
                {ann.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-1 text-xs text-muted-foreground leading-relaxed">
              <p>{ann.content}</p>

              {ann.hasAttachment && (
                <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-muted/20 p-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground text-xs">{ann.attachmentName}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => alert(`Mengunduh berkas: ${ann.attachmentName}`)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Unduh
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
