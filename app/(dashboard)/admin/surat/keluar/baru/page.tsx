"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send,
  ArrowLeft,
  Sparkles,
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateLetterNumber } from "@/lib/utils/letter-numbering";

export default function BuatSuratKeluarBaruPage() {
  const router = useRouter();

  const [classification, setClassification] = useState("421");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [letterDate, setLetterDate] = useState("2026-09-22");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    try {
      setLetterDate(new Date().toISOString().split("T")[0]);
    } catch {}
  }, []);

  // Live auto-number calculation: 45th letter of 2026
  const nextSequenceNumber = 45;
  const currentMonth = 9;
  const currentYear = 2026;
  const generatedNumber = generateLetterNumber(classification, nextSequenceNumber, currentMonth, currentYear);

  const handleSubmit = (actionType: "draft" | "submit") => {
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/admin/surat/keluar");
      }, 1000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-1 -ml-2 h-7 text-xs text-muted-foreground hover:text-foreground">
            <Link href="/admin/surat/keluar">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Buat Surat Keluar Baru
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Penerbitan nomor dinas otomatis dan pengajuan pengesahan Kepala Sekolah
          </p>
        </div>
      </div>

      {savedSuccess && (
        <Card className="border-emerald-500 bg-emerald-500/10 text-emerald-900 p-3">
          <div className="flex items-center gap-2 font-semibold text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Surat berhasil disimpan dengan nomor resmi {generatedNumber}. Mengalihkan...
          </div>
        </Card>
      )}

      {/* Live Generated Letter Number Preview */}
      <Card className="border border-border bg-muted/30">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Pratinjau Nomor Surat Otomatis
              </p>
              <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                {generatedNumber}
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Format Klasifikasi Dinas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Main Letter Form */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="text-base font-semibold">Formulir Konsep Surat Dinas</CardTitle>
          <CardDescription className="text-xs">
            Isi atribut surat dengan lengkap sebelum diajukan ke Kepala Sekolah
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Classification */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Klasifikasi / Kode Surat *
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="421">421 — Pendidikan, Kesiswaan & Kurikulum Vokasi</option>
                <option value="005">005 — Undangan Rapat / Pertemuan Dinas</option>
                <option value="800">800 — Kepegawaian & Penugasan Guru</option>
                <option value="020">020 — Perlengkapan & Sarpras Sekolah</option>
                <option value="045">045 — Penelitian & Kerjasama Mitra DUDI</option>
              </select>
              <p className="text-[10px] text-muted-foreground">
                Menentukan digit awal penomoran surat resmi SMKS AL-FALAH
              </p>
            </div>

            {/* Letter Date */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Tanggal Surat Keluar *
              </label>
              <Input
                type="date"
                required
                value={letterDate}
                onChange={(e) => setLetterDate(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Tanggal yang akan tercantum pada kop dan penutup surat
              </p>
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Tujuan / Kepada Yth. *
            </label>
            <Input
              required
              placeholder="Contoh: Pimpinan Bengkel Resmi Honda Astra Motor Pontianak"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Perihal Surat *
            </label>
            <Input
              required
              placeholder="Contoh: Permohonan Uji Kompetensi Keahlian (UKK) TBSM Tahun 2026"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Letter Body Content */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Isi Pokok / Ringkasan Keterangan Surat *
            </label>
            <textarea
              required
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
              placeholder="Tuliskan isi pokok pengantar, maksud dan tujuan, serta rincian waktu/tempat kegiatan yang dicantumkan..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Catatan Internal untuk Kepala Sekolah (Opsional)
            </label>
            <Input
              placeholder="Contoh: Mohon approval segera sebelum batas waktu pendaftaran tanggal 25 Sep"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 border-t border-border bg-secondary/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Format nomor surat otomatis tervalidasi</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => handleSubmit("draft")}
              className="w-full sm:w-auto text-xs"
            >
              Simpan sebagai Draft
            </Button>
            <Button
              type="button"
              disabled={submitting || !recipient || !subject || !content}
              onClick={() => handleSubmit("submit")}
              className="w-full sm:w-auto bg-primary text-primary-foreground text-xs"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {submitting ? "Memproses..." : "Ajukan ke Kepala Sekolah"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
