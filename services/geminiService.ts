
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateIrresistibleDescription(productName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escreva uma descrição curta, profissional e altamente vendedora para um produto gastronômico chamado "${productName}". Use palavras sensoriais, foco em qualidade artesanal e seja conciso (máximo 150 caracteres).`,
    });
    return response.text?.trim() || `Delicioso ${productName} feito com ingredientes selecionados e muito carinho.`;
  } catch (error) {
    console.error("Gemini API error:", error);
    return `O melhor ${productName} da região, preparado artesanalmente para você.`;
  }
}
