import React from "react";
import { MessageCircle } from "lucide-react";
import {
  siteConfig,
  buildWhatsAppUrl,
  isWhatsAppNumberPlaceholder,
  buildProjectWhatsAppMessage,
  buildUnitWhatsAppMessage,
} from "@/config/site";
import { cn } from "@/lib/utils";

export type WhatsAppButtonVariant = "primary" | "secondary" | "outline" | "compact" | "iconOnly";

export interface WhatsAppButtonProps {
  /** Bahasa aktif untuk memilih template pesan default */
  locale?: "id" | "en";
  /** Konteks pesan WhatsApp: homepage, project, unit, atau custom */
  context?: "homepage" | "project" | "unit" | "custom";
  /** Nama lengkap proyek jika context="project" atau context="unit" */
  projectFullName?: string;
  /** Kode kavling/unit jika context="unit" */
  unitCode?: string;
  /** Pesan spesifik jika context="custom" atau ingin override */
  customMessage?: string;
  /** Varian visual tombol */
  variant?: WhatsAppButtonVariant;
  /** Pesan tooltip saat nomor masih placeholder / disabled */
  disabledMessage?: string;
  /** Class CSS tambahan */
  className?: string;
  /** Konten label tombol (jika tidak diisi, menggunakan default sesuai konteks/varian) */
  children?: React.ReactNode;
  /** Aksesibilitas: aria-label */
  ariaLabel?: string;
  /** Apakah lebar 100% */
  fullWidth?: boolean;
  /** Tampilkan icon WhatsApp */
  showIcon?: boolean;
}

/**
 * WhatsAppButton — Komponen resmi untuk seluruh aksi Call-to-Action WhatsApp di Celestia.
 *
 * Memenuhi aturan Task 9:
 * 1. Menggunakan konfigurasi terpusat dari siteConfig (tidak pernah hardcode nomor).
 * 2. Otomatis mendeteksi nomor placeholder (mengandung 'X') dan masuk ke disabled state yang aman.
 * 3. Membuka di tab baru dengan target="_blank" dan rel="noopener noreferrer".
 * 4. Mendukung pesan kontekstual bilingual (homepage, proyek, detail unit, atau kustom).
 */
export function WhatsAppButton({
  locale = "id",
  context = "homepage",
  projectFullName,
  unitCode,
  customMessage,
  variant = "primary",
  disabledMessage = "WhatsApp belum aktif",
  className,
  children,
  ariaLabel,
  fullWidth = false,
  showIcon = true,
}: WhatsAppButtonProps) {
  const isPlaceholder = isWhatsAppNumberPlaceholder();

  // Tentukan pesan berdasarkan konteks
  let message = "";
  if (customMessage) {
    message = customMessage;
  } else if (context === "unit" && unitCode && projectFullName) {
    message = buildUnitWhatsAppMessage(unitCode, projectFullName, locale);
  } else if (context === "project" && projectFullName) {
    message = buildProjectWhatsAppMessage(projectFullName, locale);
  } else {
    message =
      locale === "en"
        ? siteConfig.contact.whatsappMessageEn
        : siteConfig.contact.whatsappMessageId;
  }

  const href = isPlaceholder ? undefined : buildWhatsAppUrl(message);

  // Styling variant
  const baseClasses =
    "inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 select-none";

  const variantClasses: Record<WhatsAppButtonVariant, string> = {
    primary:
      "bg-whatsapp text-white shadow-sm hover:bg-whatsapp-hover min-h-[44px] px-6 py-3 rounded-lg text-sm",
    secondary:
      "bg-emerald-50 text-whatsapp-text border border-emerald-200 hover:bg-emerald-100 min-h-[44px] px-5 py-2.5 rounded-lg text-sm",
    outline:
      "bg-transparent border border-whatsapp text-whatsapp hover:bg-emerald-50 min-h-[44px] px-5 py-2.5 rounded-lg text-sm",
    compact:
      "bg-whatsapp text-white hover:bg-whatsapp-hover min-h-[36px] px-3.5 py-1.5 rounded-md text-xs",
    iconOnly:
      "bg-whatsapp text-white hover:bg-whatsapp-hover w-10 h-10 p-2 rounded-full",
  };

  const disabledVariantClasses: Record<WhatsAppButtonVariant, string> = {
    primary:
      "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none min-h-[44px] px-6 py-3 rounded-lg text-sm",
    secondary:
      "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed min-h-[44px] px-5 py-2.5 rounded-lg text-sm",
    outline:
      "bg-transparent border border-neutral-300 text-neutral-400 cursor-not-allowed min-h-[44px] px-5 py-2.5 rounded-lg text-sm",
    compact:
      "bg-neutral-200 text-neutral-400 cursor-not-allowed min-h-[36px] px-3.5 py-1.5 rounded-md text-xs",
    iconOnly:
      "bg-neutral-200 text-neutral-400 cursor-not-allowed w-10 h-10 p-2 rounded-full",
  };

  const defaultLabel =
    variant === "compact" || variant === "iconOnly"
      ? "WhatsApp"
      : locale === "en"
      ? "Contact via WhatsApp"
      : "Hubungi via WhatsApp";

  const iconSizeClass =
    variant === "compact"
      ? "h-3.5 w-3.5 mr-1.5"
      : variant === "iconOnly"
      ? "h-5 w-5"
      : "h-4 w-4 mr-2";

  const content = (
    <>
      {showIcon && (
        <MessageCircle
          className={cn(iconSizeClass, "shrink-0 stroke-[2.25]")}
          aria-hidden="true"
        />
      )}
      {variant !== "iconOnly" && (children ?? defaultLabel)}
    </>
  );

  if (isPlaceholder) {
    return (
      <span
        role="button"
        aria-disabled="true"
        tabIndex={-1}
        title={disabledMessage}
        aria-label={ariaLabel ?? (typeof children === "string" ? children : defaultLabel)}
        className={cn(
          baseClasses,
          disabledVariantClasses[variant],
          fullWidth && "w-full",
          className
        )}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        baseClasses,
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {content}
    </a>
  );
}
