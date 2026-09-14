# Neuravena · 3D NeuroVascular Atlas

**Neuravena** adalah aplikasi atlas anatomi interaktif berbasis 3D (*zero-build static web application*) yang berfokus secara mendalam pada eksplorasi **Sistem Saraf (Nervous System)** dan **Sistem Pembuluh Darah (Circulatory/Vascular System)** manusia beserta korelasi fisiologi dan patologi klinisnya.

---

## Fitur Utama

- **Visualisasi 3D Interaktif Real-Time**:
  - Model terintegrasi sistem saraf, pembuluh darah arteri & vena, jantung 3D berdenyut, serta kerangka acuan.
  - Orbit, zoom, pan, dan auto-rotasi 360° yang mulus menggunakan Three.js & OrbitControls.
  - Simulasi partikel dinamis aliran oksigen ($O_2$), karotis, impuls listrik saraf, dan nutrisi.
- **Pencarian Cepat Organ & Kondisi Klinis (`Ctrl + K` / `/`)**:
  - Modal pencarian instan dengan fuzzy match nama organ, fungsi fisiologis, dan penyakit klinis.
  - Filter kategori (*Semua*, *🧠 Saraf*, *🫀 Vaskular*).
  - Navigasi keyboard penuh (`↑`/`↓` navigasi hasil, `Enter` untuk fokus kamera ke organ).
- **Modul Evaluasi & Kuis Klinis Interaktif (`Q` / Tombol 🏆)**:
  - Skenario kasus klinis nyata (Aterosklerosis, Stroke Iskemik vs Hemoragik, Polineuropati Diabetik, Infark Miokard, Pleksus Brakialis).
  - **Fitur 3D Peek**: Tombol *"🔍 Intip di 3D Atlas"* untuk mengarahkan kamera 3D ke target anatomi secara real-time tanpa menutup kuis.
  - Penjelasan ilmiah patofisiologi instan dan kartu evaluasi skor akhir.
- **Aset 3D Ultra Ringan (-68% Ukuran Download)**:
  - Model GLTF/GLB dikompresi menggunakan Draco Geometry Compression & WebP Texture Compression.
  - Total ukuran download hanya ~6.6 MB (berkurang dari ukuran asli 21 MB) dengan preservasi node mesh Three.js.
- **Aksesibilitas & Pintasan Keyboard Terpadu (`?`)**:
  - Memenuhi standar WCAG 2.1 AA (kontras `:focus-visible`, semantic ARIA roles & dialogs).
  - Pintasan keyboard: `Ctrl+K` (Cari), `←`/`→` (Ganti organ), `1`-`4` (Kondisi klinis), `Space` (Pause/Play rotasi), `Q` (Kuis), `?` (Daftar pintasan), `Esc` (Tutup dialog).

---

## Menjalankan Secara Lokal

Neuravena adalah aplikasi *zero-build* (berjalan langsung di peramban web modern tanpa perlu compiler atau bundler):

```bash
# Clone repositori
git clone https://github.com/kahpiba/neuravena.git
cd neuravena

# Jalankan server lokal (pilih salah satu)
python3 -m http.server 8088
# atau
npx serve .
```

Buka peramban di `http://localhost:8088`.

---

## Struktur Proyek

```
neuravena/
├── index.html                   # Aplikasi utama (HTML5, Tailwind CSS, Three.js & Logic)
├── README.md                    # Dokumentasi proyek
├── assets/
│   └── models/
│       ├── circulatory_system.glb  # Sistem peredaran darah (Draco compressed)
│       ├── heart.glb               # Jantung 3D (Draco compressed)
│       ├── nervous_system.glb      # Sistem saraf (Draco compressed)
│       ├── skeletal_system.glb     # Kerangka acuan (Draco compressed)
│       └── original/               # Cadangan model asli tanpa kompresi
```

---

## Lisensi & Atribusi

Proyek ini dikembangkan untuk tujuan edukasi medis dan sains interaktif.
Model 3D anatomi dioptimasi untuk render performa tinggi di browser.
