import { GoogleGenAI } from "@google/genai";
import { FocusSession, PetState, BlockItem } from "../types";

// Helper to safely get AI instance
const getAI = () => {
  // Use a safe check for the environment variable. 
  // In Vite/CRA locally, process might be missing or strict.
  // We prefer the key passed from settings in the new architecture, 
  // but for this legacy service we handle the missing key gracefully.
  const apiKey = typeof process !== 'undefined' ? process.env?.API_KEY : '';
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getPetCoaching = async (
  petState: PetState,
  lastSession: FocusSession | null,
  blockedItems: BlockItem[]
): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return "Let's focus together! (Add API Key in settings)";

    const blockedNames = blockedItems.map(b => b.url).join(", ");
    
    let prompt = `You are a virtual pet named ${petState.name}. 
    Current stats: Health ${petState.health}/100, Level ${petState.level}.
    The user is trying to focus and avoid these distractions: ${blockedNames || "None defined"}.
    `;

    if (lastSession) {
      prompt += `The user just finished a session. Duration: ${lastSession.durationMinutes} minutes. Completed: ${lastSession.completed}. Distractions detected: ${lastSession.distractions}.`;
    } else {
      prompt += `The user is looking at the dashboard. Give them a short, cute, motivating sentence to start focusing.`;
    }

    prompt += `\nKeep the response under 150 characters. Be supportive but remind them that your health depends on their focus. If they had distractions, scold them gently.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Let's focus together!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm ready to focus when you are!";
  }
};