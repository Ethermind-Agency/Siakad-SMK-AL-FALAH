"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  Sparkles,
  AlertCircle,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AcademicYearConfig,
  AVAILABLE_ACADEMIC_YEARS,
  getActiveAcademicYear,
  saveActiveAcademicYear,
} from "@/lib/data/academic";

interface AcademicYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (config: AcademicYearConfig) => void;
}

export function AcademicYearDialog({
  open,
  onOpenChange,
  onSaved,
}: AcademicYearDialogProps) {
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [semester, setSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [isCustom, setIsCustom] = useState(false);
  const [customYear, setCustomYear] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const current = getActiveAcademicYear();
      if (AVAILABLE_ACADEMIC_YEARS.includes(current.academic_year)) {
        setAcademicYear(current.academic_year);
        setIsCustom(false);
        setCustomYear("");
      } else {
        setIsCustom(true);
        setCustomYear(current.academic_year);
      }
      setSemester(current.semester);
      setError(null);
    }
  }, [open]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalYear = isCustom ? customYear.trim() : academicYear;

    // Validate format YYYY/YYYY
    const regex = /^\d{4}\/\d{4}$/;
    if (!regex.test(finalYear)) {
      setError("Format tahun ajaran harus YYYY/YYYY (contoh: 2026/2027)");
      return;
    }

    const [startYear, endYear] = finalYear.split("/").map(Number);
    if (endYear !== startYear + 1) {
      setError("Tahun akhir harus 1 tahun setelah tahun awal (contoh: 2026/2027)");
      return;
    }

    const newConfig: AcademicYearConfig = {
      academic_year: finalYear,
      semester,
      status: "Aktif",
    };

    saveActiveAcademicYear(newConfig);
    if (onSaved) onSaved(newConfig);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSave} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Atur Tahun Ajaran Aktif
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Kelola periode kalender pendidikan dan semester aktif SIMS
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-1 text-xs">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-[11px] font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Academic Year Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">
                  Tahun Ajaran <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustom(!isCustom);
                    setError(null);
                  }}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  {isCustom ? "Pilih dari daftar" : "+ Tambah Tahun Baru"}
                </button>
              </div>

              {isCustom ? (
                <div className="space-y-1">
                  <Input
                    placeholder="Contoh: 2027/2028"
                    value={customYear}
                    onChange={(e) => {
                      setCustomYear(e.target.value);
                      setError(null);
                    }}
                    className="font-mono text-xs"
                    autoFocus
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Format: 4 digit tahun awal / 4 digit tahun akhir (YYYY/YYYY)
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_ACADEMIC_YEARS.map((year) => {
                    const isSelected = academicYear === year;
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setAcademicYear(year);
                          setError(null);
                        }}
                        className={`py-2 px-3 rounded-md border text-xs font-mono font-medium transition-all text-center ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-sm"
                            : "border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Semester Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">
                Semester Aktif <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["Ganjil", "Genap"] as const).map((sem) => {
                  const isSelected = semester === sem;
                  return (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setSemester(sem)}
                      className={`py-2.5 px-3 rounded-md border text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>Semester {sem}</span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-3 rounded-md border border-border/80 bg-muted/40 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Dampak Perubahan:</p>
              <p>
                Tahun ajaran aktif akan dijadikan acuan utama pada kop surat e-office, rekapitulasi presensi harian guru & siswa, serta status rombongan belajar.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground text-xs"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
