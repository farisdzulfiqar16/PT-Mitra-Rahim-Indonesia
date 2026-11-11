/**
 * Galeri foto publik Celestia Dehir.
 *
 * Foto disimpan di: /images/projects/dehir/gallery/
 *
 * Alt text dan caption saat ini bersifat sementara dan netral.
 * Perbarui dengan deskripsi spesifik setelah owner meninjau konten foto.
 */

export interface ProjectGalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

interface GalleryCopy {
  id: string;
  en: string;
}

interface DehirGallerySource {
  id: string;
  src: string;
  alt: GalleryCopy;
  caption: GalleryCopy;
}

const dehirGallery: DehirGallerySource[] = [
  {
    id: "dehir-doc-060",
    src: "/images/projects/dehir/gallery/060_IMG_0354.jpg",
    alt: {
      id: "Dokumentasi lapangan proyek Celestia Dehir",
      en: "Field documentation of the Celestia Dehir project site",
    },
    caption: {
      id: "Dokumentasi lapangan proyek Celestia Dehir.",
      en: "Field documentation of the Celestia Dehir project site.",
    },
  },
  {
    id: "dehir-doc-062",
    src: "/images/projects/dehir/gallery/062_IMG_0356.jpg",
    alt: {
      id: "Dokumentasi lapangan proyek Celestia Dehir",
      en: "Field documentation of the Celestia Dehir project site",
    },
    caption: {
      id: "Dokumentasi lapangan proyek Celestia Dehir.",
      en: "Field documentation of the Celestia Dehir project site.",
    },
  },
  {
    id: "dehir-doc-064",
    src: "/images/projects/dehir/gallery/064_IMG_0358.jpg",
    alt: {
      id: "Dokumentasi lapangan proyek Celestia Dehir",
      en: "Field documentation of the Celestia Dehir project site",
    },
    caption: {
      id: "Dokumentasi lapangan proyek Celestia Dehir.",
      en: "Field documentation of the Celestia Dehir project site.",
    },
  },
  {
    id: "dehir-doc-067",
    src: "/images/projects/dehir/gallery/067_IMG_0361.jpg",
    alt: {
      id: "Dokumentasi lapangan proyek Celestia Dehir",
      en: "Field documentation of the Celestia Dehir project site",
    },
    caption: {
      id: "Dokumentasi lapangan proyek Celestia Dehir.",
      en: "Field documentation of the Celestia Dehir project site.",
    },
  },
  {
    id: "dehir-doc-088",
    src: "/images/projects/dehir/gallery/088_IMG_0383.jpg",
    alt: {
      id: "Dokumentasi lapangan proyek Celestia Dehir",
      en: "Field documentation of the Celestia Dehir project site",
    },
    caption: {
      id: "Dokumentasi lapangan proyek Celestia Dehir.",
      en: "Field documentation of the Celestia Dehir project site.",
    },
  },
  {
    id: "dehir-doc-097",
    src: "/images/projects/dehir/gallery/097_IMG_0392.jpg",
    alt: {
      id: "Dokumentasi lapangan proyek Celestia Dehir",
      en: "Field documentation of the Celestia Dehir project site",
    },
    caption: {
      id: "Dokumentasi lapangan proyek Celestia Dehir.",
      en: "Field documentation of the Celestia Dehir project site.",
    },
  },
  {
    id: "dehir-doc-110",
    src: "/images/projects/dehir/gallery/110_IMG_0405.jpg",
    alt: {
      id: "Dokumentasi lapangan proyek Celestia Dehir",
      en: "Field documentation of the Celestia Dehir project site",
    },
    caption: {
      id: "Dokumentasi lapangan proyek Celestia Dehir.",
      en: "Field documentation of the Celestia Dehir project site.",
    },
  },
];

export function getProjectGalleryImages(slug: string, locale: string): ProjectGalleryImage[] {
  if (slug !== "dehir") return [];

  const lang = locale === "en" ? "en" : "id";
  return dehirGallery.map((photo) => ({
    id: photo.id,
    src: photo.src,
    alt: photo.alt[lang],
    caption: photo.caption[lang],
  }));
}
