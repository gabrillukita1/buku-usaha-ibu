# Buku Usaha Ibu

Aplikasi React + Vite untuk pencatatan usaha Brambang Goreng dan Supplier Rumah Makan.

## Teknologi

- React 18, Vite, JavaScript
- Tailwind CSS dan komponen UI bergaya shadcn/ui (Radix Dialog)
- Supabase untuk penyimpanan data
- Lucide React dan html2canvas untuk ekspor kwitansi

## Menjalankan aplikasi

1. Isi `.env` dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.

Untuk build produksi, jalankan `npm run build`.

## Aturan perhitungan

- Upah pengupas dihitung dari `timbangan.qty` yang terkait dengan setoran karyawan.
- Upah menggunakan tarif yang paling baru berlaku pada tanggal transaksi.
- Data operasional diambil dari Supabase; aplikasi tidak memakai data contoh sebagai pengganti database.
