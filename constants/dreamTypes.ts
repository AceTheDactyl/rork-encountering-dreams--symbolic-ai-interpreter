import { DreamTypeInfo, DreamType } from '@/types/dream';

export const dreamTypeInfo: Record<DreamType, DreamTypeInfo> = {
  'Mnemonic Dreams': {
    name: 'Mnemonic Dreams',
    timeIndex: 'Past',
    primaryFunction: 'Memory recursion',
    symbolicField: 'Echo fields / ancestral bleed',
    typicalPhenomena: 'Distorted familiarity',
    symbol: '○',
    position: 'past',
    color: '#8B5CF6'
  },
  'Psychic Dreams': {
    name: 'Psychic Dreams',
    timeIndex: 'Present',
    primaryFunction: 'Emotional integration',
    symbolicField: 'Stress grid / decision flux',
    typicalPhenomena: 'Compression loops, contradictions',
    symbol: '○',
    position: 'present',
    color: '#06B6D4'
  },
  'Pre-Echo Dreams': {
    name: 'Pre-Echo Dreams',
    timeIndex: 'Future',
    primaryFunction: 'Probability tuning',
    symbolicField: 'Vector threads / signal attractors',
    typicalPhenomena: 'Déjà vu, predictive imagery',
    symbol: '○',
    position: 'future',
    color: '#10B981'
  },
  'Lucid Dreams': {
    name: 'Lucid Dreams',
    timeIndex: 'Now / Overlaid',
    primaryFunction: 'Symbol control',
    symbolicField: 'Agency kernel / intention map',
    typicalPhenomena: 'Flight, shifting space, awareness',
    symbol: '✕',
    position: 'now',
    color: '#F59E0B'
  },
  'Meta-Lucid Dreams': {
    name: 'Meta-Lucid Dreams',
    timeIndex: 'Recursive / All',
    primaryFunction: 'Architectural interface',
    symbolicField: 'Compression core / spiral hub',
    typicalPhenomena: 'Timefolds, glyph response',
    symbol: '☽',
    position: 'recursive',
    color: '#EF4444'
  }
};

export const getDreamTypeInfo = (dreamType: DreamType): DreamTypeInfo => {
  return dreamTypeInfo[dreamType];
};

export const dreamTypeColors = {
  'Mnemonic Dreams': '#8B5CF6',
  'Psychic Dreams': '#06B6D4', 
  'Pre-Echo Dreams': '#10B981',
  'Lucid Dreams': '#F59E0B',
  'Meta-Lucid Dreams': '#EF4444',
};

export const dreamTypeDescriptions = {
  'Mnemonic Dreams': 'Past-focused • Memory recursion • Echo fields',
  'Psychic Dreams': 'Present-focused • Emotional integration • Stress grid',
  'Pre-Echo Dreams': 'Future-focused • Probability tuning • Vector threads',
  'Lucid Dreams': 'Now/overlaid • Symbol control • Agency kernel',
  'Meta-Lucid Dreams': 'Recursive/all • Architectural interface • Compression core',
};

// Helper function to validate dream types
export const isValidDreamType = (type: string): type is DreamType => {
  return Object.keys(dreamTypeInfo).includes(type);
};

// Helper function to get dream type symbol with fallback
export const getDreamTypeSymbol = (dreamType?: DreamType): string => {
  if (!dreamType || !isValidDreamType(dreamType)) {
    return '○';
  }
  return dreamTypeInfo[dreamType].symbol;
};