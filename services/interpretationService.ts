import { Persona } from '@/types/dream';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  completion: string;
}

interface ParsedInterpretation {
  name: string;
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
          content: `${persona.systemPrompt}

IMPORTANT: Your response must include these three sections in this exact format:

DREAM_NAME: [A poetic, evocative title for this dream in 2-6 words that captures its essence]

DREAM_TYPE: [One of: mnemonic, psychic, pre-echo, lucid, meta-lucid]

INTERPRETATION: [Your full interpretation of the dream]

The dream name should be memorable and capture the core imagery or emotion of the dream. Examples: "The Floating Library", "Chasing Shadows Home", "Mirror of Lost Time", "The Singing Forest".`
        },
        {
          role: 'user',
          content: `Please interpret this dream and provide a name for it: ${dreamText}`
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
      return this.parseInterpretation(data.completion, dreamText);
    } catch (error) {
      console.error('Interpretation service error:', error);
      throw new Error('Unable to retrieve interpretation. Please check your internet connection and try again.');
    }
  }

  private static parseInterpretation(rawResponse: string, dreamText: string): ParsedInterpretation {
    try {
      // Extract dream name
      const nameMatch = rawResponse.match(/DREAM_NAME:\s*([^\n\r]+)/i);
      let name = 'Untitled Dream';
      
      if (nameMatch) {
        name = nameMatch[1].trim();
        // Remove quotes if present
        name = name.replace(/^["']|["']$/g, '');
      } else {
        // Fallback: generate name from first few words of dream
        const words = dreamText.trim().split(/\s+/).slice(0, 4);
        name = words.join(' ');
        if (dreamText.length > name.length) {
          name += '...';
        }
      }
      
      // Extract dream type
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
        // If no INTERPRETATION: section found, try to remove the other parts
        interpretation = rawResponse
          .replace(/DREAM_NAME:\s*[^\n\r]+/i, '')
          .replace(/DREAM_TYPE:\s*[^\n\r]+/i, '')
          .replace(/CLASSIFICATION_REASON:\s*[^\n\r]+/i, '')
          .trim();
      }
      
      return {
        name,
        dreamType,
        interpretation
      };
    } catch (error) {
      console.error('Error parsing interpretation:', error);
      // Fallback: return basic values
      const fallbackName = dreamText.trim().split(/\s+/).slice(0, 4).join(' ') + '...';
      return {
        name: fallbackName,
        dreamType: 'psychic',
        interpretation: rawResponse
      };
    }
  }
}