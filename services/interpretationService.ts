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
      // Extract dream type - look for the exact format from the system prompt
      const dreamTypeMatch = rawResponse.match(/DREAM_TYPE:\s*([^\n\r]+)/i);
      let dreamType = 'psychic'; // default fallback
      
      if (dreamTypeMatch) {
        const extractedType = dreamTypeMatch[1].trim().toLowerCase();
        // Validate against known dream types
        const validTypes = ['mnemonic', 'psychic', 'pre-echo', 'lucid', 'meta-lucid'];
        if (validTypes.includes(extractedType)) {
          dreamType = extractedType;
        }
      }
      
      // Extract interpretation (everything after "INTERPRETATION:")
      const interpretationMatch = rawResponse.match(/INTERPRETATION:\s*([\s\S]*)/i);
      let interpretation = rawResponse;
      
      if (interpretationMatch) {
        interpretation = interpretationMatch[1].trim();
      } else {
        // If no INTERPRETATION: section found, try to remove the DREAM_TYPE and CLASSIFICATION_REASON parts
        interpretation = rawResponse
          .replace(/DREAM_TYPE:\s*[^\n\r]+/i, '')
          .replace(/CLASSIFICATION_REASON:\s*[^\n\r]+/i, '')
          .trim();
      }
      
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