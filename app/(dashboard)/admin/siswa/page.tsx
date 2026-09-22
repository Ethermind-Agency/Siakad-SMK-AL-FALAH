"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  PlusCircle,
  Upload,
  Search,
  FileDown,
  UserCheck,
  Phone,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
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
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";

interface StudentItem {
  id: string;
  nisn: string;
  name: string;
  class_name: string;
  gender: "L" | "P";
  parent_name: string;
  parent_phone: string;
  attendance_rate: number;
  is_active: boolean;
}

const INITIAL_STUDENTS: StudentItem[] = [
  {
    id: "s-1",
    nisn: "0071234501",
    name: "Ahmad Fauzi",
    class_name: "XII TBSM",
    gender: "L",
    parent_name: "H. Abdullah",
    parent_phone: "0812-5432-1101",
    attendance_rate: 98.5,
    is_active: true,
  },
  {
    id: "s-2",
    nisn: "0071234502",
    name: "Bagus Setiawan",
    class_name: "XII TBSM",
    gender: "L",
    parent_name: "Slamet Riyadi",
    parent_phone: "0813-9876-2202",
    attendance_rate: 95.0,
    is_active: true,
  },
  {
    id: "s-3",
    nisn: "0081234503",
    name: "Dimas Pratama",
    class_name: "XI TBSM",
    gender: "L",
    parent_name: "Rahmat Hidayat",
    parent_phone: "0852-1122-3303",
    attendance_rate: 94.2,
    is_active: true,
  },
  {
    id: "s-4",
    nisn: "0081234504",
    name: "Fajar Maulana",
    class_name: "XI TBSM",
    gender: "L",
    parent_name: "Umar Bakri",
    parent_phone: "0857-4455-6604",
    attendance_rate: 97.0,
    is_active: true,
  },
  {
    id: "s-5",
    nisn: "0091234505",
    name: "Hendra Wijaya",
    class_name: "X TBSM",
    gender: "L",
    parent_name: "Suryanto",
    parent_phone: "0821-6677-8805",
    attendance_rate: 100.0,
    is_active: true,
  },
  {
    id: "s-6",
    nisn: "0091234506",
    name: "Iqbal Ramadhan",
    class_name: "X TBSM",
    gender: "L",
    parent_name: "Mansyur",
    parent_phone: "0822-7788-9906",
    attendance_rate: 96.5,
    is_active: true,
  },
  {
    id: "s-7",
    nisn: "0071234507",
    name: "Nurul Aini",
    class_name: "XII TBSM",
    gender: "P",
    parent_name: "Zulkifli",
    parent_phone: "0815-3344-5507",
    attendance_rate: 98.0,
    is_active: true,
  },
  {
    id: "s-8",
    nisn: "0081234508",
    name: "Rizky Alamsyah",
    class_name: "XI TBSM",
    gender: "L",
    parent_name: "Bambang Sugiono",
    parent_phone: "0853-9988-7708",
    attendance_rate: 76.5,
    is_active: true,
  },
];

export default function MasterDataSiswaPage() {
  const [students, setStudents] = useState<StudentItem[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nisn: "",
    name: "",
    class_name: "X TBSM",
    gender: "L" as "L" | "P",
    parent_name: "",
    parent_phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Import State
  const [importFileName, setImportFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newStudent: StudentItem = {
      id: `s-${Date.now()}`,
      nisn: formData.nisn,
      name: formData.name,
      class_name: formData.class_name,
      gender: formData.gender,
      parent_name: formData.parent_name,
      parent_phone: formData.parent_phone,
      attendance_rate: 100.0,
      is_active: true,
    };

    setTimeout(() => {
      setStudents([newStudent, ...students]);
      setSubmitting(false);
      setCreateOpen(false);
      setFormData({
        nisn: "",
        name: "",
        class_name: "X TBSM",
        gender: "L",
        parent_name: "",
        parent_phone: "",
      });
    }, 400);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFileName) return;

    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImportSuccess(true);
      setTimeout(() => {
        setImportOpen(false);
        setImportSuccess(false);
        setImportFileName("");
      }, 1200);
    }, 800);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nisn.includes(searchQuery) ||
      student.parent_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = classFilter === "all" || student.class_name === classFilter;
    return matchesSearch && matchesClass;
  });

  const totalActive = students.filter((s) => s.is_active).length;
  const countX = 36;
  const countXI = 34;
  const countXII = 34;

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Data Siswa
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Master data peserta didik dan rombongan belajar TBSM
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportOpen(true)}
            className="text-xs h-8"
          >
            <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
            Import CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-primary text-primary-foreground text-xs h-8"
          >
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
            Tambah Siswa
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Siswa Aktif"
          value={totalActive}
          icon={GraduationCap}
        />
        <StatCard
          title="Kelas X TBSM"
          value={countX}
          icon={GraduationCap}
        />
        <StatCard
          title="Kelas XI TBSM"
          value={countXI}
          icon={GraduationCap}
        />
        <StatCard
          title="Kelas XII TBSM"
          value={countXII}
          icon={GraduationCap}
        />
      </div>

      {/* Search & Class Filter */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama siswa, NISN, atau orang tua..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={classFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setClassFilter("all")}
                className="text-xs"
              >
                Semua Rombel
              </Button>
              <Button
                variant={classFilter === "X TBSM" ? "default" : "outline"}
                size="sm"
                onClick={() => setClassFilter("X TBSM")}
                className="text-xs"
              >
                X TBSM
              </Button>
              <Button
                variant={classFilter === "XI TBSM" ? "default" : "outline"}
                size="sm"
                onClick={() => setClassFilter("XI TBSM")}
                className="text-xs"
              >
                XI TBSM
              </Button>
              <Button
                variant={classFilter === "XII TBSM" ? "default" : "outline"}
                size="sm"
                onClick={() => setClassFilter("XII TBSM")}
                className="text-xs"
              >
                XII TBSM
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Student Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Induk Siswa Aktif</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredStudents.length} siswa sesuai filter kelas dan pencarian
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Data Siswa Tidak Ditemukan"
                description="Tidak ada siswa yang sesuai dengan NISN atau nama yang dicari."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">NISN</TableHead>
                    <TableHead className="text-xs font-semibold">Nama Lengkap & L/P</TableHead>
                    <TableHead className="text-xs font-semibold">Rombel / Kelas</TableHead>
                    <TableHead className="text-xs font-semibold">Wali Murid & Kontak WA</TableHead>
                    <TableHead className="text-xs font-semibold">Rata-rata Presensi</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-xs font-mono font-bold text-primary">
                        {student.nisn}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{student.name}</span>
                          <Badge variant="outline" className="text-[9px] px-1 py-0">
                            {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          {student.class_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <p className="font-medium text-foreground">{student.parent_name}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {student.parent_phone}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span
                          className={`font-bold ${
                            student.attendance_rate >= 90
                              ? "text-emerald-600"
                              : student.attendance_rate >= 80
                              ? "text-blue-600"
                              : "text-amber-600"
                          }`}
                        >
                          {student.attendance_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            title="Edit Data Siswa"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Pendaftaran Siswa Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Masukkan nomor NISN 10 digit dan identitas orang tua siswa
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">NISN (10 Digit) *</label>
                <Input
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="Contoh: 0091234509"
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Jenis Kelamin *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "L" | "P" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Nama Lengkap Siswa *</label>
              <Input
                required
                placeholder="Contoh: Muhammad Akbar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Penetapan Rombel / Kelas *</label>
              <select
                value={formData.class_name}
                onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="X TBSM">Kelas X TBSM (Tingkat 10)</option>
                <option value="XI TBSM">Kelas XI TBSM (Tingkat 11)</option>
                <option value="XII TBSM">Kelas XII TBSM (Tingkat 12)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nama Orang Tua / Wali *</label>
                <Input
                  required
                  placeholder="Contoh: H. Sudirman"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">No. Telepon / WhatsApp *</label>
                <Input
                  required
                  placeholder="Contoh: 0812-3456-7890"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? "Mendaftarkan..." : "Simpan Data Siswa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batch Import CSV Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Import Siswa Massal (CSV/Excel)</DialogTitle>
            <DialogDescription className="text-xs">
              Unggah berkas daftar siswa untuk di-import sekaligus ke basis data Dapodik sekolah
            </DialogDescription>
          </DialogHeader>

          {importSuccess ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-foreground">
                Batch Import Berhasil!
              </p>
              <p className="text-xs text-muted-foreground">
                Seluruh data siswa dari berkas {importFileName} telah terverifikasi dan masuk ke database.
              </p>
            </div>
          ) : (
            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs py-2">
              <div className="rounded-lg bg-secondary/50 p-3.5 border border-border space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <FileDown className="h-4 w-4 text-primary" />
                  Format Template CSV Resmi
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Gunakan kolom: <code className="bg-muted px-1 rounded">nisn, nama, gender, kelas, nama_ortu, no_hp</code>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => alert("Mengunduh template CSV format siswa...")}
                >
                  <FileDown className="mr-1 h-3 w-3" />
                  Unduh Contoh Template CSV
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Pilih Berkas CSV / Excel *</label>
                <Input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImportFileName(file.name);
                    }
                  }}
                />
                {importFileName && (
                  <p className="text-[11px] text-emerald-600 font-medium">
                    Berkas terpilih: {importFileName}
                  </p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setImportOpen(false)}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={importing || !importFileName}
                  className="bg-primary text-primary-foreground"
                >
                  {importing ? "Memproses Batch Insert..." : "Mulai Import Siswa"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
