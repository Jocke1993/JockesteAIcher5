// This is a serverless function that will be deployed by Vercel.
// It runs on the server, so it's safe to use the API key here.

import { GoogleGenAI, Type } from "@google/genai";
import type { Feedback, ChatMessage } from '../types';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const feedbackSchema = {
  type: Type.OBJECT,
  properties: {
    instructionFollowing: {
      type: Type.STRING,
      description: "A summary of how well the student's text followed the provided instructions. Mention any missed points.",
    },
    languageFeedback: {
      type: Type.STRING,
      description: "General, high-level feedback on language use (e.g., sentence structure, verb tense, word choice) without pointing out specific errors. The tone should be encouraging.",
    },
  },
  required: ['instructionFollowing', 'languageFeedback'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, payload } = req.body;

    if (type === 'get-feedback') {
      const { instructions, studentText, subject } = payload;
      const result = await handleGetFeedback(instructions, studentText, subject);
      return res.status(200).json(result);
    }

    if (type === 'get-chat-response') {
        const { messages, subject } = payload;
        const result = await handleGetChatResponse(messages, subject);
        return res.status(200).json(result);
    }

    return res.status(400).json({ error: 'Invalid request type' });

  } catch (error) {
    console.error("Error in serverless function:", error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
    return res.status(500).json({ error: errorMessage });
  }
}

async function handleGetFeedback(instructions: string, studentText: string, subject: 'English' | 'Svenska'): Promise<Feedback> {
  const isSwedish = subject === 'Svenska';

  const prompt = `
    You are an expert teaching assistant providing feedback on student writing. The subject is ${subject}.
    Your goal is to be encouraging and helpful without giving away the answers.
    ${isSwedish ? "Your entire response, including all feedback, MUST be in Swedish." : "Your entire response, including all feedback, MUST be in English."}

    You will be given "Assignment Instructions" and the "Student's Text".
    Your task is to analyze the student's text based on the instructions and provide feedback in two specific categories.
    You MUST respond in a valid JSON format that matches the provided schema. The JSON keys ('instructionFollowing', 'languageFeedback') must remain in English.

    Rules for \`instructionFollowing\`: Compare text against instructions, state if followed, mention missed parts.
    Rules for \`languageFeedback\`: Analyze for general patterns. DO NOT correct specific errors. Give high-level advice.
    ${isSwedish 
        ? `Exempel: 'Se över din meningsbyggnad.' istället för 'Du glömde en punkt här.'`
        : `Example: 'Review your sentence structure.' instead of 'You missed a comma here.'`
    }
    The tone should be supportive.
    ---
    ASSIGNMENT INSTRUCTIONS: ${instructions}
    ---
    STUDENT'S TEXT: ${studentText}
  `;

  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: feedbackSchema,
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Feedback;
}


async function handleGetChatResponse(messages: ChatMessage[], subject: 'English' | 'Svenska'): Promise<{ text: string }> {
    const isSwedish = subject === 'Svenska';
    
    const systemInstruction = isSwedish
      ? `Du är en hjälpsam och tålmodig lärarassistent. Ditt primära mål är att hjälpa elever att utveckla sitt kritiska tänkande.
         Din metod:
         1. Prioritera vägledande frågor.
         2. Undvik omedelbara svar på analytiska frågor.
         3. Ge förklaringar för faktabaserade frågor om eleven kör fast, och följ sedan upp med en kontrollfråga.
         4. Var uppmuntrande.
         KRITISK REGEL: ALDRIG skriv om, redigera eller korrigera elevens text direkt. Om en elev klistrar in text, ställ vägledande frågor om den, som 'Vad är dina tankar om det här avsnittet?' eller 'Vilken specifik del vill du ha hjälp med?'.
         Om användarens språk inte matchar det valda ämnet, be vänligt om ett förtydligande istället för att anta att de vill ha en översättning eller korrigering.`
      : `You are a helpful and patient teaching assistant. Your primary goal is to help students develop their critical thinking skills.
         Your Method:
         1. Prioritize Guiding Questions.
         2. Avoid Immediate Answers for analytical questions.
         3. Provide Explanations for factual questions if the student is stuck, then follow up with a check-in question.
         4. Be Encouraging.
         CRITICAL RULE: NEVER rewrite, edit, or correct the student's text directly. If a student pastes text, ask them guiding questions about it, such as 'What are your thoughts on this section?' or 'What specific part are you looking for help with?'.
         If the user's language does not match the selected subject, gently ask for clarification instead of assuming they want a translation or correction.`;
    
    const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));
    
    const latestMessage = messages[messages.length - 1].text;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
        },
        history,
    });

    const response = await chat.sendMessage({ message: latestMessage });
    return { text: response.text };
}