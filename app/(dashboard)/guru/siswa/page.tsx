"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Search,
  Phone,
  MessageCircle,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/dashboard/stat-card";

interface StudentBinaan {
  id: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  parentName: string;
  parentPhone: string;
  address: string;
  attendanceRate: number;
  alpaCount: number;
  status: "aman" | "perhatian" | "kritis";
  notes: string;
}

const STUDENTS_BINAAN: StudentBinaan[] = [
  {
    id: "1",
    nisn: "0081234567",
    name: "Ahmad Fauzi",
    gender: "L",
    parentName: "H. Ridwan",
    parentPhone: "6281234567890",
    address: "Dusun Karya Maju, Telok Pakedai",
    attendanceRate: 76.5,
    alpaCount: 3,
    status: "kritis",
    notes: "Sudah dipanggil ke ruang BK pada tanggal 19 September terkait 3 hari alpa berturut-turut.",
  },
  {
    id: "2",
    nisn: "0087654321",
    name: "Budi Santoso",
    gender: "L",
    parentName: "Samsul Bahri",
    parentPhone: "6282134567891",
    address: "Desa Kuala Karang, Telok Pakedai",
    attendanceRate: 79.0,
    alpaCount: 2,
    status: "perhatian",
    notes: "Terkendala transportasi penyeberangan air saat musim pasang surut.",
  },
  {
    id: "3",
    nisn: "0082345678",
    name: "Dimas Saputra",
    gender: "L",
    parentName: "Mulyadi",
    parentPhone: "6283134567892",
    address: "Telok Pakedai Satu",
    attendanceRate: 100.0,
    alpaCount: 0,
    status: "aman",
    notes: "Ketua Kelas X TBSM, proaktif dalam kegiatan praktik bengkel.",
  },
  {
    id: "4",
    nisn: "0083456789",
    name: "Eko Prasetyo",
    gender: "L",
    parentName: "Supardi",
    parentPhone: "6284134567893",
    address: "Dusun Harapan Baru",
    attendanceRate: 95.5,
    alpaCount: 0,
    status: "aman",
    notes: "Sangat antusias pada materi sistem kelistrikan motor.",
  },
  {
    id: "5",
    nisn: "0084567890",
    name: "Fajar Ramadhan",
    gender: "L",
    parentName: "Zulkifli",
    parentPhone: "6285134567894",
    address: "Parit Kelapa, Telok Pakedai",
    attendanceRate: 90.9,
    alpaCount: 0,
    status: "aman",
    notes: "Aktif dalam ekstrakurikuler kepramukaan.",
  },
  {
    id: "6",
    nisn: "0085678901",
    name: "Gilang Pratama",
    gender: "L",
    parentName: "Bambang Irawan",
    parentPhone: "6286134567895",
    address: "Dusun Telok Gelam",
    attendanceRate: 100.0,
    alpaCount: 0,
    status: "aman",
    notes: "-",
  },
  {
    id: "7",
    nisn: "0086789012",
    name: "Hendra Gunawan",
    gender: "L",
    parentName: "Gunawan Santoso",
    parentPhone: "6287134567896",
    address: "Kuala Mandor B",
    attendanceRate: 100.0,
    alpaCount: 0,
    status: "aman",
    notes: "-",
  },
  {
    id: "8",
    nisn: "0087890123",
    name: "Ilham Maulana",
    gender: "L",
    parentName: "Maulana",
    parentPhone: "6288134567897",
    address: "Dusun Melati, Telok Pakedai",
    attendanceRate: 95.5,
    alpaCount: 0,
    status: "aman",
    notes: "-",
  },
  {
    id: "9",
    nisn: "0088901234",
    name: "Joko Wahyudi",
    gender: "L",
    parentName: "Wahyudi",
    parentPhone: "6289134567898",
    address: "Dusun Sejahtera",
    attendanceRate: 100.0,
    alpaCount: 0,
    status: "aman",
    notes: "-",
  },
  {
    id: "10",
    nisn: "0089012345",
    name: "Kevin Kurniawan",
    gender: "L",
    parentName: "Kurniawan",
    parentPhone: "6281134567899",
    address: "Telok Pakedai Hulu",
    attendanceRate: 95.5,
    alpaCount: 0,
    status: "aman",
    notes: "-",
  },
];

export default function SiswaBinaanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentBinaan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = STUDENTS_BINAAN.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              Direktori Siswa Binaan
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kelas Binaan: <span className="font-semibold text-foreground">X TBSM</span> • Wali Kelas: M. Syaifullah, S.Pd
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Siswa Binaan"
          value="36 Siswa"
          icon={GraduationCap}
        />
        <StatCard
          title="Kehadiran Sangat Baik"
          value="34 Siswa"
          badgeText=">= 90%"
          badgeVariant="success"
          icon={CheckCircle2}
        />
        <StatCard
          title="Perlu Perhatian"
          value="2 Siswa"
          badgeText="Alpa Terdeteksi"
          badgeVariant="destructive"
          icon={AlertTriangle}
        />
        <StatCard
          title="Program Keahlian"
          value="TBSM"
          icon={Users}
        />
      </div>

      {/* Search & Filter Bar */}
      <Card className="border border-border bg-card p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari nama siswa, NISN, atau orang tua..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="h-8 text-xs"
            >
              Semua (36)
            </Button>
            <Button
              variant={statusFilter === "kritis" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("kritis")}
              className="h-8 text-xs text-destructive"
            >
              Kritis / Pembinaan (1)
            </Button>
            <Button
              variant={statusFilter === "perhatian" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("perhatian")}
              className="h-8 text-xs text-amber-600"
            >
              Perhatian (1)
            </Button>
            <Button
              variant={statusFilter === "aman" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("aman")}
              className="h-8 text-xs text-emerald-600"
            >
              Aman (34)
            </Button>
          </div>
        </div>
      </Card>

      {/* Student List Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-sm font-semibold">
            Daftar Anggota Rombel X TBSM
          </CardTitle>
          <CardDescription className="text-xs">
            Data kontak orang tua dan pemantauan disiplin kehadiran harian
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-semibold">No</TableHead>
                  <TableHead className="w-28 text-xs font-semibold">NISN</TableHead>
                  <TableHead className="min-w-[180px] text-xs font-semibold">Nama Siswa</TableHead>
                  <TableHead className="min-w-[180px] text-xs font-semibold">Nama Orang Tua / Wali</TableHead>
                  <TableHead className="w-28 text-center text-xs font-semibold">Kehadiran</TableHead>
                  <TableHead className="w-28 text-center text-xs font-semibold">Status</TableHead>
                  <TableHead className="min-w-[180px] text-right text-xs font-semibold pr-4">Kontak & Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s, idx) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="text-center text-xs text-muted-foreground font-mono">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {s.nisn}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {s.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{s.parentName}</p>
                      <p className="text-[11px] text-muted-foreground">{s.address}</p>
                    </TableCell>
                    <TableCell className="text-center text-xs font-mono font-bold">
                      <span className={s.attendanceRate < 80 ? "text-destructive" : "text-foreground"}>
                        {s.attendanceRate}%
                      </span>
                      {s.alpaCount > 0 && (
                        <span className="block text-[10px] text-destructive font-normal">
                          {s.alpaCount}x Alpa
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {s.status === "kritis" ? (
                        <Badge variant="destructive" className="text-[10px] font-normal">
                          Kritis
                        </Badge>
                      ) : s.status === "perhatian" ? (
                        <Badge variant="warning" className="text-[10px] font-normal">
                          Perhatian
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px] font-normal">
                          Aman
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                        >
                          <a
                            href={`https://wa.me/${s.parentPhone}?text=Assalamu%27alaikum%20Bapak%2FIbu%20${encodeURIComponent(
                              s.parentName
                            )}%2C%20saya%20Wali%20Kelas%20X%20TBSM%20SMKS%20AL-FALAH%20ingin%20mengonfirmasi%20kehadiran%20${encodeURIComponent(
                              s.name
                            )}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            WhatsApp
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setSelectedStudent(s);
                            setModalOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Detail
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Detail & Notes Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Profil & Riwayat Pembinaan Siswa
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informasi lengkap biodata dan catatan wali kelas
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4 text-xs py-2">
              <div className="rounded-lg bg-secondary/50 p-3.5 border border-border space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{selectedStudent.name}</h3>
                    <p className="font-mono text-muted-foreground">NISN: {selectedStudent.nisn}</p>
                  </div>
                  <Badge variant={selectedStudent.status === "kritis" ? "destructive" : "success"}>
                    {selectedStudent.attendanceRate}% Kehadiran
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/50">
                  <div>
                    <span className="text-muted-foreground block">Orang Tua / Wali:</span>
                    <span className="font-semibold">{selectedStudent.parentName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Alamat Domisili:</span>
                    <span className="font-semibold">{selectedStudent.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Catatan Pembinaan / Tindak Lanjut:</label>
                <div className="rounded-md border border-border p-3 bg-card text-foreground leading-relaxed">
                  {selectedStudent.notes || "Belum ada catatan khusus."}
                </div>
              </div>

              <div className="rounded-md bg-muted/40 p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Nomor Kontak WhatsApp Orang Tua</p>
                  <p className="font-mono text-muted-foreground">+{selectedStudent.parentPhone}</p>
                </div>
                <Button asChild size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  <a
                    href={`https://wa.me/${selectedStudent.parentPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1" />
                    Kirim Pesan
                  </a>
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
