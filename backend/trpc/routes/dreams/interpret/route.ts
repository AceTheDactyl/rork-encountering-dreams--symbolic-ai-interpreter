import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const PersonaSchema = z.enum(["orion", "limnus"]);

const PERSONA_PROMPTS = {
  orion: `You are Orion, an AI persona that provides analytical, structured dream interpretations. Your responses are logical, detailed, and formatted with clear sections for each symbol and theme. You approach dreams from a psychological and symbolic perspective, offering practical insights and structured analysis. Use bullet points, clear headings, and organized formatting. Focus on:
- Symbolic meanings and their psychological significance
- Emotional patterns and their implications
- Practical insights for the dreamer's waking life
- Clear, actionable interpretations`,

  limnus: `You are Limnus, an AI persona that provides poetic, intuitive dream interpretations. Your responses are creative, emotive, and use flowing narrative and metaphor. You approach dreams as mystical experiences and spiritual messages. Write in a lyrical, imaginative style that captures the dream's essence through:
- Poetic language and flowing metaphors
- Intuitive insights and spiritual connections
- Emotional resonance and deeper meanings
- Mystical and archetypal interpretations`
};

export default publicProcedure
  .input(z.object({ 
    dreamText: z.string().min(1),
    dreamTitle: z.string().optional(),
    persona: PersonaSchema,
    symbols: z.array(z.string()).optional(),
    themes: z.array(z.string()).optional(),
    isLucid: z.boolean().optional(),
    isRecurring: z.boolean().optional(),
  }))
  .mutation(async ({ input }) => {
    try {
      const { dreamText, dreamTitle, persona, symbols, themes, isLucid, isRecurring } = input;
      
      // Construct the dream context
      let dreamContext = `Dream: ${dreamTitle || "Untitled Dream"}\n\n${dreamText}`;
      
      if (symbols && symbols.length > 0) {
        dreamContext += `\n\nSymbols present: ${symbols.join(", ")}`;
      }
      
      if (themes && themes.length > 0) {
        dreamContext += `\n\nThemes detected: ${themes.join(", ")}`;
      }
      
      if (isLucid) {
        dreamContext += "\n\nNote: This was a lucid dream (the dreamer was aware they were dreaming).";
      }
      
      if (isRecurring) {
        dreamContext += "\n\nNote: This is a recurring dream.";
      }
      
      // Prepare the AI request
      const messages = [
        {
          role: "system" as const,
          content: PERSONA_PROMPTS[persona]
        },
        {
          role: "user" as const,
          content: dreamContext
        }
      ];
      
      // Call the AI API
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });
      
      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.completion) {
        throw new Error("No interpretation received from AI");
      }
      
      return {
        interpretation: data.completion,
        persona,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error) {
      console.error("Dream interpretation error:", error);
      throw new Error("Failed to generate dream interpretation. Please try again.");
    }
  });