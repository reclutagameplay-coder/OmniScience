import { GoogleGenAI, Type } from "@google/genai";
import { Subject, QuizQuestion } from '../types';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Caching System ---
const theoryCache: Record<string, string> = {}; // Key format: "Subject-Topic"
const topicsCache: Record<string, string[]> = {}; // Key format: "Subject"

/**
 * Solves a problem using the Thinking Model (Gemini 2.5/3.0 Pro) for high reasoning.
 */
export const solveProblem = async (subject: Subject, problem: string): Promise<string> => {
  try {
    const systemInstruction = `
      Actúa como un profesor experto y paciente de ${subject}.
      Tu objetivo es resolver el problema proporcionado paso a paso.
      1. Identifica qué tipo de problema es.
      2. Desglosa los datos conocidos.
      3. Explica las fórmulas o teoremas necesarios.
      4. Resuelve el problema mostrando el procedimiento matemático claramente.
      5. Concluye con la respuesta final resaltada.
      Usa formato Markdown. Usa LaTeX (entre signos $) para fórmulas matemáticas complejas si es necesario.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Best for complex reasoning (STEM)
      contents: problem,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 4096 }, // Enable thinking for complex logic
      },
    });

    return response.text || "No pude generar una respuesta. Intenta de nuevo.";
  } catch (error) {
    console.error("Error solving problem:", error);
    throw new Error("Hubo un error al conectar con el tutor virtual.");
  }
};

/**
 * Explains a theoretical concept with caching.
 */
export const getTheoryExplanation = async (subject: Subject, topic: string): Promise<string> => {
  const cacheKey = `${subject}-${topic}`;
  if (theoryCache[cacheKey]) {
    return theoryCache[cacheKey];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Fast for text generation
      contents: `Explica detalladamente el tema "${topic}" en el contexto de ${subject}.
      La explicación debe ser visualmente rica y estructurada en Markdown.
      
      Estructura requerida:
      # Título del Concepto
      
      ## Definición
      [Definición clara y concisa]

      ## Principios Clave
      - [Punto 1]
      - [Punto 2]
      
      ## Explicación Detallada
      [Desarrollo del tema usando párrafos claros]

      ## Analogía / Ejemplo Real
      [Una comparación simple o uso práctico]

      Usa **negritas** para términos importantes.
      `,
    });

    const text = response.text || "No hay explicación disponible.";
    theoryCache[cacheKey] = text; // Save to cache
    return text;
  } catch (error) {
    console.error("Error fetching theory:", error);
    throw new Error("No pude recuperar la teoría.");
  }
};

/**
 * Generates a quiz using structured JSON output.
 */
export const generateQuiz = async (subject: Subject, difficulty: 'Fácil' | 'Medio' | 'Difícil'): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genera 5 preguntas de opción múltiple sobre ${subject}, nivel ${difficulty}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER, description: "Index 0-3 of the correct answer" },
              explanation: { type: Type.STRING, description: "Brief explanation of why it is correct" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

/**
 * Suggests topics for the theory section with caching.
 */
export const suggestTopics = async (subject: Subject): Promise<string[]> => {
    if (topicsCache[subject]) {
        return topicsCache[subject];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Dame una lista JSON de 8 temas fundamentales, interesantes y ordenados por complejidad para estudiar en ${subject}. Solo devuelve un array de strings.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const topics = JSON.parse(response.text || "[]");
        topicsCache[subject] = topics; // Save to cache
        return topics;
    } catch (e) {
        return ["Conceptos Básicos", "Historia", "Aplicaciones Modernas"];
    }
}