import { OrganData } from '../types/anatomy';

export const ORGAN_ORDER: string[] = [
  'cerebrum', 'brainstem', 'carotid', 'heart', 'aorta',
  'brachial', 'vena_cava', 'femoral', 'sciatic'
];

export const NERVE_ORGAN_IDS = ['cerebrum', 'brainstem', 'brachial', 'sciatic'];

export const ORGAN_DATABASE: Record<string, OrganData> = {
  cerebrum: {
    id: 'cerebrum',
    type: 'saraf',
    name: 'Otak Besar & Sirkulasi Serebral',
    latin: 'Cerebrum & Circulus Arteriosus Cerebri',
    system: 'Sistem Saraf Pusat — Korteks Serebral',
    shortDesc: 'Pusat kontrol kognitif, sensorik, dan motorik dengan suplai darah via Poligon Willis.',
    keywords: ['otak', 'serebrum', 'cortex', 'poligon willis', 'stroke', 'pikiran', 'memori', 'iskemik', 'saraf pusat', 'cns'],
    camera: { target: [0, 0.72, 0], pos: [0, 0.74, 0.82] },
    pos3D: [0, 0.72, 0.05],
    icon: '🧠',
    color: '#0d9488',
    pinLabel: '🧠 Otak Besar & Sirkulasi Serebral',
    anatomi: 'Massa terbesar sistem saraf pusat (±85% berat otak, ±1,4 kg) dengan 4 lobus: frontal, parietal, temporal, dan oksipital. Mengatur berpikir, bahasa, gerakan sadar, penglihatan, dan memori.',
    fisiologi: 'Hanya 2% berat tubuh tetapi mengonsumsi ±20% oksigen tubuh. Disuplai arteri karotis interna dan arteri vertebralis melalui Poligon Willis dengan aliran ±750–1000 ml darah per menit.',
    kondisi: {
      sehat: {
        badge: 'SUPLAI OKSIGEN OPTIMAL',
        badgeClass: 'badge-ok',
        patologi: 'Perfusi serebral normal (CBF 50 ml/100g/menit). Barrier sawar darah otak (Blood-Brain Barrier) utuh dan transmisi neurotransmiter seimbang.',
        dampak: 'Fungsi eksekutif, memori kerja, dan regulasi emosi berjalan normal tanpa defisit neurologis.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'RISIKO TIA (SERANGAN ISKEMIK TRANSIEN)',
        badgeClass: 'badge-warn',
        patologi: 'Penyempitan lumen arteri serebral anterior/media oleh plak ateroma kalsifikasi. Turbulensi aliran mikro.',
        dampak: 'Pusing berulang (dizziness), sakit kepala vaskular, penurunan konsentrasi bertahap, dan risiko TIA berulang.',
        pulseAmp: 0.65, pulseFreq: 1.2
      },
      stroke: {
        badge: 'EMERGENSI: ISKEMIA FOKAL AKUT',
        badgeClass: 'badge-danger',
        patologi: 'Oklusi tromboemboli total pada Arteri Serebri Media (MCA). Inti infark nekrotik dikelilingi zona penumbra iskemik yang dapat diselamatkan jika diobati < 4.5 jam.',
        dampak: 'Hemiparesis kontralateral, afasia Broca/Wernicke, disartria, hilangnya lapang pandang hemianopsia homonim.',
        pulseAmp: 0.20, pulseFreq: 1.5
      },
      neuropati: {
        badge: 'GANGGUAN SENSORIK-MOTORIK SENTRAL',
        badgeClass: 'badge-info',
        patologi: 'Disfungsi integrasi sinyal somatosensorik kortikal akibat kerusakan jaras asenden atau degenerasi neuron asosiasi.',
        dampak: 'Parestesia perseptual, ataksia sensorik, dan perlambatan waktu reaksi motorik sadar.',
        pulseAmp: 0.70, pulseFreq: 0.9
      }
    },
    fisiologiData: { label: 'Aliran Darah Otak (CBF)', value: '750', unit: 'ml/menit', desc: 'Nilai referensi: 700–1000 ml/menit (20% curah jantung)' }
  },
  brainstem: {
    id: 'brainstem',
    type: 'saraf',
    name: 'Batang Otak & Sumsum Tulang Belakang',
    latin: 'Truncus Encephali & Medulla Spinalis',
    system: 'Sistem Saraf Pusat — Pusat Otonom Vital',
    shortDesc: 'Pusat pengatur denyut jantung, respirasi, tekanan darah, dan jalan tol impuls ke perifer.',
    keywords: ['batang otak', 'medulla spinalis', 'pons', 'medulla oblongata', 'otonom', 'refleks', 'respirasi'],
    camera: { target: [0, 0.52, 0], pos: [0, 0.54, 0.75] },
    pos3D: [0, 0.52, 0.02],
    icon: '🕳️',
    color: '#0d9488',
    pinLabel: '🕳️ Batang Otak & Medulla Spinalis',
    anatomi: 'Terdiri dari mesensefalon (otak tengah), pons, dan medula oblongata, berlanjut ke medula spinalis sepanjang kolumna vertebra hingga L1/L2.',
    fisiologi: 'Memuat pusat kardiovaskular vasomotor, pusat pernapasan dorsal/ventral, formatio retikularis (kesadaran), dan 10 pasang nukleus saraf kranial (CN III–XII).',
    kondisi: {
      sehat: {
        badge: 'REGULASI OTONOM STABIL',
        badgeClass: 'badge-ok',
        patologi: 'Pusat respirasi dan vasomotor bekerja otomatis tanpa gangguan transmisi traktus piramidalis.',
        dampak: 'Homeostasis laju jantung, napas, dan refleks protektif (batuk, menelan) berjalan sempurna.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'INSUFISIENSI VERTEBROBASILAR',
        badgeClass: 'badge-warn',
        patologi: 'Hipoperfusi arteri basilaris dan vertebralis menyebabkan iskemia parsial pada formatio retikularis dan nukleus vestibularis.',
        dampak: 'Vertigo sentral episodik, diplopia, disfagia sementara, dan drop attacks.',
        pulseAmp: 0.60, pulseFreq: 1.1
      },
      stroke: {
        badge: 'KRITIS: STROKE BATANG OTAK',
        badgeClass: 'badge-danger',
        patologi: 'Oklusi arteri basilaris menghasilkan sindrom Locked-in atau henti napas akut bila mengenai medula oblongata dorsal.',
        dampak: 'Tetraplegia spastik, koma, gangguan irama jantung mematikan, dan kegagalan ventilasi spontan.',
        pulseAmp: 0.15, pulseFreq: 1.6
      },
      neuropati: {
        badge: 'DISAUTONOMIA & DEFISIT TRAKTUS',
        badgeClass: 'badge-info',
        patologi: 'Demielinisasi serabut asenden/desenden dan degenerasi neuron medula spinalis.',
        dampak: 'Instabilitas postural, hipotensi ortostatik kronis, dan disfungsi sfingter traktus urinarius.',
        pulseAmp: 0.75, pulseFreq: 0.85
      }
    },
    fisiologiData: { label: 'Kecepatan Hantar Saraf', value: '100', unit: 'm/detik', desc: 'Serabut A-alfa: 80–120 m/s pada traktus piramidalis' }
  },
  carotid: {
    id: 'carotid',
    type: 'vaskular',
    name: 'Arteri Karotis Komunis & Interna',
    latin: 'Arteria Carotis Communis & Interna',
    system: 'Sistem Pembuluh Darah — Suplai Utama Otak',
    shortDesc: 'Pipa pembawa darah bertekanan tinggi langsung dari arkus aorta menuju intrakranial.',
    keywords: ['karotis', 'arteri karotis', 'bifurkasio', 'baroreseptor', 'stenosis', 'leher', 'otak'],
    camera: { target: [0.03, 0.56, 0.02], pos: [0.03, 0.58, 0.70] },
    pos3D: [0.04, 0.57, 0.04],
    icon: '🩸',
    color: '#e11d48',
    pinLabel: '🩸 Arteri Karotis (Leher)',
    anatomi: 'Berasal dari trunkus brakiosefalikus (kanan) dan arkus aorta (kiri). Bercabang di C3/C4 menjadi karotis eksterna (wajah/leher) dan karotis interna (menembus basis kranii).',
    fisiologi: 'Memiliki sinus karotikus (baroreseptor pengatur tekanan darah) dan glomus karotikus (kemoreseptor pO2, pCO2, pH). Mengalirkan 80% darah yang dibutuhkan otak.',
    kondisi: {
      sehat: {
        badge: 'LUMEN PATEN & ELASTIS',
        badgeClass: 'badge-ok',
        patologi: 'Endotel halus tanpa plak, elastisitas tunika media terjaga, refleks baroreseptor responsif.',
        dampak: 'Aliran darah laminar laminer tanpa hambatan ke kedua belahan serebral.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'STENOSIS KAROTIS > 70%',
        badgeClass: 'badge-warn',
        patologi: 'Plak fibroateroma pada bifurkasio karotis mempersempit lumen. Terbentuk bruit karotis yang terdengar pada auskultasi stetoskop.',
        dampak: 'Aliran turbulen, pembentukan mikroemboli kolesterol ke retina (amaurosis fugax) dan korteks.',
        pulseAmp: 0.50, pulseFreq: 1.25
      },
      stroke: {
        badge: 'TROMBOSIS AKUT KAROTIS',
        badgeClass: 'badge-danger',
        patologi: 'Ruptur kapsul plak ateroma memicu kaskade koagulasi instan; trombus menyumbat total arteri karotis interna.',
        dampak: 'Infark serebral luas hemisfer anterior dengan defisit neurologis parah seketika.',
        pulseAmp: 0.10, pulseFreq: 1.4
      },
      neuropati: {
        badge: 'VASKULOPATI NEURAL',
        badgeClass: 'badge-info',
        patologi: 'Gangguan suplai vasa nervorum ke cabang pleksus servikalis dan saraf cranial IX, X di trigonum karotikum.',
        dampak: 'Kelemahan sensorik refleks leher dan hipersensitivitas sinus karotikus.',
        pulseAmp: 0.80, pulseFreq: 0.95
      }
    },
    fisiologiData: { label: 'Kecepatan Puncak Sistolik (PSV)', value: '85', unit: 'cm/detik', desc: 'Normal < 125 cm/s; stenosis signifikan bila > 230 cm/s' }
  },
  heart: {
    id: 'heart',
    type: 'vaskular',
    name: 'Jantung & Sirkulasi Koroner',
    latin: 'Cor & Circulatio Coronaria',
    system: 'Sistem Kardiovaskular — Pompa Utama Tubuh',
    shortDesc: 'Pompa berotot empat ruang yang memompa darah ke seluruh tubuh dan paru-paru tanpa henti.',
    keywords: ['jantung', 'cor', 'miokardium', 'koroner', 'pompa', 'denyut', 'infark', 'angina', 'ekg'],
    camera: { target: [0.03, 0.46, 0.05], pos: [0.03, 0.48, 0.62] },
    pos3D: [0.03, 0.465, 0.045],
    icon: '🫀',
    color: '#e11d48',
    pinLabel: '🫀 Jantung & Sirkulasi Koroner',
    anatomi: 'Organ berotot (miokardium) sebesar kepalan tangan, terletak di mediastinum media. Memiliki 4 katup (trikuspid, pulmonal, mitral, aorta) dan sistem vaskular koroner mandiri (LAD, LCx, RCA).',
    fisiologi: 'Membangkitkan ritme otomatis via nodus sinoatrial (SA Node 60–100 bpm). Menghasilkan curah jantung (Cardiac Output) 5 L/menit pada saat istirahat.',
    kondisi: {
      sehat: {
        badge: 'FRAKSI EJEKSI NORMAL (60%)',
        badgeClass: 'badge-ok',
        patologi: 'Sinkronisasi depolarisasi nodus SA ke AV node sempurna; kontraktilitas ventrikel kiri optimal tanpa hipertrofi.',
        dampak: 'Oksigenasi perifer tercukupi, toleransi aktivitas tinggi, hemodinamik stabil.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'PENYAKIT JANTUNG KORONER (CAD)',
        badgeClass: 'badge-warn',
        patologi: 'Stenosis arteri koroner (LAD/RCA) oleh plak ateroma. Menurunkan cadangan aliran darah koroner.',
        dampak: 'Angina pektoris stabil saat aktivitas fisik, penurunan fraksi ejeksi parsial (EF 45–50%).',
        pulseAmp: 0.60, pulseFreq: 1.3
      },
      stroke: {
        badge: 'KARDIOEMBOLI (RISIKO FIBRILASI ATRIUM)',
        badgeClass: 'badge-danger',
        patologi: 'Irama aritmia fibrilasi atrium memicu stasis darah di aurikel atrium kiri, membentuk trombus mural yang siap terlempar ke otak.',
        dampak: 'Palpitasi, gagal jantung kongestif, dan peningkatan risiko stroke emboli 5 kali lipat.',
        pulseAmp: 0.40, pulseFreq: 1.7
      },
      neuropati: {
        badge: 'NEUROPATI OTONOM JANTUNG (CAN)',
        badgeClass: 'badge-info',
        patologi: 'Kerusakan serabut simpatis dan parasimpatis (N. Vagus) yang menginervasi nodus SA dan nodus AV (sering komplikasi diabetes).',
        dampak: 'Takikardia istirahat menetap, hilangnya variabilitas detak jantung (HRV flat), dan iskemia miokard tanpa nyeri (silent ischemia).',
        pulseAmp: 0.75, pulseFreq: 1.1
      }
    },
    fisiologiData: { label: 'Curah Jantung (Cardiac Output)', value: '5.2', unit: 'L/menit', desc: 'Isi sekuncup 70 ml × denyut 75 bpm = 5.25 L/menit' }
  },
  aorta: {
    id: 'aorta',
    type: 'vaskular',
    name: 'Aorta & Percabangan Arteri Besar',
    latin: 'Aorta Ascendens, Arcus & Descendens',
    system: 'Sistem Sirkulasi Sistemik — Pipa Tekanan Tinggi',
    shortDesc: 'Saluran pembuluh darah terbesar di tubuh, menyalurkan darah beroksigen dari bilik kiri ke semua organ.',
    keywords: ['aorta', 'arkus aorta', 'arteri abdominalis', 'tekanan darah', 'sistolik', 'aneurisma'],
    camera: { target: [0, 0.40, 0], pos: [0, 0.42, 0.72] },
    pos3D: [0, 0.40, 0.03],
    icon: '🔴',
    color: '#e11d48',
    pinLabel: '🔴 Aorta & Arteri Besar',
    anatomi: 'Arteri terbesar tubuh (diameter ±2.5–3 cm). Terbagi menjadi aorta asendens, arkus aorta (cabang brakiosefalika, karotis komunis kiri, subklavia kiri), aorta torakalis, dan aorta abdominalis.',
    fisiologi: 'Efek Windkessel: dinding aorta meregang saat sistol dan mengerut saat diastol, meredam pulsasi pompa jantung menjadi aliran kontinu ke kapiler.',
    kondisi: {
      sehat: {
        badge: 'KOMPLIANS DINDING NORMAL',
        badgeClass: 'badge-ok',
        patologi: 'Lapisan tunika intima elastis sempurna, rasio elastin/kolagen seimbang, kapasitas Windkessel optimal.',
        dampak: 'Tekanan darah sistolik/diastolik terjaga pada 120/80 mmHg tanpa diseksi.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'KEKAKUAN ARTERI & PLAQUE AORTA',
        badgeClass: 'badge-warn',
        patologi: 'Kalsifikasi luas pada tunika media aorta (arteriosklerosis) menyebabkan dinding kaku kehilangan fungsi Windkessel.',
        dampak: 'Hipertensi sistolik terisolasi (160/70 mmHg), beban kerja ventrikel kiri meningkat drastis.',
        pulseAmp: 0.65, pulseFreq: 1.2
      },
      stroke: {
        badge: 'ATEROMA ARKUS AORTA KOMPLEKS',
        badgeClass: 'badge-danger',
        patologi: 'Plak ulseratif dengan ketebalan > 4 mm pada arkus aorta melepaskan mikroemboli langsung ke arteri brakiosefalika dan karotis.',
        dampak: 'Serangan stroke iskemik multipel pada beberapa teritori serebral berbeda sekaligus.',
        pulseAmp: 0.35, pulseFreq: 1.4
      },
      neuropati: {
        badge: 'HIPOPERFUSI ARTERI RADIKULARIS',
        badgeClass: 'badge-info',
        patologi: 'Penyempitan cabang aorta interkostal/lumbal yang menyuplai medula spinalis (arteri Adamkiewicz).',
        dampak: 'Iskemia medulla spinalis anterior, paraparesis flaksid berlanjut spastik.',
        pulseAmp: 0.70, pulseFreq: 0.9
      }
    },
    fisiologiData: { label: 'Tekanan Darah Rata-rata (MAP)', value: '93', unit: 'mmHg', desc: 'Diastol + 1/3 (Sistol - Diastol); normal 70–105 mmHg' }
  },
  brachial: {
    id: 'brachial',
    type: 'saraf',
    name: 'Pleksus Brakialis & Saraf Lengan',
    latin: 'Plexus Brachialis & Nervi Extremitatis Superioris',
    system: 'Sistem Saraf Perifer — Ekstremitas Atas',
    shortDesc: 'Jejaring saraf kompleks dari leher yang mengendalikan bahu, lengan, tangan, dan jari.',
    keywords: ['pleksus brakialis', 'saraf lengan', 'nervus medianus', 'radialis', 'ulnaris', 'tangan', 'motorik lengan'],
    camera: { target: [-0.22, 0.40, 0], pos: [-0.22, 0.42, 0.72] },
    pos3D: [-0.22, 0.42, 0.02],
    icon: '⚡',
    color: '#14b8a6',
    pinLabel: '⚡ Pleksus Brakialis (Saraf Lengan)',
    anatomi: 'Anyaman serabut saraf yang dibentuk oleh ramus anterior saraf spinal C5–T1. Terbagi menjadi trunkus, divisi, korda, dan 5 saraf terminal (Muskulokutaneus, Aksilaris, Radialis, Medianus, Ulnaris).',
    fisiologi: 'Menginervasi seluruh motorik otot lengan atas, lengan bawah, serta sensorik kulit tangan. Memungkinkan keterampilan motorik halus dan reflek tendon bisep/trisep.',
    kondisi: {
      sehat: {
        badge: 'KONDUKSI SARAF CEPAT (55 M/S)',
        badgeClass: 'badge-ok',
        patologi: 'Lapisan mielin sel Schwann tebal dan nodus Ranvier berfungsi optimal, tanpa kompresi fosa supraklavikularis.',
        dampak: 'Kekuatan genggaman tangan 5/5, sensasi diskriminasi dua titik halus pada ujung jari.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'SINDROM ISKEMIK ARTERI SUBKLAVIA',
        badgeClass: 'badge-warn',
        patologi: 'Stenosis arteri subklavia proksimal mencuri darah dari arteri vertebralis (Subclavian Steal Syndrome) saat lengan beraktivitas.',
        dampak: 'Lengan cepat lelah, kram klaudikasio ekstremitas atas, denyut nadi radialis asimetris.',
        pulseAmp: 0.65, pulseFreq: 1.15
      },
      stroke: {
        badge: 'HEMIPARESIS & SPASTISITAS LENGAN',
        badgeClass: 'badge-danger',
        patologi: 'Kerusakan Upper Motor Neuron (UMN) traktus kortikospinalis di hemisfer kontralateral.',
        dampak: 'Paralisis lengan flaksid pada fase akut, diikuti spastisitas fleksor jari/siku kronis.',
        pulseAmp: 0.25, pulseFreq: 1.35
      },
      neuropati: {
        badge: 'NEUROPATI JEBAKAN & DEMIELINISASI',
        badgeClass: 'badge-info',
        patologi: 'Kompresi terowongan karpal (Carpal Tunnel Syndrome) pada N. medianus atau polineuropati diabetik distal aksonal.',
        dampak: 'Kebas kesemutan jari I–III, atrofi otot tenar, sensasi tertusuk jarum malam hari.',
        pulseAmp: 0.50, pulseFreq: 0.8
      }
    },
    fisiologiData: { label: 'Kecepatan Konduksi Motorik', value: '58', unit: 'm/detik', desc: 'N. Medianus normal > 50 m/s; melambat pada kompresi mielin' }
  },
  vena_cava: {
    id: 'vena_cava',
    type: 'vaskular',
    name: 'Vena Kava Superior & Inferior',
    latin: 'Vena Cava Superior & Inferior',
    system: 'Sistem Pembuluh Darah — Sirkulasi Balik Vena',
    shortDesc: 'Vena raksasa yang mengumpulkan darah miskin oksigen dari seluruh tubuh kembali ke serambi kanan jantung.',
    keywords: ['vena kava', 'vena balik', 'co2', 'jantung kanan', 'katup', 'darah vena'],
    camera: { target: [0, 0.38, 0], pos: [0, 0.40, 0.70] },
    pos3D: [0.02, 0.38, 0.02],
    icon: '🔵',
    color: '#3b82f6',
    pinLabel: '🔵 Vena Kava (Aliran Balik)',
    anatomi: 'Vena terbesar tubuh: SVC menerima darah dari kepala, leher, dada, lengan; IVC menerima darah dari perut, pelvis, dan tungkai bawah, bermuara di atrium kanan.',
    fisiologi: 'Sistem bertekanan rendah (CVP 2–8 mmHg) dan volume tinggi (memuat 65–70% darah tubuh). Bekerja dengan pompa otot skelet dan katup vena satu arah.',
    kondisi: {
      sehat: {
        badge: 'TEKANAN VENA SENTRAL STABIL',
        badgeClass: 'badge-ok',
        patologi: 'Dinding vena kapasitans normal, aliran balik vena (Venous Return) seimbang dengan beban kerja jantung kanan.',
        dampak: 'Tidak ada bendungan cairan perifer, hepar normal, pertukaran gas di paru lancar.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'PENINGKATAN AFTERLOAD JANTUNG KANAN',
        badgeClass: 'badge-warn',
        patologi: 'Kekakuan vaskular sistemik menyebabkan resistensi sirkulasi kapiler perifer bertambah.',
        dampak: 'Peningkatan ringan tekanan pengisian vena sentral dan beban kerja ventrikel kanan.',
        pulseAmp: 0.70, pulseFreq: 1.1
      },
      stroke: {
        badge: 'STASIS VENA & EMBOLISME PARU',
        badgeClass: 'badge-danger',
        patologi: 'Imobilisasi ekstremitas pascastroke memicu stasis aliran vena kava inferior dan vena femoralis (Trias Virchow).',
        dampak: 'Pembentukan Deep Vein Thrombosis (DVT) masif yang berisiko lepas menjadi emboli paru fatal.',
        pulseAmp: 0.30, pulseFreq: 1.3
      },
      neuropati: {
        badge: 'KEGAGALAN VASOKONSTRIKSI VENA',
        badgeClass: 'badge-info',
        patologi: 'Neuropati otonom vasomotor: hilangnya tonus simpatis pada dinding vena splanknikus dan ekstremitas bawah.',
        dampak: 'Darah terkumpul di vena bawah saat berdiri (pooling), memicu pingsan sinkop ortostatik mendadak.',
        pulseAmp: 0.55, pulseFreq: 0.9
      }
    },
    fisiologiData: { label: 'Tekanan Vena Sentral (CVP)', value: '5', unit: 'mmHg', desc: 'Rentang normal: 2–8 mmHg (pengukur preload jantung)' }
  },
  femoral: {
    id: 'femoral',
    type: 'vaskular',
    name: 'Arteri Femoralis & Pembuluh Tungkai',
    latin: 'Arteria Femoralis & Vasa Membri Inferioris',
    system: 'Sistem Pembuluh Darah — Ekstremitas Bawah',
    shortDesc: 'Arteri utama pembawa darah beroksigen untuk seluruh otot paha, betis, dan telapak kaki.',
    keywords: ['femoralis', 'arteri paha', 'klaudikasio', 'kaki', 'tungkai', 'pad', 'nadi paha'],
    camera: { target: [-0.08, -0.22, 0], pos: [-0.08, -0.20, 0.70] },
    pos3D: [-0.08, -0.22, 0.02],
    icon: '🦵',
    color: '#e11d48',
    pinLabel: '🦵 Arteri Femoralis (Paha)',
    anatomi: 'Lanjutan dari arteri iliaka eksterna di bawah ligamentum inguinale. Berjalan melalui trigonum femorale, berlanjut menjadi arteri poplitea di belakang lutut.',
    fisiologi: 'Menyuplai oksigen dan glukosa untuk massa otot lokomotor terbesar tubuh (quadriceps, hamstring, gastrocnemius). Akses klinis utama untuk kateterisasi jantung.',
    kondisi: {
      sehat: {
        badge: 'INDEKS ANKLE-BRACHIAL NORMAL (1.1)',
        badgeClass: 'badge-ok',
        patologi: 'Lumen arteri femoralis paten, perfusi distal hangat dan merah muda hingga kapiler jari kaki.',
        dampak: 'Dapat berjalan/berlari tanpa nyeri iskemia; denyut nadi dorsalis pedis kuat dan teraba.',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'PENYAKIT ARTERI PERIFER (PAD)',
        badgeClass: 'badge-warn',
        patologi: 'Plak aterosklerosis menyumbat lumen arteri femoralis superfisialis. Menurunkan perfusi jaringan betis saat berjalan.',
        dampak: 'Klaudikasio intermiten (nyeri betis hebat saat jalan 100 m yang reda saat istirahat). Nilai ABI turun < 0.9.',
        pulseAmp: 0.50, pulseFreq: 1.25
      },
      stroke: {
        badge: 'GANGGUAN SENSORIK KONTROL MOTORIK',
        badgeClass: 'badge-danger',
        patologi: 'Kerusakan area representasi tungkai pada korteks motorik serebri anterior.',
        dampak: 'Kelemahan dorsofleksi kaki (drop foot), sirkumduksi gaya berjalan, dan risiko jatuh tinggi.',
        pulseAmp: 0.35, pulseFreq: 1.3
      },
      neuropati: {
        badge: 'MIKROVASKULOPATI & DIABETIC FOOT',
        badgeClass: 'badge-info',
        patologi: 'Penebalan membran basal kapiler mikrovaskular dipadu dengan hilangnya sensasi protektif saraf perifer.',
        dampak: 'Luka ulkus diabetik tanpa rasa nyeri pada telapak kaki, penyembuhan luka sangat lambat berisiko gangren.',
        pulseAmp: 0.60, pulseFreq: 0.85
      }
    },
    fisiologiData: { label: 'Ankle-Brachial Index (ABI)', value: '1.15', unit: 'rasio', desc: 'Normal 1.0–1.4; PAD ringan 0.7–0.9; iskemia kritis < 0.4' }
  },
  sciatic: {
    id: 'sciatic',
    type: 'saraf',
    name: 'Nervus Iskiadikus (Saraf Terpanjang)',
    latin: 'Nervus Ischiadicus',
    system: 'Sistem Saraf Perifer — Ekstremitas Bawah',
    shortDesc: 'Saraf terpanjang dan tertebal di tubuh manusia, membentang dari punggung bawah hingga ujung kaki.',
    keywords: ['nervus iskiadikus', 'skiatika', 'saraf paha', 'lumbosakral', 'kebas kaki', 'nyeri panggul'],
    camera: { target: [-0.07, -0.05, 0], pos: [-0.07, -0.03, 0.70] },
    pos3D: [-0.07, -0.05, -0.02],
    icon: '⚡',
    color: '#14b8a6',
    pinLabel: '⚡ Saraf Iskiadikus (Tungkai)',
    anatomi: 'Berasal dari pleksus lumbosakralis L4–S3 (tebal ±2 cm sebesar ibu jari). Melewati foramen iskiadikus mayor di bawah m. piriformis, turun di paha posterior dan bercabang menjadi N. tibialis dan N. peroneus komunis.',
    fisiologi: 'Mengontrol pergerakan otot fleksor lutut, semua otot betis dan kaki, serta menyalurkan seluruh sensasi taktil, suhu, dan propriosepsi tungkai bawah.',
    kondisi: {
      sehat: {
        badge: 'KONDUKSI & TONUS MOTORIK PRIMA',
        badgeClass: 'badge-ok',
        patologi: 'Sel Schwann menghasilkan mielin sehat; tidak ada jepitan radiks saraf L4–S1 pada diskus intervertebralis.',
        dampak: 'Refleks tendon Achilles normal (+2), tidak ada nyeri menjalar saat tungkai diangkat (Lasegue negatif).',
        pulseAmp: 1.0, pulseFreq: 1.0
      },
      aterosklerosis: {
        badge: 'ISKEMIA AKSONAL VASA NERVORUM',
        badgeClass: 'badge-warn',
        patologi: 'Penyempitan mikroarteriol vasa nervorum yang menyuplai serabut saraf iskiadikus.',
        dampak: 'Nyeri kram iskemia malam hari pada betis dan parestesia saat sirkulasi tungkai menurun.',
        pulseAmp: 0.60, pulseFreq: 1.15
      },
      stroke: {
        badge: 'SPASTISITAS EKSTENSOR TUNGKAI',
        badgeClass: 'badge-danger',
        patologi: 'Hilangnya kontrol inhibisi kortikal desenden menyebabkan hiperrefleksia arkus refleks spinal tungkai.',
        dampak: 'Spastisitas otot betis, klonus pergelangan kaki, dan pola jalan hemiplegik.',
        pulseAmp: 0.30, pulseFreq: 1.4
      },
      neuropati: {
        badge: 'SKIATIKA & POLINEUROPATI DISTAL',
        badgeClass: 'badge-info',
        patologi: 'Kompresi mekanik hernia nukleus pulposus (HNP) atau degenerasi aksonal metabolik panjang (glove & stocking pattern).',
        dampak: 'Nyeri tajam membakar menjalar dari bokong ke telapak kaki, rasa tebal seperti menginjak kapas, reflek Achilles hilang.',
        pulseAmp: 0.45, pulseFreq: 0.8
      }
    },
    fisiologiData: { label: 'Diameter Saraf', value: '20', unit: 'mm', desc: 'Saraf terbesar tubuh manusia (seukuran ibu jari)' }
  }
};
