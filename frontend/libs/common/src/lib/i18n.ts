import { useSyncExternalStore } from "react";
import sharedVietnameseCatalog from "./locales/vi/common.tsv?raw";

export type Locale = "en" | "vi";
export type TranslationValues = Record<string, string | number>;
export interface TranslationOptions {
  context?: string;
  values?: TranslationValues;
}
export type TranslationFunction = (
  sourceText: string,
  options?: TranslationOptions,
) => string;

const STORAGE_KEY = "craft.language";
const LEGACY_STORAGE_KEY = "st-locale";

export interface CatalogEntry {
  context: string;
  source: string;
  translation: string;
}

function unescapeColumn(value: string, catalogName: string, lineNumber: number): string {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character !== "\\") {
      result += character;
      continue;
    }

    const next = value[index + 1];
    if (next === undefined) {
      throw new Error("Trailing escape in " + catalogName + " line " + lineNumber);
    }
    index += 1;

    if (next === "n") result += "\n";
    else if (next === "t") result += "\t";
    else if (next === "\\") result += "\\";
    else {
      throw new Error("Unsupported escape \\" + next + " in " + catalogName + " line " + lineNumber);
    }
  }
  return result;
}

/**
 * Parse the same three-column TSV format used by storytold/craft-i18n.
 * Context and English source text form the lookup key; missing rows fall back to English.
 */
export function parseCatalog(contents: string, catalogName = "catalog.tsv"): CatalogEntry[] {
  const rows: CatalogEntry[] = [];
  const seen = new Set<string>();
  const lines = contents.replace(/^\uFEFF/, "").split("\n");

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
    if (!line.trim() || line.trimStart().startsWith("#")) return;

    const columns = line.split("\t");
    if (columns.length !== 3) {
      throw new Error("Expected three TAB-separated columns in " + catalogName + " line " + lineNumber);
    }

    const entry: CatalogEntry = {
      context: unescapeColumn(columns[0], catalogName, lineNumber),
      source: unescapeColumn(columns[1], catalogName, lineNumber),
      translation: unescapeColumn(columns[2], catalogName, lineNumber),
    };

    if (!entry.source) {
      throw new Error("Empty source text in " + catalogName + " line " + lineNumber);
    }
    if (!entry.translation.trim()) {
      throw new Error("Empty translation in " + catalogName + " line " + lineNumber);
    }

    const key = catalogKey(entry.context, entry.source);
    if (seen.has(key)) {
      throw new Error("Duplicate context/source pair in " + catalogName + " line " + lineNumber);
    }
    seen.add(key);
    rows.push(entry);
  });

  return rows;
}

function catalogKey(context: string, source: string): string {
  return JSON.stringify([context, source]);
}

function indexCatalog(entries: readonly CatalogEntry[]): Map<string, string> {
  return new Map(entries.map((entry) => [
    catalogKey(entry.context, entry.source),
    entry.translation,
  ]));
}

/** Pinned snapshot of craft-i18n/locales/vi/common.tsv for the React frontend. */
export const vietnameseCommonCatalog = parseCatalog(
  sharedVietnameseCatalog,
  "locales/vi/common.tsv",
);

const commonCatalogs = new Map<Locale, Map<string, string>>([
  ["vi", indexCatalog(vietnameseCommonCatalog)],
]);
const appCatalogs = new Map<Locale, Map<string, string>>();

const listeners = new Set<() => void>();
let currentLocale: Locale | undefined;

function notifyLocaleListeners(): void {
  listeners.forEach((listener) => listener());
}

function normalizeLocale(value: string | null | undefined): Locale | undefined {
  if (!value) return undefined;
  const language = value.trim().toLowerCase().replace(/_/g, "-").split("-")[0];
  if (language === "vi") return "vi";
  if (language === "en") return "en";
  return undefined;
}

function detectInitialLocale(): Locale {
  try {
    const stored = typeof window === "undefined"
      ? null
      : window.localStorage.getItem(STORAGE_KEY);
    const normalizedStored = normalizeLocale(stored);
    if (normalizedStored) return normalizedStored;

    // Read preferences saved by the earlier prototype to avoid resetting existing users.
    const legacyStored = typeof window === "undefined"
      ? null
      : window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const normalizedLegacy = normalizeLocale(legacyStored);
    if (normalizedLegacy) return normalizedLegacy;
  } catch {
    // Storage may be unavailable in private browsing or embedded webviews.
  }

  if (typeof window !== "undefined") {
    const requested = normalizeLocale(new URLSearchParams(window.location.search).get("lang"));
    if (requested) return requested;
  }

  if (typeof navigator !== "undefined") {
    const preferences = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    for (const preference of preferences) {
      const detected = normalizeLocale(preference);
      if (detected) return detected;
    }
  }

  return "en";
}

export function getLocale(): Locale {
  if (!currentLocale) currentLocale = detectInitialLocale();
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  } catch {
    // Changing the language must still work when storage is unavailable.
  }

  if (typeof document !== "undefined") {
    document.documentElement.lang = locale === "vi" ? "vi-VN" : "en";
  }

  notifyLocaleListeners();
}

/**
 * Register an application's own catalog. App entries override common entries for the same
 * locale/context/source pair. The returned disposer is useful for tests and hot reload.
 */
export function registerAppCatalog(locale: Locale, contents: string): () => void {
  const previous = appCatalogs.get(locale);
  const registered = indexCatalog(parseCatalog(contents, "artcraft.tsv"));
  appCatalogs.set(locale, registered);
  notifyLocaleListeners();

  return () => {
    if (appCatalogs.get(locale) !== registered) return;
    if (previous) appCatalogs.set(locale, previous);
    else appCatalogs.delete(locale);
    notifyLocaleListeners();
  };
}

function lookupTranslation(locale: Locale, sourceText: string, context = ""): string {
  if (locale === "en") return sourceText;

  const appCatalog = appCatalogs.get(locale);
  const commonCatalog = commonCatalogs.get(locale);
  const candidates = context
    ? [[context, sourceText], ["", sourceText]]
    : [["", sourceText]];

  for (const [candidateContext, source] of candidates) {
    const key = catalogKey(candidateContext, source);
    const appTranslation = appCatalog?.get(key);
    if (appTranslation !== undefined) return appTranslation;

    const commonTranslation = commonCatalog?.get(key);
    if (commonTranslation !== undefined) return commonTranslation;
  }

  return sourceText;
}

export function getTranslation(
  locale: Locale,
  sourceText: string,
  options: TranslationOptions = {},
): string {
  const template = lookupTranslation(locale, sourceText, options.context);
  const values = options.values ?? {};
  return template.replace(/\{([a-zA-Z0-9_.-]+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name)
      ? String(values[name])
      : match,
  );
}

export function getLocaleName(locale: Locale): string {
  if (locale === "en") return "English";
  return getTranslation(locale, "language.name", { context: "@id" });
}

function subscribeToLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribeToLocale, getLocale, () => "en");
}

export function useTranslation(): {
  locale: Locale;
  setLocale: typeof setLocale;
  t: TranslationFunction;
} {
  const locale = useLocale();

  return {
    locale,
    setLocale,
    t: (sourceText, options) => getTranslation(locale, sourceText, options),
  };
}
