"use client";

import React, { memo } from "react";
import {
  Menu,
  ShieldCheck,
  User,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/lib/types/database";

interface HeaderProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
  onRoleChange?: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; badgeVariant: "default" | "secondary" | "success" | "warning" }> = {
  admin_tu: { label: "Admin TU", badgeVariant: "default" },
  kepala_sekolah: { label: "Kepala Sekolah", badgeVariant: "warning" },
  guru: { label: "Guru / Wali Kelas", badgeVariant: "success" },
  siswa_ortu: { label: "Siswa / Wali Murid", badgeVariant: "secondary" },
};

export const DashboardHeader = memo(function DashboardHeader({
  role,
  userName = "Pengguna Sistem",
  userEmail = "user@smk-alfalah.sch.id",
  onRoleChange,
  onOpenMobileMenu,
}: HeaderProps) {
  const roleInfo = ROLE_LABELS[role] || ROLE_LABELS.admin_tu;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8 xl:px-10 pr-6 sm:pr-8 lg:pr-10 shadow-none">
      {/* Left: Mobile Toggle & System Name */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={onOpenMobileMenu}
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            SIMS SMKS AL-FALAH
          </span>
        </div>
      </div>

      {/* Right: Simulation Switcher & User Profile (With Safe Margin) */}
      <div className="flex items-center gap-3">
        {/* Role Switcher for Demo / Testing */}
        {onRoleChange && (
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <span className="text-[11px] text-muted-foreground">Simulasi Peran:</span>
            <Select value={role} onValueChange={(val) => onRoleChange(val as UserRole)}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin_tu">Admin TU (Ibrahim)</SelectItem>
                <SelectItem value="kepala_sekolah">Kepala Sekolah (Dedi)</SelectItem>
                <SelectItem value="guru">Guru (M. Syaifullah)</SelectItem>
                <SelectItem value="siswa_ortu">Siswa (Rizki)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2.5 h-9 px-2 hover:bg-secondary/60">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold leading-none text-foreground">{userName}</p>
                <p className="text-[10px] text-muted-foreground leading-none mt-1">{roleInfo.label}</p>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold leading-none text-foreground">{userName}</p>
                <p className="text-[11px] leading-none text-muted-foreground">{userEmail}</p>
                <div className="pt-1.5">
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {roleInfo.label}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs cursor-pointer"
              onClick={() => {
                alert("Pengaturan profil & akun");
              }}
            >
              <User className="mr-2 h-3.5 w-3.5" />
              Pengaturan Akun
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs text-destructive cursor-pointer focus:bg-destructive/10"
              onClick={() => {
                window.location.href = "/api/auth/logout";
              }}
            >
              Keluar Sistem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

DashboardHeader.displayName = "DashboardHeader";
