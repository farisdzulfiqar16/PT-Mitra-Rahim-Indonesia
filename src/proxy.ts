import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";

/**
 * Proxy untuk i18n routing — Next.js 16 mengganti middleware.ts dengan proxy.ts.
 *
 * Fungsi:
 * - URL dengan locale valid (/id/... atau /en/...) diteruskan apa adanya
 * - URL tanpa locale prefix diarahkan ke locale default (/id/...) dengan path yang sesuai
 * - Unknown locale diarahkan ke path setara dengan prefix /id/
 */
export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  // Skip internal paths dan file statis
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
