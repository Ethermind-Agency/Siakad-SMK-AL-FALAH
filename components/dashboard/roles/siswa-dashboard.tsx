"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  School,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ErrorState } from "@/components/dashboard/error-state";
import type { AttendanceStatus } from "@/lib/types/database";

interface AttendanceRecord {
  id: string;
  date: string;
  day_name: string;
  status: AttendanceStatus;
  notes?: string | null;
  verified_by: string;
}

interface SiswaDashboardData {
  studentProfile: {
    nisn: string;
    full_name: string;
    class_name: string;
    academic_year: string;
    homeroom_teacher: string;
  };
  summary: {
    attendance_rate: number;
    total_effective_days: number;
    hadir: number;
    izin: number;
    sakit: number;
    alpa: number;
  };
  recentRecords: AttendanceRecord[];
  announcements: {
    id: string;
    title: string;
    date: string;
    category: string;
  }[];
}

const STATUS_BADGE_MAP: Record<AttendanceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  HADIR: { label: "HADIR", variant: "success" },
  IZIN: { label: "IZIN", variant: "default" },
  SAKIT: { label: "SAKIT", variant: "warning" },
  ALPA: { label: "ALPA", variant: "destructive" },
};

export function SiswaDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SiswaDashboardData | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      setData({
        studentProfile: {
          nisn: "0089876543",
          full_name: "Rizki Ramadhan",
          class_name: "XII TBSM",
          academic_year: "2026/2027",
          homeroom_teacher: "Bpk. M. Syaifullah, S.Pd",
        },
        summary: {
          attendance_rate: 96.2,
          total_effective_days: 52,
          hadir: 50,
          izin: 1,
          sakit: 1,
          alpa: 0,
        },
        recentRecords: [
          {
            id: "att-1",
            date: "2026-09-22",
            day_name: "Selasa",
            status: "HADIR",
            notes: "Tepat waktu",
            verified_by: "Wali Kelas",
          },
          {
            id: "att-2",
            date: "2026-09-21",
            day_name: "Senin",
            status: "HADIR",
            notes: "Mengikuti upacara",
            verified_by: "Wali Kelas",
          },
          {
            id: "att-3",
            date: "2026-09-19",
            day_name: "Sabtu",
            status: "HADIR",
            notes: "Praktik bengkel TBSM",
            verified_by: "Wali Kelas",
          },
          {
            id: "att-4",
            date: "2026-09-18",
            day_name: "Jumat",
            status: "IZIN",
            notes: "Keperluan keluarga",
            verified_by: "Wali Kelas",
          },
          {
            id: "att-5",
            date: "2026-09-17",
            day_name: "Kamis",
            status: "HADIR",
            notes: "-",
            verified_by: "Wali Kelas",
          },
        ],
        announcements: [
          {
            id: "ann-1",
            title: "Jadwal Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil",
            date: "2026-09-28",
            category: "Akademik",
          },
          {
            id: "ann-2",
            title: "Kunjungan Industri Siswa TBSM ke Astra Motor Pontianak",
            date: "2026-10-05",
            category: "Kejuruan",
          },
        ],
      });
    } catch (err: any) {
      console.error("Failed to load siswa dashboard:", err);
      setError(err.message || "Gagal memuat rekap kehadiran siswa.");
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
      </div>
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Gagal Memuat Rekap Kehadiran"
        message={error || "Terjadi kesalahan saat memuat data."}
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Profile Card - Clean Enterprise Header */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground">
                {data.studentProfile.full_name}
              </h1>
              <span className="text-xs text-muted-foreground font-mono">
                (NISN: {data.studentProfile.nisn})
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kelas: <span className="font-semibold text-foreground">{data.studentProfile.class_name}</span> • Wali Kelas: {data.studentProfile.homeroom_teacher}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-muted-foreground block">Persentase Kehadiran</span>
            <span className="text-2xl font-bold text-emerald-600">
              {data.summary.attendance_rate}%
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Hadir"
          value={`${data.summary.hadir} Hari`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Total Izin"
          value={`${data.summary.izin} Hari`}
          icon={CalendarCheck}
        />
        <StatCard
          title="Total Sakit"
          value={`${data.summary.sakit} Hari`}
          icon={Clock}
        />
        <StatCard
          title="Tanpa Keterangan (Alpa)"
          value={`${data.summary.alpa} Hari`}
          badgeText={data.summary.alpa === 0 ? "Nol Alpa" : "Perhatian"}
          badgeVariant={data.summary.alpa === 0 ? "success" : "destructive"}
          icon={AlertCircle}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Recent Attendance Records */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="p-4 sm:p-5 pb-3">
            <CardTitle className="text-sm font-semibold">
              Riwayat Presensi Terkini
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Tanggal & Hari</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold">Keterangan</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Verifikasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentRecords.map((rec) => {
                    const badge = STATUS_BADGE_MAP[rec.status];
                    return (
                      <TableRow key={rec.id} className="hover:bg-muted/30">
                        <TableCell className="text-xs font-medium py-3">
                          <span className="font-semibold text-foreground block">{rec.day_name}</span>
                          <span className="text-[11px] text-muted-foreground">{rec.date}</span>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant={badge.variant} className="text-[10px] font-normal px-1.5 py-0">
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground py-3">
                          {rec.notes || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-right text-muted-foreground py-3">
                          {rec.verified_by}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Announcements & Contact */}
        <div className="space-y-5">
          <Card className="border border-border">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Pengumuman Sekolah</CardTitle>
              <Button asChild variant="link" size="sm" className="h-auto p-0 text-[11px]">
                <Link href="/siswa/pengumuman">Semua</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2">
              {data.announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="rounded border border-border/70 p-2.5 bg-muted/20 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{ann.category}</span>
                    <span>{ann.date}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-snug">
                    {ann.title}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2">
                <School className="h-3.5 w-3.5 text-muted-foreground" />
                <CardTitle className="text-xs font-semibold">Layanan Bantuan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-muted-foreground">
              <p>Jika ada ketidaksesuaian catatan kehadiran, silakan konfirmasi langsung ke Wali Kelas.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
