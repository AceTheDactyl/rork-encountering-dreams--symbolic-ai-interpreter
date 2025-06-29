import { Dream } from '@/types/dream';
import { dreamSymbols, dreamThemes } from '@/constants/symbols';

// Detect symbols in dream content
export const detectSymbols = (content: string): string[] => {
  const detectedSymbols: string[] = [];
  
  dreamSymbols.forEach(symbol => {
    // Check if the symbol character is in the content
    if (content.includes(symbol.symbol)) {
      detectedSymbols.push(symbol.symbol);
    }
    
    // Check if the symbol name is mentioned
    if (content.toLowerCase().includes(symbol.name.toLowerCase())) {
      detectedSymbols.push(symbol.symbol);
    }
  });
  
  return [...new Set(detectedSymbols)]; // Remove duplicates
};

// Detect themes in dream content
export const detectThemes = (content: string): string[] => {
  const detectedThemes: string[] = [];
  
  dreamThemes.forEach(theme => {
    if (content.toLowerCase().includes(theme.name.toLowerCase())) {
      detectedThemes.push(theme.id);
    }
  });
  
  return [...new Set(detectedThemes)]; // Remove duplicates
};

// Generate a basic interpretation based on symbols and themes
export const generateBasicInterpretation = (dream: Dream): string => {
  let interpretation = "Dream Analysis:\n\n";
  
  // Add symbol interpretations
  if (dream.symbols.length > 0) {
    interpretation += "Symbols detected:\n";
    dream.symbols.forEach(symbolChar => {
      const symbol = dreamSymbols.find(s => s.symbol === symbolChar);
      if (symbol) {
        interpretation += `• ${symbol.symbol} (${symbol.name}): ${symbol.meaning}\n`;
      }
    });
    interpretation += "\n";
  }
  
  // Add theme interpretations
  if (dream.themes.length > 0) {
    interpretation += "Themes detected:\n";
    dream.themes.forEach(themeId => {
      const theme = dreamThemes.find(t => t.id === themeId);
      if (theme) {
        interpretation += `• ${theme.symbol} ${theme.name}\n`;
      }
    });
    interpretation += "\n";
  }
  
  // Add special dream type notes
  if (dream.isLucid) {
    interpretation += "This was a lucid dream, indicating awareness and potential for conscious direction within the dream state.\n\n";
  }
  
  if (dream.isRecurring) {
    interpretation += "This is a recurring dream, which often points to unresolved issues or important messages from your subconscious.\n\n";
  }
  
  interpretation += "Remember that dream interpretation is subjective. Consider how these symbols and themes relate to your personal experiences and emotions.";
  
  return interpretation;
};

// Detect patterns across multiple dreams
export const detectPatterns = (dreams: Dream[]): string[] => {
  const patterns: string[] = [];
  const symbolCounts: Record<string, number> = {};
  const themeCounts: Record<string, number> = {};
  
  // Count occurrences of symbols and themes
  dreams.forEach(dream => {
    dream.symbols.forEach(symbol => {
      symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    });
    
    dream.themes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
  });
  
  // Identify frequent symbols
  Object.entries(symbolCounts).forEach(([symbol, count]) => {
    if (count >= 3) { // Arbitrary threshold
      const symbolObj = dreamSymbols.find(s => s.symbol === symbol);
      if (symbolObj) {
        patterns.push(`The symbol ${symbolObj.symbol} (${symbolObj.name}) appears in ${count} dreams, suggesting ${symbolObj.meaning} is a recurring theme in your subconscious.`);
      }
    }
  });
  
  // Identify frequent themes
  Object.entries(themeCounts).forEach(([themeId, count]) => {
    if (count >= 2) { // Arbitrary threshold
      const themeObj = dreamThemes.find(t => t.id === themeId);
      if (themeObj) {
        patterns.push(`The theme "${themeObj.name}" ${themeObj.symbol} appears in ${count} dreams, suggesting it may be significant in your dream landscape.`);
      }
    }
  });
  
  return patterns;
};