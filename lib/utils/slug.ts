/**
 * Converts a string into a clean, URL-friendly slug.
 * Removes accents/diacritics, special symbols, multiple consecutive hyphens, and trims leading/trailing hyphens.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters
    .replace(/[\s_-]+/g, '-') // convert spaces and underscores to hyphens
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

export const generateSlug = slugify;
