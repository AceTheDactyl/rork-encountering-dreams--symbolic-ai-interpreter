export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  symbols: string[];
  themes: string[];
  isLucid: boolean;
  isRecurring: boolean;
  interpretation?: string;
  patterns?: string[];
}

export interface DreamSymbol {
  symbol: string;
  name: string;
  meaning: string;
}

export interface DreamTheme {
  id: string;
  name: string;
  symbol: string;
}