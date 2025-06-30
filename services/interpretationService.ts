import { Persona, InterpretationResponse } from '@/types/dream';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  completion: string;
}

export class InterpretationService {
  private static readonly API_URL = 'https://toolkit.rork.com/text/llm/';

  static async interpretDream(dreamText: string, persona: Persona): Promise<InterpretationResponse> {
    try {
      const messages: AIMessage[] = [
        {
          role: 'system',
          content: persona.systemPrompt
        },
        {
          role: 'user',
          content: `Please interpret and classify this dream: ${dreamText}`
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
      
      // Try to parse JSON response
      try {
        const parsedResponse = JSON.parse(data.completion);
        
        // Validate the response structure
        if (!parsedResponse.dreamType || !parsedResponse.rationale || !parsedResponse.interpretation) {
          throw new Error('Invalid response structure');
        }
        
        return {
          dreamType: parsedResponse.dreamType,
          rationale: parsedResponse.rationale,
          interpretation: parsedResponse.interpretation
        };
      } catch (parseError) {
        // Fallback: treat the entire response as interpretation with unknown type
        return {
          dreamType: 'Psychic Dreams', // Default fallback
          rationale: 'Classification unavailable due to response format.',
          interpretation: data.completion
        };
      }
    } catch (error) {
      console.error('Interpretation service error:', error);
      throw new Error('Unable to retrieve interpretation. Please check your internet connection and try again.');
    }
  }
}