"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  Calendar,
  UserCheck,
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
import type { LetterStatus } from "@/lib/types/database";

interface OutgoingLetter {
  id: string;
  letter_number: string;
  recipient: string;
  date: string;
  subject: string;
  description: string;
  status: LetterStatus;
  created_by: string;
  approved_by?: string;
  approval_date?: string;
}

const INITIAL_OUTGOING: OutgoingLetter[] = [
  {
    id: "out-1",
    letter_number: "421/042/SMK-AF/IX/2026",
    recipient: "Seluruh Orang Tua / Wali Siswa Kelas X, XI, XII",
    date: "2026-09-20",
    subject: "Undangan Rapat Koordinasi Komite Sekolah & Sosialisasi Presensi Digital SIMS",
    description: "Pertemuan berkala orang tua siswa bersama Kepala Sekolah dan Dewan Guru terkait penguatan kedisiplinan.",
    status: "approved",
    created_by: "Ibrahim (Staf TU)",
    approved_by: "Dedi Irawan (Kepala Sekolah)",
    approval_date: "2026-09-20",
  },
  {
    id: "out-2",
    letter_number: "421/043/SMK-AF/IX/2026",
    recipient: "Pimpinan PT Astra Motor Pontianak",
    date: "2026-09-21",
    subject: "Permohonan Izin Kunjungan Industri Siswa TBSM Tahun 2026",
    description: "Pengajuan izin pelaksanaan study visit kompetensi otomotif roda dua bagi 34 siswa kelas XI TBSM.",
    status: "pending",
    created_by: "Ibrahim (Staf TU)",
  },
  {
    id: "out-4",
    letter_number: "800/011/SMK-AF/IX/2026",
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

export default function KepsekSuratKeluarPage() {
  const [letters, setLetters] = useState<OutgoingLetter[]>(INITIAL_OUTGOING);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<OutgoingLetter | null>(null);

  const filteredLetters = letters.filter(
    (l) =>
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.letter_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Arsip Surat Keluar
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar surat dinas resmi yang telah disahkan dan diterbitkan
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/kepala-sekolah/disposisi">
            <Clock className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
            Antrean Approval
          </Link>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Surat Keluar Terbit"
          value={letters.filter((l) => l.status === "approved").length}
          icon={Send}
        />
        <StatCard
          title="Menunggu Persetujuan"
          value={letters.filter((l) => l.status === "pending").length}
          badgeText={letters.filter((l) => l.status === "pending").length > 0 ? "Pending" : undefined}
          badgeVariant="warning"
          icon={Clock}
        />
        <StatCard
          title="Total Bulan Ini"
          value={43}
          icon={UserCheck}
        />
      </div>

      {/* Search */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nomor surat keluar, penerima, perihal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Surat Keluar Resmi</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredLetters.length} nomor surat terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Nomor Surat Resmi</TableHead>
                  <TableHead className="text-xs font-semibold">Tujuan / Penerima</TableHead>
                  <TableHead className="text-xs font-semibold">Perihal Surat</TableHead>
                  <TableHead className="text-xs font-semibold">Tanggal</TableHead>
                  <TableHead className="text-xs font-semibold">Status Pengesahan</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLetters.map((letter) => (
                  <TableRow key={letter.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="text-xs font-mono font-bold text-primary">
                      {letter.letter_number}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground max-w-xs">
                      {letter.recipient}
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
                      ) : (
                        <Badge variant="warning" className="text-[10px]">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs font-medium"
                        onClick={() => setSelectedLetter(letter)}
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
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLetter} onOpenChange={(open) => !open && setSelectedLetter(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Detail Surat Keluar</DialogTitle>
          </DialogHeader>

          {selectedLetter && (
            <div className="space-y-4 text-xs py-2">
              <div className="rounded-lg bg-secondary/50 p-4 border border-border space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Nomor Surat</p>
                    <p className="font-mono font-bold text-primary">{selectedLetter.letter_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tanggal Terbit</p>
                    <p className="font-semibold text-foreground">{selectedLetter.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Tujuan / Penerima</p>
                  <p className="font-semibold text-foreground">{selectedLetter.recipient}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Perihal Surat:</p>
                <p className="p-3 rounded bg-card border border-border">{selectedLetter.subject}</p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Ringkasan Keterangan:</p>
                <p className="p-3 rounded bg-card border border-border text-muted-foreground">
                  {selectedLetter.description}
                </p>
              </div>

              {selectedLetter.approved_by && (
                <div className="rounded border-2 border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
                  <p className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Telah Disetujui & Divalidasi oleh Kepala Sekolah
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Oleh: {selectedLetter.approved_by} • Tanggal: {selectedLetter.approval_date}
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
              Cetak Berkas
            </Button>
            <Button variant="default" size="sm" onClick={() => setSelectedLetter(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
