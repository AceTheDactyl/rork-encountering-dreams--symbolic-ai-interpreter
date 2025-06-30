import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream } from '@/types/dream';

export type SortOption = 'date-desc' | 'date-asc' | 'type' | 'persona' | 'length-desc' | 'length-asc';

interface DreamState {
  dreams: Dream[];
  sortBy: SortOption;
  addDream: (dream: Dream) => void;
  deleteDream: (id: string) => void;
  getDream: (id: string) => Dream | undefined;
  setSortBy: (sortBy: SortOption) => void;
  getSortedDreams: () => Dream[];
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
    
    case 'length-desc':
      return dreamsCopy.sort((a, b) => {
        if (a.text.length !== b.text.length) {
          return b.text.length - a.text.length;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    case 'length-asc':
      return dreamsCopy.sort((a, b) => {
        if (a.text.length !== b.text.length) {
          return a.text.length - b.text.length;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    default:
      return dreamsCopy;
  }
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
    }),
    {
      name: 'spiralite-dreams',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);