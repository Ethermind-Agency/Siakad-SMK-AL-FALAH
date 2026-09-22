"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  ImagePlus,
  X,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/dashboard/stat-card";
import type { FacilityCondition } from "@/lib/types/database";

// ── Types ──────────────────────────────────────────────────────────────────────
interface FacilityItem {
  id: string;
  name: string;
  condition: FacilityCondition;
  description: string;
  /** Supports both URL strings and base64 data URLs from local file picks */
  image_url: string;
}

// ── Initial Demo Data ──────────────────────────────────────────────────────────
const INITIAL_FACILITIES: FacilityItem[] = [
  {
    id: "f-1",
    name: "Bengkel Praktik TBSM",
    condition: "baik",
    description:
      "Dilengkapi toolkit servis otomotif, bike lift, kompresor, dan unit motor praktik kejuruan.",
    image_url: "/images/facility-bengkel.jpg",
  },
  {
    id: "f-2",
    name: "Ruang Kelas Teori (3 Ruang)",
    condition: "rusak_sedang",
    description:
      "3 ruang kelas aktif untuk proses belajar mengajar teori umum dan kejuruan siswa kelas X s.d XII.",
    image_url: "/images/facility-kelas.jpg",
  },
  {
    id: "f-3",
    name: "Ruang Perpustakaan",
    condition: "baik",
    description:
      "Koleksi buku teks kejuruan otomotif, modul pelajaran, dan buku referensi keagamaan santri.",
    image_url: "/images/facility-perpus.jpg",
  },
  {
    id: "f-4",
    name: "Masjid Yayasan Ponpes Al-Falah",
    condition: "baik",
    description:
      "Pusat kegiatan ibadah harian, sholat dhuhur berjamaah, dan pembinaan karakter santri & siswa.",
    image_url: "/images/facility-masjid.jpg",
  },
  {
    id: "f-5",
    name: "Ruang Tata Usaha & SIMS Server",
    condition: "baik",
    description:
      "Pusat pelayanan administrasi persuratan, pengarsipan e-office, dan pengelolaan pangkalan data.",
    image_url: "/images/gallery-mechanic.jpg",
  },
  {
    id: "f-6",
    name: "Lapangan Upacara & Olahraga Voli",
    condition: "baik",
    description:
      "Area multifungsi untuk upacara bendera hari Senin, senam kesegaran jasmani, dan latihan voli siswa.",
    image_url: "/images/gallery-voli.jpg",
  },
];

// ── Condition Config ───────────────────────────────────────────────────────────
const CONDITION_CONFIG: Record<
  FacilityCondition,
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  baik: { label: "Kondisi Baik", variant: "success" },
  rusak_ringan: { label: "Rusak Ringan", variant: "warning" },
  rusak_sedang: { label: "Rusak Sedang", variant: "warning" },
  rusak_berat: { label: "Rusak Berat", variant: "destructive" },
};

// ── Image placeholder when src is missing / broken ────────────────────────────
function FacilityImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-muted gap-2">
        <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
        <span className="text-[11px] text-muted-foreground/60">Belum ada foto</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setBroken(true)}
    />
  );
}

// ── Edit Dialog (self-contained to avoid state race) ──────────────────────────
interface EditDialogProps {
  facility: FacilityItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Pick<FacilityItem, "id" | "condition" | "description" | "image_url">) => void;
}

function EditFacilityDialog({ facility, open, onOpenChange, onSave }: EditDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state — only initialized from facility when dialog opens
  const [condition, setCondition] = useState<FacilityCondition>("baik");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageChanged, setImageChanged] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Sync local state whenever the dialog opens with a new facility
  // Using key on DialogContent (below) is actually the cleanest approach,
  // but we also handle it here for clarity
  React.useEffect(() => {
    if (open && facility) {
      setCondition(facility.condition);
      setDescription(facility.description);
      setImagePreview(facility.image_url);
      setImageChanged(false);
    }
  }, [open, facility]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setImageChanged(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSave = () => {
    if (!facility) return;
    onSave({
      id: facility.id,
      condition,
      description,
      image_url: imagePreview,
    });
  };

  if (!facility) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* key={facility.id} forces a full remount when facility changes, preventing stale state */}
      <DialogContent key={facility.id} className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold leading-tight">
            Update Fasilitas
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {facility.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* ── Image Upload Zone ─────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Foto Fasilitas</Label>

            {/* Preview */}
            {imagePreview && (
              <div className="relative h-40 w-full overflow-hidden rounded-md border border-border bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={() => setImagePreview("")}
                />
                <button
                  type="button"
                  onClick={() => { setImagePreview(""); setImageChanged(true); }}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 hover:bg-destructive hover:text-white transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {imageChanged && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-[10px]">Foto baru dipilih</Badge>
                  </div>
                )}
              </div>
            )}

            {/* Drop zone (shown when no preview) */}
            {!imagePreview && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/60"
                }`}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">Klik atau seret gambar ke sini</p>
                  <p className="text-[11px] text-muted-foreground">PNG, JPG, WebP · Maks. 5 MB</p>
                </div>
              </div>
            )}

            {/* Change button when preview exists */}
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-8 w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Ganti Foto
              </Button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>

          {/* ── Condition Select ────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-condition" className="text-xs font-semibold">
              Status Kondisi
            </Label>
            <select
              id="edit-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as FacilityCondition)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="baik">✅ Kondisi Baik</option>
              <option value="rusak_ringan">⚠️ Rusak Ringan</option>
              <option value="rusak_sedang">🟡 Rusak Sedang</option>
              <option value="rusak_berat">🔴 Rusak Berat</option>
            </select>
          </div>

          {/* ── Description ────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc" className="text-xs font-semibold">
              Deskripsi & Keterangan
            </Label>
            <textarea
              id="edit-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan keterangan kondisi atau catatan pemeliharaan..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground">
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminFasilitasPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>(INITIAL_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleOpenEdit = useCallback((f: FacilityItem) => {
    setSelectedFacility(f);
    setEditOpen(true);
  }, []);

  const handleSaveEdit = useCallback(
    (updated: Pick<FacilityItem, "id" | "condition" | "description" | "image_url">) => {
      setFacilities((prev) =>
        prev.map((f) =>
          f.id === updated.id
            ? { ...f, condition: updated.condition, description: updated.description, image_url: updated.image_url }
            : f
        )
      );
      setEditOpen(false);
    },
    []
  );

  const countBaik = facilities.filter((f) => f.condition === "baik").length;
  const countPerluPerbaikan = facilities.filter((f) => f.condition !== "baik").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Fasilitas Sekolah</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Inventaris sarana dan pemantauan kelayakan kondisi fisik
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Kondisi Baik" value={countBaik} icon={CheckCircle2} />
        <StatCard
          title="Perlu Pemeliharaan"
          value={countPerluPerbaikan}
          badgeText={countPerluPerbaikan > 0 ? "Perlu Renovasi" : undefined}
          badgeVariant="warning"
          icon={AlertTriangle}
        />
        <StatCard title="Total Sarpras" value={facilities.length} icon={Building2} />
      </div>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac) => {
          const cond = CONDITION_CONFIG[fac.condition] ?? { label: fac.condition, variant: "secondary" as const };

          return (
            <Card
              key={fac.id}
              className="border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Facility Image */}
                <div className="h-44 overflow-hidden border-b border-border bg-muted relative">
                  <FacilityImage src={fac.image_url} alt={fac.name} />
                  <div className="absolute top-3 right-3">
                    <Badge variant={cond.variant} className="text-[10px] shadow-md">
                      {cond.label}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 pb-2">
                  <h3 className="text-sm font-bold text-foreground leading-tight">{fac.name}</h3>
                </div>
                <div className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">
                  {fac.description || <span className="italic">Belum ada deskripsi.</span>}
                </div>
              </div>

              <CardFooter className="border-t border-border p-3.5 bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleOpenEdit(fac)}
                >
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                  Update Kondisi & Foto
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog — rendered once, driven by selectedFacility state */}
      <EditFacilityDialog
        facility={selectedFacility}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
