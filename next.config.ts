import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Konfigurasi Next.js untuk project Celestia (POC Static Export).
 */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
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
