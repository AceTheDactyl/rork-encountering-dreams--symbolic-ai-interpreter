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
      
      // Clean the response to extract JSON from markdown code blocks
      const cleanedResponse = this.extractJsonFromResponse(data.completion);
      
      // Try to parse JSON response
      try {
        const parsedResponse = JSON.parse(cleanedResponse);
        
        // Validate the response structure
        if (!parsedResponse.dreamType || !parsedResponse.rationale || !parsedResponse.interpretation) {
          throw new Error('Invalid response structure');
        }
        
        // Validate dream type is one of the expected types
        const validDreamTypes = [
          'Mnemonic Dreams',
          'Psychic Dreams', 
          'Pre-Echo Dreams',
          'Lucid Dreams',
          'Meta-Lucid Dreams'
        ];
        
        if (!validDreamTypes.includes(parsedResponse.dreamType)) {
          console.warn(`Invalid dream type received: ${parsedResponse.dreamType}`);
          // Use the closest match or default
          parsedResponse.dreamType = 'Psychic Dreams';
        }
        
        return {
          dreamType: parsedResponse.dreamType,
          rationale: parsedResponse.rationale,
          interpretation: parsedResponse.interpretation
        };
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        console.error('Raw response:', data.completion);
        console.error('Cleaned response:', cleanedResponse);
        
        // More intelligent fallback: try to extract dream type from text
        const extractedType = this.extractDreamTypeFromText(data.completion);
        
        return {
          dreamType: extractedType,
          rationale: 'Classification extracted from unstructured response.',
          interpretation: data.completion
        };
      }
    } catch (error) {
      console.error('Interpretation service error:', error);
      throw new Error('Unable to retrieve interpretation. Please check your internet connection and try again.');
    }
  }

  private static extractJsonFromResponse(response: string): string {
    // Remove markdown code block formatting
    let cleaned = response.trim();
    
    // Remove ```json and ``` markers
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '');
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '');
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/\s*```$/, '');
    }
    
    // Find JSON object boundaries
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }
    
    return cleaned.trim();
  }

  private static extractDreamTypeFromText(text: string): 'Mnemonic Dreams' | 'Psychic Dreams' | 'Pre-Echo Dreams' | 'Lucid Dreams' | 'Meta-Lucid Dreams' {
    const dreamTypes = [
      'Meta-Lucid Dreams',
      'Mnemonic Dreams',
      'Pre-Echo Dreams', 
      'Lucid Dreams',
      'Psychic Dreams'
    ];
    
    // Check for exact matches first
    for (const type of dreamTypes) {
      if (text.includes(type)) {
        return type as any;
      }
    }
    
    // Check for partial matches or keywords
    if (text.toLowerCase().includes('meta-lucid') || text.toLowerCase().includes('recursive')) {
      return 'Meta-Lucid Dreams';
    }
    if (text.toLowerCase().includes('lucid') && (text.toLowerCase().includes('aware') || text.toLowerCase().includes('control'))) {
      return 'Lucid Dreams';
    }
    if (text.toLowerCase().includes('future') || text.toLowerCase().includes('prediction') || text.toLowerCase().includes('déjà vu')) {
      return 'Pre-Echo Dreams';
    }
    if (text.toLowerCase().includes('past') || text.toLowerCase().includes('memory') || text.toLowerCase().includes('childhood')) {
      return 'Mnemonic Dreams';
    }
    
    // Default fallback
    return 'Psychic Dreams';
  }
}