import { afterEach, describe, expect, it } from "vitest";
import {
  getLocale,
  getLocaleName,
  getTranslation,
  parseCatalog,
  registerAppCatalog,
  setLocale,
  vietnameseCommonCatalog,
} from "./i18n";

const placeholderPattern = /\{([a-zA-Z0-9_.-]+)\}/g;

function placeholders(value: string): string[] {
  return [...value.matchAll(placeholderPattern)]
    .map((match) => match[0])
    .sort();
}

const originalLocale = getLocale();

afterEach(() => {
  setLocale(originalLocale);
  localStorage.removeItem("craft.language");
  localStorage.removeItem("st-locale");
});

describe("shared craft-i18n TSV catalog", () => {
  it("parses comments, BOM, CRLF, and documented column escapes", () => {
    const entries = parseCatalog(
      "\uFEFF# a comment\r\nmenu\tFirst\\tsecond\tDòng\\tthứ hai\r\n\r\n",
      "fixture.tsv",
    );
    expect(entries).toEqual([
      { context: "menu", source: "First\tsecond", translation: "Dòng\tthứ hai" },
    ]);
  });

  it("rejects malformed rows, duplicate keys, and empty translations", () => {
    expect(() => parseCatalog("source only\tThiếu cột")).toThrow(/three TAB-separated columns/);
    expect(() => parseCatalog("\tHome\tTrang chủ\n\tHome\tTrang chủ")).toThrow(/Duplicate/);
    expect(() => parseCatalog("\tHome\t   ")).toThrow(/Empty translation/);
  });

  it("uses shared translations before falling back to English source text", () => {
    expect(getTranslation("vi", "Home")).toBe("Trang chủ");
    expect(getTranslation("vi", "Settings")).toBe("Cài đặt");
    expect(getTranslation("vi", "Uncatalogued source text")).toBe("Uncatalogued source text");
    expect(getTranslation("en", "Home")).toBe("Home");
  });

  it("gets the Vietnamese language-picker label from the @id row", () => {
    expect(getLocaleName("en")).toBe("English");
    expect(getLocaleName("vi")).toBe("Tiếng Việt");
  });

  it("stores locale under the shared suite preference and updates the HTML language", () => {
    setLocale("vi");
    expect(localStorage.getItem("craft.language")).toBe("vi");
    expect(document.documentElement.lang).toBe("vi-VN");
    setLocale("en");
    expect(localStorage.getItem("craft.language")).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("selects CLDR plural forms and interpolates the count", () => {
    const dispose = registerAppCatalog(
      "vi",
      "@plural\t{n} page|{n} pages\t{n} trang",
    );
    expect(
      getTranslation("vi", "{n} page|{n} pages", { context: "@plural", values: { n: 3 } }),
    ).toBe("3 trang");
    dispose();

    expect(
      getTranslation("en", "{n} page|{n} pages", { context: "@plural", values: { n: 1 } }),
    ).toBe("1 page");
    expect(
      getTranslation("en", "{n} page|{n} pages", { context: "@plural", values: { n: 3 } }),
    ).toBe("3 pages");
  });

  it("keeps shared Vietnamese strings non-empty, normalized, and placeholder-safe", () => {
    expect(vietnameseCommonCatalog.length).toBeGreaterThan(100);

    for (const entry of vietnameseCommonCatalog) {
      expect(entry.translation.trim(), "empty or whitespace-only translation").not.toBe("");
      expect(
        entry.translation.normalize("NFC"),
        "non-NFC translation for " + entry.source,
      ).toBe(entry.translation);

      if (entry.context === "@plural") {
        const sourceForms = entry.source.split("|");
        const translatedForms = entry.translation.split("|");
        const expected = placeholders(sourceForms[0]);
        expect(placeholders(sourceForms[1] ?? sourceForms[0])).toEqual(expected);
        for (const form of translatedForms) {
          expect(placeholders(form), "plural placeholder mismatch for " + entry.source)
            .toEqual(expected);
        }
      } else {
        expect(
          placeholders(entry.translation),
          "placeholder mismatch for " + entry.source,
        ).toEqual(placeholders(entry.source));
      }

      expect(
        entry.translation.endsWith("…"),
        "trailing ellipsis mismatch for " + entry.source,
      ).toBe(entry.source.endsWith("…"));
    }
  });
});
