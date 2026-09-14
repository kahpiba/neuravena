import { QuizQuestion } from '../types/anatomy';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    scenario: 'Pasien pria 62 tahun datang dengan keluhan pusing mendadak, mata kabur sepintas (amaurosis fugax), dan pada auskultasi leher terdengar suara bising vaskular (bruit).',
    targetOrganId: 'carotid',
    targetOrganName: 'Arteri Karotis Komunis & Interna',
    question: 'Struktur neurovaskular manakah yang paling mungkin mengalami stenosis akibat plak ateroma?',
    options: [
      'Arteri Karotis Interna pada bifurkasio leher',
      'Nervus Iskiadikus pada posterior paha',
      'Vena Kava Superior dekat atrium kanan',
      'Pleksus Brakialis pada fosa supraklavikularis'
    ],
    correctIndex: 0,
    explanation: 'Bifurkasio arteri karotis komunis menjadi karotis interna dan eksterna merupakan lokasi predileksi turbulensi tinggi yang rentan penumpukan plak ateroma. Stenosis > 70% di area ini memicu bruit sistolik dan embolisasi mikro ke arteri oftalmika yang menyebabkan amaurosis fugax.'
  },
  {
    scenario: 'Seorang wanita 68 tahun tiba-tiba mengalami kelemahan separuh tubuh kanan (hemiparesis) dan kesulitan berbicara (afasia Broca) sejak 1 jam yang lalu.',
    targetOrganId: 'cerebrum',
    targetOrganName: 'Otak Besar (Korteks Serebral & MCA)',
    question: 'Pembuluh darah utama apakah yang mengalami oklusi akut dan membutuhkan trombolisis segera dalam golden hour?',
    options: [
      'Arteri Serebri Media (MCA) cabang sirkulasi serebral',
      'Arteri Femoralis profunda',
      'Vena Kava Inferior',
      'Trunkus simpatis servikalis'
    ],
    correctIndex: 0,
    explanation: 'Arteri Serebri Media (MCA) menyuplai sebagian besar korteks lateral belahan otak, termasuk area motorik primer (mengontrol wajah dan lengan) dan area bicara Broca di lobus frontal hemisfer dominan. Oklusi tromboemboli akut pada MCA memicu gejala stroke iskemik fokal dengan risiko kematian jutaan neuron per menit.'
  },
  {
    scenario: 'Penderita diabetes melitus tipe 2 selama 15 tahun mengeluhkan kedua telapak kakinya kebas, mati rasa seperti memakai kaus kaki tebal, dan sering timbul sensasi terbakar di malam hari.',
    targetOrganId: 'sciatic',
    targetOrganName: 'Nervus Iskiadikus & Cabang Terminal Perifer',
    question: 'Patofisiologi apakah yang mendasari gejala sensorik distal "glove and stocking" tersebut?',
    options: [
      'Degenerasi aksonal panjang akibat iskemia vasa nervorum dan stres metabolik',
      'Ruptur diseksi aorta torakalis',
      'Oklusi total katup mitral jantung',
      'Peningkatan tekanan vena sentral (CVP)'
    ],
    correctIndex: 0,
    explanation: 'Polineuropati diabetik perifer (DPN) adalah neuropati aksonal distal simetris yang mengenai serabut saraf terpanjang (panjang akson dari lumbosakral hingga ujung jari kaki). Hiperglikemia kronis merusak mikrosirkulasi kapiler penyokong saraf (vasa nervorum) dan menyebabkan akumulasi sorbitol serta stres oksidatif intraradiks.'
  },
  {
    scenario: 'Pasien mengeluhkan dada terasa ditekan beban berat saat menaiki tangga yang menjalar ke lengan kiri dan leher, reda setelah istirahat selama 5 menit.',
    targetOrganId: 'heart',
    targetOrganName: 'Jantung & Sirkulasi Koroner',
    question: 'Mekanisme hemodinamik manakah yang menyebabkan nyeri angina pektoris tersebut?',
    options: [
      'Ketidakseimbangan suplai oksigen miokard akibat stenosis arteri koroner',
      'Kompresi mekanik pada pleksus brakialis oleh iga servikal',
      'Disfungsi sawar darah otak (BBB) di korteks serebral',
      'Refluks vena melalui katup vena safena magna'
    ],
    correctIndex: 0,
    explanation: 'Angina pektoris stabil terjadi saat kebutuhan oksigen otot jantung (miokardium) meningkat selama aktivitas fisik namun tidak dapat diimbangi oleh aliran darah koroner karena adanya plak aterosklerosis fixed pada arteri koroner (LAD/LCx/RCA). Penumpukan asam laktat merangsang serabut nyeri visceral sensorik simpatis jantung.'
  },
  {
    scenario: 'Seorang pengendara motor terjatuh dengan posisi bahu membentur aspal dan kepala terdorong ke arah berlawanan, mengakibatkan lengan kanan terkulai lemas tidak bisa diangkat.',
    targetOrganId: 'brachial',
    targetOrganName: 'Pleksus Brakialis',
    question: 'Anyaman serabut saraf manakah yang mengalami cedera traksi (Erb-Duchenne palsy)?',
    options: [
      'Radiks C5–C6 Pleksus Brakialis',
      'Nervus Iskiadikus L4–S3',
      'Saraf kranial V (Trigeminus)',
      'Arteri karotis eksterna'
    ],
    correctIndex: 0,
    explanation: 'Cedera pleksus brakialis atas (C5–C6 / Erb palsy) terjadi akibat peregangan berlebih sudut leher dan bahu. Kerusakan pada cabang N. suprascapularis, N. musculocutaneus, dan N. axillaris menyebabkan paralisis m. deltoideus, bisep, dan brakialis, menghasilkan posisi karakteristik "waiter\'s tip".'
  }
];
