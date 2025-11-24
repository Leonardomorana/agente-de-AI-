import { GoogleGenAI, Chat, GroundingChunk } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Source } from '../types';

// Initialize lazily to prevent startup crashes if API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getApiKey(): string | undefined {
  let key: string | undefined;

  // 1. Try standard process.env.API_KEY (Bundler replacement or Node env)
  try {
    // This looks redundant but is necessary for bundlers like Webpack/Vite 
    // to statically replace "process.env.API_KEY" with the actual string.
    key = process.env.API_KEY;
  } catch (e) {
    // ReferenceError if process is not defined and no replacement happened
  }

  if (key) return key;

  // 2. Try import.meta.env (Vite standard)
  try {
    // @ts-ignore - import.meta might not be typed in all setups
    if (import.meta && import.meta.env) {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
    }
  } catch (e) {
    // Ignore syntax or reference errors
  }

  return key;
}

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = getApiKey();

    if (!apiKey) {
      console.error("API Key lookup failed. Checked process.env.API_KEY and import.meta.env.");
      throw new Error("API Key not found. Please ensure 'API_KEY' or 'VITE_API_KEY' is set in your environment variables.");
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
    // Return the error message to the UI so the user knows what happened
    if (error instanceof Error && error.message.includes("API Key")) {
        return {
            text: "⚠️ **Erro de Configuração**: A chave de API não foi detectada. Por favor, verifique as configurações de ambiente no Vercel.",
            sources: []
        };
    }
    return {
      text: "Desculpe, ocorreu um erro ao me comunicar com a IA. Por favor, tente novamente mais tarde.",
      sources: []
    };
  }
}