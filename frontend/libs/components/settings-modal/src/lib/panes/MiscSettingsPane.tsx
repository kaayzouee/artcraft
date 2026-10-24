import { Label } from "@storyteller/ui-label";
import { useTranslation } from "@storyteller/common";
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
          <Label htmlFor="artcraft-language">{t("settings.language")}</Label>
          <p className="text-xs opacity-70">{t("settings.languageDescription")}</p>
        </div>
        <select
          id="artcraft-language"
          className="w-full border border-ui-panel-border bg-ui-panel px-2 py-2 text-sm text-base-fg"
          value={locale}
          onChange={(event) => setLocale(event.currentTarget.value === "vi" ? "vi" : "en")}
        >
          <option value="en">{t("language.english")}</option>
          <option value="vi">{t("language.vietnamese")}</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="enter-to-generate">{t("settings.general.enterToGenerate")}</Label>
          <p className="text-xs opacity-70">
            {t("settings.general.enterToGenerateDescription")}
          </p>
        </div>
        <Switch enabled={enterToGenerate} setEnabled={setEnterToGenerate} />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="group-models-by-family">{t("settings.general.groupModels")}</Label>
          <p className="text-xs opacity-70">
            {t("settings.general.groupModelsDescription")}
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
            {t("settings.general.keepShortcuts")}
          </Label>
          <p className="text-xs opacity-70">
            {t("settings.general.keepShortcutsDescription")}
          </p>
        </div>
        <Switch enabled={cheatsheetSticky} setEnabled={setCheatsheetSticky} />
      </div>
    </div>
  );
};
