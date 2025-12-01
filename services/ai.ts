
import { GoogleGenAI } from "@google/genai";
import { Doctor } from "../types";

const getAI = (apiKey: string) => {
  if (!apiKey || apiKey.trim() === '') return null;
  return new GoogleGenAI({ apiKey });
};

// Generic helper to parse JSON from AI response
const parseAIJSON = (text: string, type: 'DOCTOR' | 'LAB' | 'DONATION' | 'HOSPITAL' | 'THERAPY' = 'DOCTOR') => {
  try {
    // 1. Strip Markdown code blocks
    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. Locate the start and end of the JSON structure (array or object)
    const firstOpenBrace = jsonStr.indexOf('{');
    const firstOpenBracket = jsonStr.indexOf('[');
    
    // If we find an array starts before an object, or there is no object, assume array
    if (firstOpenBracket !== -1 && (firstOpenBrace === -1 || firstOpenBracket < firstOpenBrace)) {
        const lastCloseBracket = jsonStr.lastIndexOf(']');
        if (lastCloseBracket !== -1) {
            jsonStr = jsonStr.substring(firstOpenBracket, lastCloseBracket + 1);
        }
    } else if (firstOpenBrace !== -1) {
        const lastCloseBrace = jsonStr.lastIndexOf('}');
        if (lastCloseBrace !== -1) {
            jsonStr = jsonStr.substring(firstOpenBrace, lastCloseBrace + 1);
        }
    }

    const parsed = JSON.parse(jsonStr);
    let results: any[] = [];

    // 3. Ensure we return an Array
    if (Array.isArray(parsed)) {
      results = parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
       // If it's an object (e.g. { "doctors": [...] }), look for the first array property
       const keys = Object.keys(parsed);
       for (const key of keys) {
         if (Array.isArray(parsed[key])) {
           results = parsed[key];
           break;
         }
       }
    }

    // 4. Post-process to ensure WORKING LINKS and MAP URLS
    return results.map(item => {
      let querySuffix = "appointment booking";
      if (type === 'LAB') querySuffix = "test booking contact";
      if (type === 'DONATION') querySuffix = "contact number location";
      if (type === 'HOSPITAL') querySuffix = "emergency contact directions";
      if (type === 'THERAPY') querySuffix = "therapy session booking";
      
      const query = `${item.name} ${item.location} ${querySuffix}`;
      const reliableUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.name} ${item.location}`)}`;

      return {
        ...item,
        website: reliableUrl, // Force a working link
        mapUrl: mapUrl
      };
    });

  } catch (e) {
    console.error("Failed to parse JSON", e);
    return [];
  }
};

export const findDoctors = async (
  apiKey: string,
  symptoms: string,
  location: string,
  preferredGender: string
): Promise<Doctor[]> => {
  if (!apiKey) throw new Error("API Key Missing");
  const ai = getAI(apiKey);
  if (!ai) throw new Error("Invalid API Key");

  const prompt = `
    Act as a medical directory API. 
    User Query: Symptoms: "${symptoms}", Location: "${location}", Gender Preference: "${preferredGender}".
    Task: Identify the specialist needed. Generate a JSON list of the 4-6 BEST and TOP RATED FICTIONAL doctors in that specific location area.
    Prioritize quality, experience, and proximity to "${location}".
    JSON Structure per item: { "id", "name", "specialty", "location", "rating" (number between 4.5 and 5.0), "gender", "bio" (highlight why they are the best), "phone" (e.g. +1 555...), "email" (e.g. booking@...), "website" (leave empty), "availableSlots": ["10:00 AM", "2:00 PM"] }
    IMPORTANT: Return ONLY the JSON array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return parseAIJSON(response.text || "[]", 'DOCTOR');
};

export const findHospitals = async (
  apiKey: string,
  need: string,
  location: string
): Promise<Doctor[]> => {
  if (!apiKey) throw new Error("API Key Missing");
  const ai = getAI(apiKey);
  if (!ai) throw new Error("Invalid API Key");

  const prompt = `
    Act as a medical directory API.
    User Query: Need: "${need}", Location: "${location}".
    Task: Generate a JSON list of the 4-5 BEST RATED FICTIONAL hospitals or emergency centers in that location.
    JSON Structure per item: { "id", "name", "specialty" (e.g. "Trauma Center", "General"), "location", "rating" (4.0-5.0), "gender" (set "N/A"), "bio" (facilities), "phone", "email", "availableSlots": ["24/7 Open"] }
    IMPORTANT: Return ONLY the JSON array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return parseAIJSON(response.text || "[]", 'HOSPITAL');
};

export const findTherapists = async (
  apiKey: string,
  issue: string,
  location: string
): Promise<Doctor[]> => {
  if (!apiKey) throw new Error("API Key Missing");
  const ai = getAI(apiKey);
  if (!ai) throw new Error("Invalid API Key");

  const prompt = `
    Act as a medical directory API.
    User Query: Mental Health Issue: "${issue}", Location: "${location}".
    Task: Generate a JSON list of the 4-5 BEST and MOST RECOMMENDED FICTIONAL therapists, psychologists, or counselors in that location.
    JSON Structure per item: { "id", "name", "specialty" (e.g. "CBT", "Clinical Psychology"), "location", "rating", "gender", "bio" (approach), "phone", "email", "availableSlots": ["Online", "In-Person"] }
    IMPORTANT: Return ONLY the JSON array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return parseAIJSON(response.text || "[]", 'THERAPY');
};

export const findLabs = async (
  apiKey: string,
  testType: string,
  location: string
): Promise<Doctor[]> => {
  if (!apiKey) throw new Error("API Key Missing");
  const ai = getAI(apiKey);
  if (!ai) throw new Error("Invalid API Key");

  const prompt = `
    Act as a medical directory API.
    User Query: Lab Test: "${testType}", Location: "${location}".
    Task: Generate a JSON list of 4-6 BEST RATED FICTIONAL pathology labs or diagnostic centers in that location.
    JSON Structure per item: { "id", "name", "specialty" (e.g. "Pathology", "Radiology"), "location", "rating" (number), "gender" (set to "N/A"), "bio" (services offered), "phone", "email", "website" (leave empty), "availableSlots": ["Walk-in"] }
    IMPORTANT: Return ONLY the JSON array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return parseAIJSON(response.text || "[]", 'LAB');
};

export const findDonationCenters = async (
  apiKey: string,
  type: 'BLOOD' | 'ORGAN',
  location: string,
  bloodGroup?: string
): Promise<Doctor[]> => {
  if (!apiKey) throw new Error("API Key Missing");
  const ai = getAI(apiKey);
  if (!ai) throw new Error("Invalid API Key");

  const prompt = `
    Act as a medical directory API.
    User Query: "${type} Donation Centers", Location: "${location}", User Blood Group: "${bloodGroup || 'Any'}".
    Task: Generate a JSON list of 4 REPUTABLE FICTIONAL donation centers or hospitals.
    JSON Structure per item: { "id", "name", "specialty" (e.g. "Blood Bank"), "location", "rating", "gender" ("N/A"), "bio" (urgency or details), "phone", "email", "website" (leave empty), "availableSlots": ["Walk-in"] }
    IMPORTANT: Return ONLY the JSON array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return parseAIJSON(response.text || "[]", 'DONATION');
};

export const analyzeCertificate = async (
  apiKey: string,
  imageBase64: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key Missing");
  const ai = getAI(apiKey);
  if (!ai) throw new Error("Invalid API Key");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: imageBase64 } },
        { text: "Analyze this medical certificate/report. Extract the Doctor Name, Patient Name, Diagnosis/Purpose, and Date. Summarize the validity and key medical details in simple terms for the patient." }
      ]
    }
  });

  return response.text || "Could not analyze image.";
};

export const chatWithMedicalAI = async (
  apiKey: string,
  message: string,
  history: {sender: string, text: string}[]
): Promise<string> => {
  if (!apiKey) return "Please set your API Key in Profile.";
  const ai = getAI(apiKey);
  if (!ai) return "Error initializing AI.";

  const context = history.slice(-5).map(h => `${h.sender}: ${h.text}`).join('\n');
  
  const prompt = `
    You are DocBook AI, a helpful medical assistant.
    Context:
    ${context}
    User: ${message}
    AI:
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "I didn't catch that.";
};

export interface DiagnosisResult {
  condition: string;
  likelihood: 'High' | 'Medium' | 'Low';
  reasoning: string;
  recommendation: string;
}

export const diagnosePatient = async (
  apiKey: string,
  description: string
): Promise<DiagnosisResult[]> => {
  if (!apiKey) throw new Error("API Key Missing");
  const ai = getAI(apiKey);
  if (!ai) throw new Error("Invalid API Key");

  const prompt = `
    Act as an expert medical diagnostician system named KkGPT.
    Patient Description: "${description}"
    Task: Analyze the description and provide a list of 3-5 possible medical diagnoses.
    IMPORTANT: This is for informational purposes only.
    Return the result as a raw JSON ARRAY.
    JSON Structure per item:
    {
      "condition": "Name of disease/condition",
      "likelihood": "High" | "Medium" | "Low",
      "reasoning": "Brief explanation why based on symptoms",
      "recommendation": "Suggested tests or immediate actions"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  try {
     const text = response.text || "[]";
     const jsonStart = text.indexOf('[');
     const jsonEnd = text.lastIndexOf(']');
     if (jsonStart !== -1 && jsonEnd !== -1) {
       return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
     }
     return [];
  } catch (e) {
    console.error("Diagnosis parsing error", e);
    return [];
  }
};
