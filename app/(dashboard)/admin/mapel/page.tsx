"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Search,
  BookOpen,
  Wrench,
  GraduationCap,
  Clock,
  User,
  Edit2,
  Trash2,
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

interface SubjectItem {
  id: string;
  code: string;
  name: string;
  category: "Kejuruan TBSM" | "Umum / Normatif" | "Keagamaan & Pesantren";
  hours_per_week: number;
  teacher_name: string;
}

const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: "sub-1",
    code: "TBSM-01",
    name: "Pemeliharaan Mesin Sepeda Motor (PMSM)",
    category: "Kejuruan TBSM",
    hours_per_week: 6,
    teacher_name: "M. Syaifullah, S.Pd",
  },
  {
    id: "sub-2",
    code: "TBSM-02",
    name: "Pemeliharaan Kelistrikan Sepeda Motor (PKSM)",
    category: "Kejuruan TBSM",
    hours_per_week: 6,
    teacher_name: "Ahmad Dahlan, S.T",
  },
  {
    id: "sub-3",
    code: "TBSM-03",
    name: "Pemeliharaan Sasis & Pemindah Tenaga (PSPT)",
    category: "Kejuruan TBSM",
    hours_per_week: 4,
    teacher_name: "M. Syaifullah, S.Pd",
  },
  {
    id: "sub-4",
    code: "TBSM-04",
    name: "Pengelolaan Bengkel Sepeda Motor & Kewirausahaan",
    category: "Kejuruan TBSM",
    hours_per_week: 4,
    teacher_name: "Ahmad Dahlan, S.T",
  },
  {
    id: "sub-5",
    code: "UMUM-01",
    name: "Matematika Terapan Kejuruan",
    category: "Umum / Normatif",
    hours_per_week: 4,
    teacher_name: "Siti Rohmah, S.Pd",
  },
  {
    id: "sub-6",
    code: "UMUM-02",
    name: "Bahasa Indonesia & Komunikasi Industri",
    category: "Umum / Normatif",
    hours_per_week: 3,
    teacher_name: "Dewi Lestari, S.Pd",
  },
  {
    id: "sub-7",
    code: "AGM-01",
    name: "Pendidikan Agama Islam & Budi Pekerti Pesantren",
    category: "Keagamaan & Pesantren",
    hours_per_week: 3,
    teacher_name: "Ust. Abdullah Ridwan",
  },
];

export default function MasterDataMapelPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "Kejuruan TBSM" as SubjectItem["category"],
    hours_per_week: 4,
    teacher_name: "M. Syaifullah, S.Pd",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject: SubjectItem = {
      id: `sub-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      category: formData.category,
      hours_per_week: Number(formData.hours_per_week),
      teacher_name: formData.teacher_name,
    };

    setSubjects([...subjects, newSubject]);
    setCreateOpen(false);
    setFormData({
      code: "",
      name: "",
      category: "Kejuruan TBSM",
      hours_per_week: 4,
      teacher_name: "M. Syaifullah, S.Pd",
    });
  };

  const filteredSubjects = subjects.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const countKejuruan = subjects.filter((s) => s.category === "Kejuruan TBSM").length;
  const countUmum = subjects.filter((s) => s.category === "Umum / Normatif").length;
  const countAgama = subjects.filter((s) => s.category === "Keagamaan & Pesantren").length;

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Mata Pelajaran
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kurikulum kejuruan TBSM, umum, dan muatan pesantren
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="bg-primary text-primary-foreground text-xs h-8"
        >
          <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
          Tambah Mapel
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Kejuruan TBSM"
          value={countKejuruan}
          icon={Wrench}
        />
        <StatCard
          title="Umum / Normatif"
          value={countUmum}
          icon={BookOpen}
        />
        <StatCard
          title="Muatan Pesantren"
          value={countAgama}
          icon={GraduationCap}
        />
      </div>

      {/* Search & Category Filter */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kode mapel, nama pelajaran, guru pengampu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={categoryFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("all")}
                className="text-xs"
              >
                Semua ({subjects.length})
              </Button>
              <Button
                variant={categoryFilter === "Kejuruan TBSM" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("Kejuruan TBSM")}
                className="text-xs"
              >
                Kejuruan ({countKejuruan})
              </Button>
              <Button
                variant={categoryFilter === "Umum / Normatif" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("Umum / Normatif")}
                className="text-xs"
              >
                Umum ({countUmum})
              </Button>
              <Button
                variant={categoryFilter === "Keagamaan & Pesantren" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("Keagamaan & Pesantren")}
                className="text-xs"
              >
                Pesantren ({countAgama})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Kurikulum & Guru Pengampu</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredSubjects.length} mata pelajaran aktif
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSubjects.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Mata Pelajaran Tidak Ditemukan"
                description="Tidak ada mata pelajaran yang cocok dengan kriteria pencarian."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Kode Mapel</TableHead>
                    <TableHead className="text-xs font-semibold">Nama Mata Pelajaran</TableHead>
                    <TableHead className="text-xs font-semibold">Kategori Kelompok</TableHead>
                    <TableHead className="text-xs font-semibold">Guru Pengampu</TableHead>
                    <TableHead className="text-xs font-semibold">Beban JP</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((sub) => (
                    <TableRow key={sub.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-xs font-mono font-bold text-primary">
                        {sub.code}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {sub.name}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant={
                            sub.category === "Kejuruan TBSM"
                              ? "default"
                              : sub.category === "Keagamaan & Pesantren"
                              ? "success"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {sub.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-medium">
                        {sub.teacher_name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">{sub.hours_per_week}</span> JP / Pekan
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Subject Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Tambah Mata Pelajaran Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Daftarkan kode mata pelajaran dan tetapkan guru pengampu
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs py-2">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Kode Mapel *</label>
              <Input
                required
                placeholder="Contoh: TBSM-05"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Nama Mata Pelajaran *</label>
              <Input
                required
                placeholder="Contoh: Praktik Sistem Injeksi & EFI Motor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Kelompok Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Kejuruan TBSM">Kejuruan TBSM</option>
                  <option value="Umum / Normatif">Umum / Normatif</option>
                  <option value="Keagamaan & Pesantren">Keagamaan & Pesantren</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Beban Jam (JP) *</label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  required
                  value={formData.hours_per_week}
                  onChange={(e) => setFormData({ ...formData, hours_per_week: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Guru Pengampu *</label>
              <select
                value={formData.teacher_name}
                onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="M. Syaifullah, S.Pd">M. Syaifullah, S.Pd (Kaprog TBSM)</option>
                <option value="Ahmad Dahlan, S.T">Ahmad Dahlan, S.T (Instruktur Bengkel)</option>
                <option value="Siti Rohmah, S.Pd">Siti Rohmah, S.Pd (Guru Matematika)</option>
                <option value="Dewi Lestari, S.Pd">Dewi Lestari, S.Pd (Guru Bhs. Indonesia)</option>
                <option value="Ust. Abdullah Ridwan">Ust. Abdullah Ridwan (Guru PAI/Pesantren)</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Simpan Mapel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
