/**
 * Halaman utama — placeholder sementara.
 *
 * Halaman ini akan digantikan oleh Homepage Celestia pada Feature Spec berikutnya.
 * Jangan menambahkan konten bisnis di sini sebelum spec siap.
 */

import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold text-neutral-900">
        {siteConfig.name}
      </h1>
      <p className="text-neutral-500 text-center max-w-sm">
        {siteConfig.tagline}
      </p>
      <p className="text-sm text-neutral-400 border border-neutral-200 rounded-md px-4 py-2">
        🚧 Fondasi project siap. Homepage akan dibangun pada Feature Spec berikutnya.
      </p>
      <p className="text-xs text-neutral-300">
        {siteConfig.company}
      </p>
    </main>
  );
}
