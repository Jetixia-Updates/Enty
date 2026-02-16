import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";

export type Lang = "ar" | "en";

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

function applyLang(lang: Lang) {
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", lang === "ar");
  if (typeof localStorage !== "undefined") localStorage.setItem("lang", lang);
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: "en",
      setLang: (lang) => {
        applyLang(lang);
        set({ lang });
      },
      toggleLang: () => {
        const next = get().lang === "ar" ? "en" : "ar";
        get().setLang(next);
      },
    }),
    {
      name: "home-queen-lang",
      onRehydrateStorage: () => (state) => {
        if (state?.lang) applyLang(state.lang);
      },
    }
  )
);
