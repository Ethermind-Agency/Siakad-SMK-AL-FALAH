import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  School,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Identity & Foundation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
                AF
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">SMKS AL-FALAH</h3>
                <p className="text-xs text-muted-foreground">Kubu Raya, Kalimantan Barat</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lembaga pendidikan kejuruan di bawah naungan{" "}
              <strong className="text-foreground font-semibold">
                Yayasan Pondok Pesantren Al-Falah Teluk Pakedai
              </strong>
              . Membina generasi terampil, kompeten, dan berakhlak mulia.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="text-[10px]">
                NPSN: 69984368
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                Akreditasi C (BAN-PDM)
              </Badge>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Tautan Navigasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/profil"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Visi, Misi & Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link
                  href="/fasilitas"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Fasilitas & Sarana Prasarana
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Berita & Pengumuman Sekolah
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Galeri Foto Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Portal SIMS (Login Pengguna)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Program & Kurikulum */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Program Keahlian
            </h4>
            <div className="rounded-lg border border-border bg-secondary/40 p-3 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <GraduationCap className="h-4 w-4 text-primary" />
                Teknik & Bisnis Sepeda Motor (TBSM)
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Fokus kompetensi mekanik otomotif roda dua, pemeliharaan mesin, kelistrikan, sasis, dan kewirausahaan bengkel.
              </p>
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Waktu Pembelajaran: Siang / 6 Hari Belajar</span>
            </div>
          </div>

          {/* Col 4: School Address & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Alamat & Kontak
            </h4>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Desa Sungai Deras, Kec. Telok Pakedai, Kab. Kubu Raya, Kalimantan Barat 78383
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>SK Pendirian: 1297/BAN-SM/SK/2021</span>
              </div>
              <div className="pt-2">
                <p className="text-[11px] font-medium text-foreground">Kepala Sekolah:</p>
                <p className="text-[11px]">Dedi Irawan</p>
                <p className="text-[11px] font-medium text-foreground mt-1">Operator Sekolah:</p>
                <p className="text-[11px]">Ibrahim</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} SMKS AL-FALAH Kubu Raya. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="text-[11px]">
            Sistem Informasi Manajemen Sekolah (SIMS) • SMKS AL-FALAH Telok Pakedai, Kab. Kubu Raya
          </p>
        </div>
      </div>
    </footer>
  );
}
