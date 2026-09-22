"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Mail,
  Send,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import type { LetterStatus, LetterType } from "@/lib/types/database";

interface PendingLetter {
  id: string;
  letter_number: string;
  type: LetterType;
  subject: string;
  sender_or_recipient: string;
  date: string;
  status: LetterStatus;
  disposition_notes?: string | null;
}

interface ClassSummary {
  class_name: string;
  grade_level: number;
  total_students: number;
  attendance_percentage: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
}

interface PrincipalDashboardData {
  stats: {
    pendingDispositions: number;
    monthlyIncomingLetters: number;
    approvedOutgoingLetters: number;
    schoolAttendanceRate: number;
  };
  pendingLetters: PendingLetter[];
  classSummaries: ClassSummary[];
}

export function KepalaSekolahDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PrincipalDashboardData | null>(null);

  // Disposition dialog state
  const [selectedLetter, setSelectedLetter] = useState<PendingLetter | null>(null);
  const [dispositionInput, setDispositionInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      setData({
        stats: {
          pendingDispositions: 3,
          monthlyIncomingLetters: 28,
          approvedOutgoingLetters: 41,
          schoolAttendanceRate: 94.2,
        },
        pendingLetters: [
          {
            id: "surat-001",
            letter_number: "421/043/SMK-AF/IX/2026",
            type: "outgoing",
            subject: "Permohonan Izin Kunjungan Industri Siswa TBSM ke PT Astra Motor Pontianak",
            sender_or_recipient: "PT Astra Motor Pontianak",
            date: "2026-09-21",
            status: "pending",
            disposition_notes: null,
          },
          {
            id: "surat-002",
            letter_number: "005/DISDIK-KKR/IX/2026",
            type: "incoming",
            subject: "Undangan Rapat Koordinasi Kepala SMK Swasta se-Kabupaten Kubu Raya",
            sender_or_recipient: "Dinas Pendidikan Kab. Kubu Raya",
            date: "2026-09-20",
            status: "pending",
            disposition_notes: null,
          },
          {
            id: "surat-003",
            letter_number: "421/045/SMK-AF/IX/2026",
            type: "outgoing",
            subject: "Surat Rekomendasi Beasiswa Prestasi Santri Berprestasi Kejuruan",
            sender_or_recipient: "Yayasan Ponpes Al-Falah",
            date: "2026-09-19",
            status: "pending",
            disposition_notes: null,
          },
        ],
        classSummaries: [
          {
            class_name: "X TBSM",
            grade_level: 10,
            total_students: 36,
            attendance_percentage: 95.2,
            hadir: 34,
            sakit: 1,
            izin: 1,
            alpa: 0,
          },
          {
            class_name: "XI TBSM",
            grade_level: 11,
            total_students: 34,
            attendance_percentage: 92.6,
            hadir: 31,
            sakit: 2,
            izin: 1,
            alpa: 0,
          },
          {
            class_name: "XII TBSM",
            grade_level: 12,
            total_students: 34,
            attendance_percentage: 93.6,
            hadir: 32,
            sakit: 0,
            izin: 1,
            alpa: 1,
          },
        ],
      });
    } catch (err: any) {
      console.error("Failed to load principal dashboard:", err);
      setError(err.message || "Gagal memuat dashboard Kepala Sekolah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenDisposition = (letter: PendingLetter) => {
    setSelectedLetter(letter);
    setDispositionInput(letter.disposition_notes || "");
  };

  const handleSaveDisposition = async (newStatus: LetterStatus) => {
    if (!selectedLetter) return;
    setIsSubmitting(true);

    try {
      if (data) {
        setData({
          ...data,
          stats: {
            ...data.stats,
            pendingDispositions: Math.max(0, data.stats.pendingDispositions - 1),
            approvedOutgoingLetters:
              newStatus === "approved"
                ? data.stats.approvedOutgoingLetters + 1
                : data.stats.approvedOutgoingLetters,
          },
          pendingLetters: data.pendingLetters.filter(
            (l) => l.id !== selectedLetter.id
          ),
        });
      }
      setSelectedLetter(null);
    } catch (err) {
      console.error("Failed to save disposition:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        message={error || "Terjadi kesalahan saat memproses data eksekutif."}
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Dashboard Kepala Sekolah
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Persetujuan surat dinas dan rekapitulasi kehadiran sekolah
          </p>
        </div>
      </div>

      {/* Metrics Row - Clean Data First */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Menunggu Disposisi"
          value={data.stats.pendingDispositions}
          badgeText={data.stats.pendingDispositions > 0 ? "Perlu Tindakan" : "Selesai"}
          badgeVariant={data.stats.pendingDispositions > 0 ? "warning" : "success"}
          icon={FileCheck2}
        />
        <StatCard
          title="Surat Masuk Bulan Ini"
          value={data.stats.monthlyIncomingLetters}
          icon={Mail}
        />
        <StatCard
          title="Surat Keluar Disetujui"
          value={data.stats.approvedOutgoingLetters}
          icon={Send}
        />
        <StatCard
          title="Rata-rata Kehadiran"
          value={`${data.stats.schoolAttendanceRate}%`}
          icon={BarChart3}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Pending Approvals */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Antrean Disposisi & Persetujuan
              </CardTitle>
            </div>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-[11px]">
              <Link href="/kepala-sekolah/disposisi">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {data.pendingLetters.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="Antrean Bersih"
                  description="Tidak ada surat yang menunggu disposisi saat ini."
                  icon={CheckCircle2}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="text-xs font-semibold w-[180px]">Nomor & Jenis</TableHead>
                      <TableHead className="text-xs font-semibold min-w-[260px]">Perihal & Pihak</TableHead>
                      <TableHead className="text-xs font-semibold w-[90px]">Tanggal</TableHead>
                      <TableHead className="text-xs font-semibold text-right w-[80px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.pendingLetters.map((letter) => (
                      <TableRow key={letter.id} className="hover:bg-muted/30">
                        <TableCell className="text-xs py-3">
                          <span className="font-mono font-medium block">{letter.letter_number}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {letter.type === "incoming" ? "Surat Masuk" : "Draft Keluar"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs min-w-[260px] py-3">
                          <p className="font-medium text-foreground line-clamp-2 leading-snug">
                            {letter.subject}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                            {letter.type === "incoming"
                              ? `Pengirim: ${letter.sender_or_recipient}`
                              : `Tujuan: ${letter.sender_or_recipient}`}
                          </p>
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground py-3">
                          {letter.date}
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <Button
                            size="sm"
                            className="h-7 px-2.5 text-xs bg-primary text-primary-foreground"
                            onClick={() => handleOpenDisposition(letter)}
                          >
                            <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                            Tinjau
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

        {/* Right 1 Col: Class Attendance Breakdown */}
        <Card className="border border-border">
          <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Presensi per Kelas</CardTitle>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-[11px]">
              <Link href="/kepala-sekolah/monitoring/absensi">Detail</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {data.classSummaries.map((cls, idx) => (
              <div key={idx} className="rounded border border-border/70 p-3 space-y-1.5 bg-muted/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{cls.class_name}</span>
                  <span className="font-mono font-bold text-primary">{cls.attendance_percentage}%</span>
                </div>
                <Progress value={cls.attendance_percentage} className="h-1.5" />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>Hadir: {cls.hadir}/{cls.total_students}</span>
                  <span>S/I/A: {cls.sakit}/{cls.izin}/{cls.alpa}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Disposition Dialog */}
      <Dialog open={!!selectedLetter} onOpenChange={(open) => !open && setSelectedLetter(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Lembar Disposisi & Persetujuan
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedLetter?.letter_number} • {selectedLetter?.type === "incoming" ? "Surat Masuk" : "Surat Keluar"}
            </DialogDescription>
          </DialogHeader>

          {selectedLetter && (
            <div className="space-y-3 py-2 text-xs">
              <div className="rounded bg-muted/30 p-3 space-y-1 border border-border/60">
                <p className="font-semibold text-foreground text-sm">{selectedLetter.subject}</p>
                <p className="text-muted-foreground">
                  {selectedLetter.type === "incoming" ? "Pengirim: " : "Tujuan: "}
                  <span className="font-medium text-foreground">{selectedLetter.sender_or_recipient}</span>
                </p>
                <p className="text-muted-foreground">
                  Tanggal Berkas: <span className="font-medium text-foreground">{selectedLetter.date}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Catatan / Instruksi Disposisi
                </label>
                <textarea
                  value={dispositionInput}
                  onChange={(e) => setDispositionInput(e.target.value)}
                  placeholder="Tuliskan memo atau arahan disposisi untuk staf TU / dewan guru..."
                  className="w-full min-h-[90px] rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive hover:bg-destructive/10"
              disabled={isSubmitting}
              onClick={() => handleSaveDisposition("rejected")}
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Tolak Berkas
            </Button>
            <Button
              size="sm"
              className="text-xs bg-primary text-primary-foreground"
              disabled={isSubmitting}
              onClick={() => handleSaveDisposition("approved")}
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Setujui & Terbitkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
