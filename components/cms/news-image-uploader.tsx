"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  ImagePlus,
  X,
  Sparkles,
  Check,
  Link as LinkIcon,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PRESET_NEWS_IMAGES } from "@/lib/data/news";

interface NewsImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export function NewsImageUploader({
  value,
  onChange,
  label = "Foto Sampul / Gambar Berita",
  helperText = "Format: PNG, JPG, WebP. Ukuran maks 5 MB.",
}: NewsImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFile = useCallback(
    (file: File) => {
      setErrorMessage("");
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Format file tidak didukung. Harap pilih gambar (PNG, JPG, WebP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran gambar melebihi batas maksimal 5 MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-foreground">{label}</Label>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowPresets(!showPresets);
              setShowUrlInput(false);
            }}
            className="h-6 text-[11px] px-2 text-primary font-medium hover:bg-primary/10"
          >
            <FolderOpen className="h-3 w-3 mr-1" />
            {showPresets ? "Tutup Galeri" : "Pilih dari Galeri Sekolah"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowUrlInput(!showUrlInput);
              setShowPresets(false);
            }}
            className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
          >
            <LinkIcon className="h-3 w-3 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {/* URL Input Form */}
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2 p-2.5 rounded-lg border border-border bg-muted/40">
          <Input
            placeholder="Tempel URL gambar (https://...)"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="text-xs h-8"
            autoFocus
          />
          <Button type="submit" size="sm" className="h-8 text-xs shrink-0">
            Terapkan
          </Button>
        </form>
      )}

      {/* Preset Gallery Selector Grid */}
      {showPresets && (
        <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-2">
          <p className="text-[11px] font-medium text-foreground">
            Klik salah satu foto dokumentasi sekolah berikut untuk dijadikan sampul:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRESET_NEWS_IMAGES.map((preset) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    onChange(preset.url);
                    setShowPresets(false);
                  }}
                  className={`group relative h-20 rounded-md overflow-hidden border text-left transition-all ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/40 shadow-sm"
                      : "border-border hover:border-primary/60 hover:shadow"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                    <span className="text-[10px] font-semibold text-white leading-tight line-clamp-1">
                      {preset.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {value ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border bg-muted shadow-inner group">
          <img
            src={value}
            alt="Sampul Berita"
            className="h-full w-full object-cover"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs bg-background/90 hover:bg-background text-foreground shadow"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Ganti Foto
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange("")}
              className="h-8 text-xs shadow"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Hapus
            </Button>
          </div>

          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-[10px] bg-background/80 backdrop-blur-sm border shadow-sm">
              Foto Siap
            </Badge>
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-destructive hover:text-white shadow-sm transition-colors md:hidden"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all ${
            dragOver
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border/80">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center px-4">
            <p className="text-xs font-semibold text-foreground">
              Unggah Foto Sampul Berita
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Klik untuk memilih berkas atau seret foto ke area ini
            </p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Error / Helper */}
      {errorMessage ? (
        <p className="text-[11px] font-medium text-destructive">{errorMessage}</p>
      ) : (
        <p className="text-[11px] text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
