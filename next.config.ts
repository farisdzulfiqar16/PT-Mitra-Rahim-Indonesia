import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Konfigurasi Next.js untuk project Celestia.
 *
 * Catatan:
 * - Next.js 16 menggunakan Turbopack secara default untuk build.
 * - Turbopack memerlukan konfigurasi loader CSS eksplisit agar
 *   Tailwind CSS v4 (@theme, @import) dapat diproses dengan benar.
 * - next-intl plugin untuk App Router i18n routing.
 */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
