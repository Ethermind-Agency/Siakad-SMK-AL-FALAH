"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Search,
  Filter,
  GraduationCap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";

interface ClassAttendanceData {
  class_name: string;
  grade_level: number;
  homeroom_teacher: string;
  total_students: number;
  percentage: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
}

const CLASS_RECAP_DATA: ClassAttendanceData[] = [
  {
    class_name: "X TBSM (Teknik Bisnis Sepeda Motor)",
    grade_level: 10,
    homeroom_teacher: "M. Syaifullah, S.Pd",
    total_students: 36,
    percentage: 95.2,
    hadir: 34,
    izin: 1,
    sakit: 1,
    alpa: 0,
  },
  {
    class_name: "XI TBSM (Teknik Bisnis Sepeda Motor)",
    grade_level: 11,
    homeroom_teacher: "Siti Rohmah, S.Pd",
    total_students: 34,
    percentage: 92.6,
    hadir: 31,
    izin: 1,
    sakit: 2,
    alpa: 0,
  },
  {
    class_name: "XII TBSM (Teknik Bisnis Sepeda Motor)",
    grade_level: 12,
    homeroom_teacher: "Ahmad Dahlan, S.T",
    total_students: 34,
    percentage: 93.6,
    hadir: 32,
    izin: 1,
    sakit: 0,
    alpa: 1,
  },
];

const STUDENTS_NEEDING_ATTENTION = [
  {
    name: "Rizky Alamsyah",
    nisn: "0081234508",
    class_name: "XI TBSM",
    rate: 76.5,
    alpa_count: 4,
    parent_phone: "0853-9988-7708",
    note: "Akumulasi 4 kali tanpa keterangan dalam 1 bulan terakhir",
  },
  {
    name: "Wahyu Hidayat",
    nisn: "0071234512",
    class_name: "XII TBSM",
    rate: 79.2,
    alpa_count: 3,
    parent_phone: "0812-4433-2211",
    note: "Sering izin terlambat saat jam praktik bengkel",
  },
];

export default function MonitoringAbsensiPage() {
  const [selectedDate, setSelectedDate] = useState("2026-09-22");

  useEffect(() => {
    try {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    } catch {}
  }, []);

  const totalStudents = 104;
  const overallPercentage = 93.8;
  const totalHadir = 97;
  const totalIzin = 3;
  const totalSakit = 3;
  const totalAlpa = 1;

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Rekapitulasi Presensi Siswa
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitoring kehadiran harian seluruh rombel dan evaluasi pembinaan
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={() => alert("Mengunduh laporan rekapitulasi presensi CSV...")}
        >
          <FileDown className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
          Ekspor CSV
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tingkat Kehadiran"
          value={`${overallPercentage}%`}
          icon={BarChart3}
        />
        <StatCard
          title="Hadir Hari Ini"
          value={`${totalHadir}/${totalStudents}`}
          icon={Users}
        />
        <StatCard
          title="Izin & Sakit"
          value={totalIzin + totalSakit}
          icon={Calendar}
        />
        <StatCard
          title="Alpa"
          value={totalAlpa}
          badgeText={totalAlpa > 0 ? "1 Alpa" : undefined}
          badgeVariant="warning"
          icon={AlertTriangle}
        />
      </div>

      {/* Class Level Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CLASS_RECAP_DATA.map((cls, idx) => (
          <Card key={idx} className="border border-border bg-card shadow-sm">
            <CardHeader className="p-4 pb-2 border-b border-border bg-secondary/30">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">{cls.class_name}</span>
                <span className="font-bold text-xs text-primary">{cls.percentage}%</span>
              </div>
              <CardDescription className="text-[11px]">
                Wali Kelas: {cls.homeroom_teacher}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <Progress value={cls.percentage} className="h-2" />
              <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-border">
                <div className="rounded bg-emerald-500/10 p-1.5 border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-800 font-semibold">Hadir</p>
                  <p className="font-bold text-sm text-emerald-700">{cls.hadir}</p>
                </div>
                <div className="rounded bg-blue-500/10 p-1.5 border border-blue-500/20">
                  <p className="text-[10px] text-blue-800 font-semibold">Izin</p>
                  <p className="font-bold text-sm text-blue-700">{cls.izin}</p>
                </div>
                <div className="rounded bg-amber-500/10 p-1.5 border border-amber-500/20">
                  <p className="text-[10px] text-amber-800 font-semibold">Sakit</p>
                  <p className="font-bold text-sm text-amber-700">{cls.sakit}</p>
                </div>
                <div className="rounded bg-rose-500/10 p-1.5 border border-rose-500/20">
                  <p className="text-[10px] text-rose-800 font-semibold">Alpa</p>
                  <p className="font-bold text-sm text-rose-700">{cls.alpa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Attention Students */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Siswa Memerlukan Pembinaan Khusus
                </CardTitle>
                <CardDescription className="text-xs">
                  Daftar siswa dengan kehadiran &lt;80% atau akumulasi ketidakhadiran tanpa izin
                </CardDescription>
              </div>
            </div>
            <Badge variant="warning" className="text-xs">
              {STUDENTS_NEEDING_ATTENTION.length} Siswa
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Nama Siswa & NISN</TableHead>
                  <TableHead className="text-xs font-semibold">Kelas</TableHead>
                  <TableHead className="text-xs font-semibold">Persentase Kehadiran</TableHead>
                  <TableHead className="text-xs font-semibold">Total Alpa</TableHead>
                  <TableHead className="text-xs font-semibold">Kontak Orang Tua</TableHead>
                  <TableHead className="text-xs font-semibold">Catatan Pembinaan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENTS_NEEDING_ATTENTION.map((student, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/40">
                    <TableCell className="text-xs">
                      <p className="font-bold text-foreground">{student.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{student.nisn}</p>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="text-[10px]">
                        {student.class_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-bold text-amber-600">{student.rate}%</span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="destructive" className="text-[10px]">
                        {student.alpa_count} Kali Alpa
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {student.parent_phone}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      {student.note}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
