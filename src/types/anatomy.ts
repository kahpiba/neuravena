export type ClinicalCondition = 'sehat' | 'aterosklerosis' | 'stroke' | 'neuropati';

export type OrganSystemType = 'saraf' | 'vaskular';

export interface OrganConditionData {
  badge: string;
  badgeClass: string;
  badgeBg?: string;
  badgeColor?: string;
  borderColor?: string;
  patologi: string;
  dampak: string;
  pulseAmp?: number;
  pulseFreq?: number;
}

export interface OrganData {
  id: string;
  type: OrganSystemType;
  name: string;
  latin: string;
  system: string;
  shortDesc: string;
  keywords: string[];
  camera: {
    target: [number, number, number];
    pos: [number, number, number];
  };
  pos3D: [number, number, number];
  icon: string;
  color: string;
  pinLabel: string;
  anatomi: string;
  fisiologi: string;
  kondisi: Record<ClinicalCondition, OrganConditionData>;
  fisiologiData: {
    label: string;
    value: string;
    unit: string;
    desc: string;
  };
}

export interface QuizQuestion {
  scenario: string;
  targetOrganId: string;
  targetOrganName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LayerOpacityState {
  nerves: { visible: boolean; opacity: number };
  arteries: { visible: boolean; opacity: number };
  veins: { visible: boolean; opacity: number };
  heart: { visible: boolean; opacity: number };
  skeleton: { visible: boolean; opacity: number };
  skin: { visible: boolean; opacity: number };
}
