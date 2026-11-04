import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

/**
 * Footer — konsisten di semua halaman.
 */
export async function Footer() {
  const t = await getTranslations("footer");

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
