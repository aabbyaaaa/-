import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PolishRequest, PolishResponse, Tone } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema strictly to ensure consistent JSON output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    variants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tone: {
            type: Type.STRING,
            enum: [Tone.CONCISE, Tone.STANDARD, Tone.FORMAL],
            description: "The tone of the response."
          },
          subject: {
            type: Type.STRING,
            description: "A professional email subject line suitable for this response."
          },
          content: {
            type: Type.STRING,
            description: "The complete polished response text including greeting and closing."
          }
        },
        required: ["tone", "content"],
        propertyOrdering: ["tone", "subject", "content"]
      }
    }
  },
  required: ["variants"]
};

export const polishText = async (request: PolishRequest): Promise<PolishResponse> => {
  const { sourceText, customerName, customerTitle } = request;

  // Construct the prompt
  const greetingInstruction = (customerName || customerTitle)
    ? `Address the customer as "${customerName || ''}${customerTitle || ''}".`
    : `Use a generic professional greeting (e.g., "您好，感謝您的詢問").`;

  const systemInstruction = `
    You are a specialized "Technical Customer Service Polishing Assistant". 
    Your goal is to take raw technical notes from engineers and convert them into polite, professional customer service replies in Traditional Chinese (繁體中文).
    
    CRITICAL RULES (Hard Constraints):
    1. **Term Integrity**: DO NOT change, translate, or remove any technical terms, model numbers (e.g., ABC-1234), values (e.g., 0.22 μm), units, or part numbers. Verify this strictly.
    2. **Language**: Output MUST be in Traditional Chinese (Taiwan).
    3. **Tone Variance**: You must generate exactly 3 versions:
       - **Concise (精簡)**: Direct, efficient, minimal pleasantries, suitable for quick updates.
       - **Standard (標準)**: Balanced, friendly, standard business polite.
       - **Formal (正式)**: Highly respectful, more honorifics, suitable for official notices or senior management.
    4. **Structure**:
       - ${greetingInstruction}
       - Include the technical content (polished flow, but preserved facts).
       - End with a polite closing (e.g., "如需補充資訊，歡迎告知").
  `;

  const userPrompt = `
    Raw Technical Text:
    """
    ${sourceText}
    """
    
    Please generate the 3 variants now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Low temperature for consistency and adherence to facts
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(jsonText) as PolishResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};