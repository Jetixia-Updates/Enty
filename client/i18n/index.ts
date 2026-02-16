import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

// Prefer zustand persist (home-queen-lang) to stay in sync with LanguageSwitcher
let initialLang: "ar" | "en" = "en";
if (typeof localStorage !== "undefined") {
  try {
    const persisted = localStorage.getItem("home-queen-lang");
    if (persisted) {
      const parsed = JSON.parse(persisted);
      const lang = parsed?.state?.lang;
      if (lang === "ar" || lang === "en") initialLang = lang;
    } else {
      const lang = localStorage.getItem("lang");
      if (lang === "ar" || lang === "en") initialLang = lang;
    }
  } catch {
    const lang = localStorage.getItem("lang");
    if (lang === "ar" || lang === "en") initialLang = lang;
  }
}

i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Set RTL on init
document.documentElement.lang = initialLang;
document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";

export default i18n;
