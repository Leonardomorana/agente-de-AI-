import { GoogleGenAI, Chat, GroundingChunk } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Source } from '../types';

// Initialize lazily to prevent startup crashes if API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    let apiKey: string | undefined;

    try {
      // Direct access allows bundlers (Vite/Webpack) to replace 'process.env.API_KEY' with the actual string literal
      // even if the global 'process' object doesn't exist in the browser.
      apiKey = process.env.API_KEY;
    } catch (e) {
      // If 'process' is not defined and no replacement happened, ignore the ReferenceError
      console.warn("Could not access process.env.API_KEY directly.");
    }

    if (!apiKey) {
      throw new Error("API_KEY environment variable not set. Ensure you have defined 'API_KEY' in your Vercel deployment settings.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export function createChatSession(): Chat {
  const ai = getAiClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{googleSearch: {}}],
    },
  });
  return chat;
}

interface AiResponse {
  text: string;
  sources: Source[];
}

export async function sendMessageToAI(chat: Chat, message: string): Promise<AiResponse> {
  try {
    const response = await chat.sendMessage({ message });
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    
    const sources: Source[] = groundingChunks
      .map((chunk: GroundingChunk) => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri)
      .map(web => ({ uri: web.uri, title: web.title || web.uri }));

    return {
      text: response.text,
      sources,
    };
  } catch (error) {
    console.error("Error sending message to Gemini API:", error);
    return {
      text: "Desculpe, ocorreu um erro ao me comunicar com a IA. Por favor, tente novamente mais tarde.",
      sources: []
    };
  }
}