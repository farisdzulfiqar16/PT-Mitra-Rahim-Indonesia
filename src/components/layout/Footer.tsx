import { getTranslations } from "next-intl/server";
import { siteConfig, uiConfig } from "@/config/site";

/**
 * Footer — konsisten di semua halaman.
 * V2 mengikuti style mockup: lebih compact, layout horizontal, background putih.
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const isV2 = uiConfig.uiVariant === "v2";

  if (isV2) {
    return (
      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-primary-700">{siteConfig.name}</span>
              <span className="text-neutral-200">|</span>
              <span className="text-xs text-neutral-400">{t("company")}</span>
            </div>
            <p className="text-xs text-neutral-300">
              © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // V1 fallback
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-neutral-600">{siteConfig.name}</p>
          <p className="text-xs text-neutral-400">{t("company")}</p>
          <p className="text-xs text-neutral-300">© {new Date().getFullYear()} {siteConfig.name}. {t("rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
