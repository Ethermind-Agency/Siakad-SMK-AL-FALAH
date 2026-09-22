"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/stat-card";
import type { AttendanceStatus } from "@/lib/types/database";

interface DailyRecord {
  id: string;
  date: string;
  dayName: string;
  timeIn: string;
  status: AttendanceStatus;
  notes: string;
  verifiedBy: string;
}

const ATTENDANCE_RECORDS: DailyRecord[] = [
  { id: "1", date: "2026-09-22", dayName: "Selasa", timeIn: "06:50 WIB", status: "HADIR", notes: "Tepat waktu", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "2", date: "2026-09-21", dayName: "Senin", timeIn: "06:45 WIB", status: "HADIR", notes: "Mengikuti upacara bendera", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "3", date: "2026-09-19", dayName: "Sabtu", timeIn: "06:55 WIB", status: "HADIR", notes: "Praktik bengkel TBSM", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "4", date: "2026-09-18", dayName: "Jumat", timeIn: "-", status: "IZIN", notes: "Keperluan keluarga di Pontianak", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "5", date: "2026-09-17", dayName: "Kamis", timeIn: "06:48 WIB", status: "HADIR", notes: "-", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "6", date: "2026-09-16", dayName: "Rabu", timeIn: "06:52 WIB", status: "HADIR", notes: "-", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "7", date: "2026-09-15", dayName: "Selasa", timeIn: "06:50 WIB", status: "HADIR", notes: "-", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "8", date: "2026-09-14", dayName: "Senin", timeIn: "06:40 WIB", status: "HADIR", notes: "-", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "9", date: "2026-09-12", dayName: "Sabtu", timeIn: "06:55 WIB", status: "HADIR", notes: "-", verifiedBy: "M. Syaifullah, S.Pd" },
  { id: "10", date: "2026-09-11", dayName: "Jumat", timeIn: "-", status: "SAKIT", notes: "Demam ringan (surat ortu)", verifiedBy: "M. Syaifullah, S.Pd" },
];

export default function SiswaKehadiranPage() {
  const [selectedMonth, setSelectedMonth] = useState("09-2026");

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
              Buku Kehadiran Saya
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rizki Ramadhan • NISN: 0089876543 • Kelas XII TBSM • Wali Kelas: M. Syaifullah, S.Pd
            </p>
          </div>
        </div>

        <div className="w-[180px]">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09-2026">September 2026</SelectItem>
              <SelectItem value="08-2026">Agustus 2026</SelectItem>
              <SelectItem value="07-2026">Juli 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info Notice */}
      <Alert className="border border-primary/20 bg-primary/5 py-3">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Ketentuan Syarat Ujian & Prakerin</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Siswa wajib memenuhi kehadiran minimal 85% hari efektif untuk dapat mengikuti Penilaian Tengah Semester (PTS) dan Sidang Laporan Praktik Kerja Lapangan (PKL).
        </AlertDescription>
      </Alert>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          title="Total Hadir"
          value="50 Hari"
          icon={CheckCircle2}
        />
        <StatCard
          title="Total Izin"
          value="1 Hari"
          icon={CalendarCheck}
        />
        <StatCard
          title="Total Sakit"
          value="1 Hari"
          icon={Clock}
        />
        <StatCard
          title="Tanpa Keterangan"
          value="0 Hari"
          badgeText="Nol Alpa"
          badgeVariant="success"
          icon={AlertCircle}
        />
      </div>

      {/* Attendance Log Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-sm font-semibold">
            Riwayat Presensi Harian — September 2026
          </CardTitle>
          <CardDescription className="text-xs">
            Catatan kedatangan harian yang telah diverifikasi oleh Wali Kelas
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-semibold">No</TableHead>
                  <TableHead className="w-36 text-xs font-semibold">Tanggal & Hari</TableHead>
                  <TableHead className="w-28 text-xs font-semibold">Jam Hadir</TableHead>
                  <TableHead className="w-24 text-xs font-semibold">Status</TableHead>
                  <TableHead className="min-w-[200px] text-xs font-semibold">Keterangan</TableHead>
                  <TableHead className="w-44 text-right text-xs font-semibold pr-4">Pemverifikasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ATTENDANCE_RECORDS.map((rec, idx) => (
                  <TableRow key={rec.id} className="hover:bg-muted/30">
                    <TableCell className="text-center text-xs text-muted-foreground font-mono">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      <span className="font-semibold block">{rec.dayName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{rec.date}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {rec.timeIn}
                    </TableCell>
                    <TableCell>
                      {rec.status === "HADIR" ? (
                        <Badge variant="success" className="text-[10px] font-normal">
                          Hadir
                        </Badge>
                      ) : rec.status === "IZIN" ? (
                        <Badge variant="default" className="text-[10px] font-normal">
                          Izin
                        </Badge>
                      ) : rec.status === "SAKIT" ? (
                        <Badge variant="warning" className="text-[10px] font-normal">
                          Sakit
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] font-normal">
                          Alpa
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {rec.notes}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground pr-4">
                      {rec.verifiedBy}
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
