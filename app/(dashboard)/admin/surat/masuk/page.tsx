"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  PlusCircle,
  Search,
  Filter,
  Eye,
  FileDown,
  Upload,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Trash2,
  RefreshCw,
  Send,
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
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
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
  status: "pending" | "approved" | "rejected" | "archived";
  disposition_note?: string;
  disposition_date?: string;
  file_url?: string;
}

const INITIAL_INCOMING_LETTERS: IncomingLetter[] = [
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
    file_url: "/docs/sample-disdik-005.pdf",
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
    file_url: "/docs/sample-yayasan-112.pdf",
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
    file_url: "/docs/sample-astra-420.pdf",
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

export default function SuratMasukPage() {
  const [letters, setLetters] = useState<IncomingLetter[]>(INITIAL_INCOMING_LETTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    letter_number: "",
    sender: "",
    letter_date: "2026-09-22",
    received_date: "2026-09-22",
    subject: "",
    description: "",
    file_name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        letter_date: today,
        received_date: today,
      }));
    } catch {}
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const nextCount = letters.length + 28;
    const newEntry: IncomingLetter = {
      id: `inc-${Date.now()}`,
      agenda_number: `AG-0${nextCount}/SMK-AF/2026`,
      letter_number: formData.letter_number,
      sender: formData.sender,
      received_date: formData.received_date,
      letter_date: formData.letter_date,
      subject: formData.subject,
      description: formData.description,
      status: "pending",
      file_url: formData.file_name ? `/docs/${formData.file_name}` : undefined,
    };

    setTimeout(() => {
      setLetters([newEntry, ...letters]);
      setSubmitting(false);
      setCreateOpen(false);
      setFormData({
        letter_number: "",
        sender: "",
        letter_date: new Date().toISOString().split("T")[0],
        received_date: new Date().toISOString().split("T")[0],
        subject: "",
        description: "",
        file_name: "",
      });
    }, 400);
  };

  const filteredLetters = letters.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agenda_number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCount = letters.length;
  const approvedCount = letters.filter((l) => l.status === "approved").length;
  const pendingCount = letters.filter((l) => l.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Surat Masuk
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Buku agenda penerimaan surat dinas dan disposisi pimpinan
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="bg-primary text-primary-foreground h-8 text-xs shrink-0"
        >
          <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
          Catat Surat Masuk
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Surat Masuk"
          value={totalCount}
          icon={Mail}
        />
        <StatCard
          title="Sudah Didisposisi"
          value={approvedCount}
          icon={CheckCircle2}
        />
        <StatCard
          title="Menunggu Disposisi"
          value={pendingCount}
          badgeText={pendingCount > 0 ? `${pendingCount} Menunggu` : undefined}
          badgeVariant="warning"
          icon={Clock}
        />
        <StatCard
          title="Format Berkas"
          value="PDF"
          icon={FileText}
        />
      </div>

      {/* Search & Filter Bar */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor agenda, instansi pengirim, perihal..."
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
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
                className="text-xs"
              >
                Menunggu ({pendingCount})
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
                className="text-xs"
              >
                Disposisi ({approvedCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Buku Agenda Surat Masuk</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredLetters.length} dari {totalCount} arsip surat tercatat
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLetters.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Surat Masuk Tidak Ditemukan"
                description="Tidak ada berkas surat yang sesuai dengan kata kunci pencarian atau filter status."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">No. Agenda & Tanggal</TableHead>
                    <TableHead className="text-xs font-semibold">Asal Pengirim & No. Surat</TableHead>
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
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          Terima: {letter.received_date}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs max-w-xs">
                        <p className="font-semibold text-foreground line-clamp-1">{letter.sender}</p>
                        <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                          {letter.letter_number}
                        </p>
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
                        ) : letter.status === "pending" ? (
                          <Badge variant="warning" className="text-[10px]">
                            <Clock className="mr-1 h-3 w-3" />
                            Menunggu Kepsek
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            {letter.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
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

      {/* Detail & Disposisi Modal Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="text-lg font-bold">Detail Arsip Surat Masuk</DialogTitle>
              {selectedLetter?.status === "approved" ? (
                <Badge variant="success">Sudah Didisposisi</Badge>
              ) : (
                <Badge variant="warning">Menunggu Arahan Kepala Sekolah</Badge>
              )}
            </div>
            <DialogDescription className="text-xs">
              Informasi lengkap nomor agenda dan catatan instruksi pimpinan
            </DialogDescription>
          </DialogHeader>

          {selectedLetter && (
            <div className="space-y-4 text-xs py-2">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/50 p-4 border border-border">
                <div>
                  <p className="text-muted-foreground">Nomor Agenda Sekolah</p>
                  <p className="font-mono font-bold text-primary text-sm mt-0.5">
                    {selectedLetter.agenda_number}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nomor Surat Asal</p>
                  <p className="font-mono font-bold text-foreground text-sm mt-0.5">
                    {selectedLetter.letter_number}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Instansi / Pihak Pengirim</p>
                  <p className="font-semibold text-foreground mt-0.5">{selectedLetter.sender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Surat / Tanggal Masuk</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {selectedLetter.letter_date} / {selectedLetter.received_date}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Perihal Surat:</p>
                <p className="p-3 rounded-md bg-card border border-border text-foreground leading-relaxed">
                  {selectedLetter.subject}
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">Ringkasan / Isi Pokok:</p>
                <p className="p-3 rounded-md bg-card border border-border text-muted-foreground leading-relaxed">
                  {selectedLetter.description}
                </p>
              </div>

              {/* Disposition Box */}
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Lembar Disposisi Kepala Sekolah (Dedi Irawan)
                  </span>
                  {selectedLetter.disposition_date && (
                    <span className="text-[11px] text-muted-foreground">
                      Tanggal: {selectedLetter.disposition_date}
                    </span>
                  )}
                </div>
                {selectedLetter.disposition_note ? (
                  <p className="italic text-foreground bg-card p-3 rounded border border-border">
                    "{selectedLetter.disposition_note}"
                  </p>
                ) : (
                  <p className="text-muted-foreground text-[11px]">
                    Belum ada catatan disposisi dari Kepala Sekolah.
                  </p>
                )}
              </div>

              {selectedLetter.file_url && (
                <div className="flex items-center justify-between p-3 rounded-md bg-secondary border border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">Lampiran Berkas PDF Surat</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <FileDown className="mr-1.5 h-3.5 w-3.5" />
                    Unduh PDF
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Incoming Letter Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Catat Surat Masuk Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Masukkan detail identitas surat fisik yang diterima ke dalam Buku Agenda SIMS
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nomor Surat Asal *</label>
                <Input
                  required
                  placeholder="Contoh: 005/DISDIK/IX/2026"
                  value={formData.letter_number}
                  onChange={(e) => setFormData({ ...formData, letter_number: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Instansi / Pengirim *</label>
                <Input
                  required
                  placeholder="Contoh: Dinas Pendidikan Kalbar"
                  value={formData.sender}
                  onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Tanggal Pada Surat *</label>
                <Input
                  type="date"
                  required
                  value={formData.letter_date}
                  onChange={(e) => setFormData({ ...formData, letter_date: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Tanggal Surat Diterima *</label>
                <Input
                  type="date"
                  required
                  value={formData.received_date}
                  onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Perihal Surat *</label>
              <Input
                required
                placeholder="Contoh: Undangan Koordinasi Akreditasi Sekolah"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Ringkasan / Isi Pokok *</label>
              <textarea
                required
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Tuliskan intisari isi surat untuk keperluan disposisi pimpinan..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Unggah Scan PDF Surat (Opsional)</label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, file_name: file.name });
                  }
                }}
              />
              <p className="text-[10px] text-muted-foreground">Maksimal ukuran berkas 5MB format .pdf</p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? "Menyimpan ke Buku Agenda..." : "Simpan Surat Masuk"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
