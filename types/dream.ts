export type DreamType = 
  | 'Mnemonic Dreams'
  | 'Psychic Dreams' 
  | 'Pre-Echo Dreams'
  | 'Lucid Dreams'
  | 'Meta-Lucid Dreams';

export interface Dream {
  id: string;
  text: string;
  persona: 'orion' | 'limnus';
  interpretation: string;
  dreamType?: DreamType;
  rationale?: string;
  date: string;
}

export interface Persona {
  id: 'orion' | 'limnus';
  name: string;
  description: string;
  color: string;
  systemPrompt: string;
}

export interface InterpretationResponse {
  dreamType: DreamType;
  rationale: string;
  interpretation: string;
}