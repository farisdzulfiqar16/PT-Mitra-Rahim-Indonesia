import { siteConfig } from "@/config/site";

export const locales = siteConfig.supportedLocales as readonly string[];
export const defaultLocale = siteConfig.defaultLocale;

export type Locale = (typeof siteConfig.supportedLocales)[number];
