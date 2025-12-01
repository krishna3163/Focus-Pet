import { GoogleGenAI } from "@google/genai";
import { FocusSession, PetState, BlockItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPetCoaching = async (
  petState: PetState,
  lastSession: FocusSession | null,
  blockedItems: BlockItem[]
): Promise<string> => {
  try {
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