"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Newspaper,
  User,
  ImagePlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsItem, SAMPLE_NEWS_LIST, getStoredNews } from "@/lib/data/news";

function NewsCardImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-muted gap-1 text-muted-foreground/60">
        <ImagePlus className="h-6 w-6" />
        <span className="text-[10px]">Dokumentasi SMKS AL-FALAH</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
      onError={() => setBroken(true)}
    />
  );
}

export default function BeritaPage() {
  const [articles, setArticles] = useState<NewsItem[]>(SAMPLE_NEWS_LIST);

  useEffect(() => {
    setArticles(getStoredNews());

    const handleUpdate = () => {
      setArticles(getStoredNews());
    };
    window.addEventListener("sims-news-updated", handleUpdate);
    return () => window.removeEventListener("sims-news-updated", handleUpdate);
  }, []);

  return (
    <div className="flex flex-col py-10 sm:py-16 space-y-12 sm:space-y-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="default" className="text-xs">
            Warta Sekolah
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Berita & Pengumuman SMKS AL-FALAH
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Informasi terkini seputar agenda akademik, kompetensi kejuruan TBSM, prestasi siswa, dan kegiatan sekolah.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <Card
              key={item.id}
              className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="h-44 overflow-hidden border-b border-border bg-muted">
                  <NewsCardImage src={item.image_url} alt={item.title} />
                </div>
                <CardHeader className="p-5 pb-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {item.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.published_at}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground leading-snug line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                  <p className="line-clamp-3">{item.excerpt}</p>
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-0 border-t border-border/60 bg-secondary/20 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {item.author}
                </span>
                <Button asChild variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-primary font-semibold">
                  <Link href={`/berita/${item.slug}`}>
                    Baca Lengkap &rarr;
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
