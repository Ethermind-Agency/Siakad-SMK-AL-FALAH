"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogIn,
  Lock,
  AlertCircle,
  IdCard,
  Hash,
  Mail,
  Calendar,
  KeyRound,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { UserRole } from "@/lib/types/database";
import { getLoginSchemaForRole } from "@/lib/validators/auth";

// ─── Role-specific credential configuration ───────────────────────────────────
interface RoleConfig {
  label: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  identifierType: "email" | "text";
  identifierIcon: React.ReactNode;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordHint: string;
  demoIdentifier: string;
  demoPassword: string;
  demoName: string;
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin_tu: {
    label: "Admin / Operator TU",
    identifierLabel: "Email Akun",
    identifierPlaceholder: "tu@smk-alfalah.sch.id",
    identifierType: "email",
    identifierIcon: <Mail className="h-4 w-4 text-muted-foreground" />,
    passwordLabel: "Kata Sandi",
    passwordPlaceholder: "••••••••",
    passwordHint: "Kata sandi akun sistem.",
    demoIdentifier: "tu@smk-alfalah.sch.id",
    demoPassword: "password123",
    demoName: "Ibrahim (Operator TU)",
  },
  kepala_sekolah: {
    label: "Kepala Sekolah",
    identifierLabel: "Nomor Induk Pegawai (NIP)",
    identifierPlaceholder: "Contoh: 197509152005011002",
    identifierType: "text",
    identifierIcon: <IdCard className="h-4 w-4 text-muted-foreground" />,
    passwordLabel: "Kata Sandi (Tanggal Lahir)",
    passwordPlaceholder: "YYYYMMDD — misal 19750915",
    passwordHint: "Format: TAHUNBULANHARI tanpa spasi (contoh: 19750915).",
    demoIdentifier: "197509152005011002",
    demoPassword: "19750915",
    demoName: "Dedi Irawan, S.Pd",
  },
  guru: {
    label: "Guru / Wali Kelas",
    identifierLabel: "Nomor Induk Pegawai (NIP)",
    identifierPlaceholder: "Contoh: 198509232010011003",
    identifierType: "text",
    identifierIcon: <IdCard className="h-4 w-4 text-muted-foreground" />,
    passwordLabel: "Kata Sandi (Tanggal Lahir)",
    passwordPlaceholder: "YYYYMMDD — misal 19850923",
    passwordHint: "Format: TAHUNBULANHARI tanpa spasi (contoh: 19850923).",
    demoIdentifier: "198509232010011003",
    demoPassword: "19850923",
    demoName: "M. Syaifullah, S.Pd",
  },
  siswa_ortu: {
    label: "Siswa / Orang Tua",
    identifierLabel: "Nomor Induk Siswa Nasional (NISN)",
    identifierPlaceholder: "Contoh: 0089876543",
    identifierType: "text",
    identifierIcon: <Hash className="h-4 w-4 text-muted-foreground" />,
    passwordLabel: "Kata Sandi (Tanggal Lahir)",
    passwordPlaceholder: "YYYYMMDD — misal 20080512",
    passwordHint: "Format: TAHUNBULANHARI tanpa spasi (contoh: 20080512).",
    demoIdentifier: "0089876543",
    demoPassword: "20080512",
    demoName: "Rizki Ramadhan (XII TBSM)",
  },
};

const ROLE_ORDER: UserRole[] = ["admin_tu", "kepala_sekolah", "guru", "siswa_ortu"];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin_tu");
  const [identifier, setIdentifier] = useState("tu@smk-alfalah.sch.id");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Field-level validation errors for instant inline feedback
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const config = ROLE_CONFIGS[selectedRole];

  const handleRoleSelect = (role: UserRole) => {
    const cfg = ROLE_CONFIGS[role];
    setSelectedRole(role);
    setIdentifier(cfg.demoIdentifier);
    setPassword(cfg.demoPassword);
    setErrorMessage(null);
    setIdentifierError(null);
    setPasswordError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIdentifierError(null);
    setPasswordError(null);

    // ── Client-side validation before touching the server ──────────────────
    const schema = getLoginSchemaForRole(selectedRole);
    const result = schema.safeParse({ identifier: identifier.trim(), password });
    if (!result.success) {
      // Map Zod errors to field-level state
      let hasIdentifierErr = false;
      let hasPasswordErr = false;
      for (const err of result.error.errors) {
        if (err.path[0] === 'identifier' && !hasIdentifierErr) {
          setIdentifierError(err.message);
          hasIdentifierErr = true;
        } else if (err.path[0] === 'password' && !hasPasswordErr) {
          setPasswordError(err.message);
          hasPasswordErr = true;
        }
      }
      // If error has no path (e.g. refine at root), show as general
      if (!hasIdentifierErr && !hasPasswordErr) {
        setErrorMessage(result.error.errors[0]?.message ?? 'Input tidak valid.');
      }
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const json = await res.json();

      if (!res.ok || json.status === "error") {
        throw new Error(json.message || "Gagal masuk ke sistem.");
      }

      // Redirect to role-specific home path returned by API, or fallback
      const redirectTo = json.data?.redirectTo || searchParams.get("redirect") || "/dashboard";
      window.location.href = redirectTo;
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal melakukan autentikasi. Silakan periksa kredensial Anda.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
          AF
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          SIMS SMKS AL-FALAH
        </h2>
        <p className="text-xs text-muted-foreground">
          Portal Sistem Informasi Manajemen Sekolah • NPSN 69984368
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="space-y-1 pb-3">
          <CardTitle className="text-base font-semibold text-foreground">
            Masuk ke Portal SIMS
          </CardTitle>
          <CardDescription className="text-xs">
            Pilih jenis akun Anda, lalu masukkan identitas dan kata sandi.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Role Selector Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Jenis Akun:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ROLE_ORDER.map((role) => {
                  const cfg = ROLE_CONFIGS[role];
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`text-left rounded-md border p-2.5 text-xs transition-colors ${
                        selectedRole === role
                          ? "border-primary bg-primary/5 text-primary font-semibold"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <p className="leading-tight font-medium text-foreground">{cfg.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {cfg.demoName}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Identifier Field — adapts per role */}
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-xs">
                {config.identifierLabel}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">
                  {config.identifierIcon}
                </span>
                <Input
                  id="identifier"
                  type={config.identifierType}
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setIdentifierError(null); }}
                  placeholder={config.identifierPlaceholder}
                  className={`pl-9 text-xs h-9 font-mono ${identifierError ? 'border-destructive ring-1 ring-destructive' : ''}`}
                />
              </div>
              {identifierError && (
                <p className="flex items-start gap-1 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  {identifierError}
                </p>
              )}
            </div>

            {/* Password Field — adapts per role */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">
                {config.passwordLabel}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
                  placeholder={config.passwordPlaceholder}
                  className={`pl-9 pr-10 text-xs h-9 font-mono ${passwordError ? 'border-destructive ring-1 ring-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  title={showPassword ? "Sembunyikan kata sandi" : "Lihat isi kata sandi"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-primary" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Field-level password validation error */}
              {passwordError && (
                <p className="flex items-start gap-1 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  {passwordError}
                </p>
              )}
              {/* Contextual password hint — only show when no error */}
              {!passwordError && selectedRole !== "admin_tu" && (
                <p className="flex items-start gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3 mt-0.5 shrink-0" />
                  {config.passwordHint}
                </p>
              )}
            </div>

            {/* Credential Reference — shown collapsed in a subtle info box */}
            <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-[11px] space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3 w-3 text-primary" />
                Referensi Akun Demo Aktif:
              </p>
              <div className="grid grid-cols-1 gap-1 text-muted-foreground">
                <span className="flex items-center justify-between">
                  <span>Admin TU</span>
                  <span className="font-mono text-foreground">tu@smk-alfalah.sch.id · password123</span>
                </span>
                <span className="flex items-center justify-between">
                  <span>Kepala Sekolah</span>
                  <span className="font-mono text-foreground">197509152005011002 · 19750915</span>
                </span>
                <span className="flex items-center justify-between">
                  <span>Guru / Wali Kelas</span>
                  <span className="font-mono text-foreground">198509232010011003 · 19850923</span>
                </span>
                <span className="flex items-center justify-between">
                  <span>Siswa (Rizki)</span>
                  <span className="font-mono text-foreground">0089876543 · 20080512</span>
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground text-xs h-9 shadow-sm"
            >
              {loading ? (
                "Memproses..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Masuk ke Portal SIMS
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>SMKS AL-FALAH • Telok Pakedai, Kab. Kubu Raya</p>
        <p className="text-[11px]">
          Lupa kata sandi atau kendala akses? Hubungi Operator Tata Usaha Sekolah.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-foreground">
          Memuat portal login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

