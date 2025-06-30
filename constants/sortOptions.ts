import { SortOption } from '@/store/dreamStore';

export interface SortOptionConfig {
  id: SortOption;
  label: string;
  description: string;
  icon: string;
}

export const sortOptions: SortOptionConfig[] = [
  {
    id: 'date-desc',
    label: 'Newest First',
    description: 'Most recent dreams at the top',
    icon: '↓'
  },
  {
    id: 'date-asc',
    label: 'Oldest First',
    description: 'Earliest dreams at the top',
    icon: '↑'
  },
  {
    id: 'type',
    label: 'By Dream Type',
    description: 'Group by dream classification',
    icon: '○'
  },
  {
    id: 'persona',
    label: 'By Persona',
    description: 'Group by Orion or Limnus',
    icon: '👤'
  }
];

export const getSortOption = (id: SortOption): SortOptionConfig | undefined => {
  return sortOptions.find(option => option.id === id);
};