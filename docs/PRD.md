# Product Requirement Document (PRD)

# Buku Usaha Ibu

## Aplikasi Manajemen Home Industry Brambang Goreng & Supplier Rumah Makan

**Versi:** 1.0\
**Tanggal:** Oktober 2026

------------------------------------------------------------------------

## Daftar Isi

1.  [Overview](#1-overview)
2.  [Requirements](#2-requirements)
3.  [Core Features](#3-core-features)
4.  [User Flow](#4-user-flow)
5.  [Architecture](#5-architecture)
6.  [Design & Technical Constraints](#6-design--technical-constraints)
7.  [Entity Relationship Diagram
    (ERD)](#7-entity-relationship-diagram-erd)
8.  [Development Phases](#8-development-phases)
9.  [Catatan Risiko & Mitigasi](#9-catatan-risiko--mitigasi)

------------------------------------------------------------------------

# 1. Overview

## 1.1 Latar Belakang

Ibu dari pemilik produk menjalankan dua usaha sekaligus: home industry
brambang goreng (bawang goreng) dan supplier bahan makanan pokok untuk
beberapa rumah makan langganan.

Kedua usaha ini dikelola secara manual --- pencatatan mengandalkan
ingatan dan chat WhatsApp, tanpa sistem pencatatan yang terstruktur.
Akibatnya sering terjadi:

-   Lupa jumlah bawang yang disetor ke tiap karyawan pengupas, sehingga
    perhitungan upah mingguan tidak akurat.
-   Kwitansi untuk rumah makan ditulis tangan dan sering dirapel
    (digabung beberapa hari sekaligus), menyebabkan kebingungan soal apa
    saja yang sudah dikirim dan ditagihkan.
-   Tidak ada catatan piutang yang jelas --- pembayaran dari rumah makan
    tidak menentu waktunya (langsung atau beberapa hari kemudian).

## 1.2 Tujuan Produk

Membangun aplikasi pencatatan digital yang:

1.  Mengurangi beban mengingat dan mencatat manual bagi pengguna utama
    (ibu pemilik usaha).
2.  Menyediakan perhitungan otomatis (upah karyawan, total tagihan, sisa
    piutang).
3.  Menghasilkan kwitansi yang rapi dan bisa langsung dibagikan ke rumah
    makan.
4.  Menjadi satu aplikasi terpadu untuk dua lini usaha yang berbeda,
    bukan dua aplikasi terpisah.
5.  (Tujuan sekunder) Menjadi portofolio pengembangan untuk pembuatnya,
    seorang fullstack programmer.

## 1.3 Target Pengguna

-   **Pengguna utama:** Ibu pemilik usaha --- pengguna lanjut usia,
    tidak terbiasa dengan aplikasi kompleks, perlu antarmuka yang
    sederhana, kontras tinggi, dan tombol besar.
-   **Pengguna sekunder:** Anak pemilik usaha (developer aplikasi) ---
    berperan memantau data dan melakukan maintenance teknis.
-   Tidak ada rencana akses untuk karyawan (pengupas/pengiris) atau
    pihak rumah makan secara langsung pada versi ini.

## 1.4 Problem Statement

> Ibu kesulitan mencatat transaksi harian dari dua usaha yang kompleks
> alurnya, sehingga sering terjadi kesalahan hitung upah karyawan dan
> kebingungan soal piutang rumah makan yang belum dibayar.

------------------------------------------------------------------------

# 2. Requirements

## 2.1 Functional Requirements

  -----------------------------------------------------------------------
  ID                                  Requirement
  ----------------------------------- -----------------------------------
  FR-1                                Sistem dapat mencatat data karyawan
                                      (pengupas & pengiris) beserta
                                      status aktif/nonaktif.

  FR-2                                Sistem dapat mencatat riwayat
                                      perubahan harga upah per kg (kupas
                                      & iris) dengan tanggal berlaku.

  FR-3                                Sistem dapat mencatat setoran
                                      bawang mentah harian per pengupas.

  FR-4                                Sistem dapat mencatat hasil
                                      timbangan kupasan sore, terhubung
                                      ke setoran pagi terkait.

  FR-5                                Sistem dapat mencatat hasil irisan
                                      per pengiris, terhubung ke hasil
                                      timbangan.

  FR-6                                Sistem dapat menghitung otomatis
                                      rekap upah mingguan per karyawan
                                      berdasarkan kg × tarif berlaku.

  FR-7                                Sistem dapat menandai status
                                      pembayaran upah (lunas/belum) per
                                      karyawan per minggu.

  FR-8                                Sistem dapat mencatat data rumah
                                      makan pelanggan.

  FR-9                                Sistem dapat mencatat pesanan dari
                                      rumah makan dengan banyak item
                                      sekaligus dalam satu pesanan.

  FR-10                               Sistem dapat membedakan pesanan
                                      biasa (malam) dan pesanan dadakan
                                      (siang/sore).

  FR-11                               Sistem dapat mencatat realisasi
                                      belanja: qty aktual dibeli, harga
                                      beli, dan harga jual per item
                                      (diinput manual tiap transaksi).

  FR-12                               Sistem dapat menghasilkan kwitansi
                                      otomatis per pesanan yang bisa
                                      dibagikan via WhatsApp atau diunduh
                                      sebagai gambar.

  FR-13                               Sistem dapat mencatat pembayaran
                                      dari rumah makan, termasuk
                                      pembayaran sebagian (cicilan).

  FR-14                               Sistem dapat menampilkan kartu
                                      piutang per rumah makan dengan
                                      saldo berjalan.

  FR-15                               Sistem menyediakan dashboard harian
                                      yang merangkum tugas yang masih
                                      tertunda di kedua modul.

  FR-16                               Data tersimpan secara permanen di
                                      database cloud (bukan hanya di satu
                                      perangkat).
  -----------------------------------------------------------------------

## 2.2 Non-Functional Requirements

  -----------------------------------------------------------------------
  ID                                  Requirement
  ----------------------------------- -----------------------------------
  NFR-1                               **Usability** --- antarmuka harus
                                      mudah dipahami pengguna lanjut
                                      usia: teks besar, kontras tinggi,
                                      navigasi sederhana, minim langkah
                                      per aksi.

  NFR-2                               **Installability** --- aplikasi
                                      dapat diinstal ke homescreen HP
                                      sebagai PWA tanpa perlu app store.

  NFR-3                               **Performance** --- aplikasi tetap
                                      ringan dan responsif di perangkat
                                      HP kelas menengah.

  NFR-4                               **Cost** --- biaya operasional
                                      Rp0/bulan pada skala pemakaian saat
                                      ini (tier gratis Supabase &
                                      hosting).

  NFR-5                               **Security** --- akses data
                                      dibatasi lewat Row Level Security
                                      sebelum aplikasi digunakan secara
                                      publik/online.

  NFR-6                               **Maintainability** --- basis kode
                                      menggunakan pola React yang umum,
                                      terstruktur per modul, agar mudah
                                      dikembangkan lebih lanjut.

  NFR-7                               **Portability kode** --- source
                                      code dapat dibuka, diedit, dan
                                      dikembangkan lebih lanjut di VS
                                      Code secara lokal, serta dikelola
                                      lewat version control (Git/GitHub).
  -----------------------------------------------------------------------

## 2.3 Out of Scope (versi ini)

-   Login multi-user / autentikasi untuk karyawan atau rumah makan.
-   Laporan keuangan gabungan lintas dua usaha.
-   Notifikasi push otomatis.
-   Backup otomatis ke layanan eksternal (Google Drive, dsb.).

------------------------------------------------------------------------

# 3. Core Features

## 3.1 Modul Brambang Goreng

-   **Manajemen Karyawan** --- tambah/nonaktifkan karyawan, klasifikasi
    peran (pengupas/pengiris).
-   **Manajemen Harga** --- atur tarif upah per kg kupas & iris, riwayat
    harga tersimpan (tidak menghapus data lama saat harga berubah).
-   **Input Setor Pagi** --- catat jumlah bawang mentah yang disetor ke
    tiap pengupas.
-   **Input Timbang Sore** --- catat hasil kupasan setelah ditimbang
    ulang, terhubung ke setoran terkait.
-   **Input Iris** --- catat hasil irisan per pengiris, terhubung ke
    hasil timbangan.
-   **Rekap Mingguan** --- kalkulasi otomatis total kg × tarif per
    karyawan per minggu, dengan navigasi antar-minggu dan tombol tandai
    lunas.
-   **Dashboard Beranda** --- ringkasan status harian (apa yang masih
    perlu ditimbang/diiris) dan ringkasan minggu berjalan.

## 3.2 Modul Supplier Rumah Makan

-   **Manajemen Rumah Makan** --- tambah/nonaktifkan data rumah makan
    pelanggan.
-   **Input Pesanan** --- catat pesanan dengan banyak item sekaligus
    (nama bahan, qty, satuan), dengan penanda pesanan biasa/dadakan.
-   **Realisasi Belanja** --- per item: input qty aktual dibeli, harga
    beli, dan harga jual (manual, karena harga jual bervariasi tiap
    transaksi), dengan catatan opsional untuk alasan selisih qty.
-   **Generate Kwitansi** --- otomatis tersusun dari data realisasi, per
    pesanan (tidak dirapel), dengan opsi "Bagikan ke WhatsApp" dan
    "Simpan sebagai Gambar".
-   **Pencatatan Piutang & Pembayaran** --- kartu piutang per rumah
    makan, dapat mencatat pembayaran penuh atau sebagian.
-   **Dashboard Beranda** --- ringkasan pesanan belum direalisasi dan
    total piutang berjalan.

## 3.3 Fitur Lintas Modul

-   **Navigasi Modul** --- satu aplikasi, dua modul dipilih lewat
    segmented switcher di bagian atas.
-   **Desain Adaptif Lansia** --- tipografi besar, warna kontras tinggi,
    tombol besar, alur input mengikuti urutan kerja nyata.

------------------------------------------------------------------------

# 4. User Flow

## 4.1 Alur Kerja Brambang Goreng

1.  **Pagi** --- Ibu menyetorkan bawang mentah ke rumah masing-masing
    pengupas (jumlah berbeda-beda) → dicatat di Setor Pagi.
2.  **Sore** --- Ibu mengambil hasil kupasan, ditimbang ulang → dicatat
    di Timbang Sore (terhubung ke setoran pagi).
3.  **Setelah ditimbang** --- Pengiris mengiris sejumlah kupasan yang
    sudah ditimbang → dicatat di Iris.
4.  **Mingguan** --- Ibu membuka Rekap, sistem otomatis menghitung total
    upah per karyawan berdasarkan kg × tarif berlaku, lalu ditandai
    lunas setelah dibayarkan.

## 4.2 Alur Kerja Supplier Rumah Makan

1.  **Malam** --- Rumah makan mengirim chat pesanan → Ibu mencatat di
    Pesanan (banyak item sekaligus).
2.  **Subuh** --- Ibu belanja ke pasar/Superindo, qty yang dibeli bisa
    berbeda dari pesanan (kondisi pasar) → dicatat di Realisasi beserta
    harga beli & harga jual.
3.  **Setelah realisasi** --- Sistem otomatis membuat Kwitansi,
    dibagikan ke rumah makan via WhatsApp saat pengiriman jam 7--9 pagi.
4.  **Siang/Sore (kondisional)** --- Jika ada pesanan dadakan, dicatat
    sebagai pesanan baru dengan penanda "Dadakan", mengikuti alur yang
    sama.
5.  **Pembayaran** --- Dicatat kapan pun rumah makan membayar (langsung
    atau beberapa hari kemudian, penuh atau sebagian) di menu Piutang.

------------------------------------------------------------------------

# 5. Architecture

## 5.1 Gambaran Umum

Aplikasi dibangun sebagai Single Page Application (SPA) berbasis React,
dengan backend-as-a-service Supabase (PostgreSQL) untuk penyimpanan
data. Arsitektur dipilih agar development cepat, berbiaya rendah, dan
tetap bisa diinstal sebagai PWA di HP pengguna.

``` mermaid
flowchart TD
    A["Browser / PWA di HP Ibu"] --> B["React App (Vite)<br/>Komponen per modul: Brambang Goreng dan Supplier"]
    B -->|"@supabase/supabase-js<br/>anon / publishable key"| C["Supabase"]
    C --> D["PostgreSQL Database"]
    C --> E["Auto-generated REST API"]
```

## 5.2 Tech Stack

  -----------------------------------------------------------------------
  Layer                   Teknologi               Alasan
  ----------------------- ----------------------- -----------------------
  Frontend Framework      React 18 + Vite         Cepat dikembangkan,
                                                  jadi portofolio,
                                                  ekosistem luas.

  Styling                 CSS murni dengan custom Ringan, tidak menambah
                          properties (design      kompleksitas build.
                          tokens)                 

  Ikon                    lucide-react            Ikon modern, ringan,
                                                  konsisten.

  Export Kwitansi         html2canvas             Konversi elemen HTML
                                                  kwitansi menjadi gambar
                                                  PNG.

  Database                Supabase (PostgreSQL)   Gratis untuk skala
                                                  pemakaian ini,
                                                  relational (cocok untuk
                                                  data yang saling
                                                  terhubung).

  Hosting (rencana)       Vercel / Netlify        Gratis, auto-deploy
                                                  dari GitHub.

  Version Control         Git + GitHub            Riwayat perubahan kode,
                                                  dasar untuk
                                                  auto-deploy.

  Local Dev Tooling       VS Code + Node.js/npm   Lingkungan kerja utama
                                                  pengembang.
  -----------------------------------------------------------------------

## 5.3 Alur Data

-   Setiap modul memakai custom hook `useTable()` yang membungkus query
    Supabase (`select`, `insert`, `update`, `delete`) sehingga komponen
    React cukup memanggil fungsi sederhana tanpa menulis ulang query
    setiap saat.
-   Perubahan data memicu `refresh()` yang mengambil ulang data terbaru
    dari Supabase, memastikan tampilan selalu sinkron dengan database.
-   Koneksi ke Supabase memakai environment variable
    (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) yang disimpan di
    file `.env` lokal (tidak ikut ter-commit ke Git).

------------------------------------------------------------------------

# 6. Design & Technical Constraints

## 6.1 Prinsip Desain

-   **Elderly-first usability** --- prioritas utama tetap pada
    keterbacaan dan kemudahan pakai untuk ibu, bukan semata estetika
    modern.
-   **Broken-white background (`#FAFAF8`) dengan teks gelap kontras
    tinggi (`#1C1C1E`)** --- menggantikan tema "kertas" hangat pada
    versi prototipe awal.
-   **Glassmorphism terbatas** --- efek kaca/transparan
    (`backdrop-blur`) hanya dipakai pada elemen struktural (header,
    module switcher, bottom nav), sedangkan kartu data tetap solid demi
    keterbacaan.
-   **Bottom navigation berbentuk pill mengambang** --- item aktif
    melebar menampilkan ikon + label dengan animasi halus; item lain
    hanya menampilkan ikon.
-   **Identitas warna per modul** --- oranye hangat (`#E08A3E`) untuk
    Brambang Goreng, hijau segar (`#2F9E6E`) untuk Supplier, agar kedua
    modul mudah dibedakan sekilas.
-   **Tipografi** --- satu keluarga font, Plus Jakarta Sans, dipilih
    karena humanis dan mudah dibaca di berbagai ukuran.

## 6.2 Batasan Teknis

-   **Supabase Free Tier:** maksimum 500 MB database, project otomatis
    pause setelah 7 hari tanpa aktivitas (risiko rendah karena aplikasi
    dipakai harian).
-   **Row Level Security (RLS)** belum diaktifkan pada tahap development
    saat ini --- ditargetkan diaktifkan sebelum aplikasi digunakan
    secara rutin/online, mengingat key Supabase tertanam di kode
    frontend yang bisa dilihat publik.
-   Tidak ada sistem autentikasi pada versi ini --- akses aplikasi
    mengandalkan kerahasiaan URL deployment, bukan login.
-   `html2canvas` dipakai untuk ekspor kwitansi ke gambar ---
    keterbatasan: elemen dengan styling CSS kompleks (misal gradient
    tertentu) kadang tidak ter-render sempurna di gambar hasil ekspor.
-   Deployment publik memerlukan proses build (`npm run build`) dan
    hosting terpisah (Vercel/Netlify) --- berbeda dari versi prototipe
    awal berbasis HTML tunggal yang bisa langsung dipublikasikan sebagai
    satu link.

------------------------------------------------------------------------

# 7. Entity Relationship Diagram (ERD)

``` mermaid
erDiagram
    KARYAWAN ||--o{ SETORAN : "melakukan (pengupas)"
    KARYAWAN ||--o{ IRISAN : "melakukan (pengiris)"
    KARYAWAN ||--o{ PEMBAYARAN_BG : "menerima"
    SETORAN ||--o| TIMBANGAN : "ditimbang menjadi"
    TIMBANGAN ||--o{ IRISAN : "diiris menjadi"
    RUMAH_MAKAN ||--o{ PESANAN : "membuat"
    PESANAN ||--o{ ITEM_PESANAN : "berisi"
    PESANAN ||--o{ PEMBAYARAN_SR : "dibayar melalui"

    KARYAWAN {
        bigint id PK
        text nama
        text peran
        boolean aktif
    }

    HARGA {
        bigint id PK
        numeric kupas
        numeric iris
        date mulai
    }

    SETORAN {
        bigint id PK
        date tanggal
        bigint karyawan_id FK
        numeric qty
    }

    TIMBANGAN {
        bigint id PK
        bigint setoran_id FK
        date tanggal
        numeric qty
    }

    IRISAN {
        bigint id PK
        bigint timbangan_id FK
        bigint karyawan_id FK
        date tanggal
        numeric qty
    }

    PEMBAYARAN_BG {
        bigint id PK
        bigint karyawan_id FK
        date minggu_mulai
        date tanggal_bayar
    }

    RUMAH_MAKAN {
        bigint id PK
        text nama
        text kontak
        boolean aktif
    }

    PESANAN {
        bigint id PK
        bigint rumah_makan_id FK
        date tanggal
        boolean dadakan
        text status
    }

    ITEM_PESANAN {
        bigint id PK
        bigint pesanan_id FK
        text nama
        text satuan
        numeric qty_pesan
        numeric qty_beli
        numeric harga_beli
        numeric harga_jual
        text catatan
    }

    PEMBAYARAN_SR {
        bigint id PK
        bigint pesanan_id FK
        date tanggal
        numeric jumlah
    }
```

## Catatan relasi penting

-   **HARGA** tidak berelasi langsung ke tabel lain --- sistem selalu
    mengambil baris dengan `mulai` (tanggal berlaku) terbaru sebagai
    tarif aktif saat kalkulasi rekap.
-   **PEMBAYARAN_BG** memakai kombinasi unik (`karyawan_id`,
    `minggu_mulai`) --- satu baris merepresentasikan satu minggu gajian
    yang sudah lunas untuk karyawan tersebut.
-   **ITEM_PESANAN.qty_beli**, `harga_beli`, dan `harga_jual` bernilai
    `null` saat status pesanan masih `dipesan`, dan baru diisi saat
    tahap Realisasi.

------------------------------------------------------------------------

# 8. Development Phases

  ------------------------------------------------------------------------------
  Fase                    Deskripsi                      Status
  ----------------------- ------------------------------ -----------------------
  Fase 1 --- Prototipe    Prototipe HTML/JS tunggal      ✅ Selesai
  Modul Brambang Goreng   (localStorage), fitur dasar    
                          setor--timbang--iris--rekap,   
                          diuji langsung di HP ibu.      

  Fase 2 --- Penggabungan Restrukturisasi jadi satu      ✅ Selesai
  Dua Modul               aplikasi dengan navigasi dua   
                          modul (Brambang Goreng &       
                          Supplier Rumah Makan) dalam    
                          satu file HTML.                

  Fase 3 --- Rewrite ke   Migrasi basis kode ke React    ✅ Selesai
  React + Redesain UI     (Vite), redesain tampilan      
                          (broken-white, glassmorphism,  
                          pill bottom nav), disiapkan    
                          sebagai proyek portofolio.     

  Fase 4 --- Integrasi    Pembuatan skema database,      ✅ Selesai
  Supabase                migrasi dari localStorage ke   
                          Supabase (hook `useTable()`),  
                          pengujian penuh kedua modul.   

  Fase 5 --- Keamanan &   Mengaktifkan Row Level         🔄 Sedang berjalan
  Deployment              Security dengan policy yang    
                          sesuai, push kode ke GitHub,   
                          deploy ke Vercel/Netlify untuk 
                          mendapat link publik yang bisa 
                          diinstal ke HP ibu.            

  Fase 6 --- Pengujian    Ibu menggunakan aplikasi untuk ⏳ Belum dimulai
  Penerimaan Pengguna     operasional harian selama      
                          beberapa minggu, pengumpulan   
                          feedback langsung.             

  Fase 7 ---              Notifikasi pengingat harian,   ⏳ Belum dimulai
  Penyempurnaan Lanjutan  laporan bulanan/gabungan,      
  (opsional)              backup otomatis ke Google      
                          Drive.                         
  ------------------------------------------------------------------------------

------------------------------------------------------------------------

# 9. Catatan Risiko & Mitigasi

  -----------------------------------------------------------------------
  Risiko                              Mitigasi
  ----------------------------------- -----------------------------------
  Ibu kesulitan beradaptasi dengan    Desain disederhanakan khusus untuk
  aplikasi baru                       pengguna lanjut usia; alur input
                                      mengikuti kebiasaan kerja nyata,
                                      bukan memaksa alur baru.

  Data hilang karena perangkat        Migrasi ke Supabase (cloud) sejak
  rusak/hilang                        Fase 4, bukan hanya localStorage.

  Key Supabase publik berisiko        RLS direncanakan aktif sebelum
  diakses sembarang pihak             aplikasi dipakai rutin/online (Fase
                                      5).

  Supplier module: harga jual manual  Form realisasi menampilkan qty
  rentan human error                  dipesan sebagai referensi saat
                                      input qty aktual, mengurangi salah
                                      input.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Catatan Penggunaan Dokumen

Dokumen ini merupakan transkripsi terstruktur dari PRD PDF versi 1.0
(Oktober 2026). Isi requirement, istilah, status fase, dan keputusan
teknis dipertahankan sesuai dokumen sumber. Perubahan atau keputusan
baru sebaiknya dicatat sebagai revisi PRD, bukan dilakukan diam-diam
saat implementasi.
