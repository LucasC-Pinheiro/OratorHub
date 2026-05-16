import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const LOCALE = "pt-BR";

/** Parse a date or ISO date-only string ("2025-03-12") as a local date. */
function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  // YYYY-MM-DD → treat as local midnight to avoid timezone shifts.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

export function formatDate(date: string | Date): string {
  return parseDate(date).toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateLong(date: string | Date): string {
  return parseDate(date).toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRelative(date: string | Date): string {
  const value = parseDate(date);
  const diffMs = Date.now() - value.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays === -1) return "Amanhã";
  if (diffDays > 1 && diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 0 && diffDays > -7) return `em ${Math.abs(diffDays)} dias`;
  if (diffDays >= 7 && diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }
  if (diffDays >= 30 && diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `há ${months} ${months === 1 ? "mês" : "meses"}`;
  }
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    return `há ${years} ${years === 1 ? "ano" : "anos"}`;
  }
  return formatDate(value);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Today's date as `YYYY-MM-DD` in local time (no timezone drift). */
export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Normalise text for fuzzy matching: lowercase, strip diacritics, collapse spaces. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Cheap fuzzy score: returns null if no match, lower is better. */
export function fuzzyScore(haystack: string, needle: string): number | null {
  if (!needle) return 0;
  const text = normalize(haystack);
  const term = normalize(needle);
  if (!term) return 0;
  if (text === term) return 0;
  if (text.startsWith(term)) return 1;
  if (text.includes(term)) return 2;

  // Sub-sequence check
  let ti = 0;
  let score = 4;
  let lastMatch = -1;
  for (const ch of term) {
    const idx = text.indexOf(ch, ti);
    if (idx === -1) return null;
    if (lastMatch >= 0 && idx !== lastMatch + 1) score += 1;
    lastMatch = idx;
    ti = idx + 1;
  }
  return score;
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}
