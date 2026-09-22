"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  User,
  ArrowLeft,
  Newspaper,
  ImagePlus,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NewsItem, SAMPLE_NEWS_LIST, getStoredNews } from "@/lib/data/news";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [article, setArticle] = useState<NewsItem | null>(() => {
    return SAMPLE_NEWS_LIST.find((item) => item.slug === slug) || null;
  });
  const [imageBroken, setImageBroken] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const all = getStoredNews();
    const found = all.find((item) => item.slug === slug);
    if (found) {
      setArticle(found);
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
          <Newspaper className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Artikel Tidak Ditemukan</h2>
        <p className="text-xs text-muted-foreground">
          Berita yang Anda cari mungkin telah dipindahkan atau dihapus.
        </p>
        <Button asChild size="sm" className="text-xs">
          <Link href="/berita">Kembali ke Daftar Berita</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-10 sm:py-16 space-y-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
          <Link href="/berita">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Berita
          </Link>
        </Button>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="text-xs">
              {article.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {article.published_at}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              Oleh {article.author}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Article Feature Image */}
        <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
          {imageBroken || !article.image_url ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-muted gap-2 text-muted-foreground/60">
              <ImagePlus className="h-10 w-10" />
              <span className="text-xs">Dokumentasi Kegiatan SMKS AL-FALAH</span>
            </div>
          ) : (
            <img
              src={article.image_url}
              alt={article.title}
              className="h-full w-full object-cover"
              onError={() => setImageBroken(true)}
            />
          )}
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-foreground space-y-4">
          {article.content.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Author / School Signature */}
        <Card className="border border-border bg-secondary/40 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base">
                AF
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Humas & Operator SMKS AL-FALAH</p>
                <p className="text-xs text-muted-foreground">
                  NPSN 69984368 • Desa Sungai Deras, Kec. Telok Pakedai
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link href="/berita">
                Lihat Berita Lainnya
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
