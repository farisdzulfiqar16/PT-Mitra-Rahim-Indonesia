import dehirData from "@/data/projects/dehir.json";
import pabuaranData from "@/data/projects/pabuaran.json";
import type { Project, ProjectId } from "@/types";

const ALL_PROJECTS: Project[] = [
  dehirData as Project,
  pabuaranData as Project,
];

/**
 * Mengembalikan seluruh proyek properti yang terdaftar di Celestia.
 */
export async function getAllProjects(): Promise<Project[]> {
  return ALL_PROJECTS;
}

/**
 * Versi sinkron dari getAllProjects (berguna untuk generateStaticParams).
 */
export function getAllProjectsSync(): Project[] {
  return ALL_PROJECTS;
}

/**
 * Mengambil data proyek berdasarkan slug URL (misal: "dehir" atau "pabuaran").
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return ALL_PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Versi sinkron dari getProjectBySlug.
 */
export function getProjectBySlugSync(slug: string): Project | undefined {
  return ALL_PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Mengambil data proyek berdasarkan ProjectId.
 */
export async function getProjectById(id: ProjectId): Promise<Project | undefined> {
  return ALL_PROJECTS.find((p) => p.id === id);
}

/**
 * Mengembalikan daftar proyek yang berstatus aktif ("active").
 */
export async function getActiveProjects(): Promise<Project[]> {
  return ALL_PROJECTS.filter((p) => p.status === "active");
}

/**
 * Versi sinkron dari getActiveProjects.
 */
export function getActiveProjectsSync(): Project[] {
  return ALL_PROJECTS.filter((p) => p.status === "active");
}
