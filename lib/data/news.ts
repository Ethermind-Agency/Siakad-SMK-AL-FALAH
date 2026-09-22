export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  published_at: string;
  author: string;
  excerpt: string;
  image_url: string;
  content: string;
}

export const PRESET_NEWS_IMAGES = [
  {
    label: "Bengkel Praktik TBSM",
    url: "/images/facility-bengkel.jpg",
    category: "Kejuruan TBSM",
  },
  {
    label: "Perakitan & Servis Motor",
    url: "/images/gallery-mechanic.jpg",
    category: "Kejuruan TBSM",
  },
  {
    label: "Ruang Kelas Teori",
    url: "/images/facility-kelas.jpg",
    category: "Akademik",
  },
  {
    label: "Lab Komputer & SIMS",
    url: "/images/news-computer.jpg",
    category: "Inovasi SIMS",
  },
  {
    label: "Perpustakaan Sekolah",
    url: "/images/facility-perpus.jpg",
    category: "Akademik",
  },
  {
    label: "Masjid Pondok Pesantren",
    url: "/images/facility-masjid.jpg",
    category: "Kegiatan Pesantren",
  },
  {
    label: "Lapangan Upacara Bendera",
    url: "/images/gallery-upacara.jpg",
    category: "Kegiatan Sekolah",
  },
  {
    label: "Olahraga & Ekstrakurikuler",
    url: "/images/gallery-voli.jpg",
    category: "Kesiswaan",
  },
  {
    label: "Gedung Utama SMKS AL-FALAH",
    url: "/images/hero-school.jpg",
    category: "Umum",
  },
];

export const SAMPLE_NEWS_LIST: NewsItem[] = [
  {
    id: "news-1",
    slug: "persiapan-kunjungan-industri-astra-motor",
    title: "Persiapan Kunjungan Industri Siswa TBSM ke Mitra Bengkel Resmi Astra Motor",
    category: "Kejuruan TBSM",
    published_at: "21 September 2026",
    author: "Ibrahim (Operator)",
    image_url: "/images/gallery-mechanic.jpg",
    excerpt:
      "SMKS AL-FALAH menjalin koordinasi awal untuk program pengenalan standar bengkel resmi dan teknologi injeksi roda dua bagi siswa kelas XI dan XII.",
    content: `Dalam rangka meningkatkan kompetensi vokasi dan memperluas wawasan dunia kerja bagi para siswa, SMKS AL-FALAH melakukan penjajakan kemitraan dan persiapan kunjungan industri ke jaringan bengkel resmi sepeda motor Astra Motor di Kalimantan Barat.

Program ini ditujukan khusus bagi siswa program keahlian Teknik dan Bisnis Sepeda Motor (TBSM) tingkat XI dan XII. Kepala Sekolah SMKS AL-FALAH, Bpk. Dedi Irawan, menegaskan bahwa kemitraan dengan dunia usaha dan industri (DUDI) merupakan kunci utama agar lulusan SMK memiliki daya saing nyata dan siap diserap oleh pasar kerja.

Kegiatan kunjungan industri dijadwalkan berlangsung pada awal bulan depan dengan agenda pelatihan singkat seputar penanganan kendala sistem injeksi elektronik (PGM-FI), standar keselamatan kerja bengkel (K3), serta manajemen pelayanan konsumen.`,
  },
  {
    id: "news-2",
    slug: "jadwal-pts-ganjil-2026-2027",
    title: "Jadwal Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil Tahun Ajaran 2026/2027",
    category: "Akademik",
    published_at: "15 September 2026",
    author: "Tim Kurikulum",
    image_url: "/images/facility-kelas.jpg",
    excerpt:
      "Pemberitahuan resmi kepada seluruh orang tua dan siswa terkait agenda pelaksanaan evaluasi tengah semester untuk kelas X, XI, dan XII TBSM.",
    content: `Diberitahukan kepada seluruh siswa dan wali murid SMKS AL-FALAH bahwa Penilaian Tengah Semester (PTS) Ganjil Tahun Ajaran 2026/2027 akan diselenggarakan mulai hari Senin, 28 September 2026 hingga Sabtu, 3 Oktober 2026.

Materi ujian mencakup seluruh kompetensi dasar mata pelajaran umum dan kejuruan yang telah dipelajari selama paruh pertama semester ganjil. Seluruh siswa diwajibkan hadir tepat waktu sesuai jadwal sesi belajar siang sekolah.

Bagi wali murid yang ingin memantau rekap kehadiran dan kedisiplinan belajar siswa menjelang ujian, silakan memanfaatkan portal SIMS SMKS AL-FALAH yang dapat diakses secara mandiri.`,
  },
  {
    id: "news-3",
    slug: "penerapan-sims-digital-alfalah",
    title: "Penerapan Sistem Informasi Manajemen Sekolah (SIMS) Berbasis Digital",
    category: "Inovasi SIMS",
    published_at: "10 September 2026",
    author: "Admin SIMS",
    image_url: "/images/news-computer.jpg",
    excerpt:
      "Digitalisasi tata kelola persuratan dinas dan transparansi kehadiran siswa kini dapat diakses secara real-time oleh para orang tua siswa.",
    content: `SMKS AL-FALAH secara resmi meluncurkan Sistem Informasi Manajemen Sekolah (SIMS) v2.0 sebagai wujud komitmen modernisasi layanan pendidikan dan transparansi kelembagaan.

Sistem ini mengintegrasikan tiga pilar utama:
1. Digitalisasi Administrasi Surat Menyurat (E-Office Paperless): Pengelolaan surat masuk dan pembuatan surat keluar ber-kop resmi dengan nomor otomatis.
2. Presensi Harian Siswa: Guru dan wali kelas mencatat absensi harian langsung dari kelas, yang secara otomatis terekap dan dapat dilihat oleh orang tua siswa.
3. Portal Informasi Publik: Pusat publikasi berita, transparansi sarana fasilitas, dan profil sekolah.

Dengan implementasi SIMS, SMKS AL-FALAH berkomitmen menghadirkan layanan pendidikan yang tertib, akuntabel, dan berorientasi pada kemajuan peserta didik.`,
  },
  {
    id: "news-4",
    slug: "peringatan-maulid-nabi-santri-alfalah",
    title: "Peringatan Maulid Nabi Muhammad SAW dan Pembinaan Karakter Santri",
    category: "Kegiatan Pesantren",
    published_at: "05 September 2026",
    author: "Humas Yayasan",
    image_url: "/images/facility-masjid.jpg",
    excerpt:
      "Keluarga besar SMKS AL-FALAH bersama Pondok Pesantren memperingati Maulid Nabi dengan rangkaian dzikir dan tausiyah kepribadian.",
    content: `Bertempat di Masjid Yayasan Pondok Pesantren Al-Falah Teluk Pakedai, seluruh siswa, dewan guru, dan pengurus yayasan memperingati Maulid Nabi Muhammad SAW dengan penuh khidmat.

Acara diisi dengan pembacaan sholawat bersama, tausiyah hikmah maulid oleh pimpinan pesantren, dan doa bersama untuk kemajuan pendidikan anak-anak di Desa Sungai Deras. Kepala Sekolah menyampaikan pesan agar para siswa senantiasa meneladani sifat jujur, amanah, dan pantang menyerah dari Rasulullah SAW dalam menuntut ilmu kejuruan.`,
  },
];

const STORAGE_KEY = "sims_custom_news";

/**
 * Get all news items, merging client localStorage additions/edits with defaults
 */
export function getStoredNews(): NewsItem[] {
  if (typeof window === "undefined") {
    return SAMPLE_NEWS_LIST;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_NEWS_LIST));
      return SAMPLE_NEWS_LIST;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_NEWS_LIST;
  } catch (err) {
    console.error("Failed to parse stored news:", err);
    return SAMPLE_NEWS_LIST;
  }
}

/**
 * Persist news list into localStorage
 */
export function saveStoredNews(items: NewsItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Dispatch a custom event so other components on same window can sync
    window.dispatchEvent(new Event("sims-news-updated"));
  } catch (err) {
    console.error("Failed to save news:", err);
  }
}

/**
 * Add a new article to stored list
 */
export function addNewsItem(
  item: Omit<NewsItem, "id"> & { id?: string }
): NewsItem {
  const currentList = getStoredNews();
  const newItem: NewsItem = {
    ...item,
    id: item.id || `news-${Date.now()}`,
    image_url: item.image_url || "/images/hero-school.jpg",
  };
  const updatedList = [newItem, ...currentList];
  saveStoredNews(updatedList);
  return newItem;
}

/**
 * Update an existing article
 */
export function updateNewsItem(
  id: string,
  updated: Partial<NewsItem>
): NewsItem | null {
  const currentList = getStoredNews();
  const index = currentList.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const merged: NewsItem = {
    ...currentList[index],
    ...updated,
  };
  currentList[index] = merged;
  saveStoredNews([...currentList]);
  return merged;
}

/**
 * Delete an article by ID
 */
export function deleteNewsItem(id: string): boolean {
  const currentList = getStoredNews();
  const filtered = currentList.filter((item) => item.id !== id);
  if (filtered.length === currentList.length) return false;
  saveStoredNews(filtered);
  return true;
}
