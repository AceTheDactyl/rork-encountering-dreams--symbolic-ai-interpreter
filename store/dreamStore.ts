import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream } from '@/types/dream';

export type SortOption = 'date-desc' | 'date-asc' | 'type' | 'persona';

interface DreamState {
  dreams: Dream[];
  sortBy: SortOption;
  addDream: (dream: Dream) => void;
  deleteDream: (id: string) => void;
  getDream: (id: string) => Dream | undefined;
  setSortBy: (sortBy: SortOption) => void;
  getSortedDreams: () => Dream[];
  getGroupedDreams: () => { groupTitle: string; dreams: Dream[] }[];
}

const sortDreams = (dreams: Dream[], sortBy: SortOption): Dream[] => {
  const dreamsCopy = [...dreams];
  
  switch (sortBy) {
    case 'date-desc':
      return dreamsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    case 'date-asc':
      return dreamsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    case 'type':
      // Sort by dream type, then by date desc within each type
      return dreamsCopy.sort((a, b) => {
        if (a.dreamType !== b.dreamType) {
          return a.dreamType.localeCompare(b.dreamType);
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    case 'persona':
      // Sort by persona, then by date desc within each persona
      return dreamsCopy.sort((a, b) => {
        if (a.persona !== b.persona) {
          return a.persona.localeCompare(b.persona);
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    default:
      return dreamsCopy;
  }
};

const groupDreams = (dreams: Dream[], sortBy: SortOption): { groupTitle: string; dreams: Dream[] }[] => {
  if (sortBy !== 'type' && sortBy !== 'persona') {
    return [{ groupTitle: '', dreams }];
  }

  const groups: { [key: string]: Dream[] } = {};
  
  dreams.forEach(dream => {
    let groupKey = '';
    
    if (sortBy === 'type') {
      // Map dream type IDs to readable names
      const typeNames: { [key: string]: string } = {
        'mnemonic': 'Mnemonic Dreams',
        'psychic': 'Psychic Dreams',
        'pre-echo': 'Pre-Echo Dreams',
        'lucid': 'Lucid Dreams',
        'meta-lucid': 'Meta-Lucid Dreams'
      };
      groupKey = typeNames[dream.dreamType] || dream.dreamType;
    } else if (sortBy === 'persona') {
      groupKey = dream.persona === 'orion' ? 'Orion' : 'Limnus';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(dream);
  });

  return Object.entries(groups).map(([groupTitle, dreams]) => ({
    groupTitle,
    dreams: dreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }));
};

export const useDreamStore = create<DreamState>()(
  persist(
    (set, get) => ({
      dreams: [],
      sortBy: 'date-desc',
      addDream: (dream) => set((state) => ({ 
        dreams: [dream, ...state.dreams] 
      })),
      deleteDream: (id) => set((state) => ({
        dreams: state.dreams.filter((dream) => dream.id !== id)
      })),
      getDream: (id) => get().dreams.find((dream) => dream.id === id),
      setSortBy: (sortBy) => set({ sortBy }),
      getSortedDreams: () => {
        const { dreams, sortBy } = get();
        return sortDreams(dreams, sortBy);
      },
      getGroupedDreams: () => {
        const { dreams, sortBy } = get();
        const sortedDreams = sortDreams(dreams, sortBy);
        return groupDreams(sortedDreams, sortBy);
      },
    }),
    {
      name: 'spiralite-dreams',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);