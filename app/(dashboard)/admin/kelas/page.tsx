"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  Users,
  GraduationCap,
  UserCheck,
  Edit2,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  AcademicYearConfig,
  DEFAULT_ACADEMIC_YEAR,
  getActiveAcademicYear,
  AVAILABLE_ACADEMIC_YEARS,
} from "@/lib/data/academic";
import { AcademicYearDialog } from "@/components/dashboard/academic-year-dialog";

interface ClassItem {
  id: string;
  name: string;
  grade_level: 10 | 11 | 12;
  major: string;
  academic_year: string;
  homeroom_teacher_name: string;
  homeroom_teacher_nip: string;
  student_count: number;
  capacity: number;
}

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "c-1",
    name: "X TBSM",
    grade_level: 10,
    major: "Teknik & Bisnis Sepeda Motor",
    academic_year: "2026/2027",
    homeroom_teacher_name: "M. Syaifullah, S.Pd",
    homeroom_teacher_nip: "19880512 201503 1 004",
    student_count: 36,
    capacity: 36,
  },
  {
    id: "c-2",
    name: "XI TBSM",
    grade_level: 11,
    major: "Teknik & Bisnis Sepeda Motor",
    academic_year: "2026/2027",
    homeroom_teacher_name: "Siti Rohmah, S.Pd",
    homeroom_teacher_nip: "19920315 201903 2 008",
    student_count: 34,
    capacity: 36,
  },
  {
    id: "c-3",
    name: "XII TBSM",
    grade_level: 12,
    major: "Teknik & Bisnis Sepeda Motor",
    academic_year: "2026/2027",
    homeroom_teacher_name: "Ahmad Dahlan, S.T",
    homeroom_teacher_nip: "19850720 201001 1 002",
    student_count: 34,
    capacity: 36,
  },
];

const TEACHERS_LIST = [
  { name: "M. Syaifullah, S.Pd", nip: "19880512 201503 1 004" },
  { name: "Siti Rohmah, S.Pd", nip: "19920315 201903 2 008" },
  { name: "Ahmad Dahlan, S.T", nip: "19850720 201001 1 002" },
  { name: "Ridwan Kamil, S.Pd", nip: "19900101 201701 1 005" },
  { name: "Dewi Lestari, S.Pd", nip: "19940822 202002 2 010" },
];

export default function MasterDataKelasPage() {
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [academicDialogOpen, setAcademicDialogOpen] = useState(false);
  const [academicConfig, setAcademicConfig] = useState<AcademicYearConfig>(DEFAULT_ACADEMIC_YEAR);
  const [notification, setNotification] = useState<string | null>(null);

  // Edit form state
  const [formHomeroom, setFormHomeroom] = useState("");
  const [formAcademicYear, setFormAcademicYear] = useState("2026/2027");
  const [formCapacity, setFormCapacity] = useState(36);

  useEffect(() => {
    setAcademicConfig(getActiveAcademicYear());

    const handleAcademicUpdate = () => {
      setAcademicConfig(getActiveAcademicYear());
    };
    window.addEventListener("sims-academic-updated", handleAcademicUpdate);
    return () => window.removeEventListener("sims-academic-updated", handleAcademicUpdate);
  }, []);

  const handleOpenEdit = (cls: ClassItem) => {
    setSelectedClass(cls);
    setFormHomeroom(cls.homeroom_teacher_name);
    setFormAcademicYear(cls.academic_year);
    setFormCapacity(cls.capacity);
    setEditOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    const teacher = TEACHERS_LIST.find((t) => t.name === formHomeroom);
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === selectedClass.id
          ? {
              ...cls,
              homeroom_teacher_name: formHomeroom,
              homeroom_teacher_nip: teacher ? teacher.nip : cls.homeroom_teacher_nip,
              academic_year: formAcademicYear,
              capacity: Number(formCapacity) || 36,
            }
          : cls
      )
    );

    setNotification(`Data kelas ${selectedClass.name} berhasil diperbarui.`);
    setTimeout(() => setNotification(null), 3000);
    setEditOpen(false);
  };

  const totalStudents = classes.reduce((acc, c) => acc + c.student_count, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Data Kelas & Rombongan Belajar
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rombongan belajar, penetapan Wali Kelas, dan periode tahun ajaran aktif
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setAcademicDialogOpen(true)}
          size="sm"
          variant="outline"
          className="text-xs h-8 gap-1.5 border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Tahun Ajaran: <strong>{academicConfig.academic_year} ({academicConfig.semester})</strong></span>
          <Edit2 className="h-3 w-3 ml-1 opacity-70" />
        </Button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {notification}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Rombel"
          value={classes.length}
          icon={BookOpen}
        />
        <StatCard
          title="Total Siswa"
          value={totalStudents}
          icon={Users}
        />
        <StatCard
          title="Tahun Ajaran SIMS"
          value={`${academicConfig.academic_year}`}
          icon={Calendar}
        />
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-border bg-secondary/30">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-normal">
                  Tingkat {cls.grade_level}
                </Badge>
                <span className="text-[11px] font-mono text-primary font-semibold">
                  TA {cls.academic_year}
                </span>
              </div>
              <CardTitle className="text-xl font-bold text-foreground mt-2">
                {cls.name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {cls.major}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium">Wali Kelas Ditetapkan</p>
                <p className="font-bold text-sm text-foreground">{cls.homeroom_teacher_name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">NIP: {cls.homeroom_teacher_nip}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Jumlah Siswa</span>
                  <span className="font-bold text-foreground">
                    {cls.student_count} / {cls.capacity} Siswa
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${(cls.student_count / cls.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border p-4 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleOpenEdit(cls)}
              >
                <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                Edit Kelas & Tahun Ajaran
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Class & Homeroom Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSaveClass} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Edit Data Kelas {selectedClass?.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Perbarui penetapan Wali Kelas, tahun ajaran rombel, dan kapasitas maksimum
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-1">
              {/* Academic Year for this class */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Tahun Ajaran Rombel *
                </Label>
                <select
                  value={formAcademicYear}
                  onChange={(e) => setFormAcademicYear(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
                >
                  {AVAILABLE_ACADEMIC_YEARS.map((y) => (
                    <option key={y} value={y}>
                      Tahun Ajaran {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Homeroom Teacher */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Wali Kelas Ditetapkan *
                </Label>
                <select
                  value={formHomeroom}
                  onChange={(e) => setFormHomeroom(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {TEACHERS_LIST.map((t) => (
                    <option key={t.nip} value={t.name}>
                      {t.name} (NIP: {t.nip})
                    </option>
                  ))}
                </select>
              </div>

              {/* Capacity */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Kapasitas Maksimum Siswa
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Global Academic Year Dialog */}
      <AcademicYearDialog
        open={academicDialogOpen}
        onOpenChange={setAcademicDialogOpen}
        onSaved={(newConfig) => setAcademicConfig(newConfig)}
      />
    </div>
  );
}
