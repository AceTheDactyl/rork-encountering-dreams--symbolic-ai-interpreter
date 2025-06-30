import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream } from '@/types/dream';

interface DreamState {
  dreams: Dream[];
  addDream: (dream: Dream) => void;
  deleteDream: (id: string) => void;
  getDream: (id: string) => Dream | undefined;
}

export const useDreamStore = create<DreamState>()(
  persist(
    (set, get) => ({
      dreams: [],
      addDream: (dream) => set((state) => ({ 
        dreams: [dream, ...state.dreams] 
      })),
      deleteDream: (id) => set((state) => ({
        dreams: state.dreams.filter((dream) => dream.id !== id)
      })),
      getDream: (id) => get().dreams.find((dream) => dream.id === id),
    }),
    {
      name: 'spiralite-dreams',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);