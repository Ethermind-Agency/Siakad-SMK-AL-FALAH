"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  School,
  LogIn,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  BookOpen,
  Building2,
  Newspaper,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { title: "Beranda", href: "/" },
  { title: "Profil & Visi Misi", href: "/profil" },
  { title: "Fasilitas", href: "/fasilitas" },
  { title: "Berita & Agenda", href: "/berita" },
  { title: "Galeri", href: "/galeri" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      {/* Top Notification / Identity Strip */}
      <div className="bg-primary text-primary-foreground py-1 px-4 text-xs font-medium">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Telok Pakedai, Kab. Kubu Raya, Kalbar
            </span>
            <span className="hidden sm:inline-block">•</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              NPSN: 69984368
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1">
              Akreditasi: BAN-PDM (C)
            </span>
            <span className="hidden sm:inline-block">•</span>
            <span className="text-[11px] opacity-90">
              Waktu Belajar: Siang (6 Hari)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
            AF
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground leading-none">
              SMKS AL-FALAH
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              Kubu Raya • Vokasi & Karakter Islami
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Portal Login (with generous right padding to avoid browser extension overlap) */}
        <div className="hidden md:flex items-center gap-3 pr-2 lg:pr-4">
          <Button asChild size="sm" className="bg-primary text-primary-foreground shadow-sm px-4">
            <Link href="/dashboard">
              <LogIn className="mr-2 h-4 w-4" />
              Portal SIMS
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm" variant="outline" className="h-8 px-2.5 text-xs">
            <Link href="/dashboard">
              <LogIn className="mr-1.5 h-3.5 w-3.5 text-primary" />
              SIMS
            </Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Buka menu navigasi"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full bg-card">
                {/* Mobile Header */}
                <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    AF
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">SMKS AL-FALAH</p>
                    <p className="text-[10px] text-muted-foreground">NPSN: 69984368</p>
                  </div>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                  <p className="px-3 text-[11px] font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                    Menu Utama
                  </p>
                  {NAV_LINKS.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <span>{link.title}</span>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    );
                  })}

                  <div className="pt-6">
                    <p className="px-3 text-[11px] font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                      Layanan Internal
                    </p>
                    <Button
                      asChild
                      className="w-full justify-start bg-primary text-primary-foreground text-sm h-10"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/dashboard">
                        <LogIn className="mr-2 h-4 w-4" />
                        Masuk ke Portal SIMS
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Mobile Footer */}
                <div className="border-t border-border p-4 bg-secondary/50 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">SMKS AL-FALAH</p>
                  <p>Sungai Deras, Telok Pakedai, Kubu Raya</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
