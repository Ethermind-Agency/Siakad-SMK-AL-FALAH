"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  Save,
  Check,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import type { AttendanceStatus } from "@/lib/types/database";

interface MapelStudent {
  id: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  status: AttendanceStatus;
  note: string;
}

const INITIAL_STUDENTS: MapelStudent[] = [
  { id: "1", nisn: "0081234567", name: "Ahmad Fauzi", gender: "L", status: "HADIR", note: "" },
  { id: "2", nisn: "0087654321", name: "Budi Santoso", gender: "L", status: "SAKIT", note: "Sakit (Wali kelas mengonfirmasi)" },
  { id: "3", nisn: "0082345678", name: "Dimas Saputra", gender: "L", status: "HADIR", note: "" },
  { id: "4", nisn: "0083456789", name: "Eko Prasetyo", gender: "L", status: "HADIR", note: "" },
  { id: "5", nisn: "0084567890", name: "Fajar Ramadhan", gender: "L", status: "HADIR", note: "" },
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
];

export default function AbsensiMapelPage() {
  const [selectedSubject, setSelectedSubject] = useState("PMSM");
  const [selectedClass, setSelectedClass] = useState("X TBSM");
  const [sessionHours, setSessionHours] = useState("Jam Ke 1 - 4 (07.15 - 10.15)");
  const [topic, setTopic] = useState("Praktik Pembongkaran & Kalibrasi Injektor Motor Honda PGM-FI");
  const [selectedDate, setSelectedDate] = useState("2026-09-22");

  const [students, setStudents] = useState<MapelStudent[]>(INITIAL_STUDENTS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const hadirCount = students.filter((s) => s.status === "HADIR").length;
  const izinCount = students.filter((s) => s.status === "IZIN").length;
  const sakitCount = students.filter((s) => s.status === "SAKIT").length;
  const alpaCount = students.filter((s) => s.status === "ALPA").length;

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setSaveSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/guru">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Presensi Mata Pelajaran
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pencatatan kehadiran sesi belajar mengajar & jurnal materi harian guru
            </p>
          </div>
        </div>
      </div>

      {/* Subject & Session Selector Card */}
      <Card className="border border-border bg-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Mata Pelajaran</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Pilih Mapel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PMSM">Pemeliharaan Mesin Sepeda Motor (PMSM)</SelectItem>
                <SelectItem value="PKSM">Pemeliharaan Kelistrikan Sepeda Motor (PKSM)</SelectItem>
                <SelectItem value="PSSM">Pemeliharaan Sasis Sepeda Motor (PSSM)</SelectItem>
                <SelectItem value="MTK">Matematika Terapan Kejuruan</SelectItem>
                <SelectItem value="BENGKEL">Pengelolaan Bengkel Sepeda Motor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Kelas</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="X TBSM">X TBSM (Teknik Bisnis Sepeda Motor)</SelectItem>
                <SelectItem value="XI TBSM">XI TBSM (Teknik Bisnis Sepeda Motor)</SelectItem>
                <SelectItem value="XII TBSM">XII TBSM (Teknik Bisnis Sepeda Motor)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Tanggal</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Sesi Jam Pelajaran</label>
            <Select value={sessionHours} onValueChange={setSessionHours}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Pilih Jam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jam Ke 1 - 4 (07.15 - 10.15)">Jam Ke 1 - 4 (07.15 - 10.15)</SelectItem>
                <SelectItem value="Jam Ke 5 - 8 (10.30 - 13.30)">Jam Ke 5 - 8 (10.30 - 13.30)</SelectItem>
                <SelectItem value="Jam Ke 9 - 10 (13.45 - 15.15)">Jam Ke 9 - 10 (13.45 - 15.15)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Topik / Jurnal Materi Pembelajaran</label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Praktik Tune Up Mesin 4-Tak & Sistem Injeksi..."
            className="text-xs h-9"
          />
        </div>
      </Card>

      {/* Student Attendance List */}
      <Card className="border border-border bg-card">
        <CardHeader className="p-4 sm:p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border">
          <div>
            <CardTitle className="text-sm font-semibold">
              Presensi Siswa — {selectedClass}
            </CardTitle>
            <CardDescription className="text-xs">
              Hadir: {hadirCount} • Izin: {izinCount} • Sakit: {sakitCount} • Alpa: {alpaCount}
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStudents((prev) => prev.map((s) => ({ ...s, status: "HADIR", note: "" })));
            }}
            className="h-8 text-xs"
          >
            <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
            Tandai Semua Hadir
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-semibold">No</TableHead>
                  <TableHead className="w-32 text-xs font-semibold">NISN</TableHead>
                  <TableHead className="min-w-[200px] text-xs font-semibold">Nama Siswa</TableHead>
                  <TableHead className="w-[280px] text-center text-xs font-semibold">Status Presensi</TableHead>
                  <TableHead className="min-w-[200px] text-xs font-semibold">Catatan Sesi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, idx) => (
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
                    <TableCell className="py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
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
                        placeholder="Catatan keaktifan / tugas..."
                        value={student.note}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStudents((prev) =>
                            prev.map((s) => (s.id === student.id ? { ...s, note: val } : s))
                          );
                        }}
                        className="h-8 text-xs bg-transparent"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border bg-muted/10">
          <div>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Jurnal & Presensi mapel {selectedSubject} berhasil disimpan!
              </span>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Menyimpan Jurnal..." : "Simpan Presensi Mata Pelajaran"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
