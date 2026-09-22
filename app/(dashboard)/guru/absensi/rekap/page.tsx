"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Printer,
  Calendar,
  Filter,
  ArrowLeft,
  GraduationCap,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
import { StatCard } from "@/components/dashboard/stat-card";

interface StudentRecap {
  id: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  totalDays: number;
  rate: number;
}

const RECAP_DATA: StudentRecap[] = [
  { id: "1", nisn: "0081234567", name: "Ahmad Fauzi", gender: "L", hadir: 16, izin: 2, sakit: 1, alpa: 3, totalDays: 22, rate: 76.5 },
  { id: "2", nisn: "0087654321", name: "Budi Santoso", gender: "L", hadir: 17, izin: 1, sakit: 2, alpa: 2, totalDays: 22, rate: 79.0 },
  { id: "3", nisn: "0082345678", name: "Dimas Saputra", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "4", nisn: "0083456789", name: "Eko Prasetyo", gender: "L", hadir: 21, izin: 1, sakit: 0, alpa: 0, totalDays: 22, rate: 95.5 },
  { id: "5", nisn: "0084567890", name: "Fajar Ramadhan", gender: "L", hadir: 20, izin: 2, sakit: 0, alpa: 0, totalDays: 22, rate: 90.9 },
  { id: "6", nisn: "0085678901", name: "Gilang Pratama", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "7", nisn: "0086789012", name: "Hendra Gunawan", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "8", nisn: "0087890123", name: "Ilham Maulana", gender: "L", hadir: 21, izin: 0, sakit: 1, alpa: 0, totalDays: 22, rate: 95.5 },
  { id: "9", nisn: "0088901234", name: "Joko Wahyudi", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "10", nisn: "0089012345", name: "Kevin Kurniawan", gender: "L", hadir: 21, izin: 1, sakit: 0, alpa: 0, totalDays: 22, rate: 95.5 },
  { id: "11", nisn: "0089876543", name: "M. Rizki", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "12", nisn: "0081122334", name: "M. Aditya", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "13", nisn: "0082233445", name: "M. Farhan", gender: "L", hadir: 20, izin: 1, sakit: 1, alpa: 0, totalDays: 22, rate: 90.9 },
  { id: "14", nisn: "0083344556", name: "M. Syaifullah Jr", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "15", nisn: "0084455667", name: "Nur Hidayat", gender: "L", hadir: 21, izin: 0, sakit: 1, alpa: 0, totalDays: 22, rate: 95.5 },
  { id: "16", nisn: "0085566778", name: "Pandu Wijaya", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "17", nisn: "0086677889", name: "Rahmat Hidayat", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "18", nisn: "0087788990", name: "Rio Febrian", gender: "L", hadir: 21, izin: 1, sakit: 0, alpa: 0, totalDays: 22, rate: 95.5 },
  { id: "19", nisn: "0088899001", name: "Sandi Permana", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "20", nisn: "0089900112", name: "Tegar Prakoso", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "21", nisn: "0080011223", name: "Wahyu Setiawan", gender: "L", hadir: 21, izin: 0, sakit: 1, alpa: 0, totalDays: 22, rate: 95.5 },
  { id: "22", nisn: "0081133557", name: "Yoga Pratama", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
  { id: "23", nisn: "0082244668", name: "Zaki Al-Faruq", gender: "L", hadir: 22, izin: 0, sakit: 0, alpa: 0, totalDays: 22, rate: 100.0 },
];

export default function RekapPresensiPage() {
  const [selectedMonth, setSelectedMonth] = useState("09-2026");
  const [selectedClass, setSelectedClass] = useState("X TBSM");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "critical" | "perfect">("all");

  const filteredStudents = RECAP_DATA.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filterCategory === "critical") return s.rate < 80.0;
    if (filterCategory === "perfect") return s.rate === 100.0;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ["No", "NISN", "Nama Siswa", "L/P", "Hadir (H)", "Izin (I)", "Sakit (S)", "Alpa (A)", "Persentase Kehadiran (%)"];
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `'${s.nisn}`,
      `"${s.name}"`,
      s.gender,
      s.hadir,
      s.izin,
      s.sakit,
      s.alpa,
      `${s.rate}%`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap-presensi-${selectedClass.replace(/\s+/g, "_")}-September-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
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
              Rekapitulasi Presensi Siswa
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Laporan akumulasi kehadiran siswa bulanan & semester untuk wali kelas dan dinas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            size="sm"
            className="h-8 text-xs bg-primary text-primary-foreground"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Unduh Rekap CSV
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Cetak Laporan
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Rata-rata Kehadiran"
          value="95.8%"
          icon={ClipboardList}
        />
        <StatCard
          title="Hari Efektif Belajar"
          value="22 Hari"
          icon={Calendar}
        />
        <StatCard
          title="Kehadiran 100%"
          value="18 Siswa"
          badgeText="Sempurna"
          badgeVariant="success"
          icon={CheckCircle2}
        />
        <StatCard
          title="Perlu Pembinaan"
          value="2 Siswa"
          badgeText="Alpa >= 2"
          badgeVariant="destructive"
          icon={AlertTriangle}
        />
      </div>

      {/* Filter Bar */}
      <Card className="border border-border bg-card p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-[160px]">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09-2026">September 2026</SelectItem>
                  <SelectItem value="08-2026">Agustus 2026</SelectItem>
                  <SelectItem value="07-2026">Juli 2026</SelectItem>
                  <SelectItem value="ganjil-2026">Semester Ganjil 2026/2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[140px]">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X TBSM">X TBSM</SelectItem>
                  <SelectItem value="XI TBSM">XI TBSM</SelectItem>
                  <SelectItem value="XII TBSM">XII TBSM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant={filterCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("all")}
                className="h-8 text-xs px-2.5"
              >
                Semua
              </Button>
              <Button
                variant={filterCategory === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("critical")}
                className="h-8 text-xs px-2.5 text-destructive"
              >
                Kritis (&lt;80%)
              </Button>
              <Button
                variant={filterCategory === "perfect" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory("perfect")}
                className="h-8 text-xs px-2.5 text-emerald-600"
              >
                100% Hadir
              </Button>
            </div>
          </div>

          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari siswa atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Recap Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-sm font-semibold">
            Matriks Rekapitulasi Presensi — {selectedClass}
          </CardTitle>
          <CardDescription className="text-xs">
            Menampilkan akumulasi kehadiran {filteredStudents.length} siswa pada periode September 2026
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-semibold">No</TableHead>
                  <TableHead className="w-28 text-xs font-semibold">NISN</TableHead>
                  <TableHead className="min-w-[200px] text-xs font-semibold">Nama Siswa</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold">L/P</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold text-emerald-600">Hadir</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold text-blue-600">Izin</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold text-amber-600">Sakit</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold text-destructive">Alpa</TableHead>
                  <TableHead className="w-28 text-right text-xs font-semibold">% Kehadiran</TableHead>
                  <TableHead className="w-32 text-right text-xs font-semibold pr-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, idx) => (
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
                    <TableCell className="text-center text-xs font-semibold text-emerald-600">
                      {student.hadir}
                    </TableCell>
                    <TableCell className="text-center text-xs font-semibold text-blue-600">
                      {student.izin}
                    </TableCell>
                    <TableCell className="text-center text-xs font-semibold text-amber-600">
                      {student.sakit}
                    </TableCell>
                    <TableCell className="text-center text-xs font-semibold text-destructive">
                      {student.alpa}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono font-bold">
                      <span className={student.rate < 80 ? "text-destructive" : student.rate === 100 ? "text-emerald-600" : "text-foreground"}>
                        {student.rate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      {student.rate < 80 ? (
                        <Badge variant="destructive" className="text-[10px] font-normal">
                          Perlu Pembinaan
                        </Badge>
                      ) : student.rate === 100 ? (
                        <Badge variant="success" className="text-[10px] font-normal">
                          Sempurna
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          Memenuhi Syarat
                        </Badge>
                      )}
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
