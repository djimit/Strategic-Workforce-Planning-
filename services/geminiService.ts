
import { GoogleGenAI, Type } from "@google/genai";
import { HRAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeHRDocument = async (documentText: string): Promise<HRAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze the following HR strategic document or data and extract key workforce planning insights. Provide a structured analysis including metrics, skill gaps, a training roadmap, and strategic insights. 
    
    For the training roadmap, ensure you explicitly define:
    1. Key learning modules (with a name and a brief context/detail for each).
    2. Any prerequisites (with a name and a brief detail).
    3. The recommended or maximum team size per session.
    4. A 'managerApprovalStatus' based on whether the document implies this training is already greenlit, still a proposal, or faced previous pushback. Default to 'Pending' if unclear.
    5. 'skillsCovered': A list of specific competencies developed.
    6. 'deliveryMethod': How the training is conducted (e.g., 'Instructor-led Virtual', 'On-site Workshop', 'Self-paced eLearning').

    Document Content:
    ${documentText}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                current: { type: Type.NUMBER },
                target: { type: Type.NUMBER },
                unit: { type: Type.STRING },
              },
              required: ["category", "current", "target", "unit"],
            }
          },
          skillGaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                currentProficiency: { type: Type.NUMBER },
                requiredProficiency: { type: Type.NUMBER },
                priority: { type: Type.STRING },
              },
              required: ["skill", "currentProficiency", "requiredProficiency", "priority"],
            }
          },
          trainingRoadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                objective: { type: Type.STRING },
                duration: { type: Type.STRING },
                audience: { type: Type.STRING },
                expectedOutcome: { type: Type.STRING },
                teamSize: { type: Type.STRING },
                managerApprovalStatus: { 
                  type: Type.STRING, 
                  description: "Current approval status from management.",
                  enum: ["Pending", "Approved", "Rejected"] 
                },
                skillsCovered: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                deliveryMethod: { type: Type.STRING },
                modules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      detail: { type: Type.STRING }
                    },
                    required: ["name", "detail"]
                  }
                },
                prerequisites: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      detail: { type: Type.STRING }
                    },
                    required: ["name", "detail"]
                  }
                },
              },
              required: [
                "title", "objective", "duration", "audience", "expectedOutcome", 
                "modules", "prerequisites", "teamSize", "managerApprovalStatus",
                "skillsCovered", "deliveryMethod"
              ],
            }
          },
          strategicInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
              },
              required: ["title", "description", "impact"],
            }
          },
        },
        required: ["metrics", "skillGaps", "trainingRoadmap", "strategicInsights"],
      },
    },
  });

  return JSON.parse(response.text || '{}') as HRAnalysisResult;
};
