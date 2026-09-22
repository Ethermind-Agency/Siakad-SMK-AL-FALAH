"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  FileDown,
  Calendar,
  Building,
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
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";

interface IncomingLetter {
  id: string;
  agenda_number: string;
  letter_number: string;
  sender: string;
  received_date: string;
  letter_date: string;
  subject: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  disposition_note?: string;
  disposition_date?: string;
}

const INITIAL_DATA: IncomingLetter[] = [
  {
    id: "inc-1",
    agenda_number: "AG-028/SMK-AF/2026",
    letter_number: "005/DISDIK-KBR/IX/2026",
    sender: "Dinas Pendidikan & Kebudayaan Kab. Kubu Raya",
    received_date: "2026-09-18",
    letter_date: "2026-09-16",
    subject: "Pemberitahuan Pendataan Ulang Sarpras BAN-PDM & Verifikasi Dapodik",
    description: "Instruksi pengisian instrumen kelayakan sarana bengkel vokasi dan rombel aktif tahun ajaran 2026/2027.",
    status: "approved",
    disposition_note: "Tindak lanjuti segera bersama Staf TU dan instruktur bengkel TBSM.",
    disposition_date: "2026-09-19",
  },
  {
    id: "inc-2",
    agenda_number: "AG-029/SMK-AF/2026",
    letter_number: "112/YPP-AF/IX/2026",
    sender: "Yayasan Pondok Pesantren Al-Falah Teluk Pakedai",
    received_date: "2026-09-20",
    letter_date: "2026-09-19",
    subject: "Penyelenggaraan Peringatan Maulid Nabi & Rapat Evaluasi Bulanan",
    description: "Undangan rapat koordinasi pengurus yayasan bersama dewan guru dan pimpinan sekolah di Masjid Utama.",
    status: "pending",
  },
  {
    id: "inc-3",
    agenda_number: "AG-030/SMK-AF/2026",
    letter_number: "420/890/DUDI-ASTRA/IX/2026",
    sender: "PT Astra Motor Pontianak (Mitra Industri TBSM)",
    received_date: "2026-09-21",
    letter_date: "2026-09-20",
    subject: "Konfirmasi Penerimaan Program Praktik Kerja Lapangan (PKL) Siswa TBSM",
    description: "Persetujuan penempatan 6 siswa kelas XII TBSM pada periode magang semester genap 2026/2027.",
    status: "approved",
    disposition_note: "Siapkan surat tugas siswa dan berkas pembekalan PKL oleh Kaprog TBSM.",
    disposition_date: "2026-09-21",
  },
  {
    id: "inc-4",
    agenda_number: "AG-031/SMK-AF/2026",
    letter_number: "024/PUSK-TP/IX/2026",
    sender: "Puskesmas Kecamatan Telok Pakedai",
    received_date: "2026-09-22",
    letter_date: "2026-09-21",
    subject: "Jadwal Pemeriksaan Kesehatan Berkala & Penyuluhan Remaja Sehat",
    description: "Pelaksanaan skrining kesehatan siswa kelas X TBSM pada hari Kamis pekan depan.",
    status: "pending",
  },
];

export default function KepsekSuratMasukPage() {
  const [letters, setLetters] = useState<IncomingLetter[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null);

  const filteredLetters = letters.filter((l) =>
    l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.letter_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Arsip Surat Masuk
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar surat masuk dan riwayat lembar disposisi pimpinan
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/kepala-sekolah/disposisi">
            <Clock className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
            Antrean Disposisi
          </Link>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Surat Masuk"
          value={letters.length}
          icon={Mail}
        />
        <StatCard
          title="Telah Didisposisi"
          value={letters.filter((l) => l.status === "approved").length}
          icon={CheckCircle2}
        />
        <StatCard
          title="Menunggu Disposisi"
          value={letters.filter((l) => l.status === "pending").length}
          badgeText={letters.filter((l) => l.status === "pending").length > 0 ? "Pending" : undefined}
          badgeVariant="warning"
          icon={Clock}
        />
      </div>

      {/* Search */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nomor agenda, instansi pengirim, perihal..."
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
          <CardTitle className="text-base font-semibold">Buku Agenda Surat Masuk</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredLetters.length} berkas surat
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-xs font-semibold">No. Agenda & Tanggal</TableHead>
                  <TableHead className="text-xs font-semibold">Pengirim / Instansi</TableHead>
                  <TableHead className="text-xs font-semibold">Perihal Surat</TableHead>
                  <TableHead className="text-xs font-semibold">Status Disposisi</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLetters.map((letter) => (
                  <TableRow key={letter.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="text-xs">
                      <span className="font-mono font-bold text-primary block">
                        {letter.agenda_number}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {letter.received_date}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground max-w-xs">
                      {letter.sender}
                    </TableCell>
                    <TableCell className="text-xs max-w-sm">
                      <p className="font-medium text-foreground line-clamp-2">{letter.subject}</p>
                    </TableCell>
                    <TableCell>
                      {letter.status === "approved" ? (
                        <Badge variant="success" className="text-[10px]">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Terdisposisi
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px]">
                          <Clock className="mr-1 h-3 w-3" />
                          Menunggu
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
            <DialogTitle className="text-base font-bold">Detail Surat & Disposisi</DialogTitle>
          </DialogHeader>

          {selectedLetter && (
            <div className="space-y-4 text-xs py-2">
              <div className="rounded-lg bg-secondary/50 p-4 border border-border space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Nomor Agenda</p>
                    <p className="font-mono font-bold text-primary">{selectedLetter.agenda_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nomor Surat Asal</p>
                    <p className="font-mono font-bold text-foreground">{selectedLetter.letter_number}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Instansi Pengirim</p>
                  <p className="font-semibold text-foreground">{selectedLetter.sender}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Perihal Surat:</p>
                <p className="p-3 rounded bg-card border border-border">{selectedLetter.subject}</p>
              </div>

              {selectedLetter.disposition_note && (
                <div className="rounded border-2 border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
                  <p className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Lembar Disposisi Kepala Sekolah
                  </p>
                  <p className="italic text-foreground mt-1">"{selectedLetter.disposition_note}"</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Tanggal Disposisi: {selectedLetter.disposition_date}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLetter(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
