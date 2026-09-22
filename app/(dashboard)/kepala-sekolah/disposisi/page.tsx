"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Send,
  Search,
  MessageSquare,
  FileText,
  AlertCircle,
  Eye,
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

interface PendingLetterItem {
  id: string;
  letter_number: string;
  type: "incoming" | "outgoing";
  subject: string;
  sender_or_recipient: string;
  date: string;
  status: LetterStatus;
  description: string;
  disposition_note?: string;
}

const INITIAL_QUEUE: PendingLetterItem[] = [
  {
    id: "p-1",
    letter_number: "421/043/SMK-AF/IX/2026",
    type: "outgoing",
    subject: "Permohonan Izin Kunjungan Industri Siswa TBSM ke Astra Motor Pontianak",
    sender_or_recipient: "PT Astra Motor Pontianak",
    date: "2026-09-21",
    status: "pending",
    description: "Pengajuan izin rombongan 34 siswa kelas XI TBSM bersama 2 guru pendamping untuk kunjungan industri.",
  },
  {
    id: "p-2",
    letter_number: "112/YPP-AF/IX/2026",
    type: "incoming",
    subject: "Undangan Rapat Evaluasi Triwulan & Peringatan Maulid Nabi SAW",
    sender_or_recipient: "Yayasan Ponpes Al-Falah Teluk Pakedai",
    date: "2026-09-20",
    status: "pending",
    description: "Pertemuan pengurus yayasan dan dewan guru di Masjid Utama pada hari Sabtu mendatang.",
  },
  {
    id: "p-3",
    letter_number: "024/PUSK-TP/IX/2026",
    type: "incoming",
    subject: "Jadwal Pemeriksaan Kesehatan Berkala Siswa Baru Kelas X TBSM",
    sender_or_recipient: "Puskesmas Kecamatan Telok Pakedai",
    date: "2026-09-22",
    status: "pending",
    description: "Pelaksanaan skrining kesehatan fisik dan penyuluhan remaja sehat bagi 36 santri/siswa kelas X.",
  },
];

export default function AntreanDisposisiPage() {
  const [queue, setQueue] = useState<PendingLetterItem[]>(INITIAL_QUEUE);
  const [selectedLetter, setSelectedLetter] = useState<PendingLetterItem | null>(null);
  const [dispositionNote, setDispositionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenAction = (item: PendingLetterItem) => {
    setSelectedLetter(item);
    setDispositionNote(item.disposition_note || "");
  };

  const handleProcessAction = (actionStatus: "approved" | "rejected") => {
    if (!selectedLetter) return;
    setSubmitting(true);

    setTimeout(() => {
      setQueue(queue.filter((q) => q.id !== selectedLetter.id));
      setSubmitting(false);
      setSelectedLetter(null);
    }, 400);
  };

  const filteredQueue = queue.filter(
    (item) =>
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sender_or_recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letter_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Antrean Disposisi
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Persetujuan surat dinas dan penerbitan instruksi disposisi
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Menunggu Tindakan"
          value={queue.length}
          badgeText={queue.length > 0 ? "Perlu Respon" : "Selesai"}
          badgeVariant={queue.length > 0 ? "warning" : "success"}
          icon={Clock}
        />
        <StatCard
          title="Draft Surat Keluar"
          value={queue.filter((q) => q.type === "outgoing").length}
          icon={Send}
        />
        <StatCard
          title="Surat Masuk"
          value={queue.filter((q) => q.type === "incoming").length}
          icon={Mail}
        />
      </div>

      {/* Search Bar */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nomor surat, pengirim/tujuan, perihal antrean..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Surat yang Membutuhkan Respon</CardTitle>
          <CardDescription className="text-xs">
            Pilih surat untuk melihat isi ringkas dan memberikan keputusan persetujuan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredQueue.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Semua Surat Selesai Diproses"
                description="Tidak ada berkas yang tertahan di antrean disposisi Kepala Sekolah saat ini."
                icon={CheckCircle2}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Jenis & Nomor Surat</TableHead>
                    <TableHead className="text-xs font-semibold">Perihal & Uraian Singkat</TableHead>
                    <TableHead className="text-xs font-semibold">Pihak Terkait</TableHead>
                    <TableHead className="text-xs font-semibold">Tanggal</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Aksi Kepsek</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-xs">
                        <span className="font-mono font-bold text-primary block">
                          {item.letter_number}
                        </span>
                        <Badge
                          variant={item.type === "incoming" ? "outline" : "default"}
                          className="text-[10px] mt-0.5"
                        >
                          {item.type === "incoming" ? "Surat Masuk" : "Draft Surat Keluar"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-sm">
                        <p className="font-semibold text-foreground line-clamp-1">{item.subject}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {item.sender_or_recipient}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                        {item.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs bg-primary text-primary-foreground font-semibold"
                          onClick={() => handleOpenAction(item)}
                        >
                          <FileCheck2 className="mr-1.5 h-3.5 w-3.5" />
                          Proses Disposisi
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

      {/* Disposition Modal */}
      <Dialog open={!!selectedLetter} onOpenChange={(open) => !open && setSelectedLetter(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {selectedLetter?.type === "incoming"
                ? "Disposisi Surat Masuk"
                : "Persetujuan Surat Keluar"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tulis instruksi atau langsung berikan pengesahan resmi
            </DialogDescription>
          </DialogHeader>

          {selectedLetter && (
            <div className="space-y-3.5 text-xs py-2">
              <div className="rounded-lg bg-secondary/50 p-3.5 border border-border space-y-1.5">
                <p className="font-bold text-foreground">{selectedLetter.subject}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border">
                  <span>Nomor: <strong className="font-mono text-foreground">{selectedLetter.letter_number}</strong></span>
                  <span>Tanggal: <strong className="text-foreground">{selectedLetter.date}</strong></span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Pihak: <strong className="text-foreground">{selectedLetter.sender_or_recipient}</strong>
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Keterangan / Uraian:</p>
                <p className="p-3 rounded-md bg-card border border-border text-muted-foreground leading-relaxed">
                  {selectedLetter.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Catatan Disposisi / Instruksi Kepala Sekolah:
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
                  placeholder="Contoh: Teruskan ke Waka Kurikulum dan Kaprog TBSM untuk dipersiapkan..."
                  value={dispositionNote}
                  onChange={(e) => setDispositionNote(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={submitting}
              onClick={() => handleProcessAction("rejected")}
              className="w-full sm:w-auto text-xs"
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Tolak Berkas
            </Button>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedLetter(null)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={submitting}
                onClick={() => handleProcessAction("approved")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                {submitting ? "Menyimpan..." : "Setujui & Terbitkan"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
