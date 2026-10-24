import { afterEach, describe, expect, it } from "vitest";
import {
  getLocale,
  getTranslation,
  setLocale,
  translationMessages,
  type TranslationKey,
} from "./i18n";

const placeholderPattern = /\{([a-zA-Z0-9_.-]+)\}|(%(?:\d+\$)?[-+#0 ]*(?:\d+|\*)?(?:\.\d+)?[sdif])/g;

function placeholders(value: string): string[] {
  return [...value.matchAll(placeholderPattern)]
    .map((match) => (match[1] ? `{${match[1]}}` : match[2]))
    .sort();
}

describe("Vietnamese localization quality", () => {
  const originalLocale = getLocale();

  afterEach(() => {
    setLocale(originalLocale);
  });

  it("keeps the same translation keys in English and Vietnamese", () => {
    expect(Object.keys(translationMessages.vi).sort()).toEqual(
      Object.keys(translationMessages.en).sort(),
    );
  });

  it("recognizes named, indexed, and printf-style placeholders", () => {
    expect(placeholders("{count} {0} %s %1$s %02d %-10.2f")).toEqual([
      "%-10.2f",
      "%02d",
      "%1$s",
      "%s",
      "{0}",
      "{count}",
    ]);
  });

  it("preserves interpolation placeholders in every translation", () => {
    for (const key of Object.keys(translationMessages.en) as TranslationKey[]) {
      expect(placeholders(translationMessages.vi[key]), `placeholder mismatch for ${key}`)
        .toEqual(placeholders(translationMessages.en[key]));
    }
  });

  it("contains no empty or whitespace-padded translations", () => {
    for (const [key, value] of Object.entries(translationMessages.vi)) {
      expect(value.trim(), `empty translation for ${key}`).not.toBe("");
      expect(value.trim(), `unexpected surrounding whitespace for ${key}`).toBe(value);
    }
  });

  it("stores Vietnamese translations in Unicode NFC form", () => {
    for (const [key, value] of Object.entries(translationMessages.vi)) {
      expect(value.normalize("NFC"), `non-NFC Vietnamese text at ${key}`).toBe(value);
    }
  });

  it("provides meaningful Vietnamese labels for the first localized UI slice", () => {
    const requiredKeys: TranslationKey[] = [
      "nav.home",
      "settings.title",
      "settings.general",
      "settings.language",
      "settings.languageDescription",
      "language.english",
      "settings.general.enterToGenerate",
      "settings.general.groupModels",
      "settings.general.keepShortcuts",
    ];

    for (const key of requiredKeys) {
      expect(translationMessages.vi[key].trim(), `empty translation for ${key}`).not.toBe("");
      expect(translationMessages.vi[key], `English fallback for ${key}`)
        .not.toBe(translationMessages.en[key]);
    }
  });

  it("interpolates variables without changing their values", () => {
    expect(getTranslation("vi", "generation.generatedCount", { count: 12 })).toBe(
      "Đã tạo 12 ảnh",
    );
    expect(getTranslation("vi", "gallery.selectedCount", { count: 3 })).toBe(
      "Đã chọn 3 mục",
    );
  });

  it("persists locale selection and synchronizes the document language", () => {
    setLocale("vi");

    expect(getLocale()).toBe("vi");
    expect(window.localStorage.getItem("st-locale")).toBe("vi");
    expect(document.documentElement.lang).toBe("vi-VN");
  });
});
