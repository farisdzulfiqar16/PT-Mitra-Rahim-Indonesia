import type { NextConfig } from "next";

/**
 * Konfigurasi Next.js untuk project Celestia.
 *
 * Catatan:
 * - Next.js 16 menggunakan Turbopack secara default untuk build.
 * - Turbopack memerlukan konfigurasi loader CSS eksplisit agar
 *   Tailwind CSS v4 (@theme, @import) dapat diproses dengan benar.
 */
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

export default nextConfig;
