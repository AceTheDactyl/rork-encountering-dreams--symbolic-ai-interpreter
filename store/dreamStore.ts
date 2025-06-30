import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream } from '@/types/dream';

export type SortOption = 'type' | 'persona' | 'mnemonic' | 'psychic' | 'pre-echo' | 'lucid' | 'meta-lucid';

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

const filterAndSortDreams = (dreams: Dream[], sortBy: SortOption): Dream[] => {
  let filteredDreams = [...dreams];
  
  // Filter by specific dream type if selected
  if (['mnemonic', 'psychic', 'pre-echo', 'lucid', 'meta-lucid'].includes(sortBy)) {
    filteredDreams = dreams.filter(dream => dream.dreamType === sortBy);
  }
  
  // Always sort by date desc within filtered results
  return filteredDreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const groupDreams = (dreams: Dream[], sortBy: SortOption): { groupTitle: string; dreams: Dream[] }[] => {
  // For specific dream type filters, don't group - just return all dreams
  if (['mnemonic', 'psychic', 'pre-echo', 'lucid', 'meta-lucid'].includes(sortBy)) {
    return [{ groupTitle: '', dreams }];
  }

  // For 'type' and 'persona' sorting, group the dreams
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
      sortBy: 'type',
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
        return filterAndSortDreams(dreams, sortBy);
      },
      getGroupedDreams: () => {
        const { dreams, sortBy } = get();
        const filteredDreams = filterAndSortDreams(dreams, sortBy);
        return groupDreams(filteredDreams, sortBy);
      },
    }),
    {
      name: 'spiralite-dreams',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);