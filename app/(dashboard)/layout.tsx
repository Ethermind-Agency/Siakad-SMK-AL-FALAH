"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { UserRole } from "@/lib/types/database";

function getRoleFromPathname(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin")) return "admin_tu";
  if (pathname.startsWith("/kepala-sekolah")) return "kepala_sekolah";
  if (pathname.startsWith("/guru")) return "guru";
  if (pathname.startsWith("/siswa")) return "siswa_ortu";
  return null;
}

function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case "admin_tu":
      return "/admin";
    case "kepala_sekolah":
      return "/kepala-sekolah";
    case "guru":
      return "/guru";
    case "siswa_ortu":
      return "/siswa";
    default:
      return "/admin";
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Initialize role deterministically based on pathname for SSR
  const [role, setRole] = useState<UserRole>(() => {
    return getRoleFromPathname(pathname) || "admin_tu";
  });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Sync role state when pathname or client cookie changes
  useEffect(() => {
    const pathRole = getRoleFromPathname(pathname);
    if (pathRole) {
      if (pathRole !== role) setRole(pathRole);
    } else {
      const cookieRole = getCookie("sims_role") as UserRole | null;
      if (
        cookieRole &&
        ["admin_tu", "kepala_sekolah", "guru", "siswa_ortu"].includes(cookieRole) &&
        cookieRole !== role
      ) {
        setRole(cookieRole);
      }
    }
  }, [pathname, role]);

  const handleRoleChange = useCallback((newRole: UserRole) => {
    setRole(newRole);

    // Update session cookies so middleware and API routes stay in sync
    if (typeof document !== "undefined") {
      document.cookie = `sims_role=${newRole}; path=/; max-age=2592000; SameSite=Lax`;
      const userData = {
        role: newRole,
        name:
          newRole === "admin_tu"
            ? "Ibrahim (Operator TU)"
            : newRole === "kepala_sekolah"
            ? "Dedi Irawan (Kepala Sekolah)"
            : newRole === "guru"
            ? "M. Syaifullah, S.Pd (Wali Kelas)"
            : "Rizki Ramadhan (XII TBSM)",
        email:
          newRole === "admin_tu"
            ? "tu@smk-alfalah.sch.id"
            : newRole === "kepala_sekolah"
            ? "kepsek@smk-alfalah.sch.id"
            : newRole === "guru"
            ? "guru@smk-alfalah.sch.id"
            : "siswa@smk-alfalah.sch.id",
      };
      document.cookie = `sims_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=2592000; SameSite=Lax`;

      window.dispatchEvent(
        new CustomEvent("sims:role-change", { detail: { role: newRole } })
      );
    }

    // Redirect to the newly selected role's home page
    const targetPath = getRoleHomePath(newRole);
    router.push(targetPath);
  }, [router]);


  const userName =
    role === "admin_tu"
      ? "Ibrahim (Operator TU)"
      : role === "kepala_sekolah"
      ? "Dedi Irawan (Kepala Sekolah)"
      : role === "guru"
      ? "M. Syaifullah, S.Pd (Wali Kelas)"
      : "Rizki Ramadhan (XII TBSM)";

  const userEmail =
    role === "admin_tu"
      ? "tu@smk-alfalah.sch.id"
      : role === "kepala_sekolah"
      ? "kepsek@smk-alfalah.sch.id"
      : role === "guru"
      ? "guru@smk-alfalah.sch.id"
      : "siswa@smk-alfalah.sch.id";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:shrink-0">
        <DashboardSidebar role={role} />
      </div>

      {/* Mobile Drawer Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <DashboardSidebar
            role={role}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          role={role}
          userName={userName}
          userEmail={userEmail}
          onRoleChange={handleRoleChange}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

