# Requirements Document

## Introduction

Celestia adalah **Property Exploration & Marketing Website** milik PT Mitra Rahim Indonesia.
Website ini memungkinkan calon pembeli menjelajahi proyek properti, melihat informasi unit,
mengeksplorasi site plan interaktif, mengisi formulir minat, dan menghubungi tim marketing melalui WhatsApp.

Dokumen ini mendefinisikan persyaratan fungsional dan non-fungsional untuk **MVP (Minimum Viable Product)**
Celestia. MVP ini mencakup sembilan fitur utama: Homepage (dengan fungsi promosi), Katalog Proyek,
Eksplorasi Proyek, Katalog Unit, Detail Unit, Site Plan Interaktif, Formulir Minat, Kontak WhatsApp,
dan Dukungan Bilingual.

**Status proyek dalam MVP:**
- **Celestia Dehir** — proyek aktif; eksplorasi unit, formulir minat, dan CTA WhatsApp tersedia
- **Celestia Pabuaran** — ditampilkan dengan status "Coming Soon"; informasi detail belum tersedia

Website **bukan** platform transaksi. Tidak ada booking, pembayaran, login, atau operasi CRM
dalam lingkup MVP ini.

---

## Glossary

- **Website**: Sistem website Celestia secara keseluruhan
- **Pengunjung**: Pengguna akhir yang mengakses website Celestia
- **Proyek**: Proyek properti yang dipasarkan (Dehir atau Pabuaran)
- **Unit**: Satu unit properti atau kavling dalam suatu proyek
- **Site Plan**: Denah layout kavling/unit dalam suatu proyek (bukan peta lokasi geografis)
- **Peta Lokasi**: Peta geografis yang menunjukkan lokasi proyek di dunia nyata (Google Maps)
- **Katalog**: Halaman daftar yang menampilkan banyak proyek atau unit
- **CTA (Call-to-Action)**: Tombol atau tautan yang mengarahkan pengunjung ke langkah berikutnya
- **Locale**: Kode bahasa dan regional, misalnya `id` (Bahasa Indonesia) atau `en` (English)
- **Slug**: Identifier berbasis teks yang digunakan di URL, misalnya `dehir`, `pabuaran`
- **UnitCode**: Kode identifikasi unit yang unik **dalam satu proyek**. Dua proyek yang berbeda boleh memiliki `unitCode` yang sama; keunikan hanya dijamin dalam lingkup satu `projectId`. Catatan: contoh format `A-01`, `B-12` yang ada di type definition `property.ts` dan BR-06 belum dapat dipastikan apakah sama dengan format kode kavling di brosur Dehir (`A1`, `A2`, `B1`, `B5` tanpa tanda hubung). Penyederhanaan format ini menunggu konfirmasi perusahaan (P-20)
- **UnitStatus**: Status ketersediaan unit — `available` (tersedia), `process` (proses), `sold` (terjual), atau `unknown` (belum diketahui). Catatan: nilai `reserved` yang ada di type definition saat ini perlu diselaraskan dengan definisi ini pada Design Phase
- **Sidebar**: Panel navigasi kontekstual yang muncul di sisi kiri halaman eksplorasi, menampilkan daftar proyek atau unit yang relevan dengan halaman yang sedang dilihat
- **Halaman Eksplorasi**: Halaman utama penjelajahan properti yang menampilkan Sidebar di kiri, Google Maps di kanan, dan Site Plan di bawah peta
- **Data Terkonfirmasi**: Data yang sudah diverifikasi dan disetujui oleh perusahaan
- **Placeholder**: Konten pengganti sementara yang ditandai jelas sebagai belum final
- **WhatsApp_URL**: URL yang dibangun oleh fungsi `buildWhatsAppUrl()` dari `siteConfig`
- **siteConfig**: Objek konfigurasi global website yang menjadi sumber kebenaran tunggal
- **Dehir**: Proyek Celestia Jatiluhur (ProjectId: `"dehir"`) — **proyek aktif dalam MVP**; eksplorasi unit, formulir minat, dan CTA WhatsApp tersedia
- **Pabuaran**: Proyek Celestia Jatiranggon (ProjectId: `"pabuaran"`) — **Coming Soon dalam MVP**; hanya teaser yang ditampilkan, tidak ada data detail, unit, harga, atau site plan
- **Coming Soon**: Status proyek yang belum siap untuk eksplorasi penuh; ditampilkan sebagai teaser dengan informasi terbatas
- **Formulir Minat**: Form berbasis client-side yang mengumpulkan preferensi calon pembeli sebelum mengarahkan ke WhatsApp; tidak menyimpan data ke backend
- **Tipe Bangunan**: Pilihan tipe rumah pada formulir minat — Type 1 Lantai (LB 46, 3KT) atau Type 1 Lantai Promo (LB 30, 2KT), sesuai brosur Dehir
- **Kavling**: Unit tanah tanpa bangunan; kode kavling Dehir sesuai brosur: A1, A2, A3, A4, B1, B2, B3, B4, B5
- **Language_Switcher**: Komponen UI untuk berpindah antar bahasa yang tersedia
- **Reduced_Motion**: Preferensi aksesibilitas pengguna untuk mengurangi animasi gerak

---

## Ruang Lingkup MVP

### Termasuk dalam MVP

| Fitur | Kode |
|---|---|
| Homepage (dengan fungsi promosi) | A |
| Katalog Proyek | B |
| Eksplorasi Proyek (Dehir aktif, Pabuaran Coming Soon) | C |
| Katalog Unit | D |
| Detail Unit | E |
| Site Plan Interaktif | F |
| Formulir Minat Properti Dehir | G |
| Kontak WhatsApp | H |
| Dukungan Bilingual | I |

### Tidak Termasuk dalam MVP

- Login dan registrasi pengguna
- Pembayaran atau transaksi online
- Booking atau reservasi unit
- Sistem CRM atau dashboard internal
- Sistem negosiasi online
- Backend, database, atau API eksternal
- Update status unit secara real-time
- Konfigurator desain rumah atau fitur 3D
- Notifikasi push atau email

---

## Prinsip Data dan Konten

Prinsip berikut berlaku untuk seluruh persyaratan dalam dokumen ini:

1. **Jangan mengarang** harga, luas, dimensi, status unit, fasilitas, legalitas, jarak tempuh, alamat, atau foto/video/layout resmi
2. **Sumber kebenaran data**: Data harga, luas, dimensi, lokasi, dan status unit harus bersumber dari informasi yang dikonfirmasi perusahaan. Jangan mengasumsikan nilai yang belum dikonfirmasi
3. **Data terbagi menjadi tiga kategori**: (a) sudah diketahui dan terkonfirmasi, (b) placeholder untuk kebutuhan pengembangan, (c) menunggu konfirmasi perusahaan
4. **UI harus dapat menangani** kondisi data kosong, belum tersedia, atau belum terkonfirmasi tanpa error; sediakan status "Belum diketahui" sebagai nilai yang valid
5. **Harga, dimensi, dan status unit** hanya ditampilkan apabila nilainya sudah terkonfirmasi (bukan `null`, `undefined`, atau `unknown`)
6. **Foto dan media** hanya ditampilkan apabila aset resmi sudah tersedia; gunakan placeholder yang ditandai jelas jika belum ada
7. **Terjemahan** tidak boleh mengubah, menambah, atau menghilangkan klaim bisnis yang ada di bahasa sumber
8. **Perubahan data** dilakukan secara manual pada file data lokal terstruktur di `src/data/`; tidak ada mekanisme sinkronisasi otomatis dalam MVP

---

## Requirements

### Requirement 1: Homepage

**[Diperbarui — homepage berfungsi sebagai landing page promosi, bukan sekadar halaman navigasi]**

**User Story:** Sebagai pengunjung, saya ingin melihat halaman utama Celestia yang informatif dan menarik secara visual, sehingga saya memahami nilai produk Celestia dan terdorong untuk menjelajahi properti atau menghubungi marketing.

#### Acceptance Criteria

1. THE Website SHALL menampilkan nilai `siteConfig.name` ("Celestia") dan `siteConfig.tagline` pada bagian hero homepage sebagai teks yang dapat dibaca oleh mesin pencari
2. THE Website SHALL menampilkan seksi hero/banner promosi dengan informasi dan keunggulan proyek Dehir; WHERE aset foto atau video belum tersedia, THE Website SHALL menampilkan placeholder yang ditandai jelas
3. THE Website SHALL menampilkan daftar proyek unggulan; kartu proyek Dehir menampilkan `name`, `shortDescription`, serta `location.city` dan `location.province`; kartu proyek Pabuaran menampilkan badge "Coming Soon" tanpa menampilkan data detail yang belum dikonfirmasi
4. THE Website SHALL menyediakan area galeri foto proyek Dehir; WHERE aset foto belum tersedia, THE Website SHALL menampilkan placeholder bertanda jelas
5. THE Website SHALL menyediakan area untuk video atau GIF promosi; WHERE aset belum tersedia, THE Website SHALL menampilkan placeholder bertanda jelas; komponen harus dapat menerima aset foto, video, dan GIF tanpa mengubah alur halaman
6. WHEN pengunjung mengklik kartu proyek Dehir pada homepage, THE Website SHALL menavigasi pengunjung ke Halaman Eksplorasi Dehir
7. WHEN pengunjung mengklik kartu proyek Pabuaran pada homepage, THE Website SHALL menampilkan halaman atau modal teaser "Coming Soon" tanpa menampilkan data unit, harga, atau site plan
8. THE Website SHALL menyediakan CTA dengan tautan yang dapat diklik menuju Halaman Eksplorasi Dehir
9. THE Website SHALL menyediakan tombol CTA WhatsApp yang membuka `WhatsApp_URL` dari `siteConfig`, menggunakan pesan dalam bahasa sesuai locale aktif
10. IF tidak ada data proyek yang tersedia untuk ditampilkan, THEN THE Website SHALL menampilkan teks statis yang menginformasikan bahwa data proyek sedang dipersiapkan, tanpa melempar error atau menampilkan halaman kosong
11. THE Website SHALL menampilkan komponen navigasi utama yang sama (navbar) yang digunakan pada semua halaman website lainnya

### Requirement 2: Katalog Proyek

**[Diperbarui — Pabuaran ditampilkan dengan status "Coming Soon", bukan kartu proyek aktif]**

**User Story:** Sebagai pengunjung, saya ingin melihat daftar semua proyek properti yang tersedia, sehingga saya dapat mengetahui proyek yang aktif dan proyek yang akan datang.

#### Acceptance Criteria

1. THE Website SHALL menampilkan semua proyek yang memiliki nilai `id`, `name`, dan `slug` yang valid dalam halaman katalog proyek
2. THE Website SHALL menampilkan kartu proyek Dehir dengan `name`, `fullName`, `shortDescription` (maks. 150 karakter yang ditampilkan), serta `location.city` dan `location.province`
3. THE Website SHALL menampilkan kartu proyek Pabuaran dengan badge "Coming Soon" yang jelas; kartu tidak menampilkan data detail, harga, unit, atau lokasi spesifik yang belum dikonfirmasi
4. WHEN pengunjung mengklik kartu proyek Dehir, THE Website SHALL menavigasi pengunjung ke Halaman Eksplorasi Dehir
5. WHEN pengunjung mengklik kartu proyek Pabuaran, THE Website SHALL menampilkan teaser "Coming Soon" tanpa menampilkan data yang belum tersedia
6. IF hanya satu proyek aktif yang tersedia, THEN THE Website SHALL tetap menampilkan halaman katalog dengan satu kartu aktif dan kartu Coming Soon, tanpa error atau layout yang rusak
7. IF tidak ada proyek yang tersedia sama sekali, THEN THE Website SHALL menampilkan elemen teks yang secara eksplisit menyatakan bahwa belum ada proyek yang dapat ditampilkan saat ini
8. THE Website SHALL menampilkan jumlah proyek aktif di halaman katalog

### Requirement 3: Eksplorasi Proyek

**[Direvisi dari "Detail Proyek" — konsep halaman diperbarui untuk mencerminkan layout eksplorasi: Sidebar di kiri, Google Maps di kanan, Site Plan di bawah peta dalam satu halaman terintegrasi. Halaman eksplorasi penuh hanya tersedia untuk proyek aktif (Dehir). Pabuaran menampilkan halaman teaser Coming Soon]**

**User Story:** Sebagai pengunjung, saya ingin menjelajahi proyek properti secara visual dalam satu halaman — melihat lokasi di peta, mengeksplorasi denah kavling, dan memilih unit — sehingga saya dapat memahami proyek dan menemukan kavling yang sesuai tanpa berpindah-pindah halaman.

#### Acceptance Criteria

1. THE Website SHALL menampilkan `fullName`, `description`, serta `location.city` dan `location.province` proyek di bagian atas atau area konten utama halaman eksplorasi
2. THE Website SHALL menampilkan Sidebar di sisi kiri halaman eksplorasi yang memuat daftar proyek yang tersedia; proyek yang sedang dilihat ditandai sebagai aktif
3. WHEN pengunjung memilih proyek lain dari Sidebar, THE Website SHALL memperbarui konten halaman eksplorasi sesuai proyek yang dipilih tanpa meninggalkan pola layout yang sama
4. WHERE `location.coordinates` tersedia, THE Website SHALL menampilkan peta lokasi geografis proyek di sisi kanan menggunakan Google Maps atau alternatif embed yang tidak memerlukan API key berbayar; evaluasi opsi embed terlebih dahulu sebelum memutuskan pendekatan teknis
5. WHERE `location.googleMapsUrl` tersedia, THE Website SHALL menampilkan tautan "Lihat di Google Maps" yang membuka URL tersebut di tab baru dengan atribut `target="_blank" rel="noopener noreferrer"`
6. WHERE `location.coordinates` tidak tersedia, THE Website SHALL menampilkan teks `location.city` dan `location.province` sebagai pengganti peta tanpa menampilkan elemen peta yang rusak atau kosong
7. WHERE aset site plan resmi dan data posisi unit tersedia dan terkonfirmasi perusahaan, THE Website SHALL menampilkan Site Plan interaktif di bawah Google Maps pada halaman yang sama; jika belum tersedia, THE Website SHALL menampilkan UI placeholder dengan teks "Denah belum tersedia" — bukan ilustrasi visual yang menyerupai denah resmi atau menampilkan posisi unit fiktif
8. THE Website SHALL menampilkan ringkasan jumlah unit dalam proyek yang dikelompokkan berdasarkan status `available`, `process`, `sold`; unit dengan status `unknown` tidak dihitung dalam ringkasan ini
9. THE Website SHALL menyediakan CTA WhatsApp menggunakan `WhatsApp_URL` dari `siteConfig`; pesan WhatsApp harus menyertakan nilai `fullName` proyek dan ditulis dalam bahasa yang sesuai locale aktif
10. WHERE foto proyek tersedia, THE Website SHALL menampilkan galeri foto proyek
11. WHERE foto proyek tidak tersedia, THE Website SHALL menampilkan elemen placeholder dengan teks label yang secara eksplisit menyatakan bahwa foto sedang dipersiapkan (bukan gambar kosong atau broken image)
12. IF slug proyek tidak dikenali, THEN THE Website SHALL merespons dengan HTTP status 404 dan menampilkan halaman 404 dengan tautan navigasi kembali ke halaman utama
13. IF proyek memiliki status "Coming Soon" (seperti Pabuaran), THEN THE Website SHALL menampilkan halaman teaser yang hanya memuat nama proyek, status Coming Soon, dan CTA untuk mendapatkan informasi terbaru; THE Website SHALL NOT menampilkan data unit, harga, lokasi detail, atau site plan yang belum dikonfirmasi

### Requirement 4: Katalog Unit

**[Direvisi — alur eksplorasi unit kini dimulai dari Site Plan pada Halaman Eksplorasi (Req 3). Katalog Unit tetap ada sebagai daftar unit tekstual yang dapat diakses dari Sidebar atau tautan navigasi, namun bukan lagi satu-satunya titik masuk eksplorasi unit]**

**User Story:** Sebagai pengunjung, saya ingin melihat daftar unit yang tersedia dalam suatu proyek, sehingga saya dapat menelusuri pilihan unit secara tekstual dan menemukan unit yang sesuai.

#### Acceptance Criteria

1. THE Website SHALL menampilkan daftar unit yang memiliki `projectId` sesuai dengan proyek yang dipilih
2. THE Website SHALL menampilkan `unitCode`, `unitType`, dan `status` untuk setiap unit dalam daftar; unit dengan `status: "unknown"` ditampilkan dengan label teks "Belum Diketahui"
3. WHERE `landArea` unit sudah terkonfirmasi (bukan `undefined` atau `null`), THE Website SHALL menampilkan luas tanah tersebut
4. WHERE `price` unit sudah terkonfirmasi dan bukan `null` atau `undefined`, THE Website SHALL menampilkan harga unit tersebut menggunakan `formatRupiah()`
5. WHERE `price` unit bernilai `null` atau `undefined`, THE Website SHALL menampilkan teks "Hubungi Marketing" sebagai pengganti harga
6. WHEN pengunjung mengklik kartu unit, THE Website SHALL menavigasi pengunjung ke URL `/[locale]/projects/[slug]/units/[unitCode]` yang sesuai
7. THE Website SHALL menampilkan `fullName` proyek dan `location.city` pada header atau breadcrumb halaman katalog unit
8. IF tidak ada unit yang memiliki `projectId` sesuai proyek tersebut, THEN THE Website SHALL menampilkan elemen teks yang secara eksplisit menyatakan bahwa belum ada unit yang dapat ditampilkan
9. THE Website SHALL menampilkan seluruh daftar unit dalam satu halaman yang dapat di-scroll, tanpa memotong daftar secara diam-diam
10. Filter unit bukan prioritas MVP; THE Website tidak perlu menyediakan filter apabila daftar unit sudah mudah dipindai secara visual. WHERE jumlah unit dalam proyek sama dengan atau melebihi 10 unit DAN status unit bervariasi, THE Website MAY menyediakan filter berdasarkan nilai `status`

### Requirement 5: Detail Unit

**User Story:** Sebagai pengunjung, saya ingin melihat informasi lengkap tentang sebuah unit, sehingga saya dapat membuat keputusan apakah unit tersebut sesuai keinginan saya.

#### Acceptance Criteria

1. THE Website SHALL menampilkan `unitCode`, `unitType`, dan `fullName` proyek yang memiliki unit tersebut
2. WHERE `landArea` unit memiliki nilai numerik (bukan `undefined` atau `null`), THE Website SHALL menampilkan luas tanah dalam satuan m²
3. WHERE `dimensions` unit memiliki nilai (bukan `undefined`), THE Website SHALL menampilkan dimensi sebagai `{width} × {length} m`
4. WHERE `price` unit memiliki nilai numerik dan bukan `null`, THE Website SHALL menampilkan harga menggunakan fungsi `formatRupiah()` dari `@/lib/utils`
5. WHERE `price` unit bernilai `null` atau `undefined`, THE Website SHALL menampilkan teks ajakan untuk menghubungi marketing guna mendapatkan informasi harga, tanpa menampilkan angka atau estimasi
6. THE Website SHALL menampilkan status unit (`available`, `process`, `sold`) masing-masing dengan badge visual yang berbeda warna dan teks label yang berbeda
7. WHERE `status` unit adalah `unknown`, THE Website SHALL menampilkan badge berwarna abu-abu dengan teks "Belum Diketahui" yang sejajar secara visual dengan badge status lainnya, tanpa menyebutkan angka atau klaim ketersediaan
8. WHERE foto unit tersedia, THE Website SHALL menampilkan dokumentasi foto unit
9. WHERE foto unit tidak tersedia, THE Website SHALL menampilkan elemen placeholder dengan teks label eksplisit yang menyatakan foto belum tersedia, sesuai dengan BR-05
10. THE Website SHALL menyediakan tautan menuju halaman Site Plan proyek dengan parameter yang menyebabkan unit ini ter-highlight; IF unit tidak memiliki posisi pada site plan, THEN tautan tetap ditampilkan menuju halaman Site Plan tanpa parameter posisi
11. THE Website SHALL menyediakan CTA WhatsApp yang membuka URL WhatsApp di tab baru; pesan yang dikirim harus menyertakan `unitCode` dan `fullName` proyek dalam bahasa sesuai locale aktif
12. IF kombinasi `[slug]` proyek dan `[unitCode]` tidak dikenali dalam data, THEN THE Website SHALL merespons dengan HTTP status 404 dan menampilkan halaman 404 dengan tautan navigasi kembali ke halaman utama

### Requirement 6: Site Plan Interaktif

**[Direvisi — Site Plan ditampilkan di dalam Halaman Eksplorasi (Req 3), bukan halaman terpisah. Requirement ini mendeskripsikan perilaku interaktif Site Plan. Fitur ini hanya diterapkan jika denah resmi dan data posisi unit tersedia dan terkonfirmasi perusahaan]**

**User Story:** Sebagai pengunjung, saya ingin memilih kavling pada denah proyek secara interaktif, sehingga saya dapat memahami posisi unit dan langsung melihat detail serta menghubungi marketing.

#### Acceptance Criteria

1. THE Website SHALL menampilkan Site Plan sebagai gambaran layout kavling/unit dalam proyek, dengan label teks yang jelas membedakannya dari Peta Lokasi Google Maps; Site Plan menggunakan denah resmi yang disediakan perusahaan
2. WHEN pengunjung mengklik area unit pada Site Plan, THE Website SHALL menampilkan panel atau tooltip informasi ringkas unit tersebut yang mencakup `unitCode`, `unitType`, dan `status`
3. WHEN pengunjung memilih unit pada Site Plan, THE Website SHALL memberikan perubahan tampilan visual yang terukur (misalnya: perubahan warna border, opacity, atau ukuran) yang membedakan unit yang dipilih dari unit lainnya
4. THE Website SHALL menampilkan setiap unit dengan warna atau pola visual yang berbeda berdasarkan statusnya (`available`, `process`, `sold`, `unknown`), DAN menyertakan label teks status yang dapat dibaca di dalam atau di dekat setiap unit, sehingga status tidak hanya dibedakan oleh warna; skema warna dan visualisasi status ditentukan pada Design Phase
5. WHEN pengunjung mengklik unit pada Site Plan, THE Website SHALL menyediakan CTA WhatsApp dan tautan navigasi menuju halaman Detail Unit unit tersebut
6. WHERE kemampuan zoom dan pan diimplementasikan, THE Website SHALL memungkinkan pengunjung memperbesar area Site Plan dan menggeser tampilan; kontrol zoom/pan harus dapat dioperasikan via keyboard dan touch. Zoom dan pan bukan requirement wajib MVP — keputusan implementasi diserahkan ke Design Phase
7. WHERE pengunjung tiba di Halaman Eksplorasi melalui tautan dari halaman Detail Unit yang menyertakan parameter `unitCode`, THE Website SHALL langsung menampilkan panel informasi unit tersebut dalam keadaan ter-highlight tanpa interaksi tambahan
8. IF aset site plan resmi atau data posisi unit belum tersedia dan dikonfirmasi perusahaan, THEN THE Website SHALL menampilkan elemen UI placeholder dengan teks label yang secara eksplisit menyatakan "Denah belum tersedia" — bukan ilustrasi visual sementara yang menyerupai denah resmi. THE Website SHALL NOT menampilkan tata letak kavling fiktif, posisi unit yang dibuat-buat, atau gambar yang dapat dikira sebagai denah resmi
9. IF unit tidak memiliki posisi koordinat yang terdefinisi dalam data site plan, THEN THE Website SHALL menampilkan unit tersebut dalam daftar teks terpisah di bawah Site Plan, tanpa menempatkannya pada posisi palsu di denah
10. WHERE animasi atau transisi digunakan pada Site Plan (highlight, zoom, pan), THE Website SHALL menonaktifkan atau mengurangi animasi tersebut apabila preferensi `prefers-reduced-motion: reduce` terdeteksi

### Requirement 7: Kontak WhatsApp

**[Diperbarui — ditambahkan alur pesan dari Formulir Minat dan nomor dari brosur Dehir]**

**User Story:** Sebagai pengunjung yang tertarik dengan properti, saya ingin menghubungi tim marketing dengan mudah, sehingga saya dapat mendapatkan informasi lebih lanjut atau memulai proses konsultasi.

#### Acceptance Criteria

1. THE Website SHALL memastikan tidak ada nomor WhatsApp yang di-hardcode di luar `siteConfig`; nomor WhatsApp untuk proyek Dehir menggunakan nomor resmi yang tercantum di brosur Dehir dan disimpan di `siteConfig`
2. WHEN pengunjung mengklik CTA WhatsApp pada homepage, THE Website SHALL membuka URL WhatsApp di tab baru dengan pesan umum tentang Celestia dalam bahasa sesuai locale aktif
3. WHEN pengunjung mengklik CTA WhatsApp pada Halaman Eksplorasi Proyek, THE Website SHALL membuka URL WhatsApp di tab baru dengan pesan yang menyertakan `fullName` proyek, dalam bahasa sesuai locale aktif
4. WHEN pengunjung mengklik CTA WhatsApp pada halaman Detail Unit, THE Website SHALL membuka URL WhatsApp di tab baru dengan pesan yang menyertakan `unitCode` dan `fullName` proyek, dalam bahasa sesuai locale aktif
5. WHEN pengunjung menyelesaikan Formulir Minat dan mengklik tombol kirim, THE Website SHALL menyusun pesan WhatsApp berdasarkan jawaban formulir dengan format yang sudah ditentukan (lihat Req 13) dan membukanya di tab baru; field yang tidak diisi ditampilkan sebagai tanda `-`
6. THE Website SHALL memastikan semua tombol CTA WhatsApp membuka URL dengan atribut `target="_blank" rel="noopener noreferrer"` sehingga pengunjung tidak meninggalkan halaman website
7. THE Website SHALL menyediakan CTA WhatsApp langsung (tanpa formulir) di setiap halaman yang relevan, sebagai alternatif dari Formulir Minat
8. IF nilai nomor WhatsApp dalam `siteConfig` mengandung karakter `X` (menandakan placeholder yang belum dikonfirmasi), THEN THE Website SHALL menampilkan tombol CTA WhatsApp dalam kondisi dinonaktifkan secara visual (disabled state) DAN mencegah navigasi ketika tombol diklik

### Requirement 13: Formulir Minat Properti Dehir

**[Ditempatkan setelah Req 7 dan sebelum Req 8 untuk menjaga alur logis: Req 7 (WhatsApp) → Req 13 (Formulir yang mengarah ke WhatsApp) → Req 8 (Bilingual yang berlaku untuk semua]. Nomor ID 13 dipertahankan untuk konsistensi referensi silang yang sudah ada]**

**User Story:** Sebagai calon pembeli yang tertarik dengan Celestia Dehir, saya ingin mengisi preferensi properti saya sebelum menghubungi marketing, sehingga konsultasi saya lebih terarah dan marketing dapat menyiapkan informasi yang relevan.

#### Acceptance Criteria

1. THE Website SHALL menampilkan Formulir Minat yang hanya tersedia untuk proyek Dehir; formulir tidak ditampilkan untuk proyek Pabuaran yang berstatus Coming Soon
2. THE Website SHALL mewajibkan pengunjung memilih salah satu dari dua pilihan utama sebelum dapat melanjutkan: **Kavling saja** atau **Kavling + Bangunan**; ini adalah satu-satunya field yang wajib diisi
3. WHEN pengunjung memilih "Kavling saja", THE Website SHALL menampilkan pilihan kode kavling sebagai opsi tambahan yang tidak wajib; kode kavling yang tersedia sesuai brosur Dehir: A1, A2, A3, A4, B1, B2, B3, B4, B5
4. WHERE kode kavling ditampilkan, THE Website SHALL NOT menganggap seluruh kavling pasti tersedia; status kavling harus mengikuti data resmi perusahaan (P-08). Pemilihan kode kavling merupakan **preferensi awal calon pembeli**, bukan reservasi atau jaminan ketersediaan; pesan WhatsApp harus menyatakan bahwa kode kavling yang dipilih adalah preferensi, bukan pemesanan
5. WHEN pengunjung memilih "Kavling + Bangunan", THE Website SHALL menampilkan pilihan tipe bangunan dalam bentuk visual selection cards dengan tiga pilihan: **Type 1 Lantai** (LB 46, 3 kamar tidur), **Type 1 Lantai Promo** (LB 30, 2 kamar tidur), dan **Belum menentukan / ingin konsultasi**
6. WHERE visual selection cards tipe bangunan ditampilkan, THE Website SHALL menggunakan gambar dari brosur Dehir sebagai aset awal; WHERE aset gambar belum siap atau kualitas crop tidak memadai, THE Website SHALL menampilkan placeholder yang ditandai jelas; komponen harus dapat menerima penggantian aset gambar tanpa mengubah alur formulir
7. THE Website SHALL NOT menampilkan spesifikasi tipe bangunan yang tidak tercantum di brosur atau belum dikonfirmasi perusahaan
8. THE Website SHALL menyediakan pertanyaan tambahan yang semuanya bersifat opsional:
   - Tujuan penggunaan bangunan (rumah tinggal, office/kantor, atau lainnya)
   - Apakah ada kebutuhan modifikasi desain
   - Catatan atau kebutuhan khusus
   - Nama (opsional)
9. WHEN pengunjung mengklik tombol kirim pada formulir, THE Website SHALL menyusun pesan WhatsApp dengan format berikut dan membukanya di tab baru:
   ```
   Halo, saya tertarik dengan Celestia Dehir.
   Nama: [nama atau -]
   Jenis properti: [Kavling saja / Kavling + bangunan]
   Kode kavling: [jawaban atau -]
   Tipe bangunan: [pilihan atau -]
   Tujuan penggunaan: [jawaban atau -]
   Permintaan modifikasi: [jawaban atau -]
   Catatan: [jawaban atau -]
   Saya ingin mendapatkan informasi lebih lanjut dan berkonsultasi dengan marketing.
   Terima kasih.
   ```
10. THE Website SHALL menampilkan field yang tidak relevan dengan pilihan utama (misalnya kode kavling jika memilih Kavling + Bangunan) sebagai tanda `-` dalam pesan, bukan dihilangkan
11. THE Website SHALL NOT menyimpan data formulir ke server, database, atau layanan pihak ketiga; seluruh data hanya digunakan untuk menyusun pesan WhatsApp di sisi client
12. THE Website SHALL menyediakan CTA WhatsApp langsung (tanpa harus mengisi formulir) di area yang sama, sebagai alternatif bagi pengunjung yang tidak ingin mengisi formulir

---

### Requirement 8: Dukungan Bilingual

**User Story:** Sebagai pengunjung yang berbahasa Inggris, saya ingin mengakses website Celestia dalam bahasa Inggris, sehingga saya dapat memahami informasi properti tanpa hambatan bahasa.

#### Acceptance Criteria

1. THE Website SHALL mendukung dua locale: `id` (Bahasa Indonesia, default) dan `en` (English)
2. THE Website SHALL menggunakan routing berbasis locale dengan pola URL `/id/...` untuk Bahasa Indonesia dan `/en/...` untuk English; akses ke URL tanpa prefix locale diarahkan ke locale default `id`
3. THE Website SHALL menampilkan `Language_Switcher` yang menampilkan kedua opsi locale dan menandai locale yang sedang aktif
4. WHEN pengunjung menggunakan `Language_Switcher` dari halaman `/id/projects/dehir`, THE Website SHALL menavigasi ke `/en/projects/dehir` — mempertahankan seluruh segmen path dan query parameter yang sama, hanya mengganti prefix locale
5. THE Website SHALL menerapkan terjemahan pada seluruh teks antarmuka pengguna (label, tombol, navigasi, pesan error, empty state, placeholder); teks konten properti (nama proyek, deskripsi, nama unit) dapat diterjemahkan secara terpisah melalui data
6. THE Website SHALL menyertakan atribut `lang` pada elemen `<html>` dengan nilai yang sesuai locale aktif (`"id"` atau `"en"`) pada setiap halaman
7. THE Website SHALL menyertakan tag `<title>`, `<meta name="description">`, dan `<meta property="og:locale">` dalam bahasa yang sesuai locale aktif pada setiap halaman
8. WHERE halaman tersedia dalam kedua bahasa, THE Website SHALL menyertakan tag `<link rel="alternate" hreflang="...">` untuk locale `id`, `en`, dan `x-default` (merujuk ke versi `id`) pada setiap halaman
9. WHEN website membangun pesan WhatsApp, THE Website SHALL menggunakan teks pesan dalam bahasa yang sesuai locale aktif sesuai kriteria yang didefinisikan pada Requirement 7
10. IF locale pada URL tidak dikenali (bukan `id` atau `en`), THEN THE Website SHALL mengarahkan pengunjung ke URL yang setara dengan prefix `/id/` dan merespons dengan HTTP redirect, bukan error
11. THE Website SHALL menyimpan seluruh teks antarmuka pengguna dalam file terjemahan terpisah; tidak ada string teks UI yang di-hardcode langsung di dalam file komponen
12. THE Website SHALL memastikan setiap kalimat atau klaim yang ada di terjemahan `id` juga ada di terjemahan `en` dengan makna yang setara, dan sebaliknya; terjemahan tidak boleh menambah atau menghilangkan klaim bisnis


## Persyaratan Non-Fungsional

### Requirement 9: Responsivitas dan Mobile-First

**User Story:** Sebagai pengunjung yang mengakses website dari ponsel, saya ingin tampilan yang nyaman dan mudah digunakan, sehingga saya dapat menjelajahi properti tanpa hambatan.

#### Acceptance Criteria

1. THE Website SHALL menampilkan layout yang tidak menghasilkan horizontal scroll, tidak memotong konten, dan menggunakan ukuran font minimum 14px pada lebar layar 320px
2. THE Website SHALL mendefinisikan breakpoint terkecil terlebih dahulu dalam stylesheet (mobile-first) dan memperluas layout untuk layar yang lebih besar menggunakan media query `min-width`
3. WHILE pengunjung mengakses website dari perangkat sentuh, THE Website SHALL memastikan semua fungsi navigasi dan interaksi dapat dioperasikan melalui tap tanpa bergantung pada interaksi hover
4. THE Website SHALL memastikan ukuran area sentuh (tombol, tautan, kartu yang dapat diklik) minimum 44×44 piksel pada tampilan mobile
5. WHERE gambar atau media ditampilkan, THE Website SHALL menyertakan atribut `sizes` yang sesuai pada elemen `<img>` atau komponen `Image` Next.js, dan menggunakan format gambar modern (WebP atau AVIF) bila tersedia

### Requirement 10: Aksesibilitas

**User Story:** Sebagai pengunjung dengan keterbatasan aksesibilitas, saya ingin dapat mengakses seluruh konten website, sehingga saya memiliki pengalaman yang setara.

#### Acceptance Criteria

1. THE Website SHALL memastikan kontras warna teks memenuhi standar WCAG 2.1 Level AA: rasio kontras minimum 4.5:1 untuk teks normal, dan 3:1 untuk teks besar (≥18pt reguler atau ≥14pt bold)
2. THE Website SHALL menyediakan atribut `alt` yang deskriptif pada semua gambar informatif; gambar dekoratif SHALL menggunakan `alt=""` agar dapat diabaikan oleh screen reader
3. THE Website SHALL memastikan semua elemen interaktif (tombol, tautan, input) dapat dioperasikan menggunakan keyboard, dan indikator fokus keyboard terlihat dengan rasio kontras minimum 3:1 terhadap latar belakangnya
4. THE Website SHALL menggunakan elemen HTML semantik yang tepat: satu `<h1>` per halaman, hierarki heading yang logis, landmark elements (`<main>`, `<nav>`, `<header>`, `<footer>`), dan elemen form yang memiliki label
5. WHERE animasi atau transisi digunakan, THE Website SHALL menonaktifkan atau mengurangi animasi tersebut apabila preferensi `prefers-reduced-motion: reduce` terdeteksi
6. THE Website SHALL memastikan status unit pada site plan tidak hanya dibedakan dengan warna, melainkan juga dengan label teks yang dapat dibaca oleh screen reader

### Requirement 11: Performa

**User Story:** Sebagai pengunjung, saya ingin halaman website memuat dengan cepat, sehingga saya tidak perlu menunggu lama untuk mendapatkan informasi properti.

#### Acceptance Criteria

1. THE Website SHALL menggunakan Server Components sebagai default untuk semua halaman; direktif `"use client"` hanya ditambahkan pada komponen yang membutuhkan state browser, event handler, atau API browser
2. THE Website SHALL menggunakan komponen `Image` bawaan Next.js untuk semua gambar, dengan atribut `width`, `height`, `alt`, dan `sizes` yang tepat
3. THE Website SHALL me-pre-render semua halaman yang menggunakan data statis JSON pada waktu build; tidak ada halaman statis yang melakukan data fetching ulang per request
4. THE Website SHALL memastikan halaman utama menampilkan konten yang dapat dibaca tanpa JavaScript yang dieksekusi di browser (progressive enhancement)

### Requirement 12: SEO

**User Story:** Sebagai pemilik bisnis, saya ingin website Celestia mudah ditemukan melalui mesin pencari, sehingga calon pembeli dapat menemukan properti kami secara organik.

#### Acceptance Criteria

1. THE Website SHALL menyertakan tag `<title>` yang unik dan relevan, serta tag `<meta name="description">` dengan panjang maksimum 160 karakter, untuk setiap halaman
2. THE Website SHALL menyertakan Open Graph tags (`og:title`, `og:description`, `og:image`, `og:locale`) untuk setiap halaman
3. THE Website SHALL menggunakan URL yang deskriptif dan mudah dibaca berbasis slug proyek dan kode unit dengan prefix locale (`/id/projects/dehir`, `/en/projects/dehir/units/A-01`)
4. THE Website SHALL memastikan setiap halaman memiliki tepat satu `<h1>` dengan hierarki heading yang logis di bawahnya
5. THE Website SHALL menyertakan tag `<link rel="alternate" hreflang="...">` pada setiap halaman yang mencakup: self-referencing entry untuk locale aktif, reciprocal link ke versi bahasa lain, dan `x-default` yang merujuk ke versi Bahasa Indonesia
6. THE Website SHALL menghasilkan sitemap yang mencakup semua halaman publik dalam kedua bahasa; sitemap di-generate secara statis pada waktu build dari data JSON

---

## Aturan Bisnis

### BR-01: Sumber Kebenaran Nomor WhatsApp

Nomor WhatsApp untuk proyek Dehir menggunakan nomor resmi yang tercantum di brosur Dehir. Nomor ini disimpan di `siteConfig` dan digunakan oleh seluruh CTA WhatsApp di website. Tidak diperbolehkan ada nomor WhatsApp yang di-hardcode langsung di komponen atau halaman manapun di luar `siteConfig`.

### BR-09: Status Proyek — Aktif vs Coming Soon

Proyek **Dehir** berstatus aktif: eksplorasi unit, formulir minat, site plan, dan CTA WhatsApp tersedia. Proyek **Pabuaran** berstatus Coming Soon: hanya teaser yang ditampilkan. Jangan menampilkan data unit, harga, lokasi detail, atau site plan Pabuaran sebelum informasi resminya tersedia dan dikonfirmasi perusahaan. Fitur eksplorasi Pabuaran dapat diaktifkan setelah informasi resmi tersedia.

### BR-02: Integritas Data Properti

Data harga, luas, dimensi, status unit, fasilitas, dan informasi legalitas hanya boleh ditampilkan apabila sudah terkonfirmasi dari perusahaan. Jika data belum terkonfirmasi atau bernilai `null`/`unknown`, website harus menampilkan indikator yang jelas bahwa informasi tersebut belum tersedia, bukan menampilkan nilai palsu atau tebakan.

### BR-03: Pemisahan Site Plan dan Peta Lokasi

Site Plan (denah layout unit dalam kawasan proyek) dan Peta Lokasi (Google Maps untuk lokasi geografis) adalah dua hal yang berbeda dan tidak saling menggantikan. Keduanya harus ditampilkan pada konteks yang tepat dengan label yang jelas.

### BR-04: Integritas Terjemahan

Terjemahan konten dari Bahasa Indonesia ke English (atau sebaliknya) tidak boleh mengubah fakta, menambah klaim yang tidak ada di bahasa sumber, atau menghilangkan informasi penting. Keduanya harus menyampaikan pesan yang setara.

### BR-05: Penanganan Aset Belum Tersedia

Apabila aset resmi (foto proyek, foto unit, site plan resmi) belum tersedia, website harus menampilkan placeholder. Placeholder terbagi dalam dua jenis:
- **UI Placeholder**: elemen kosong dengan teks label yang menyatakan data belum tersedia (contoh: "Denah belum tersedia", "Foto sedang dipersiapkan") — digunakan untuk site plan dan media yang belum ada aset resminya
- **Ilustrasi Visual Sementara**: gambar pendukung yang ditandai jelas sebagai ilustrasi, bukan denah teknis resmi — digunakan untuk visual cards tipe bangunan di formulir minat jika crop brosur tidak memadai

Kedua jenis placeholder tidak boleh menampilkan denah, posisi unit, atau data fiktif yang dapat dikira sebagai informasi resmi perusahaan.

### BR-06: Konsistensi Identitas Unit

`unitCode` adalah identitas unit yang unik **dalam lingkup satu proyek** (`projectId`). Dua proyek yang berbeda boleh memiliki `unitCode` yang sama; keunikan tidak dijamin secara global di seluruh website. Oleh karena itu, lookup unit selalu dilakukan berdasarkan kombinasi `projectId` + `unitCode`, bukan `unitCode` saja. `unitCode` digunakan secara konsisten di seluruh website — pada katalog unit, detail unit, URL halaman, posisi di site plan, dan pesan WhatsApp. Catatan: format `unitCode` yang ada di type definition saat ini (`A-01`, `B-12` dengan tanda hubung) belum dapat dipastikan sama dengan format kode kavling di brosur Dehir (`A1`, `B5` tanpa tanda hubung). Penyederhanaan format menunggu konfirmasi perusahaan (P-20).

### BR-07: Batas Alur Konversi MVP

Alur konversi MVP adalah: **pilih proyek → eksplorasi lokasi & site plan → pilih unit → lihat detail → hubungi marketing melalui WhatsApp**. MVP tidak mencakup pemesanan resmi, penguncian unit, pembayaran, konfirmasi transaksi otomatis, atau proses administrasi apapun. Seluruh tindak lanjut setelah klik WhatsApp terjadi di luar sistem website.

### BR-08: Definisi Status Unit

Status unit menggunakan empat nilai dengan definisi berikut:
- **`available` (Tersedia)**: Unit dapat ditawarkan kepada calon pembeli
- **`process` (Proses)**: Unit sedang dalam proses penjualan atau administrasi
- **`sold` (Terjual)**: Unit sudah terjual
- **`unknown` (Belum Diketahui)**: Informasi status belum dikonfirmasi perusahaan

Skema warna dan visualisasi masing-masing status ditentukan pada Design Phase. Catatan: nilai `reserved` yang ada di type definition `property.ts` saat ini perlu diselaraskan dengan definisi ini — keputusan penyesuaian type dilakukan pada Design Phase.

---

## Empty State dan Kondisi Data Belum Tersedia

| Halaman / Komponen | Kondisi | Perilaku yang Diharapkan |
|---|---|---|
| Katalog Proyek | Tidak ada proyek aktif | Tampilkan pesan bahwa data sedang dipersiapkan |
| Katalog Proyek | Pabuaran Coming Soon | Tampilkan kartu dengan badge "Coming Soon"; tanpa data detail |
| Halaman Eksplorasi | Proyek berstatus Coming Soon | Tampilkan halaman teaser dengan nama proyek dan status Coming Soon saja |
| Halaman Eksplorasi | Slug tidak dikenali | Tampilkan halaman 404 |
| Halaman Eksplorasi | Foto belum tersedia | Tampilkan placeholder bertanda "ilustrasi sementara" |
| Halaman Eksplorasi | Koordinat/Maps belum tersedia | Tampilkan teks kota dan provinsi saja; tidak menampilkan elemen peta rusak |
| Katalog Unit | Tidak ada unit dalam proyek | Tampilkan pesan empty state informatif |
| Detail Unit | Harga belum terkonfirmasi | Tampilkan "Hubungi Marketing" |
| Detail Unit | Dimensi/luas belum tersedia | Jangan tampilkan baris data tersebut |
| Detail Unit | Status `unknown` | Tampilkan badge visual netral dengan teks "Belum Diketahui" |
| Detail Unit | Foto belum tersedia | Tampilkan placeholder bertanda "belum tersedia" |
| Detail Unit | UnitCode tidak dikenali dalam proyek tersebut | Tampilkan halaman 404 |
| Site Plan | Denah resmi atau data posisi unit belum tersedia | Tampilkan UI placeholder dengan teks "Denah belum tersedia"; jangan membuat denah fiktif atau ilustrasi yang menyerupai denah resmi |
| Site Plan | Unit tanpa posisi terdefinisi | Tampilkan dalam daftar teks terpisah, tanpa posisi palsu |
| Formulir Minat | Aset gambar tipe bangunan belum siap | Tampilkan placeholder bertanda jelas; formulir tetap dapat digunakan |
| Formulir Minat | Status kavling belum terkonfirmasi | Tampilkan kode kavling tanpa menyatakan ketersediaan; status mengikuti data resmi |
| WhatsApp CTA | Nomor belum dikonfirmasi | Render CTA disabled; klik tidak membuka WhatsApp |

---

## Pertanyaan Terbuka dan Keputusan yang Menunggu Konfirmasi

### Dari Perusahaan (PT Mitra Rahim Indonesia)

| # | Pertanyaan | Dampak pada MVP |
|---|---|---|
| P-01 | ~~Berapa nomor WhatsApp resmi untuk CTA?~~ | **Ditutup** — nomor WhatsApp Dehir diambil dari brosur resmi Dehir; perlu dipastikan nomor sudah dimasukkan ke `siteConfig` sebelum launch |
| P-02 | Apa tagline resmi Celestia? | Hero section homepage menggunakan tagline dari `siteConfig` |
| P-03 | Apa domain/URL produksi website? | Diperlukan untuk metadata SEO dan `siteConfig.url` |
| P-04 | Apakah aset foto proyek Dehir sudah tersedia? | Galeri foto pada Homepage dan Halaman Eksplorasi Dehir; gunakan placeholder jika belum ada |
| P-05 | Apakah foto unit tersedia untuk setiap unit Dehir? | Galeri foto pada Detail Unit; gunakan placeholder jika belum ada |
| P-06 | Apakah denah resmi (site plan) Dehir sudah tersedia beserta data posisi unit? | Site Plan Interaktif hanya diterapkan jika denah resmi tersedia; gunakan placeholder bertanda jelas jika belum |
| P-07 | Apakah data harga, luas, dan dimensi unit Dehir sudah terkonfirmasi? | Informasi ini tidak boleh ditampilkan sampai dikonfirmasi |
| P-08 | Apakah status setiap kavling/unit Dehir sudah tersedia dan terkonfirmasi? | Diperlukan untuk site plan, katalog, visualisasi status, dan validasi kode kavling di formulir |
| P-09 | Apakah perusahaan memiliki Google Maps API key, atau menggunakan embed? | **Keputusan teknis diserahkan ke Design Phase** — evaluasi opsi embed terlebih dahulu |
| P-10 | Apakah slug URL proyek perlu diterjemahkan untuk versi English? | Mempengaruhi struktur routing bilingual |
| P-11 | Apakah ada fasilitas proyek (amenities) yang ingin ditampilkan untuk Dehir? | Konten Halaman Eksplorasi dan Homepage |
| P-12 | Apakah ada informasi legalitas/perizinan yang dapat ditampilkan? | Konten Halaman Eksplorasi; hanya tampilkan jika sudah terverifikasi |
| P-13 | ~~Apakah sidebar kontekstual adalah requirement wajib MVP?~~ | **Ditutup** — sidebar adalah bagian dari konsep MVP |
| P-14 | ~~Apakah Google Maps dan Site Plan tampil di halaman yang sama?~~ | **Ditutup** — ya, dalam satu Halaman Eksplorasi |
| P-15 | ~~Apakah "halaman lokasi" adalah konsep baru atau nama lain Detail Proyek?~~ | **Ditutup** — disebut Halaman Eksplorasi |
| P-16 | Berapa estimasi jumlah unit/kavling di proyek Dehir? | Menentukan kompleksitas site plan dan relevansi filter unit |
| P-17 | Apakah aset gambar tipe bangunan dari brosur Dehir tersedia dalam format yang dapat di-crop? | Diperlukan untuk visual selection cards di Formulir Minat; gunakan placeholder jika belum siap |
| P-18 | Apakah video atau GIF promosi Dehir tersedia untuk ditampilkan di homepage? | Komponen video/GIF di homepage; gunakan placeholder jika belum tersedia |
| P-19 | Apakah informasi Pabuaran (lokasi, unit, harga) sudah memiliki jadwal konfirmasi? | Menentukan kapan fitur eksplorasi Pabuaran dapat diaktifkan |
| P-20 | Apakah format kode kavling di brosur Dehir (A1, B5 tanpa tanda hubung) sama dengan format `unitCode` di type definition (A-01, B-12 dengan tanda hubung)? | Menentukan apakah type definition perlu disesuaikan atau format brosur yang digunakan sebagai standar |

### Asumsi yang Digunakan

| # | Asumsi | Berlaku Sampai |
|---|---|---|
| A-01 | Data proyek Dehir dan Pabuaran sudah cukup untuk ditampilkan (nama, deskripsi, lokasi kota/provinsi) | Dikonfirmasi dari file `project.ts` yang ada |
| A-02 | `siteConfig.supportedLocales` = `["id", "en"]` dan `defaultLocale` = `"id"` | Dikonfirmasi dari file `site.ts` yang ada |
| A-03 | Routing bilingual menggunakan pola `/[locale]/...` | Sesuai dengan rencana struktur folder di `PROJECT-STRUCTURE.md` |
| A-04 | Data properti disimpan sebagai file JSON statis di `src/data/` | Sesuai dengan keputusan arsitektur di `ARCHITECTURE.md` |
| A-05 | Filter pada katalog unit bukan prioritas MVP; tidak wajib jika daftar unit mudah dipindai | Keputusan produk dari Scope Finalization |
| A-06 | Sidebar menampilkan daftar proyek yang tersedia; routing dan struktur URL final diputuskan pada Design Phase | Keputusan konsep dari Scope Finalization |
| A-07 | Google Maps ditampilkan menggunakan opsi embed; keputusan penggunaan API key atau alternatif lain diserahkan ke Design Phase | Keputusan konsep dari Scope Finalization |
| A-08 | Kode kavling Dehir yang tercantum di brosur (A1–A4, B1–B5) digunakan sebagai pilihan di Formulir Minat; status ketersediaan masing-masing kavling tetap menunggu konfirmasi (P-08) | Berdasarkan brosur Dehir yang tersedia |
| A-09 | Tipe bangunan yang tersedia untuk Dehir: Type 1 Lantai (LB 46, 3KT) dan Type 1 Lantai Promo (LB 30, 2KT) sesuai brosur; tidak ada tipe lain yang ditambahkan tanpa konfirmasi | Berdasarkan brosur Dehir yang tersedia |
| A-10 | Formulir Minat hanya untuk Dehir selama Pabuaran berstatus Coming Soon | Keputusan produk dari Update Requirements |

---

## Fakta yang Sudah Diketahui (Tidak Perlu Konfirmasi Ulang)

- Nama perusahaan: PT Mitra Rahim Indonesia
- Nama website: Celestia
- **Dehir (Celestia Jatiluhur)** — proyek aktif dalam MVP; eksplorasi, formulir minat, dan WhatsApp tersedia
- **Pabuaran (Celestia Jatiranggon)** — Coming Soon dalam MVP; hanya teaser yang ditampilkan
- Kode kavling Dehir dari brosur: A1, A2, A3, A4, B1, B2, B3, B4, B5
- Tipe bangunan Dehir dari brosur: Type 1 Lantai (LB 46, 3KT) dan Type 1 Lantai Promo (LB 30, 2KT)
- Nomor WhatsApp marketing Dehir tersedia di brosur Dehir (perlu dimasukkan ke `siteConfig` sebelum launch)
- Tech stack: Next.js 16 App Router, React 19, TypeScript 5 strict, Tailwind CSS v4
- Locale yang didukung: `id` (Bahasa Indonesia, default) dan `en` (English)
- Type definitions: `Project`, `ProjectId`, `PropertyUnit`, `UnitStatus`, `siteConfig` sudah ada
- Utility functions: `buildWhatsAppUrl()`, `formatRupiah()`, `formatArea()`, `cn()` sudah ada
- Arah visual: Modern Residential + Property Explorer — clean, modern, sage green, rounded cards
- Server Components sebagai default; `"use client"` hanya jika diperlukan
- Konsep navigasi MVP: navbar atas + sidebar kontekstual + Halaman Eksplorasi (Maps + Site Plan)
- Alur konversi MVP: pilih proyek → eksplorasi lokasi & site plan → pilih unit → lihat detail → hubungi marketing via WhatsApp

---

## Kriteria Penerimaan MVP

Website Celestia dianggap siap sebagai MVP apabila memenuhi seluruh kriteria berikut:

1. **Dehir aktif dan dapat dieksplorasi** — halaman eksplorasi Dehir menampilkan informasi proyek, peta lokasi, dan site plan (atau placeholder bertanda jelas jika aset belum tersedia)
2. **Pabuaran tampil sebagai Coming Soon** — kartu dan halaman Pabuaran menampilkan status Coming Soon tanpa data yang belum dikonfirmasi
3. **Site Plan menggunakan denah resmi** yang disediakan perusahaan, bukan ilustrasi fiktif; jika belum tersedia, placeholder ditandai jelas
4. **Unit yang ditampilkan sesuai data** yang telah dikonfirmasi perusahaan — tidak ada data yang dikarang
5. **Status unit dapat dibedakan** secara visual dan tekstual: Tersedia, Proses, Terjual, dan Belum Diketahui
6. **Pengunjung dapat memilih unit** dari Site Plan dan melihat informasi detail yang sesuai
7. **Formulir Minat Dehir berfungsi** — pilihan jenis properti, kode kavling, dan tipe bangunan tersedia; pesan WhatsApp tersusun dengan benar sesuai pilihan pengunjung
8. **Pengunjung dapat menghubungi marketing** melalui WhatsApp dari setiap halaman yang relevan, baik via formulir maupun CTA langsung
9. **Semua halaman dapat diakses** dalam Bahasa Indonesia dan English
10. **Tidak ada data palsu** yang ditampilkan — placeholder selalu ditandai jelas sebagai sementara
