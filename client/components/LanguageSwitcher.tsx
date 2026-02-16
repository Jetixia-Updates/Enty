import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguageStore();

  return (
    <div className="flex items-center gap-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 p-1">
      <button
        onClick={() => setLang("ar")}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          lang === "ar" ? "bg-rose-500 text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        )}
      >
        {t("common.languageAr")}
      </button>
      <button
        onClick={() => setLang("en")}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          lang === "en" ? "bg-rose-500 text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        )}
      >
        {t("common.languageEn")}
      </button>
    </div>
  );
}
