import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import de from "./locales/de.json";
import zh from "./locales/zh.json";
import tr from "./locales/tr.json";

export const supportedLocales = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
] as const;

export type LocaleCode = (typeof supportedLocales)[number]["code"];

export function getLocaleFromPath(pathname: string): LocaleCode {
  const seg = pathname.split("/")[1];
  const match = supportedLocales.find((l) => l.code === seg);
  return match ? match.code : "en";
}

export function stripLocalePrefix(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (supportedLocales.some((l) => l.code === seg)) {
    return pathname.slice(seg.length + 1) || "/";
  }
  return pathname;
}

export function localePath(path: string, locale: LocaleCode): string {
  if (locale === "en") return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    it: { translation: it },
    de: { translation: de },
    zh: { translation: zh },
    tr: { translation: tr },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
