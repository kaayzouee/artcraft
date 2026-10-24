import { Label } from "@storyteller/ui-label";
import { getLocaleName, useTranslation } from "@storyteller/common";
import { Switch } from "@storyteller/ui-switch";
import { useEnterToGenerateStore } from "@storyteller/ui-promptbox";
import { useModelPickerStyleStore } from "@storyteller/ui-popover";
import { useKeybindsStore } from "@storyteller/keybinds";

interface MiscSettingsPaneProps {}

export const MiscSettingsPane = (args: MiscSettingsPaneProps) => {
  const { locale, setLocale, t } = useTranslation();
  const enterToGenerate = useEnterToGenerateStore((s) => s.enabled);
  const setEnterToGenerate = useEnterToGenerateStore((s) => s.setEnabled);

  const modelPickerStyle = useModelPickerStyleStore((s) => s.style);
  const setModelPickerStyle = useModelPickerStyleStore((s) => s.setStyle);

  const cheatsheetSticky = useKeybindsStore((s) => s.cheatsheetSticky);
  const setCheatsheetSticky = useKeybindsStore((s) => s.setCheatsheetSticky);

  return (
    <div className="space-y-4 text-base-fg">
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="artcraft-language">{t("Language")}</Label>
          <p className="text-xs opacity-70">{t("Choose the language for localized parts of ArtCraft. More screens will be translated over time.")}</p>
        </div>
        <select
          id="artcraft-language"
          className="w-full border border-ui-panel-border bg-ui-panel px-2 py-2 text-sm text-base-fg"
          value={locale}
          onChange={(event) => setLocale(event.currentTarget.value === "vi" ? "vi" : "en")}
        >
          <option value="en">{getLocaleName("en")}</option>
          <option value="vi">{getLocaleName("vi")}</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="enter-to-generate">{t("Enter to generate")}</Label>
          <p className="text-xs opacity-70">
            {t("When enabled, Enter submits the prompt and Shift+Enter adds a new line. When disabled (default), both Enter and Shift+Enter add a new line; use the button to submit.")}
          </p>
        </div>
        <Switch enabled={enterToGenerate} setEnabled={setEnterToGenerate} />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="group-models-by-family">{t("Group models by family")}</Label>
          <p className="text-xs opacity-70">
            {t("When enabled (default), the model picker groups models into submenus by family, such as Seedance or Veo. When disabled, every model appears in one flat list.")}
          </p>
        </div>
        <Switch
          enabled={modelPickerStyle === "grouped"}
          setEnabled={(on) => setModelPickerStyle(on ? "grouped" : "flat")}
        />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cheatsheet-sticky">
            {t("Keep shortcut cheatsheet open")}
          </Label>
          <p className="text-xs opacity-70">
            {t("In editors, holding Ctrl (⌘ on Mac) alone for a few seconds shows keyboard shortcuts. When enabled, the cheatsheet stays visible after you release the key until you press Esc or click outside it. When disabled (default), it disappears as soon as you release the key.")}
          </p>
        </div>
        <Switch enabled={cheatsheetSticky} setEnabled={setCheatsheetSticky} />
      </div>
    </div>
  );
};
