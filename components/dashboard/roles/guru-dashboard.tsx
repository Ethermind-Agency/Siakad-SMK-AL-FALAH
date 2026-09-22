"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CalendarCheck,
  CheckSquare,
  AlertTriangle,
  ClipboardList,
  Download,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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

interface CriticalStudent {
  id: string;
  nisn: string;
  full_name: string;
  attendance_rate: number;
  alpa_count: number;
  last_status: string;
}

interface RecentAttendanceLog {
  date: string;
  day_name: string;
  is_filled: boolean;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
}

interface GuruDashboardData {
  homeroomClass: {
    id: string;
    name: string;
    grade_level: number;
    total_students: number;
    academic_year: string;
  };
  todayStatus: {
    is_filled: boolean;
    filled_at?: string;
    hadir: number;
    izin: number;
    sakit: number;
    alpa: number;
  };
  monthlyAttendanceRate: number;
  criticalStudents: CriticalStudent[];
  recentLogs: RecentAttendanceLog[];
}

export function GuruDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GuruDashboardData | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      setData({
        homeroomClass: {
          id: "class-10-tbsm",
          name: "X TBSM",
          grade_level: 10,
          total_students: 36,
          academic_year: "2026/2027",
        },
        todayStatus: {
          is_filled: true,
          filled_at: "07:45 WIB",
          hadir: 34,
          izin: 1,
          sakit: 1,
          alpa: 0,
        },
        monthlyAttendanceRate: 95.8,
        criticalStudents: [
          {
            id: "std-001",
            nisn: "0081234567",
            full_name: "Ahmad Fauzi",
            attendance_rate: 76.5,
            alpa_count: 3,
            last_status: "ALPA",
          },
          {
            id: "std-002",
            nisn: "0087654321",
            full_name: "Budi Santoso",
            attendance_rate: 79.0,
            alpa_count: 2,
            last_status: "SAKIT",
          },
        ],
        recentLogs: [
          {
            date: "2026-09-22",
            day_name: "Selasa",
            is_filled: true,
            hadir: 34,
            izin: 1,
            sakit: 1,
            alpa: 0,
          },
          {
            date: "2026-09-21",
            day_name: "Senin",
            is_filled: true,
            hadir: 35,
            izin: 0,
            sakit: 1,
            alpa: 0,
          },
          {
            date: "2026-09-19",
            day_name: "Sabtu",
            is_filled: true,
            hadir: 33,
            izin: 2,
            sakit: 1,
            alpa: 0,
          },
          {
            date: "2026-09-18",
            day_name: "Jumat",
            is_filled: true,
            hadir: 34,
            izin: 1,
            sakit: 0,
            alpa: 1,
          },
        ],
      });
    } catch (err: any) {
      console.error("Failed to load guru dashboard:", err);
      setError(err.message || "Gagal memuat dashboard guru.");
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
        title="Gagal Memuat Dashboard"
        message={error || "Terjadi kesalahan saat memproses data absensi."}
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Presensi Wali Kelas — {data.homeroomClass.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pencatatan presensi harian dan pembinaan kehadiran siswa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="h-8 text-xs bg-primary text-primary-foreground">
            <Link href="/guru/absensi/harian">
              <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
              Input Presensi Hari Ini
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/guru/absensi/rekap">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Unduh Rekap
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert Banner for Today's Attendance */}
      {data.todayStatus.is_filled ? (
        <Alert variant="success" className="border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-xs font-semibold">Presensi Hari Ini Telah Terisi</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Tercatat pukul {data.todayStatus.filled_at} (Hadir: {data.todayStatus.hadir}, Izin: {data.todayStatus.izin}, Sakit: {data.todayStatus.sakit}, Alpa: {data.todayStatus.alpa}).
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="warning" className="border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 py-3">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-xs font-semibold">Presensi Belum Diisi</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Segera lakukan input presensi siswa kelas binaan Anda untuk hari ini.
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Row - Clean Data First */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Siswa di Kelas Binaan"
          value={data.homeroomClass.total_students}
          icon={GraduationCap}
        />
        <StatCard
          title="Status Presensi Hari Ini"
          value={data.todayStatus.is_filled ? "Tercatat" : "Belum Diisi"}
          badgeText={data.todayStatus.is_filled ? "Selesai" : "Pending"}
          badgeVariant={data.todayStatus.is_filled ? "success" : "warning"}
          icon={CalendarCheck}
        />
        <StatCard
          title="Rata-rata Bulan Ini"
          value={`${data.monthlyAttendanceRate}%`}
          icon={ClipboardList}
        />
        <StatCard
          title="Perlu Perhatian"
          value={data.criticalStudents.length}
          badgeText={data.criticalStudents.length > 0 ? "Perlu Pembinaan" : undefined}
          badgeVariant="destructive"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Recent Attendance Logs */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Riwayat Presensi 7 Hari Terakhir
            </CardTitle>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-[11px]">
              <Link href="/guru/absensi/rekap">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Tanggal & Hari</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Hadir</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Izin</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Sakit</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Alpa</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentLogs.map((log, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-medium py-3">
                        <span className="font-semibold text-foreground block">{log.day_name}</span>
                        <span className="text-[11px] text-muted-foreground">{log.date}</span>
                      </TableCell>
                      <TableCell className="text-xs text-center font-semibold text-emerald-600 py-3">
                        {log.hadir}
                      </TableCell>
                      <TableCell className="text-xs text-center font-semibold text-blue-600 py-3">
                        {log.izin}
                      </TableCell>
                      <TableCell className="text-xs text-center font-semibold text-amber-600 py-3">
                        {log.sakit}
                      </TableCell>
                      <TableCell className="text-xs text-center font-semibold text-destructive py-3">
                        {log.alpa}
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <Badge variant="success" className="text-[10px] font-normal px-1.5 py-0">
                          Terekam
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Critical Attention List */}
        <div className="space-y-5">
          <Card className="border border-border">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Siswa Perlu Pembinaan</CardTitle>
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                {data.criticalStudents.length} Siswa
              </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2">
              {data.criticalStudents.map((std) => (
                <div
                  key={std.id}
                  className="rounded border border-destructive/20 bg-destructive/5 p-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">{std.full_name}</p>
                    <span className="font-mono text-xs font-bold text-destructive">
                      {std.attendance_rate}%
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    NISN: {std.nisn} • Alpa: <span className="font-semibold text-destructive">{std.alpa_count} hari</span>
                  </p>
                </div>
              ))}
              <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs h-8 px-2 font-normal text-muted-foreground hover:text-foreground mt-1">
                <Link href="/guru/siswa">
                  <span>Daftar Siswa Kelas</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Action Mapel */}
          <Card className="border border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Presensi Mata Pelajaran</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <Button asChild variant="outline" className="w-full justify-start text-xs h-8">
                <Link href="/guru/absensi/mapel">
                  <BookOpen className="mr-2 h-3.5 w-3.5 text-primary" />
                  Buka Presensi Mapel
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
