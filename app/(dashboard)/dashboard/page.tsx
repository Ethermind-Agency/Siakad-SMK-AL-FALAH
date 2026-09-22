"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/lib/types/database";

// ── Dashboard panel skeleton shared between all roles ─────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      {/* Main content blocks */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-64 col-span-2 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}

// ── Lazy-loaded role dashboards — each is a separate JS chunk ─────────────
// Only the chunk for the active role is downloaded; the rest are never fetched.
const AdminDashboard = dynamic(
  () => import("@/components/dashboard/roles/admin-dashboard").then((m) => m.AdminDashboard),
  { loading: () => <DashboardSkeleton />, ssr: false }
);

const KepalaSekolahDashboard = dynamic(
  () => import("@/components/dashboard/roles/kepala-sekolah-dashboard").then((m) => m.KepalaSekolahDashboard),
  { loading: () => <DashboardSkeleton />, ssr: false }
);

const GuruDashboard = dynamic(
  () => import("@/components/dashboard/roles/guru-dashboard").then((m) => m.GuruDashboard),
  { loading: () => <DashboardSkeleton />, ssr: false }
);

const SiswaDashboard = dynamic(
  () => import("@/components/dashboard/roles/siswa-dashboard").then((m) => m.SiswaDashboard),
  { loading: () => <DashboardSkeleton />, ssr: false }
);

// ── Cookie helper ─────────────────────────────────────────────────────────
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const VALID_ROLES: UserRole[] = ["admin_tu", "kepala_sekolah", "guru", "siswa_ortu"];

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin_tu");

  useEffect(() => {
    const cookieRole = getCookie("sims_role") as UserRole | null;
    if (cookieRole && VALID_ROLES.includes(cookieRole)) {
      setCurrentRole(cookieRole);
    }

    const handleRoleChange = (e: CustomEvent<{ role: UserRole }>) => {
      if (e.detail?.role && VALID_ROLES.includes(e.detail.role)) {
        setCurrentRole(e.detail.role);
      }
    };

    window.addEventListener("sims:role-change", handleRoleChange as EventListener);
    return () => window.removeEventListener("sims:role-change", handleRoleChange as EventListener);
  }, []);

  switch (currentRole) {
    case "admin_tu":       return <AdminDashboard />;
    case "kepala_sekolah": return <KepalaSekolahDashboard />;
    case "guru":           return <GuruDashboard />;
    case "siswa_ortu":     return <SiswaDashboard />;
    default:               return <AdminDashboard />;
  }
}


