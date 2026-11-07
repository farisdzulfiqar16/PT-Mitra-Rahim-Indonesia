import dehirUnitsData from "@/data/properties/dehir-units.json";
import type { PropertyUnit } from "@/types";

/**
 * Mapping data unit berdasarkan ProjectId.
 * Jika proyek baru ditambahkan, daftarkan file JSON-nya di sini.
 */
const UNITS_BY_PROJECT: Record<string, PropertyUnit[]> = {
  dehir: dehirUnitsData as PropertyUnit[],
  pabuaran: [], // Pabuaran saat ini berstatus coming-soon tanpa unit
};

/**
 * Mengambil seluruh unit kavling atau properti untuk suatu proyek.
 *
 * @param projectId ID proyek (misal: "dehir")
 */
export async function getUnitsByProject(projectId: string): Promise<PropertyUnit[]> {
  const normalizedId = projectId.toLowerCase();
  return UNITS_BY_PROJECT[normalizedId] ?? [];
}

/**
 * Versi sinkron dari getUnitsByProject (berguna untuk generateStaticParams).
 */
export function getUnitsByProjectSync(projectId: string): PropertyUnit[] {
  const normalizedId = projectId.toLowerCase();
  return UNITS_BY_PROJECT[normalizedId] ?? [];
}

/**
 * Mengambil detail satu unit tertentu berdasarkan kombinasi projectId dan unitCode.
 *
 * @param projectId ID proyek tempat unit berada (misal: "dehir")
 * @param unitCode Kode kavling/unit (misal: "A1", "B5")
 */
export async function getUnitByCode(
  projectId: string,
  unitCode: string
): Promise<PropertyUnit | undefined> {
  const units = await getUnitsByProject(projectId);
  return units.find(
    (u) => u.unitCode.toLowerCase() === unitCode.toLowerCase()
  );
}

/**
 * Versi sinkron dari getUnitByCode.
 */
export function getUnitByCodeSync(
  projectId: string,
  unitCode: string
): PropertyUnit | undefined {
  const units = getUnitsByProjectSync(projectId);
  return units.find(
    (u) => u.unitCode.toLowerCase() === unitCode.toLowerCase()
  );
}
