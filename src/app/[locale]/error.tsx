"use client";

import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">{t("errorOccurred")}</h1>
      <button
        onClick={() => reset()}
        className="mt-4 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-primary-700 text-white hover:bg-primary-600 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
      >
        {t("tryAgain")}
      </button>
    </main>
  );
}
