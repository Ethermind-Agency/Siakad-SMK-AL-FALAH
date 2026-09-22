"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  School,
  Save,
  CheckCircle2,
  ShieldCheck,
  Target,
  Award,
  History,
  Building,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminProfilPage() {
  const [npsn, setNpsn] = useState("69984368");
  const [schoolName, setSchoolName] = useState("SMKS AL-FALAH");
  const [headmaster, setHeadmaster] = useState("Dedi Irawan");
  const [accreditation, setAccreditation] = useState("BAN-PDM (C)");
  const [skNumber, setSkNumber] = useState("1297/BAN-SM/SK/2021");
  const [address, setAddress] = useState("Desa Sungai Deras, Kec. Telok Pakedai, Kab. Kubu Raya, Kalimantan Barat, 78383");
  const [vision, setVision] = useState("Menjadi Sekolah Menengah Kejuruan yang unggul, berakhlak mulia, berjiwa wirausaha, dan siap bersaing di dunia industri otomotif tingkat regional maupun nasional.");
  const [history, setHistory] = useState("SMKS AL-FALAH didirikan atas prakarsa Yayasan Pondok Pesantren Al-Falah Teluk Pakedai untuk menjawab tantangan ketersediaan akses pendidikan kejuruan menengah bagi masyarakat di wilayah Desa Sungai Deras dan sekitarnya di Kabupaten Kubu Raya, Kalimantan Barat.");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Profil Sekolah
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identitas resmi Dapodik, visi misi, dan sejarah institusi
          </p>
        </div>
      </div>

      {saveSuccess && (
        <Card className="border-emerald-500 bg-emerald-500/10 text-emerald-900 p-4">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Data profil sekolah dan visi misi berhasil diperbarui!
          </div>
        </Card>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Legalitas */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-bold">Data Pokok Pendidikan (Dapodik)</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Informasi identitas resmi yang terdaftar di Kementerian Pendidikan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nomor Pokok Sekolah Nasional (NPSN)</label>
                <Input value={npsn} onChange={(e) => setNpsn(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nama Resmi Sekolah</label>
                <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Kepala Sekolah Aktif</label>
                <Input value={headmaster} onChange={(e) => setHeadmaster(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Status Akreditasi & No. SK</label>
                <Input value={`${accreditation} (${skNumber})`} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Alamat Lengkap Sekolah</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Visi Sekolah */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-bold">Teks Visi Sekolah</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Cita-cita dan arah pengembangan institusi jangka panjang
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-xs">
            <textarea
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Sejarah Sekolah */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-bold">Sejarah Singkat Sekolah</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Latar belakang pendirian SMKS AL-FALAH di Desa Sungai Deras
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-xs">
            <textarea
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
            />
          </CardContent>
          <CardFooter className="border-t border-border p-5 flex justify-end bg-secondary/20">
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground text-xs"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {saving ? "Menyimpan..." : "Simpan Pembaruan Profil"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
