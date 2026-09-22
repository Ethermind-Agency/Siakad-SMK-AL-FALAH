import React from "react";
import Link from "next/link";
import {
  Calendar,
  Camera,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image_url: string;
  description: string;
}

const GALLERY_ALBUMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Praktik Bongkar Pasang & Tune-Up Mesin Motor Siswa TBSM",
    category: "Kejuruan TBSM",
    date: "September 2026",
    image_url: "/images/gallery-mechanic.jpg",
    description: "Kegiatan siswa kelas XI TBSM melakukan overhaul mesin sepeda motor di bengkel kejuruan.",
  },
  {
    id: "gal-2",
    title: "Sholat Dhuhur Berjamaah & Kajian Rutin di Masjid Yayasan",
    category: "Karakter & Pesantren",
    date: "September 2026",
    image_url: "/images/facility-masjid.jpg",
    description: "Pembinaan spiritual dan pembiasaan sholat berjamaah seluruh siswa dan dewan guru.",
  },
  {
    id: "gal-3",
    title: "Pelaksanaan Upacara Bendera Rutin Hari Senin",
    category: "Kedisiplinan",
    date: "Agustus 2026",
    image_url: "/images/gallery-upacara.jpg",
    description: "Upacara bendera melatih jiwa nasionalisme dan kepemimpinan para santri dan siswa.",
  },
  {
    id: "gal-4",
    title: "Simulasi Uji Kelistrikan & Sistem Injeksi Sepeda Motor",
    category: "Kejuruan TBSM",
    date: "Agustus 2026",
    image_url: "/images/facility-bengkel.jpg",
    description: "Praktik pengukuran tegangan kabel bodi dan scanner sistem injeksi bahan bakar EFI.",
  },
  {
    id: "gal-5",
    title: "Turnamen Persahabatan Bola Voli Antar Kelas",
    category: "Olahraga",
    date: "Agustus 2026",
    image_url: "/images/gallery-voli.jpg",
    description: "Kegiatan ekstrakurikuler olahraga untuk memupuk kebersamaan dan kesehatan fisik siswa.",
  },
  {
    id: "gal-6",
    title: "Rapat Koordinasi Komite Sekolah & Wali Murid",
    category: "Musyawarah",
    date: "Juli 2026",
    image_url: "/images/hero-school.jpg",
    description: "Pertemuan berkala pimpinan sekolah dengan orang tua siswa terkait program tahun ajaran baru.",
  },
];

export default function GaleriPage() {
  return (
    <div className="flex flex-col py-10 sm:py-16 space-y-12 sm:space-y-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="default" className="text-xs">
            Dokumentasi Sekolah
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Galeri Kegiatan SMKS AL-FALAH
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Kumpulan dokumentasi foto aktivitas belajar, praktik kejuruan TBSM, pembinaan karakter pesantren, dan kegiatan sekolah.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ALBUMS.map((item) => (
            <Card
              key={item.id}
              className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-52 overflow-hidden border-b border-border bg-muted relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge variant="secondary" className="absolute bottom-3 left-3 text-[10px] bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                    {item.category}
                  </Badge>
                </div>
                <CardContent className="p-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed pt-1">
                    {item.description}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
