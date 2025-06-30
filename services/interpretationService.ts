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
      
      console.log('Raw AI response:', data.completion);
      
      // Clean the response to extract JSON from markdown code blocks
      const cleanedResponse = this.extractJsonFromResponse(data.completion);
      
      console.log('Cleaned response:', cleanedResponse);
      
      // Try to parse JSON response
      try {
        const parsedResponse = JSON.parse(cleanedResponse);
        
        console.log('Parsed response:', parsedResponse);
        
        // Validate the response structure
        if (!parsedResponse.dreamType || !parsedResponse.rationale || !parsedResponse.interpretation) {
          console.warn('Invalid response structure:', parsedResponse);
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
          parsedResponse.dreamType = this.extractDreamTypeFromText(data.completion);
        }
        
        console.log('Final classification:', parsedResponse.dreamType);
        
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
        
        // Try to extract interpretation from the raw text
        const interpretation = this.extractInterpretationFromText(data.completion);
        
        return {
          dreamType: extractedType,
          rationale: 'Classification extracted from unstructured response.',
          interpretation: interpretation
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
    if (cleaned.includes('```json')) {
      const jsonStart = cleaned.indexOf('```json') + 7;
      const jsonEnd = cleaned.indexOf('```', jsonStart);
      if (jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd).trim();
      } else {
        cleaned = cleaned.substring(jsonStart).trim();
      }
    } else if (cleaned.includes('```')) {
      // Handle generic code blocks
      const codeStart = cleaned.indexOf('```');
      const codeEnd = cleaned.indexOf('```', codeStart + 3);
      if (codeEnd !== -1) {
        cleaned = cleaned.substring(codeStart + 3, codeEnd).trim();
      } else {
        cleaned = cleaned.substring(codeStart + 3).trim();
      }
    }
    
    // Find JSON object boundaries if no code blocks
    if (!cleaned.startsWith('{')) {
      const jsonStart = cleaned.indexOf('{');
      if (jsonStart !== -1) {
        const jsonEnd = cleaned.lastIndexOf('}');
        if (jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        }
      }
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
    if (text.toLowerCase().includes('meta-lucid') || 
        text.toLowerCase().includes('recursive') ||
        text.toLowerCase().includes('architectural interface') ||
        text.toLowerCase().includes('tesseract') ||
        text.toLowerCase().includes('timefolds')) {
      return 'Meta-Lucid Dreams';
    }
    if (text.toLowerCase().includes('lucid') && 
        (text.toLowerCase().includes('aware') || 
         text.toLowerCase().includes('control') ||
         text.toLowerCase().includes('flying') ||
         text.toLowerCase().includes('flight'))) {
      return 'Lucid Dreams';
    }
    if (text.toLowerCase().includes('future') || 
        text.toLowerCase().includes('prediction') || 
        text.toLowerCase().includes('déjà vu') ||
        text.toLowerCase().includes('probability')) {
      return 'Pre-Echo Dreams';
    }
    if (text.toLowerCase().includes('past') || 
        text.toLowerCase().includes('memory') || 
        text.toLowerCase().includes('childhood') ||
        text.toLowerCase().includes('ancestral')) {
      return 'Mnemonic Dreams';
    }
    
    // Default fallback
    return 'Psychic Dreams';
  }

  private static extractInterpretationFromText(text: string): string {
    // Try to extract the interpretation part from unstructured text
    const interpretationMarkers = [
      'interpretation":',
      'interpretation:',
      'Interpretation:',
      'This dream'
    ];
    
    for (const marker of interpretationMarkers) {
      const index = text.indexOf(marker);
      if (index !== -1) {
        let start = index + marker.length;
        let interpretation = text.substring(start).trim();
        
        // Clean up quotes and formatting
        if (interpretation.startsWith('"')) {
          const endQuote = interpretation.indexOf('"', 1);
          if (endQuote !== -1) {
            interpretation = interpretation.substring(1, endQuote);
          }
        }
        
        // Remove trailing JSON formatting
        interpretation = interpretation.replace(/["}]+$/, '').trim();
        
        if (interpretation.length > 50) {
          return interpretation;
        }
      }
    }
    
    // Fallback: return the whole text cleaned up
    return text.replace(/```json|```/g, '').trim();
  }
}