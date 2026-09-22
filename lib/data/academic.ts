export interface AcademicYearConfig {
  academic_year: string; // e.g. "2026/2027"
  semester: "Ganjil" | "Genap";
  status: "Aktif" | "Arsip";
  updated_at?: string;
}

export const DEFAULT_ACADEMIC_YEAR: AcademicYearConfig = {
  academic_year: "2026/2027",
  semester: "Ganjil",
  status: "Aktif",
  updated_at: "22 September 2026",
};

export const AVAILABLE_ACADEMIC_YEARS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
  "2027/2028",
  "2028/2029",
];

const STORAGE_KEY = "sims_academic_config";

/**
 * Get active academic year from client storage or defaults
 */
export function getActiveAcademicYear(): AcademicYearConfig {
  if (typeof window === "undefined") {
    return DEFAULT_ACADEMIC_YEAR;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACADEMIC_YEAR));
      return DEFAULT_ACADEMIC_YEAR;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.academic_year === "string") {
      return parsed;
    }
    return DEFAULT_ACADEMIC_YEAR;
  } catch (err) {
    console.error("Failed to parse academic config:", err);
    return DEFAULT_ACADEMIC_YEAR;
  }
}

/**
 * Save active academic year to localStorage and dispatch update event
 */
export function saveActiveAcademicYear(config: AcademicYearConfig): void {
  if (typeof window === "undefined") return;
  try {
    const dataToSave = {
      ...config,
      updated_at: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    window.dispatchEvent(new Event("sims-academic-updated"));
  } catch (err) {
    console.error("Failed to save academic config:", err);
  }
}
