"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  PlusCircle,
  Search,
  Eye,
  FileDown,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  ArrowRight,
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
import type { LetterStatus } from "@/lib/types/database";

interface OutgoingLetter {
  id: string;
  letter_number: string;
  classification_code: string;
  recipient: string;
  date: string;
  subject: string;
  description: string;
  status: LetterStatus;
  created_by: string;
  approved_by?: string;
  approval_date?: string;
}

const INITIAL_OUTGOING_LETTERS: OutgoingLetter[] = [
  {
    id: "out-1",
    letter_number: "421/042/SMK-AF/IX/2026",
    classification_code: "421",
    recipient: "Seluruh Orang Tua / Wali Siswa Kelas X, XI, XII",
    date: "2026-09-20",
    subject: "Undangan Rapat Koordinasi Komite Sekolah & Sosialisasi Presensi Digital SIMS",
    description: "Pertemuan berkala orang tua siswa bersama Kepala Sekolah dan Dewan Guru terkait penguatan kedisiplinan dan monitoring kehadiran online.",
    status: "approved",
    created_by: "Ibrahim (Staf TU)",
    approved_by: "Dedi Irawan (Kepala Sekolah)",
    approval_date: "2026-09-20",
  },
  {
    id: "out-2",
    letter_number: "421/043/SMK-AF/IX/2026",
    classification_code: "421",
    recipient: "Pimpinan PT Astra Motor Pontianak",
    date: "2026-09-21",
    subject: "Permohonan Izin Kunjungan Industri Siswa TBSM Tahun 2026",
    description: "Pengajuan izin pelaksanaan study visit kompetensi otomotif roda dua bagi 34 siswa kelas XI TBSM ke pusat workshop Astra Motor.",
    status: "pending",
    created_by: "Ibrahim (Staf TU)",
  },
  {
    id: "out-3",
    letter_number: "421/044/SMK-AF/IX/2026",
    classification_code: "421",
    recipient: "M. Rizki (Siswa Kelas XII TBSM - NISN 0071234567)",
    date: "2026-09-22",
    subject: "Surat Keterangan Siswa Aktif Bersekolah",
    description: "Penerbitan surat keterangan resmi untuk kelengkapan administrasi beasiswa daerah Program Indonesia Pintar (PIP).",
    status: "draft",
    created_by: "Ibrahim (Staf TU)",
  },
  {
    id: "out-4",
    letter_number: "800/011/SMK-AF/IX/2026",
    classification_code: "800",
    recipient: "M. Syaifullah, S.Pd (Wali Kelas XII TBSM)",
    date: "2026-09-15",
    subject: "Surat Tugas Pembimbing Praktik Kerja Industri (Prakerin)",
    description: "Penetapan penugasan instruktur guru pembimbing monitoring siswa magang di bengkel mitra.",
    status: "approved",
    created_by: "Ibrahim (Staf TU)",
    approved_by: "Dedi Irawan (Kepala Sekolah)",
    approval_date: "2026-09-15",
  },
];

export default function SuratKeluarPage() {
  const [letters, setLetters] = useState<OutgoingLetter[]>(INITIAL_OUTGOING_LETTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLetter, setSelectedLetter] = useState<OutgoingLetter | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredLetters = letters.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letter_number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = letters.length;
  const approvedCount = letters.filter((l) => l.status === "approved").length;
  const pendingCount = letters.filter((l) => l.status === "pending").length;
  const draftCount = letters.filter((l) => l.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Surat Keluar
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Penerbitan surat dinas resmi dan monitoring persetujuan
          </p>
        </div>

        <Button asChild size="sm" className="bg-primary text-primary-foreground h-8 text-xs shrink-0">
          <Link href="/admin/surat/keluar/baru">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
            Buat Surat Keluar
          </Link>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Surat Keluar"
          value={totalCount}
          icon={Send}
        />
        <StatCard
          title="Disetujui"
          value={approvedCount}
          icon={CheckCircle2}
        />
        <StatCard
          title="Menunggu Persetujuan"
          value={pendingCount}
          badgeText={pendingCount > 0 ? `${pendingCount} Menunggu` : undefined}
          badgeVariant="warning"
          icon={Clock}
        />
        <StatCard
          title="Draft Konsep"
          value={draftCount}
          icon={FileText}
        />
      </div>

      {/* Search & Status Filter */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor surat, penerima, perihal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="text-xs"
              >
                Semua ({totalCount})
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
                className="text-xs"
              >
                Disetujui ({approvedCount})
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
                className="text-xs"
              >
                Menunggu ({pendingCount})
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("draft")}
                className="text-xs"
              >
                Draft ({draftCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Buku Surat Keluar</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredLetters.length} dari {totalCount} nomor surat keluar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLetters.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Surat Keluar Tidak Ditemukan"
                description="Tidak ada arsip surat keluar yang sesuai dengan kata kunci atau filter status."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Nomor Surat Resmi</TableHead>
                    <TableHead className="text-xs font-semibold">Tujuan / Penerima</TableHead>
                    <TableHead className="text-xs font-semibold">Perihal Surat</TableHead>
                    <TableHead className="text-xs font-semibold">Tanggal</TableHead>
                    <TableHead className="text-xs font-semibold">Status Persetujuan</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLetters.map((letter) => (
                    <TableRow key={letter.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-xs">
                        <span className="font-mono font-bold text-primary block">
                          {letter.letter_number}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Kode: {letter.classification_code}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs max-w-xs">
                        <p className="font-semibold text-foreground line-clamp-1">{letter.recipient}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Pembuat: {letter.created_by}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs max-w-sm">
                        <p className="font-medium text-foreground line-clamp-2">{letter.subject}</p>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                        {letter.date}
                      </TableCell>
                      <TableCell>
                        {letter.status === "approved" ? (
                          <Badge variant="success" className="text-[10px]">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Disetujui
                          </Badge>
                        ) : letter.status === "pending" ? (
                          <Badge variant="warning" className="text-[10px]">
                            <Clock className="mr-1 h-3 w-3" />
                            Menunggu Kepsek
                          </Badge>
                        ) : letter.status === "rejected" ? (
                          <Badge variant="destructive" className="text-[10px]">
                            <XCircle className="mr-1 h-3 w-3" />
                            Ditolak
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs font-medium"
                          onClick={() => {
                            setSelectedLetter(letter);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Detail
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="text-lg font-bold">Detail Surat Keluar</DialogTitle>
              {selectedLetter?.status === "approved" ? (
                <Badge variant="success">Resmi Disetujui</Badge>
              ) : selectedLetter?.status === "pending" ? (
                <Badge variant="warning">Menunggu Approval</Badge>
              ) : (
                <Badge variant="secondary">Status: {selectedLetter?.status}</Badge>
              )}
            </div>
            <DialogDescription className="text-xs">
              Pratinjau nomor surat dinas dan status pengesahan pimpinan
            </DialogDescription>
          </DialogHeader>

          {selectedLetter && (
            <div className="space-y-4 text-xs py-2">
              <div className="rounded-lg bg-secondary/50 p-4 border border-border space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Nomor Surat Otomatis</p>
                    <p className="font-mono font-bold text-primary text-sm mt-0.5">
                      {selectedLetter.letter_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tanggal Dikeluarkan</p>
                    <p className="font-semibold text-foreground mt-0.5">{selectedLetter.date}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Tujuan / Kepada</p>
                    <p className="font-semibold text-foreground mt-0.5">{selectedLetter.recipient}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Staf Pembuat Surat</p>
                    <p className="font-semibold text-foreground mt-0.5">{selectedLetter.created_by}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Perihal Surat:</p>
                <p className="p-3 rounded-md bg-card border border-border text-foreground leading-relaxed">
                  {selectedLetter.subject}
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Ringkasan Isi / Keterangan:</p>
                <p className="p-3 rounded-md bg-card border border-border text-muted-foreground leading-relaxed">
                  {selectedLetter.description}
                </p>
              </div>

              {selectedLetter.approved_by && (
                <div className="rounded-lg border-2 border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
                  <p className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Telah Disetujui & Divalidasi oleh Kepala Sekolah
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Oleh: {selectedLetter.approved_by} • Pada: {selectedLetter.approval_date}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => window.print()}
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Cetak Format Surat
            </Button>
            <Button variant="default" size="sm" onClick={() => setDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
