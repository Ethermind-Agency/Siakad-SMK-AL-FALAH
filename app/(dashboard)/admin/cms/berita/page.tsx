"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import {
  Newspaper,
  PlusCircle,
  Search,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  FileText,
  ImagePlus,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  NewsItem,
  SAMPLE_NEWS_LIST,
  getStoredNews,
  updateNewsItem,
  deleteNewsItem,
} from "@/lib/data/news";
import { NewsImageUploader } from "@/components/cms/news-image-uploader";

// ── Edit News Dialog (Self-contained to eliminate render races) ────────────────
interface EditNewsDialogProps {
  article: NewsItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: NewsItem) => void;
}

const EditNewsDialog = memo(function EditNewsDialog({
  article,
  open,
  onOpenChange,
  onSave,
}: EditNewsDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kejuruan TBSM");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && article) {
      setTitle(article.title);
      setCategory(article.category);
      setAuthor(article.author);
      setPublishedAt(article.published_at);
      setImageUrl(article.image_url);
      setExcerpt(article.excerpt);
      setContent(article.content);
    }
  }, [open, article]);

  if (!article) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    const updated: NewsItem = {
      ...article,
      title: title.trim(),
      category: category.trim(),
      author: author.trim(),
      published_at: publishedAt,
      image_url: imageUrl || "/images/hero-school.jpg",
      excerpt: excerpt.trim(),
      content: content.trim(),
    };

    onSave(updated);
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={article.id} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Publikasi Berita</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Perbarui judul, foto sampul, kategori, atau isi artikel berita
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Judul Berita *</Label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Image Uploader */}
            <div className="p-3 rounded-lg border border-border/70 bg-muted/20">
              <NewsImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Foto Sampul Berita"
                helperText="Pilih dari galeri sekolah atau unggah gambar baru."
              />
            </div>

            {/* Category & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Kategori</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Kejuruan TBSM">Kejuruan TBSM</option>
                  <option value="Akademik">Akademik</option>
                  <option value="Inovasi SIMS">Inovasi SIMS</option>
                  <option value="Kegiatan Pesantren">Kegiatan Pesantren</option>
                  <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                  <option value="Kesiswaan">Kesiswaan</option>
                  <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Penulis</Label>
                <Input
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Ringkasan / Sinopsis Singkat</Label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Konten Lengkap *</Label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
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
              disabled={saving || !title.trim() || !content.trim()}
              className="bg-primary text-primary-foreground text-xs"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

// ── Delete Confirmation Dialog ────────────────────────────────────────────────
interface DeleteNewsDialogProps {
  article: NewsItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

function DeleteNewsDialog({
  article,
  open,
  onOpenChange,
  onConfirm,
}: DeleteNewsDialogProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive font-semibold">
            <AlertTriangle className="h-5 w-5" />
            Konfirmasi Hapus Berita
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-2">
            Apakah Anda yakin ingin menghapus artikel{" "}
            <span className="font-semibold text-foreground">"{article.title}"</span>?
            Artikel ini akan dihapus dari portal publik SMKS AL-FALAH.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-4">
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
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="text-xs"
          >
            Hapus Artikel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function AdminBeritaPage() {
  const [articles, setArticles] = useState<NewsItem[]>(SAMPLE_NEWS_LIST);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setArticles(getStoredNews());
  }, []);

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("sims-news-updated", handleUpdate);
    return () => window.removeEventListener("sims-news-updated", handleUpdate);
  }, [loadData]);

  const handleEditClick = (article: NewsItem) => {
    setSelectedArticle(article);
    setEditOpen(true);
  };

  const handleDeleteClick = (article: NewsItem) => {
    setSelectedArticle(article);
    setDeleteOpen(true);
  };

  const handleSaveEdit = (updated: NewsItem) => {
    updateNewsItem(updated.id, updated);
    loadData();
    setNotification(`Artikel "${updated.title}" berhasil diperbarui.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConfirmDelete = () => {
    if (!selectedArticle) return;
    deleteNewsItem(selectedArticle.id);
    loadData();
    setNotification(`Artikel "${selectedArticle.title}" telah dihapus.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Manajemen Berita
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Publikasi artikel warta dan pengumuman sekolah
          </p>
        </div>

        <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs h-8">
          <Link href="/admin/cms/berita/baru">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
            Tulis Berita
          </Link>
        </Button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {notification}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Artikel"
          value={articles.length}
          icon={Newspaper}
        />
        <StatCard
          title="Kategori Utama"
          value="Kejuruan TBSM"
          icon={FileText}
        />
        <StatCard
          title="Total Pembaca"
          value="1.2k+"
          icon={Eye}
        />
      </div>

      {/* Search Bar */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul artikel berita, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Daftar Publikasi Berita</CardTitle>
          <CardDescription className="text-xs">
            Menampilkan {filteredArticles.length} artikel terbit
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {filteredArticles.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Artikel Tidak Ditemukan"
                description="Tidak ada artikel yang cocok dengan pencarian."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs font-semibold w-16">Foto</TableHead>
                    <TableHead className="text-xs font-semibold">Judul Artikel & Slug</TableHead>
                    <TableHead className="text-xs font-semibold">Kategori</TableHead>
                    <TableHead className="text-xs font-semibold">Penulis</TableHead>
                    <TableHead className="text-xs font-semibold">Tanggal Terbit</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-muted/40 transition-colors">
                      {/* Thumbnail Image */}
                      <TableCell className="py-2.5">
                        <div className="h-11 w-16 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                          {article.image_url ? (
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImagePlus className="h-4 w-4 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Title & Slug */}
                      <TableCell className="text-xs max-w-sm py-2.5">
                        <p className="font-semibold text-foreground line-clamp-1">{article.title}</p>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          /berita/{article.slug}
                        </p>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-xs py-2.5">
                        <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
                          {article.category}
                        </Badge>
                      </TableCell>

                      {/* Author */}
                      <TableCell className="text-xs text-foreground font-medium py-2.5 whitespace-nowrap">
                        {article.author}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-2.5">
                        {article.published_at}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-2.5">
                        <Badge variant="success" className="text-[10px]">
                          Tayang
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            title="Buka Halaman Web Publik"
                          >
                            <Link href={`/berita/${article.slug}`} target="_blank">
                              <ExternalLink className="h-3.5 w-3.5 mr-1 text-primary" />
                              Web
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(article)}
                            className="h-7 px-2 text-xs text-foreground hover:bg-muted"
                            title="Edit Artikel & Foto"
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(article)}
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditNewsDialog
        article={selectedArticle}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSaveEdit}
      />

      {/* Delete Dialog */}
      <DeleteNewsDialog
        article={selectedArticle}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
