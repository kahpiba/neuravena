# Neuravena · 3D NeuroVascular Atlas

**Neuravena** adalah aplikasi atlas anatomi 3D interaktif modern berbasis **Vite + React + TypeScript + Three.js + Tailwind CSS** yang dirancang khusus untuk eksplorasi presisi tinggi pada **Sistem Saraf (Nervous System)** dan **Sistem Pembuluh Darah (Circulatory / Vascular System)** manusia beserta korelasi fisiologi dan patologi klinisnya.

---

## Fitur Utama

- **Mode Isolasi (Isolate / X-Ray Ghosting Mode)**:
  - Mengisolasi organ atau jaras target yang dipilih (misal: *Arteri Karotis*, *Nervus Iskiadikus*, *Serebrum*, dll.) dengan warna cerah dan sorotan denyut (*emissive pulse*), sementara seluruh struktur tubuh lainnya otomatis beralih menjadi siluet X-Ray tembus pandang (*translucent ghost*).
  - Pintasan keyboard instan: tekan tombol `I` atau `X`.
- **Kontrol Transparansi & Lapisan Multisaluran (Layer Opacity Controls)**:
  - Slider opasitas real-time (0% - 100%) dan toggle visibilitas mandiri untuk:
    - 🧠 **Sistem Saraf & Impuls** (CNS/PNS)
    - 🔴 **Sistem Arteri** ($O_2$ & Nutrisi)
    - 🔵 **Sistem Vena** (Aliran Balik $CO_2$)
    - 🫀 **Jantung 3D** (Pompa & Koroner)
    - 🦴 **Kerangka Acuan** (Konteks Tulang Ghost)
    - 👤 **Siluet Kulit** (Glass Contour)
  - Tombol **Preset Klinis Cepat**: *Lengkap (Default)*, *Fokus Saraf*, *Fokus Vaskular*, dan *Saraf & Pembuluh Saja*.
- **Visualisasi 3D Interaktif Real-Time**:
  - Orbit, zoom, pan, dan auto-rotasi 360° yang mulus menggunakan Three.js & OrbitControls.
  - Simulasi partikel dinamis aliran oksigen ($O_2$), karotis, impuls listrik potensial aksi saraf, dan nutrisi.
  - Grafik waveform real-time (ECG / EKG untuk jantung & pembuluh, Potensial Aksi untuk saraf).
- **Pencarian Cepat Organ & Kondisi Klinis (`Ctrl + K` / `/`)**:
  - Modal pencarian instan dengan pencocokan fuzzy pada nama organ, terminologi Latin, fungsi fisiologis, dan penyakit klinis.
  - Filter kategori (*Semua*, *🧠 Saraf*, *🫀 Vaskular*).
  - Navigasi keyboard penuh (`↑`/`↓` navigasi hasil, `Enter` untuk fokus kamera ke organ, `Esc` untuk menutup).
- **Modul Evaluasi & Kuis Klinis Interaktif (`Q` / Tombol 🏆)**:
  - Skenario kasus klinis nyata (Aterosklerosis, Stroke Iskemik MCA, Polineuropati Diabetik, Angina Pektoris, Cedera Pleksus Brakialis).
  - **Fitur 3D Peek**: Tombol *"🔍 Intip di 3D Atlas"* untuk mengarahkan kamera 3D ke target anatomi secara real-time tanpa menutup kuis.
  - Penjelasan ilmiah patofisiologi instan, sistem penilaian, dan selebrasi confetti saat skor memuaskan.
- **Aset 3D Ultra Ringan (-68% Ukuran Download)**:
  - Model GLTF/GLB dikompresi menggunakan Google Draco Geometry Compression & WebP Texture Compression (~6.6 MB total download).
- **Aksesibilitas & Pintasan Keyboard Terpadu (`?`)**:
  - Standar WCAG 2.1 AA (kontras `:focus-visible`, semantic ARIA roles & dialogs).
  - Pintasan keyboard: `Ctrl+K` / `/` (Cari), `←`/`→` (Ganti organ), `1`-`4` (Kondisi klinis), `I` (Isolasi), `Space` (Pause/Play rotasi), `Q` (Kuis), `?` (Daftar pintasan), `Esc` (Tutup modal/kartu).

---

## Menjalankan Secara Lokal

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm

### Instalasi & Menjalankan Dev Server
```bash
# Clone repositori
git clone https://github.com/kahpiba/neuravena.git
cd neuravena

# Pasang dependensi
npm install

# Jalankan dev server Vite
npm run dev
```

Buka peramban di alamat yang ditampilkan di terminal (default: `http://localhost:5173/` atau `http://localhost:5174/`).

### Membangun Versi Produksi (Production Build)
```bash
npm run build
```
Hasil build statis siap deploy akan berada di direktori `dist/`.

---

## Struktur Proyek

```
neuravena/
├── public/
│   └── assets/
│       └── models/                # Model 3D GLB teroptimasi (Draco & WebP)
├── src/
│   ├── types/
│   │   └── anatomy.ts             # Definisi tipe TypeScript
│   ├── data/
│   │   ├── organDatabase.ts       # Database anatomi, fisiologi & patologi
│   │   └── quizQuestions.ts       # Bank soal evaluasi kasus klinis
│   ├── components/
│   │   ├── Viewer3D/
│   │   │   ├── Viewer3D.tsx       # Komponen canvas Three.js
│   │   │   ├── FloatingPins.tsx   # Label pin mengambang 3D
│   │   │   └── SceneEngine.ts     # Engine Three.js (materials, particles, ghosting)
│   │   ├── Header/
│   │   │   └── TopBar.tsx         # Header branding NEURAVENA & tombol aksi
│   │   ├── Panels/
│   │   │   ├── LeftControlPanel.tsx   # Panel kontrol kondisi klinis & kamera
│   │   │   └── LayerOpacityPanel.tsx  # Slider opasitas & preset lapisan
│   │   ├── DetailCard/
│   │   │   └── OrganDetailCard.tsx    # Kartu rincian organ, ECG & toggle Isolasi
│   │   ├── Modals/
│   │   │   ├── SearchModal.tsx    # Modal pencarian cepat (Ctrl+K)
│   │   │   ├── QuizModal.tsx      # Modal evaluasi klinis & 3D peek
│   │   │   └── ShortcutsModal.tsx # Modal panduan pintasan keyboard (?)
│   │   └── Common/
│   │       └── GestureHint.tsx    # Petunjuk interaksi gestur
│   ├── App.tsx                    # Root UI & state coordinator
│   ├── main.tsx                   # React DOM entrypoint
│   └── index.css                  # Tailwind CSS & design tokens
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Lisensi & Atribusi

Proyek ini dikembangkan untuk tujuan edukasi sains dan kedokteran interaktif.
Model 3D anatomi dioptimasi untuk performa rendering tinggi di peramban web.
