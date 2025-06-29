export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  symbols: string[];
  themes: string[];
  isLucid: boolean;
  isRecurring: boolean;
}

export type Persona = "orion" | "limnus";

export interface DreamInterpretation {
  interpretation: string;
  persona: Persona;
  timestamp: string;
}