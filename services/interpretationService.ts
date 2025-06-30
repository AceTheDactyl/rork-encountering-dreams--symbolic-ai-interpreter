import { Persona } from '@/types/dream';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  completion: string;
}

interface ParsedInterpretation {
  dreamType: string;
  interpretation: string;
}

export class InterpretationService {
  private static readonly API_URL = 'https://toolkit.rork.com/text/llm/';

  static async interpretDream(dreamText: string, persona: Persona): Promise<ParsedInterpretation> {
    try {
      const messages: AIMessage[] = [
        {
          role: 'system',
          content: persona.systemPrompt
        },
        {
          role: 'user',
          content: `Please interpret this dream: ${dreamText}`
        }
      ];

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: AIResponse = await response.json();
      return this.parseInterpretation(data.completion);
    } catch (error) {
      console.error('Interpretation service error:', error);
      throw new Error('Unable to retrieve interpretation. Please check your internet connection and try again.');
    }
  }

  private static parseInterpretation(rawResponse: string): ParsedInterpretation {
    try {
      // Extract dream type
      const dreamTypeMatch = rawResponse.match(/DREAM_TYPE:\s*([^\n]+)/i);
      const dreamType = dreamTypeMatch ? dreamTypeMatch[1].trim() : 'psychic'; // default fallback
      
      // Extract interpretation (everything after "INTERPRETATION:")
      const interpretationMatch = rawResponse.match(/INTERPRETATION:\s*([\s\S]*)/i);
      const interpretation = interpretationMatch ? interpretationMatch[1].trim() : rawResponse;
      
      return {
        dreamType,
        interpretation
      };
    } catch (error) {
      console.error('Error parsing interpretation:', error);
      // Fallback: return the raw response as interpretation with default type
      return {
        dreamType: 'psychic',
        interpretation: rawResponse
      };
    }
  }
}