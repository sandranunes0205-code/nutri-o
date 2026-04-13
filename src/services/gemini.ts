import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CalorieResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  explanation: string;
}

export async function calculateCalories(mealDescription: string): Promise<CalorieResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Calcule as calorias e macronutrientes para a seguinte refeição: "${mealDescription}". Forneça uma estimativa realista.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
        },
        required: ["foodName", "calories", "protein", "carbs", "fats", "explanation"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  time: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
}

export async function getHealthyRecipes(): Promise<Recipe[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Sugira 3 receitas saudáveis e fáceis de fazer, com foco em bem-estar e nutrição equilibrada.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            calories: { type: Type.NUMBER },
            time: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Fácil", "Médio", "Difícil"] },
          },
          required: ["title", "ingredients", "instructions", "calories", "time", "difficulty"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function getHealthyDesserts(): Promise<Recipe[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Sugira 3 sobremesas saudáveis, doces naturais ou opções com frutas que sejam nutritivas e baixas em açúcar processado.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            calories: { type: Type.NUMBER },
            time: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Fácil", "Médio", "Difícil"] },
          },
          required: ["title", "ingredients", "instructions", "calories", "time", "difficulty"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export interface DietPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: {
    name: string;
    suggestions: string[];
    estimatedCalories: number;
  }[];
  recommendations: string[];
}

export async function generatePersonalizedDiet(
  weight: number,
  height: number,
  age: number,
  gender: string,
  tdee: number,
  goal: "loss" | "maintenance" | "gain"
): Promise<DietPlan> {
  const goalText = goal === "loss" ? "perda de peso" : goal === "gain" ? "ganho de massa" : "manutenção";
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere um plano de dieta personalizado para uma pessoa com as seguintes características:
    - Gênero: ${gender}
    - Idade: ${age} anos
    - Peso: ${weight}kg
    - Altura: ${height}cm
    - Gasto Calórico Diário (TDEE): ${tdee} kcal
    - Objetivo: ${goalText}
    
    O plano deve incluir calorias totais sugeridas, macros e sugestões de refeições.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailyCalories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
            },
            required: ["protein", "carbs", "fats"],
          },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                estimatedCalories: { type: Type.NUMBER },
              },
              required: ["name", "suggestions", "estimatedCalories"],
            },
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["dailyCalories", "macros", "meals", "recommendations"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
