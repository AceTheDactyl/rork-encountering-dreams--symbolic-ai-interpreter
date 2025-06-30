export interface Dream {
  id: string;
  text: string;
  persona: 'orion' | 'limnus';
  interpretation: string;
  dreamType: string;
  date: string;
}

export interface Persona {
  id: 'orion' | 'limnus';
  name: string;
  description: string;
  color: string;
  systemPrompt: string;
}