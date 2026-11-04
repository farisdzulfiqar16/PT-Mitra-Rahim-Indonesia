import Link from "next/link";

/**
 * Root-level 404 — menangani request yang tidak masuk scope proxy/middleware
 * (misal: path statis yang di-exclude dari matcher).
 * Locale-level 404 ada di src/app/[locale]/not-found.tsx.
 */
export default function RootNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold text-neutral-900">404</h1>
      <p className="text-lg font-medium text-neutral-600">Halaman tidak ditemukan</p>
      <p className="text-sm text-neutral-400 max-w-sm">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/id"
        className="mt-4 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-primary-700 text-white hover:bg-primary-600 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
