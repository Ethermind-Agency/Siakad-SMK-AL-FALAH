"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Save,
  RotateCcw,
  ArrowLeft,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
import { StatCard } from "@/components/dashboard/stat-card";
import type { AttendanceStatus } from "@/lib/types/database";

interface StudentAttendanceItem {
  id: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  status: AttendanceStatus;
  note: string;
}

const INITIAL_STUDENTS: StudentAttendanceItem[] = [
  { id: "1", nisn: "0081234567", name: "Ahmad Fauzi", gender: "L", status: "ALPA", note: "Tanpa surat keterangan" },
  { id: "2", nisn: "0087654321", name: "Budi Santoso", gender: "L", status: "SAKIT", note: "Surat dokter Puskesmas Telok Pakedai" },
  { id: "3", nisn: "0082345678", name: "Dimas Saputra", gender: "L", status: "HADIR", note: "" },
  { id: "4", nisn: "0083456789", name: "Eko Prasetyo", gender: "L", status: "HADIR", note: "" },
  { id: "5", nisn: "0084567890", name: "Fajar Ramadhan", gender: "L", status: "IZIN", note: "Urusan keluarga di Rasau Jaya" },
  { id: "6", nisn: "0085678901", name: "Gilang Pratama", gender: "L", status: "HADIR", note: "" },
  { id: "7", nisn: "0086789012", name: "Hendra Gunawan", gender: "L", status: "HADIR", note: "" },
  { id: "8", nisn: "0087890123", name: "Ilham Maulana", gender: "L", status: "HADIR", note: "" },
  { id: "9", nisn: "0088901234", name: "Joko Wahyudi", gender: "L", status: "HADIR", note: "" },
  { id: "10", nisn: "0089012345", name: "Kevin Kurniawan", gender: "L", status: "HADIR", note: "" },
  { id: "11", nisn: "0089876543", name: "M. Rizki", gender: "L", status: "HADIR", note: "" },
  { id: "12", nisn: "0081122334", name: "M. Aditya", gender: "L", status: "HADIR", note: "" },
  { id: "13", nisn: "0082233445", name: "M. Farhan", gender: "L", status: "HADIR", note: "" },
  { id: "14", nisn: "0083344556", name: "M. Syaifullah Jr", gender: "L", status: "HADIR", note: "" },
  { id: "15", nisn: "0084455667", name: "Nur Hidayat", gender: "L", status: "HADIR", note: "" },
  { id: "16", nisn: "0085566778", name: "Pandu Wijaya", gender: "L", status: "HADIR", note: "" },
  { id: "17", nisn: "0086677889", name: "Rahmat Hidayat", gender: "L", status: "HADIR", note: "" },
  { id: "18", nisn: "0087788990", name: "Rio Febrian", gender: "L", status: "HADIR", note: "" },
  { id: "19", nisn: "0088899001", name: "Sandi Permana", gender: "L", status: "HADIR", note: "" },
  { id: "20", nisn: "0089900112", name: "Tegar Prakoso", gender: "L", status: "HADIR", note: "" },
  { id: "21", nisn: "0080011223", name: "Wahyu Setiawan", gender: "L", status: "HADIR", note: "" },
  { id: "22", nisn: "0081133557", name: "Yoga Pratama", gender: "L", status: "HADIR", note: "" },
  { id: "23", nisn: "0082244668", name: "Zaki Al-Faruq", gender: "L", status: "HADIR", note: "" },
  { id: "24", nisn: "0083355779", name: "Aditya Firmansyah", gender: "L", status: "HADIR", note: "" },
  { id: "25", nisn: "0084466880", name: "Bagus Tri Saputra", gender: "L", status: "HADIR", note: "" },
  { id: "26", nisn: "0085577991", name: "Candra Wijaya", gender: "L", status: "HADIR", note: "" },
  { id: "27", nisn: "0086688002", name: "Deni Kurniawan", gender: "L", status: "HADIR", note: "" },
  { id: "28", nisn: "0087799113", name: "Eka Maulana", gender: "L", status: "HADIR", note: "" },
  { id: "29", nisn: "0088800224", name: "Ferdi Ardiansyah", gender: "L", status: "HADIR", note: "" },
  { id: "30", nisn: "0089911335", name: "Galih Prasetya", gender: "L", status: "HADIR", note: "" },
  { id: "31", nisn: "0081022446", name: "Hafiz Ramadhan", gender: "L", status: "HADIR", note: "" },
  { id: "32", nisn: "0082133557", name: "Indra Lesmana", gender: "L", status: "HADIR", note: "" },
  { id: "33", nisn: "0083244668", name: "Lukman Hakim", gender: "L", status: "HADIR", note: "" },
  { id: "34", nisn: "0084355779", name: "Maulana Malik", gender: "L", status: "HADIR", note: "" },
  { id: "35", nisn: "0085466880", name: "Nanda Pratama", gender: "L", status: "HADIR", note: "" },
  { id: "36", nisn: "0086577991", name: "Reza Pahlevi", gender: "L", status: "HADIR", note: "" },
];

export default function AbsensiHarianPage() {
  const [selectedDate, setSelectedDate] = useState("2026-09-22");
  const [students, setStudents] = useState<StudentAttendanceItem[]>(INITIAL_STUDENTS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const hadirCount = students.filter((s) => s.status === "HADIR").length;
  const izinCount = students.filter((s) => s.status === "IZIN").length;
  const sakitCount = students.filter((s) => s.status === "SAKIT").length;
  const alpaCount = students.filter((s) => s.status === "ALPA").length;
  const totalCount = students.length;

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setSaveSuccess(false);
  };

  const handleNoteChange = (id: string, note: string) => {
    setStudents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
    setSaveSuccess(false);
  };

  const handleMarkAllHadir = () => {
    setStudents((prev) =>
      prev.map((item) => ({ ...item, status: "HADIR", note: "" }))
    );
    setSaveSuccess(false);
  };

  const handleReset = () => {
    setStudents(INITIAL_STUDENTS);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/guru">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Presensi Harian Wali Kelas
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kelas: <span className="font-semibold text-foreground">X TBSM</span> • Wali Kelas: M. Syaifullah, S.Pd • Semester Ganjil 2026/2027
            </p>
          </div>
        </div>

        {/* Date Selector & Quick Link to Recap */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-input bg-card px-2.5 py-1 text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-6 w-auto border-none p-0 text-xs shadow-none focus-visible:ring-0"
            />
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/guru/absensi/rekap">
              <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
              Lihat Rekap
            </Link>
          </Button>
        </div>
      </div>

      {/* Live Counter Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Hadir</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{hadirCount} <span className="text-xs font-normal text-muted-foreground">/ {totalCount}</span></p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Izin</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{izinCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Sakit</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{sakitCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Tanpa Keterangan (Alpa)</p>
          <p className="text-2xl font-bold text-destructive mt-1">{alpaCount}</p>
        </div>
      </div>

      {/* Interactive Attendance Table Card */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border">
          <div>
            <CardTitle className="text-sm font-semibold">
              Daftar Siswa Kelas X TBSM ({totalCount} Siswa)
            </CardTitle>
            <CardDescription className="text-xs">
              Pilih status kehadiran untuk masing-masing siswa dan sertakan catatan jika berhalangan.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllHadir}
              className="h-8 text-xs"
            >
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
              Tandai Semua Hadir
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs text-muted-foreground"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-semibold">No</TableHead>
                  <TableHead className="w-32 text-xs font-semibold">NISN</TableHead>
                  <TableHead className="min-w-[200px] text-xs font-semibold">Nama Lengkap Siswa</TableHead>
                  <TableHead className="w-20 text-center text-xs font-semibold">L/P</TableHead>
                  <TableHead className="w-[280px] text-center text-xs font-semibold">Status Kehadiran</TableHead>
                  <TableHead className="min-w-[220px] text-xs font-semibold">Keterangan / Alasan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, idx) => {
                  return (
                    <TableRow key={student.id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-xs text-muted-foreground font-mono">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {student.nisn}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {student.gender}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Hadir Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "HADIR")}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                              student.status === "HADIR"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "border border-border text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            Hadir
                          </button>

                          {/* Izin Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "IZIN")}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                              student.status === "IZIN"
                                ? "bg-blue-600 text-white shadow-xs"
                                : "border border-border text-muted-foreground hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            Izin
                          </button>

                          {/* Sakit Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "SAKIT")}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                              student.status === "SAKIT"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "border border-border text-muted-foreground hover:bg-amber-50 hover:text-amber-700"
                            }`}
                          >
                            Sakit
                          </button>

                          {/* Alpa Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "ALPA")}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                              student.status === "ALPA"
                                ? "bg-destructive text-destructive-foreground shadow-xs"
                                : "border border-border text-muted-foreground hover:bg-red-50 hover:text-red-700"
                            }`}
                          >
                            Alpa
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 pr-4">
                        <Input
                          placeholder="Catatan izin / surat..."
                          value={student.note}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                          className="h-8 text-xs bg-transparent"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border bg-muted/10">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Presensi tanggal {selectedDate} berhasil tersimpan ke sistem SIMS!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground"
            >
              <Save className="mr-1.5 h-4 w-4" />
              {isSaving ? "Menyimpan Presensi..." : "Simpan Presensi Harian"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
