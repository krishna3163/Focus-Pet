
import { GoogleGenAI } from "@google/genai";
import { PetState, FocusSession, PetType } from "../types";

// Helper to get AI instance safely
const getAI = (apiKey: string) => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getPetResponse = async (
  apiKey: string,
  pet: PetState,
  petType: PetType,
  context: 'START_FOCUS' | 'DISTRACTED' | 'COMPLETED' | 'IDLE',
  recentSession?: FocusSession
): Promise<string> => {
  if (!apiKey) {
    // Canned responses if no API key provided
    const canned = [
      "I'm ready when you are!",
      "Let's focus!",
      "You can do it!",
      "Remember to drink water.",
      "Stay focused!"
    ];
    return canned[Math.floor(Math.random() * canned.length)];
  }

  try {
    const ai = getAI(apiKey);
    if (!ai) throw new Error("No API Key");

    // Determine persona based on pet type
    let persona = "helpful and energetic";
    if (petType === PetType.CAT) persona = "slightly sassy but caring, uses 'meow' occasionally";
    if (petType === PetType.ROBOT) persona = "logical, efficient, robotic beeps and boops";
    if (petType === PetType.PLANT) persona = "zen, calm, uses nature metaphors";
    if (petType === PetType.BLOB) persona = "bubbly, squishy, speaks in simple cute sentences using 'bloop'";

    const prompt = `
      You are a virtual pet (${petType}) named ${pet.name}.
      Your personality is: ${persona}.
      Current Status: Health ${pet.health}%, Happiness ${pet.happiness}%.
      
      The user is in the context: ${context}.
      ${recentSession ? `Last session: ${recentSession.durationMinutes} minutes. Success: ${recentSession.completed}` : ''}
      
      Write a VERY SHORT (max 1 sentence), cute, motivating, or funny message to the user.
      Do not use quotes. Just the text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Let's do this!";
  } catch (error) {
    console.error("AI Error:", error);
    return "I believe in you!";
  }
};

export const getDailySummary = async (apiKey: string, sessions: FocusSession[]): Promise<string> => {
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date.startsWith(today));
  
  if (todaySessions.length === 0) return "No focus sessions recorded today yet.";
  
  if (!apiKey) {
    return `You've completed ${todaySessions.filter(s => s.completed).length} sessions today!`;
  }

  try {
    const ai = getAI(apiKey);
    if (!ai) throw new Error("No API Key");

    const totalMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const completed = todaySessions.filter(s => s.completed).length;

    const prompt = `
      Analyze this daily productivity data:
      Total Focus Time: ${totalMinutes} minutes.
      Sessions Completed: ${completed}/${todaySessions.length}.
      
      Give a 2-sentence encouraging summary of the user's performance today. 
      Be bubbly and fun.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Great job today! Keep it up!";
  } catch (error) {
    return "You've been working hard today!";
  }
};
