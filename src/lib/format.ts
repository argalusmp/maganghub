import { format, formatDistanceToNow, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { Vacancy } from "@/lib/api-types";

export function safeParseDate(value?: string | null) {
  if (!value) return null;
  try {
    return parseISO(value);
  } catch (error) {
    return null;
  }
}

export function formatIndoDate(value?: string | null, pattern = "d MMM yyyy") {
  const date = safeParseDate(value);
  if (!date) return "-";
  return format(date, pattern, { locale: localeId });
}

export function formatDateRange(start?: string | null, end?: string | null) {
  const startText = formatIndoDate(start);
  const endText = formatIndoDate(end);
  if (!start && !end) return "Jadwal belum tersedia";
  if (start && !end) return `Mulai ${startText}`;
  if (!start && end) return `Hingga ${endText}`;
  return `${startText} – ${endText}`;
}

export function formatRelativeTime(value?: string | null) {
  const date = safeParseDate(value);
  if (!date) return null;
  return formatDistanceToNow(date, { locale: localeId, addSuffix: true });
}

export function isRegistrationOpen(start?: string | null, end?: string | null) {
  const now = new Date();
  const startDate = safeParseDate(start) ?? new Date(0);
  const endDate = safeParseDate(end) ?? new Date(now.getTime() - 1);
  return now >= startDate && now <= endDate;
}

export function computeJenjangPreview(vacancies: Vacancy[]) {
  return vacancies.reduce<Record<string, number>>((acc, vacancy) => {
    vacancy.jenjang.forEach((value) => {
      acc[value] = (acc[value] ?? 0) + 1;
    });
    return acc;
  }, {});
}
