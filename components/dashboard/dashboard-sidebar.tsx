"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Send,
  FileText,
  Building2,
  Newspaper,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  CheckSquare,
  BarChart3,
  LogOut,
  School,
  FileCheck2,
  Calendar,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types/database";
import {
  AcademicYearConfig,
  DEFAULT_ACADEMIC_YEAR,
  getActiveAcademicYear,
} from "@/lib/data/academic";
import { AcademicYearDialog } from "./academic-year-dialog";

interface SidebarProps {
  role: UserRole;
  onNavigate?: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export function getNavigationForRole(role: UserRole): NavGroup[] {
  switch (role) {
    case "admin_tu":
      return [
        {
          items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
        },
        {
          groupLabel: "Persuratan",
          items: [
            { title: "Surat Masuk", href: "/admin/surat/masuk", icon: Mail },
            { title: "Surat Keluar", href: "/admin/surat/keluar", icon: Send },
          ],
        },
        {
          groupLabel: "Master Data",
          items: [
            { title: "Data Siswa", href: "/admin/siswa", icon: GraduationCap },
            { title: "Data Kelas", href: "/admin/kelas", icon: BookOpen },
            { title: "Mata Pelajaran", href: "/admin/mapel", icon: FileText },
            { title: "Pengguna", href: "/admin/pengguna", icon: Users },
          ],
        },
        {
          groupLabel: "Portal & Profil",
          items: [
            { title: "Berita & Pengumuman", href: "/admin/cms/berita", icon: Newspaper },
            { title: "Fasilitas Sekolah", href: "/admin/cms/fasilitas", icon: Building2 },
            { title: "Profil Sekolah", href: "/admin/cms/profil", icon: School },
          ],
        },
      ];

    case "kepala_sekolah":
      return [
        {
          items: [{ title: "Dashboard", href: "/kepala-sekolah", icon: LayoutDashboard }],
        },
        {
          groupLabel: "Disposisi & Persetujuan",
          items: [
            { title: "Antrean Disposisi", href: "/kepala-sekolah/disposisi", icon: FileCheck2, badge: "3" },
            { title: "Arsip Surat Masuk", href: "/kepala-sekolah/surat/masuk", icon: Mail },
            { title: "Arsip Surat Keluar", href: "/kepala-sekolah/surat/keluar", icon: Send },
          ],
        },
        {
          groupLabel: "Monitoring",
          items: [
            { title: "Rekap Kehadiran", href: "/kepala-sekolah/monitoring/absensi", icon: BarChart3 },
            { title: "Kondisi Fasilitas", href: "/kepala-sekolah/monitoring/profil", icon: Building2 },
          ],
        },
      ];

    case "guru":
      return [
        {
          items: [{ title: "Dashboard", href: "/guru", icon: LayoutDashboard }],
        },
        {
          groupLabel: "Presensi",
          items: [
            { title: "Absensi Harian", href: "/guru/absensi/harian", icon: CheckSquare },
            { title: "Absensi Mapel", href: "/guru/absensi/mapel", icon: CalendarCheck },
            { title: "Rekap & Ekspor", href: "/guru/absensi/rekap", icon: ClipboardList },
          ],
        },
        {
          groupLabel: "Siswa",
          items: [
            { title: "Siswa Binaan", href: "/guru/siswa", icon: GraduationCap },
          ],
        },
      ];

    case "siswa_ortu":
      return [
        {
          items: [{ title: "Dashboard", href: "/siswa", icon: LayoutDashboard }],
        },
        {
          groupLabel: "Akademik",
          items: [
            { title: "Kehadiran Saya", href: "/siswa/kehadiran", icon: CalendarCheck },
          ],
        },
        {
          groupLabel: "Informasi",
          items: [
            { title: "Pengumuman", href: "/siswa/pengumuman", icon: Newspaper },
            { title: "Profil Sekolah", href: "/siswa/profil", icon: School },
          ],
        },
      ];

    default:
      return [];
  }
}

// ── Memoized sidebar: only re-renders when role or pathname changes ──────────
export const DashboardSidebar = React.memo(function DashboardSidebar({
  role,
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [academicConfig, setAcademicConfig] = useState<AcademicYearConfig>(DEFAULT_ACADEMIC_YEAR);
  const [academicDialogOpen, setAcademicDialogOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    setAcademicConfig(getActiveAcademicYear());

    const handleUpdate = () => {
      setAcademicConfig(getActiveAcademicYear());
    };
    window.addEventListener("sims-academic-updated", handleUpdate);
    return () => window.removeEventListener("sims-academic-updated", handleUpdate);
  }, []);

  // nav config is stable per role — recomputed only when role changes
  const navGroups = useMemo(() => getNavigationForRole(role), [role]);

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-card text-card-foreground",
        className
      )}
    >
      {/* Brand & School Info */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          AF
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">SMKS AL-FALAH</span>
          <span className="text-[11px] text-muted-foreground">NPSN 69984368</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {group.groupLabel && (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group.groupLabel}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none",
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-secondary text-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info & Logout */}
      <div className="border-t border-border p-3 space-y-2">
        {!mounted ? (
          <div className="rounded-md bg-secondary/40 px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Tahun Ajaran</span>
            <span className="font-medium text-foreground">2026/2027 Ganjil</span>
          </div>
        ) : (
          <div
            onClick={() => setAcademicDialogOpen(true)}
            title="Klik untuk mengubah Tahun Ajaran & Semester aktif"
            className="rounded-md bg-secondary/40 hover:bg-secondary/80 transition-colors px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between cursor-pointer group border border-transparent hover:border-border/60"
          >
            <span>Tahun Ajaran</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <span>{academicConfig.academic_year} {academicConfig.semester}</span>
              <Edit2 className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors opacity-70 group-hover:opacity-100" />
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-3"
          onClick={() => { window.location.href = "/api/auth/logout"; }}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Keluar Sistem
        </Button>
      </div>

      {/* Academic Year Dialog */}
      <AcademicYearDialog
        open={academicDialogOpen}
        onOpenChange={setAcademicDialogOpen}
        onSaved={(newConfig) => setAcademicConfig(newConfig)}
      />
    </aside>
  );
});

DashboardSidebar.displayName = "DashboardSidebar";
