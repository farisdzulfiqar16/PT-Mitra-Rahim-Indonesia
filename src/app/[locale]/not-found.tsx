import { useTranslations } from "next-intl";
import Link from "next/link";

/**
 * Locale-level 404.
 * Link ke homepage menggunakan "/" — proxy next-intl akan mengarahkan
 * ke locale aktif secara otomatis berdasarkan cookie header yang sudah
 * diset oleh middleware. Ini lebih andal daripada parsing pathname manual
 * karena not-found.tsx adalah Server Component dan tidak menerima params.
 */
export default function NotFound() {
  const t = useTranslations("error");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold text-neutral-900">404</h1>
      <p className="text-lg font-medium text-neutral-600">{t("notFound")}</p>
      <p className="text-sm text-neutral-400 max-w-sm">{t("notFoundDesc")}</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-primary-700 text-white hover:bg-primary-600 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
