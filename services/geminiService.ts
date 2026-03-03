
import { GoogleGenAI, Type } from "@google/genai";
import { ServiceRequest, ServiceType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartPrioritization(requests: ServiceRequest[]) {
  const prompt = `
    Analyze the following logistics requests for a local business and suggest a prioritization order.
    Consider service types (Food is high priority, Laundry is medium, Garbage is routine).
    
    Requests:
    ${JSON.stringify(requests.map(r => ({ id: r.id, type: r.type, address: r.address, time: r.createdAt })))}
    
    Return a JSON array of request IDs in suggested order of handling, with a short reason for each.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              reason: { type: Type.STRING },
              priorityScore: { type: Type.NUMBER }
            },
            required: ["id", "reason", "priorityScore"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini prioritization failed", error);
    return null;
  }
}

export async function generateRiderBriefing(request: ServiceRequest) {
  const prompt = `Generate a concise 1-sentence briefing for a rider picking up a ${request.type} request at ${request.address}. Notes: ${request.notes || 'None'}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    return "Ensure safe delivery and follow safety protocols.";
  }
}
