"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Mail,
  Send,
  Plus,
  FileText,
  Newspaper,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import type { LetterStatus, LetterType } from "@/lib/types/database";

interface RecentLetterItem {
  id: string;
  type: LetterType;
  letter_number: string;
  subject: string;
  sender_or_recipient: string;
  date: string;
  status: LetterStatus;
  has_file: boolean;
}

interface AdminDashboardData {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    incomingLetters: number;
    outgoingLetters: number;
    pendingApproval: number;
    publishedNews: number;
  };
  recentLetters: RecentLetterItem[];
  recentNews: {
    id: string;
    title: string;
    published_at: string;
    status: string;
  }[];
}

const STATUS_BADGE_MAP: Record<LetterStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  draft: { label: "Draft", variant: "secondary" },
  pending: { label: "Menunggu Kepsek", variant: "warning" },
  approved: { label: "Disetujui", variant: "success" },
  rejected: { label: "Ditolak", variant: "destructive" },
  archived: { label: "Diarsipkan", variant: "outline" },
};

export function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/letters/outgoing?limit=5");
      let lettersList: RecentLetterItem[] = [];

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          lettersList = json.data.map((item: any) => ({
            id: item.id,
            type: "outgoing" as LetterType,
            letter_number: item.letter_number,
            subject: item.subject,
            sender_or_recipient: item.recipient,
            date: item.created_at ? item.created_at.split("T")[0] : "2026-09-22",
            status: item.status,
            has_file: !!item.file_url,
          }));
        }
      }

      if (lettersList.length === 0) {
        lettersList = [
          {
            id: "1",
            type: "outgoing",
            letter_number: "421/042/SMK-AF/IX/2026",
            subject: "Undangan Rapat Koordinasi Komite Sekolah",
            sender_or_recipient: "Orang Tua / Wali Siswa",
            date: "2026-09-20",
            status: "approved",
            has_file: true,
          },
          {
            id: "2",
            type: "incoming",
            letter_number: "005/DISDIK/IX/2026",
            subject: "Pemberitahuan Pendataan Ulang Sarpras BAN-SM",
            sender_or_recipient: "Dinas Pendidikan Kab. Kubu Raya",
            date: "2026-09-18",
            status: "approved",
            has_file: true,
          },
          {
            id: "3",
            type: "outgoing",
            letter_number: "421/043/SMK-AF/IX/2026",
            subject: "Permohonan Izin Kunjungan Industri Siswa TBSM ke Astra Motor",
            sender_or_recipient: "PT Astra Motor Pontianak",
            date: "2026-09-21",
            status: "pending",
            has_file: false,
          },
          {
            id: "4",
            type: "outgoing",
            letter_number: "421/044/SMK-AF/IX/2026",
            subject: "Surat Keterangan Siswa Aktif — M. Rizki",
            sender_or_recipient: "M. Rizki (Kelas XII TBSM)",
            date: "2026-09-22",
            status: "draft",
            has_file: false,
          },
        ];
      }

      setData({
        stats: {
          totalStudents: 104,
          totalTeachers: 18,
          incomingLetters: 28,
          outgoingLetters: 43,
          pendingApproval: 2,
          publishedNews: 12,
        },
        recentLetters: lettersList,
        recentNews: [
          {
            id: "news-1",
            title: "Penerimaan Bantuan Sarana Praktik Kejuruan SMKS AL-FALAH",
            published_at: "2026-09-15",
            status: "published",
          },
          {
            id: "news-2",
            title: "Jadwal Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil",
            published_at: "2026-09-10",
            status: "published",
          },
        ],
      });
    } catch (err: any) {
      console.error("Failed to load admin dashboard:", err);
      setError(err.message || "Gagal memuat ringkasan admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 border-border">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-7 w-16" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-5 border-border">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </Card>
          <Card className="p-5 border-border">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-20 w-full mb-3" />
            <Skeleton className="h-20 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Gagal Memuat Dashboard"
        message={error || "Terjadi kesalahan saat memproses data ringkasan."}
        onRetry={fetchDashboardData}
      />
    );
  }

  const filteredLetters = data.recentLetters.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "incoming") return item.type === "incoming";
    if (activeTab === "outgoing") return item.type === "outgoing";
    if (activeTab === "pending") return item.status === "pending";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Dashboard Tata Usaha
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ringkasan persuratan dinas dan master data sekolah
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="h-8 text-xs bg-primary text-primary-foreground">
            <Link href="/admin/surat/keluar/baru">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Buat Surat Keluar
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/admin/surat/masuk">
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              Catat Surat Masuk
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row - Clean Data First */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Siswa"
          value={data.stats.totalStudents}
          icon={GraduationCap}
        />
        <StatCard
          title="Guru & Tenaga Kependidikan"
          value={data.stats.totalTeachers}
          icon={Users}
        />
        <StatCard
          title="Surat Masuk"
          value={data.stats.incomingLetters}
          icon={Mail}
        />
        <StatCard
          title="Surat Keluar"
          value={data.stats.outgoingLetters}
          badgeText={data.stats.pendingApproval > 0 ? `${data.stats.pendingApproval} Menunggu` : undefined}
          badgeVariant="warning"
          icon={Send}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Letters Overview */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="p-4 sm:p-5 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-sm font-semibold">Arsip Surat Terkini</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="h-7">
                  <TabsTrigger value="all" className="text-xs px-2.5 h-6">Semua</TabsTrigger>
                  <TabsTrigger value="outgoing" className="text-xs px-2.5 h-6">Keluar</TabsTrigger>
                  <TabsTrigger value="incoming" className="text-xs px-2.5 h-6">Masuk</TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs px-2.5 h-6">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredLetters.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="Tidak Ada Surat"
                  description="Belum ada data surat pada kategori ini."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="text-xs font-semibold w-[180px]">Nomor & Jenis</TableHead>
                      <TableHead className="text-xs font-semibold min-w-[260px]">Perihal & Pihak</TableHead>
                      <TableHead className="text-xs font-semibold w-[90px]">Tanggal</TableHead>
                      <TableHead className="text-xs font-semibold w-[120px]">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-right w-[70px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLetters.map((item) => {
                      const badgeInfo = STATUS_BADGE_MAP[item.status] || {
                        label: item.status,
                        variant: "outline",
                      };

                      return (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="text-xs py-3">
                            <span className="font-mono font-medium block">{item.letter_number}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {item.type === "incoming" ? "Surat Masuk" : "Surat Keluar"}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs py-3">
                            <p className="font-medium text-foreground line-clamp-2 leading-snug">
                              {item.subject}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                              {item.type === "incoming" ? `Dari: ${item.sender_or_recipient}` : `Kepada: ${item.sender_or_recipient}`}
                            </p>
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap text-muted-foreground py-3">
                            {item.date}
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge variant={badgeInfo.variant} className="text-[10px] font-normal px-1.5 py-0">
                              {badgeInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              asChild
                            >
                              <Link href={item.type === "incoming" ? "/admin/surat/masuk" : "/admin/surat/keluar"}>
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                Buka
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right 1 Col: Quick Links & CMS */}
        <div className="space-y-5">
          {/* Quick Nav */}
          <Card className="border border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Pintasan Menu</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-1">
              <Button asChild variant="ghost" className="w-full justify-between text-xs h-8 px-2 font-normal text-muted-foreground hover:text-foreground">
                <Link href="/admin/siswa">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-foreground" />
                    Data Siswa & Rombel
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-between text-xs h-8 px-2 font-normal text-muted-foreground hover:text-foreground">
                <Link href="/admin/cms/berita">
                  <span className="flex items-center gap-2">
                    <Newspaper className="h-3.5 w-3.5 text-foreground" />
                    Publikasi Berita
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-between text-xs h-8 px-2 font-normal text-muted-foreground hover:text-foreground">
                <Link href="/admin/cms/fasilitas">
                  <span className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-foreground" />
                    Kondisi Fasilitas
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-between text-xs h-8 px-2 font-normal text-muted-foreground hover:text-foreground">
                <Link href="/admin/pengguna">
                  <span className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-foreground" />
                    Manajemen Pengguna
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent News */}
          <Card className="border border-border">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Warta Terbaru</CardTitle>
              <Button asChild variant="link" size="sm" className="h-auto p-0 text-[11px]">
                <Link href="/admin/cms/berita">Lihat Semua</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2">
              {data.recentNews.map((news) => (
                <div key={news.id} className="rounded border border-border/70 p-2.5 bg-muted/20">
                  <p className="text-xs font-medium text-foreground line-clamp-2">
                    {news.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {news.published_at}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
