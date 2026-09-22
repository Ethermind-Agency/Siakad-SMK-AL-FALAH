"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Building,
  School,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SiswaProfilPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/siswa">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Profil Siswa & Data Akademik
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data induk siswa terdaftar pada pangkalan data Dapodik Kemendikbudristek
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <Card className="border border-border bg-card p-5 space-y-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
              RR
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Rizki Ramadhan</h2>
              <p className="text-xs text-muted-foreground font-mono">NISN: 0089876543</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Badge variant="success" className="text-[10px]">
                  Siswa Aktif
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Kelas XII TBSM
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kompetensi:</span>
              <span className="font-semibold text-foreground">Teknik Sepeda Motor</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wali Kelas:</span>
              <span className="font-semibold text-foreground">M. Syaifullah, S.Pd</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tahun Masuk:</span>
              <span className="font-semibold text-foreground">2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Akreditasi Sekolah:</span>
              <span className="font-semibold text-foreground">BAN-PDM (C)</span>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              Perlu Koreksi Biodata?
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Jika terdapat kekeliruan ejaan nama, NIK, atau nama ibu kandung, harap melapor ke Operator TU dengan membawa salinan Kartu Keluarga (KK).
            </p>
          </div>
        </Card>

        {/* Right Column: Detailed Bio & Parent Information */}
        <div className="lg:col-span-2 space-y-5">
          {/* Data Pokok */}
          <Card className="border border-border bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Data Pokok Peserta Didik
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Nama Lengkap Sesuai Ijazah</span>
                  <p className="font-semibold text-foreground">Rizki Ramadhan</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Nomor Induk Siswa Nasional (NISN)</span>
                  <p className="font-mono font-semibold text-foreground">0089876543</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Nomor Induk Kependudukan (NIK)</span>
                  <p className="font-mono font-semibold text-foreground">6112041205080001</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Tempat, Tanggal Lahir</span>
                  <p className="font-semibold text-foreground">Kubu Raya, 12 Mei 2008</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Jenis Kelamin / Agama</span>
                  <p className="font-semibold text-foreground">Laki-laki / Islam</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Sekolah Asal (SMP/MTs)</span>
                  <p className="font-semibold text-foreground">MTs Al-Falah Telok Pakedai</p>
                </div>
                <div className="sm:col-span-2 space-y-1 pt-1 border-t border-border/50">
                  <span className="text-muted-foreground">Alamat Domisili Lengkap</span>
                  <p className="font-semibold text-foreground">
                    Dusun Harapan Makmur, RT 04 / RW 02, Desa Teluk Pakedai, Kec. Telok Pakedai, Kab. Kubu Raya, Kalimantan Barat
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Orang Tua / Wali */}
          <Card className="border border-border bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Data Orang Tua / Wali Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Nama Ayah Kandung</span>
                  <p className="font-semibold text-foreground">H. Ridwan</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Pekerjaan Ayah</span>
                  <p className="font-semibold text-foreground">Petani / Wiraswasta</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Nama Ibu Kandung</span>
                  <p className="font-semibold text-foreground">Hj. Maryamah</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Pekerjaan Ibu</span>
                  <p className="font-semibold text-foreground">Ibu Rumah Tangga</p>
                </div>
                <div className="sm:col-span-2 space-y-1 pt-1 border-t border-border/50">
                  <span className="text-muted-foreground">Nomor Telepon / WhatsApp Orang Tua</span>
                  <p className="font-mono font-semibold text-foreground">+62 812-3456-7890</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
