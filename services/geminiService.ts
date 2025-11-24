import { GoogleGenAI, Chat, GroundingChunk } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Source } from '../types';

// Initialize lazily to prevent startup crashes if API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    // Safely check for process.env to avoid "ReferenceError: process is not defined" in browser
    const apiKey = typeof process !== 'undefined' && process.env 
      ? process.env.API_KEY 
      : undefined;

    if (!apiKey) {
      throw new Error("API_KEY environment variable not set. Ensure you have defined 'API_KEY' in your Vercel deployment settings and that your build tool exposes it.");
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