"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSlug } from "@/lib/utils/slug";
import { addNewsItem } from "@/lib/data/news";
import { NewsImageUploader } from "@/components/cms/news-image-uploader";

const DEFAULT_CATEGORIES = [
  "Kejuruan TBSM",
  "Akademik",
  "Inovasi SIMS",
  "Kegiatan Pesantren",
  "Kegiatan Sekolah",
  "Kesiswaan",
  "Pengumuman Resmi",
];

export default function TulisBeritaBaruPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kejuruan TBSM");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [author, setAuthor] = useState("Ibrahim (Operator TU)");
  const [publishedAt, setPublishedAt] = useState("22 September 2026");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/gallery-mechanic.jpg");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);

  React.useEffect(() => {
    try {
      setPublishedAt(
        new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    } catch {}
  }, []);

  const finalCategory = isCustomCat && customCategory.trim() ? customCategory.trim() : category;
  const slug = generateSlug(title || "judul-berita");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);

    try {
      addNewsItem({
        title: title.trim(),
        slug: slug,
        category: finalCategory,
        published_at: publishedAt,
        author: author.trim(),
        excerpt: excerpt.trim() || title.trim(),
        image_url: imageUrl || "/images/hero-school.jpg",
        content: content.trim(),
      });

      setSubmitting(false);
      setPublished(true);

      setTimeout(() => {
        router.push("/admin/cms/berita");
      }, 1000);
    } catch (err) {
      console.error("Error creating news:", err);
      setSubmitting(false);
      alert("Gagal menyimpan artikel berita.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link & Header */}
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-1 -ml-2 h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href="/admin/cms/berita">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Kembali ke Manajemen Berita
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Tulis Berita & Pengumuman Baru
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Unggah foto dokumentasi dan publikasikan artikel ke portal informasi sekolah
        </p>
      </div>

      {published && (
        <Card className="border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            Artikel berita berhasil diterbitkan beserta foto sampul! Mengalihkan...
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-base font-semibold">Formulir Publikasi Berita</CardTitle>
            <CardDescription className="text-xs">
              Lengkapi informasi judul, foto sampul, kategori, dan isi artikel
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Judul Artikel Berita <span className="text-destructive">*</span>
              </Label>
              <Input
                required
                placeholder="Contoh: Kunjungan Edukasi Siswa TBSM ke Pusat Perakitan Motor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs sm:text-sm"
              />
              <p className="text-[11px] text-muted-foreground font-mono">
                Slug URL publik: /berita/<span className="text-primary font-bold">{slug}</span>
              </p>
            </div>

            {/* Image Uploader Component */}
            <div className="p-4 rounded-lg border border-border/80 bg-muted/20">
              <NewsImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Foto Sampul Berita"
                helperText="Pilih dari koleksi galeri sekolah atau unggah berkas lokal (PNG, JPG, WebP maks 5 MB)."
              />
            </div>

            {/* Category & Author Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">
                    Kategori <span className="text-destructive">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCat(!isCustomCat)}
                    className="text-[10px] text-primary hover:underline"
                  >
                    {isCustomCat ? "Pilih dari daftar" : "+ Kategori Lain"}
                  </button>
                </div>

                {isCustomCat ? (
                  <Input
                    placeholder="Ketik nama kategori baru..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="text-xs"
                    autoFocus
                  />
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Penulis / Sumber Rilis <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Ibrahim (Operator TU) / Tim Humas"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Ringkasan / Sinopsis Singkat
              </Label>
              <textarea
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Tuliskan 1-2 kalimat pengantar singkat untuk kartu berita di beranda publik..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Konten Artikel Lengkap <span className="text-destructive">*</span>
              </Label>
              <textarea
                required
                rows={9}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
                placeholder="Tuliskan isi berita secara mendalam. Pisahkan paragraf dengan enter ganda..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between p-6 border-t border-border bg-secondary/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/cms/berita")}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="bg-primary text-primary-foreground text-xs font-semibold"
            >
              <Newspaper className="mr-1.5 h-3.5 w-3.5" />
              {submitting ? "Menerbitkan..." : "Terbitkan Berita & Foto"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
