/**
 * Utility functions untuk kebutuhan umum di seluruh aplikasi.
 *
 * Hanya tambahkan function di sini jika digunakan lebih dari satu tempat.
 * Utility yang spesifik pada satu fitur sebaiknya tetap di dalam folder fitur tersebut.
 */

/**
 * Gabungkan class names secara kondisional (pengganti library `clsx`).
 * Cocok untuk menggabungkan Tailwind CSS classes.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "rounded")
 * // → "px-4 py-2 bg-blue-500 rounded"  (jika isActive true)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format angka ke format mata uang Rupiah.
 *
 * @example
 * formatRupiah(500000000) → "Rp 500.000.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format luas area ke string yang mudah dibaca.
 *
 * @example
 * formatArea(120) → "120 m²"
 */
export function formatArea(squareMeters: number): string {
  return `${squareMeters} m²`;
}
