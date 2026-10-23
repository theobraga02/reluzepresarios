import { MockProvider } from './mockProvider';
import { GeminiRealProvider } from './geminiProvider';
import { DiagnosticProvider } from './types';

let providerInstance: DiagnosticProvider;

export function getDiagnosticProvider(): DiagnosticProvider {
  if (!providerInstance) {
    // Se houver uma chave da API do Gemini configurada (seja em localStorage ou .env), usa o provedor real do Gemini
    const temChave =
      Boolean(localStorage.getItem('gemini_api_key')) ||
      Boolean(import.meta.env.VITE_GEMINI_API_KEY);

    if (temChave) {
      providerInstance = new GeminiRealProvider();
    } else {
      // Caso contrário, usa MockProvider como fallback determinístico
      providerInstance = new MockProvider();
    }
  }
  return providerInstance;
}

export function setApiKeyAndSwitchToGemini(apiKey: string): void {
  localStorage.setItem('gemini_api_key', apiKey.trim());
  providerInstance = new GeminiRealProvider();
}
