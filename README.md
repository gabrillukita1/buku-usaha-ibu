# Buku Usaha Ibu (React + Vite)

Aplikasi pencatatan untuk usaha Brambang Goreng & Supplier Rumah Makan.

## Cara menjalankan
```
npm install
npm run dev
```
Buka http://localhost:5173 di browser.

## Build untuk produksi
```
npm run build
```
Hasil build ada di folder `dist/`.

## Struktur
- `src/modules/BrambangModule.jsx` — modul brambang goreng
- `src/modules/SupplierModule.jsx` — modul supplier rumah makan
- `src/components/` — komponen bersama (Header, PillNav)
- `src/lib/storage.js` — helper localStorage (akan diganti ke Supabase)
- `src/styles.css` — semua styling

Data saat ini tersimpan di localStorage browser. Langkah berikutnya: migrasi ke Supabase.
