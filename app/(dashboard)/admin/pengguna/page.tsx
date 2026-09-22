"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  PlusCircle,
  Search,
  Shield,
  ShieldCheck,
  User,
  GraduationCap,
  KeyRound,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import type { UserRole } from "@/lib/types/database";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identifier: string; // NIP or NISN
  last_login: string;
  status: "active" | "inactive";
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: "u-1",
    name: "Ibrahim",
    email: "tu@smk-alfalah.sch.id",
    role: "admin_tu",
    identifier: "NIP: 19890412 201802 1 003",
    last_login: "Hari ini, 12:45",
    status: "active",
  },
  {
    id: "u-2",
    name: "Dedi Irawan",
    email: "kepsek@smk-alfalah.sch.id",
    role: "kepala_sekolah",
    identifier: "NIP: 19780615 200501 1 001",
    last_login: "Kemarin, 16:30",
    status: "active",
  },
  {
    id: "u-3",
    name: "M. Syaifullah, S.Pd",
    email: "guru@smk-alfalah.sch.id",
    role: "guru",
    identifier: "NIP: 19880512 201503 1 004",
    last_login: "Hari ini, 07:15",
    status: "active",
  },
  {
    id: "u-4",
    name: "Siti Rohmah, S.Pd",
    email: "siti.rohmah@smk-alfalah.sch.id",
    role: "guru",
    identifier: "NIP: 19920315 201903 2 008",
    last_login: "21 Sep 2026",
    status: "active",
  },
  {
    id: "u-5",
    name: "Ahmad Fauzi (Wali Murid)",
    email: "siswa@smk-alfalah.sch.id",
    role: "siswa_ortu",
    identifier: "NISN: 0071234501",
    last_login: "Hari ini, 09:20",
    status: "active",
  },
];

const ROLE_BADGE_MAP: Record<UserRole, { label: string; variant: "default" | "secondary" | "outline" | "success" }> = {
  admin_tu: { label: "Admin TU / Operator", variant: "default" },
  kepala_sekolah: { label: "Kepala Sekolah", variant: "success" },
  guru: { label: "Guru / Wali Kelas", variant: "secondary" },
  siswa_ortu: { label: "Siswa / Orang Tua", variant: "outline" },
};

export default function ManajemenPenggunaPage() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "guru" as UserRole,
    identifier: "",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      identifier: formData.identifier || "-",
      last_login: "Belum pernah",
      status: "active",
    };

    setUsers([...users, newUser]);
    setCreateOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "guru",
      identifier: "",
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.identifier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Pengguna & Hak Akses
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Akun autentikasi dan peran akses pengguna SIMS
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="bg-primary text-primary-foreground text-xs h-8"
        >
          <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard
          title="Total Akun"
          value={users.length}
          icon={Users}
        />
        <StatCard
          title="Admin TU"
          value="1"
          icon={ShieldCheck}
        />
        <StatCard
          title="Dewan Guru"
          value="18"
          icon={User}
        />
        <StatCard
          title="Siswa & Ortu"
          value="104"
          icon={GraduationCap}
        />
      </div>

      {/* Search & Role Filter */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, NIP, atau NISN pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={roleFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("all")}
                className="text-xs"
              >
                Semua ({users.length})
              </Button>
              <Button
                variant={roleFilter === "admin_tu" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("admin_tu")}
                className="text-xs"
              >
                Admin TU
              </Button>
              <Button
                variant={roleFilter === "kepala_sekolah" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("kepala_sekolah")}
                className="text-xs"
              >
                Kepsek
              </Button>
              <Button
                variant={roleFilter === "guru" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("guru")}
                className="text-xs"
              >
                Guru
              </Button>
              <Button
                variant={roleFilter === "siswa_ortu" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("siswa_ortu")}
                className="text-xs"
              >
                Siswa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Akun Pengguna SIMS</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredUsers.length} pengguna terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Pengguna Tidak Ditemukan"
                description="Tidak ada akun yang sesuai dengan pencarian."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Nama & Email</TableHead>
                    <TableHead className="text-xs font-semibold">Peran / Hak Akses (Role)</TableHead>
                    <TableHead className="text-xs font-semibold">Identitas (NIP/NISN)</TableHead>
                    <TableHead className="text-xs font-semibold">Terakhir Masuk</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleInfo = ROLE_BADGE_MAP[user.role] || {
                      label: user.role,
                      variant: "outline",
                    };

                    return (
                      <TableRow key={user.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="text-xs">
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{user.email}</p>
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant={roleInfo.variant} className="text-[10px]">
                            {roleInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {user.identifier}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {user.last_login}
                        </TableCell>
                        <TableCell>
                          <Badge variant="success" className="text-[10px]">
                            Aktif
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Reset Password">
                              <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Edit Akun">
                              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Buat Akun Pengguna Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Daftarkan email dan tentukan peran akses pengguna ke portal SIMS
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs py-2">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Nama Lengkap Pengguna *</label>
              <Input
                required
                placeholder="Contoh: Bpk. Hendrawan, S.Kom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Alamat Email *</label>
              <Input
                type="email"
                required
                placeholder="Contoh: hendrawan@smk-alfalah.sch.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Peran / Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="guru">Guru / Wali Kelas</option>
                  <option value="admin_tu">Admin TU / Operator</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                  <option value="siswa_ortu">Siswa / Orang Tua</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">NIP / NISN</label>
                <Input
                  placeholder="Contoh: 19900101..."
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Password Awal *</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  title={showPassword ? "Sembunyikan password" : "Lihat isi password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-primary" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Buat Akun
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
