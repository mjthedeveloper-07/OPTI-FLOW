
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserInput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Senior Web Strategist, SEO Specialist, and Product Manager. 
Your goal is to analyze website context provided by users (text and optionally images) and generate actionable, high-impact optimizations.
Focus on modern SEO practices (semantic search, user intent), accessibility (WCAG), and feature recommendations that drive engagement (Relay features).
When generating Title Tags, ensure they are punchy, keyword-rich, and under 60 characters to prevent truncation in SERPs.
If an image is provided, analyze its visual hierarchy, design, and accessibility as part of your recommendations.
`;

export const analyzeWebsiteContent = async (input: UserInput): Promise<AnalysisResult> => {
  const promptText = `
    Analyze the following website context:
    Business Name: ${input.businessName}
    Target Audience: ${input.targetAudience}
    URL (optional reference): ${input.url || 'N/A'}
    Description/Goals: ${input.description}
    Sample Content: "${input.currentContent}"
    ${input.image ? "Note: An image screenshot of the website or design has been provided. Please use this to inform your accessibility tips (color contrast, layout) and feature recommendations." : ""}

    Please provide a structured analysis including:
    1. SEO Optimizations: 
       - Title Tag: A concise, high-impact title tag (max 60 chars) using power words and primary keywords.
       - Meta Description: A click-worthy summary (150-160 chars) with a clear call-to-action or value proposition.
       - Keywords: A list of 5-8 high-value semantic keywords.
       - Header Structure: Suggested H1/H2 hierarchy for the main landing page.
    2. Content Improvements: Specific, actionable advice to improve tone, readability, or conversion.
    3. Accessibility Tips: Key technical or visual changes to ensure inclusivity.
    4. Feature Recommendations: Suggest "Relay Features" - interactive elements, tools, or functionalities that keep users engaged or move them to the next step (e.g., calculators, chatbots, interactive demos, related content engines). For each, include a technical stack suggestion and a concrete user flow example (e.g. "User clicks 'Get Started', a modal opens asking for X...").
    5. A brief executive summary.
  `;

  const contents: any[] = [{ text: promptText }];

  if (input.image) {
    // Extract base64 data from the data URL (e.g., "data:image/png;base64,iVBOR...")
    const base64Data = input.image.split(',')[1];
    const mimeType = input.image.split(';')[0].split(':')[1];
    
    contents.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
        parts: contents
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          seo: {
            type: Type.OBJECT,
            properties: {
              titleTag: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              headerSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["titleTag", "metaDescription", "keywords", "headerSuggestions"]
          },
          contentImprovements: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          accessibilityTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendedFeatures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                difficulty: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard"] },
                techStackSuggestion: { type: Type.STRING },
                implementationExample: { type: Type.STRING }
              },
              required: ["name", "description", "impact", "difficulty"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["seo", "contentImprovements", "accessibilityTips", "recommendedFeatures", "summary"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response generated from AI.");
  }

  return JSON.parse(response.text) as AnalysisResult;
};
