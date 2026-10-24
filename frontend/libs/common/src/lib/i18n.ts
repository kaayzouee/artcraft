import { useSyncExternalStore } from "react";

export type Locale = "en" | "vi";
export type TranslationValues = Record<string, string | number>;

const STORAGE_KEY = "st-locale";

const en = {
  "common.retry": "Retry",
  "nav.home": "Home",
  "nav.homeDescription": "Explore all apps and miniapps",
  "credits.refreshFailed": "Couldn't refresh your balance.",
  "credits.upToDate": "Balance up to date.",
  "credits.refreshing": "Refreshing your balance — the current amount may not be up to date.",
  "settings.title": "Settings",
  "settings.general": "General",
  "settings.downloads": "Downloads",
  "settings.accounts": "Accounts",
  "settings.planCredits": "Plan & Credits",
  "settings.appearance": "Appearance",
  "settings.keybinds": "Keybinds",
  "settings.alerts": "Alerts",
  "settings.about": "About",
  "settings.experimental": "Experimental",
  "settings.language": "Language",
  "settings.languageDescription": "Choose the language for localized parts of ArtCraft. More screens will be translated over time.",
  "settings.general.enterToGenerate": "Enter to generate",
  "settings.general.enterToGenerateDescription": "When enabled, Enter submits the prompt and Shift+Enter adds a new line. When disabled (default), both Enter and Shift+Enter add a new line; use the button to submit.",
  "settings.general.groupModels": "Group models by family",
  "settings.general.groupModelsDescription": "When enabled (default), the model picker groups models into submenus by family, such as Seedance or Veo. When disabled, every model appears in one flat list.",
  "settings.general.keepShortcuts": "Keep shortcut cheatsheet open",
  "settings.general.keepShortcutsDescription": "In editors, holding Ctrl (⌘ on Mac) alone for a few seconds shows keyboard shortcuts. When enabled, the cheatsheet stays visible after you release the key until you press Esc or click outside it. When disabled (default), it disappears as soon as you release the key.",
  "language.english": "English",
  "language.vietnamese": "Tiếng Việt",
  "gallery.selectedCount": "{count} selected",
  "generation.generatedCount": "{count} images generated",
} as const;

const vi: { [Key in keyof typeof en]: string } = {
  "common.retry": "Thử lại",
  "nav.home": "Trang chủ",
  "nav.homeDescription": "Khám phá tất cả ứng dụng và ứng dụng mini",
  "credits.refreshFailed": "Không thể cập nhật số lượt sử dụng còn lại.",
  "credits.upToDate": "Đã cập nhật số lượt sử dụng còn lại.",
  "credits.refreshing": "Đang cập nhật số lượt sử dụng còn lại — thông tin hiện tại có thể chưa phản ánh dữ liệu mới nhất.",
  "settings.title": "Cài đặt",
  "settings.general": "Chung",
  "settings.downloads": "Tải xuống",
  "settings.accounts": "Tài khoản",
  "settings.planCredits": "Gói và lượt sử dụng",
  "settings.appearance": "Giao diện",
  "settings.keybinds": "Phím tắt",
  "settings.alerts": "Thông báo",
  "settings.about": "Giới thiệu",
  "settings.experimental": "Thử nghiệm",
  "settings.language": "Ngôn ngữ",
  "settings.languageDescription": "Chọn ngôn ngữ cho những phần đã được bản địa hóa của ArtCraft. Các màn hình khác sẽ được dịch dần.",
  "settings.general.enterToGenerate": "Nhấn Enter để tạo",
  "settings.general.enterToGenerateDescription": "Khi bật, nhấn Enter để gửi câu lệnh và Shift+Enter để xuống dòng. Khi tắt (mặc định), cả Enter và Shift+Enter đều dùng để xuống dòng; hãy dùng nút gửi để bắt đầu tạo.",
  "settings.general.groupModels": "Nhóm mô hình theo dòng",
  "settings.general.groupModelsDescription": "Khi bật (mặc định), danh sách chọn mô hình được chia thành các menu con theo dòng, chẳng hạn Seedance hoặc Veo. Khi tắt, tất cả mô hình hiển thị trong cùng một danh sách.",
  "settings.general.keepShortcuts": "Giữ mở bảng tra cứu phím tắt",
  "settings.general.keepShortcutsDescription": "Trong trình chỉnh sửa, giữ riêng phím Ctrl (⌘ trên Mac) vài giây để hiển thị bảng tra cứu phím tắt. Khi bật, bảng vẫn hiển thị sau khi nhả phím và chỉ đóng khi nhấn Esc hoặc nhấp ra ngoài. Khi tắt (mặc định), bảng biến mất ngay khi nhả phím.",
  "language.english": "Tiếng Anh",
  "language.vietnamese": "Tiếng Việt",
  "gallery.selectedCount": "Đã chọn {count} mục",
  "generation.generatedCount": "Đã tạo {count} ảnh",
};

export const translationMessages = { en, vi } as const;
export type TranslationKey = keyof typeof en;

const listeners = new Set<() => void>();
let currentLocale: Locale | undefined;

function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "vi";
}

function detectInitialLocale(): Locale {
  try {
    const stored = typeof window === "undefined"
      ? null
      : window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage may be unavailable in private browsing or embedded webviews.
  }

  return typeof navigator !== "undefined" &&
    navigator.language.toLowerCase().startsWith("vi")
    ? "vi"
    : "en";
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

  listeners.forEach((listener) => listener());
}

function subscribeToLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribeToLocale, getLocale, () => "en");
}

export function getTranslation(
  locale: Locale,
  key: TranslationKey,
  values: TranslationValues = {},
): string {
  const template = translationMessages[locale][key] ?? translationMessages.en[key] ?? key;
  return template.replace(/\{([a-zA-Z0-9_.-]+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name)
      ? String(values[name])
      : match,
  );
}

export function useTranslation() {
  const locale = useLocale();

  return {
    locale,
    setLocale,
    t: (key: TranslationKey, values?: TranslationValues) =>
      getTranslation(locale, key, values),
  };
}
