import { afterAll, describe, expect, it } from "vitest";
import {
  getTranslation,
  parseCatalog,
  registerAppCatalog,
  vietnameseCommonCatalog,
} from "@storyteller/common";
import artcraftCatalogText from "./artcraft.tsv?raw";

const appEntries = parseCatalog(artcraftCatalogText, "locales/vi/artcraft.tsv");
const appCatalogDisposer = registerAppCatalog("vi", artcraftCatalogText);
const placeholders = (value: string) =>
  [...value.matchAll(/\{([a-zA-Z0-9_.-]+)\}/g)].map((match) => match[0]).sort();

afterAll(() => {
  appCatalogDisposer();
});

describe("ArtCraft Vietnamese catalog", () => {
  it("contains no empty, padded, non-NFC, or duplicate translations", () => {
    expect(appEntries.length).toBeGreaterThan(10);
    const keys = new Set<string>();

    for (const entry of appEntries) {
      const key = JSON.stringify([entry.context, entry.source]);
      expect(keys.has(key), "duplicate key: " + entry.source).toBe(false);
      keys.add(key);

      expect(entry.translation.trim(), "empty translation: " + entry.source).not.toBe("");
      expect(entry.translation.trim(), "surrounding whitespace: " + entry.source)
        .toBe(entry.translation);
      expect(entry.translation.normalize("NFC"), "non-NFC text: " + entry.source)
        .toBe(entry.translation);
      expect(placeholders(entry.translation), "placeholder mismatch: " + entry.source)
        .toEqual(placeholders(entry.source));
      expect(entry.translation.endsWith("…"), "ellipsis mismatch: " + entry.source)
        .toBe(entry.source.endsWith("…"));
    }
  });

  it("does not duplicate an unchanged common-catalog translation", () => {
    const common = new Map(
      vietnameseCommonCatalog.map((entry) => [
        JSON.stringify([entry.context, entry.source]),
        entry.translation,
      ]),
    );

    for (const entry of appEntries) {
      const key = JSON.stringify([entry.context, entry.source]);
      expect(
        entry.translation === common.get(key),
        "redundant common override: " + entry.source,
      ).toBe(false);
    }
  });

  it("resolves app entries, shared entries, then English fallback", () => {
    expect(getTranslation("vi", "Retry")).toBe("Thử lại");
    expect(getTranslation("vi", "Home")).toBe("Trang chủ");
    expect(getTranslation("vi", "Source not yet translated")).toBe("Source not yet translated");
  });

  it("lets an app entry override a common row without mutating the shared catalog", () => {
    const dispose = registerAppCatalog("vi", "\tHome\tTrang chủ tùy chỉnh");
    expect(getTranslation("vi", "Home")).toBe("Trang chủ tùy chỉnh");
    dispose();
    expect(getTranslation("vi", "Home")).toBe("Trang chủ");
  });
});
