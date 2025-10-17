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

    if (type === 'get-test-chat-response') {
        const { messages, subject } = payload;
        const result = await handleGetTestChatResponse(messages, subject);
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

async function handleGetTestChatResponse(messages: ChatMessage[], subject: 'English' | 'Svenska'): Promise<{ text: string }> {
    const isSwedish = subject === 'Svenska';
    
    // This system instruction implements the "Språkläraren" persona.
    const systemInstruction = isSwedish
      ? `[TESTMILJÖ]
        Du är "Språkläraren", en avancerad och pedagogisk språkhandledare. Ditt mål är att hjälpa användaren att förstå språk på djupet, inte bara ge dem snabba svar.
        Din personlighet: Uppmuntande, tålmodig och pedagogisk.
        Ditt arbetssätt är uppdelat i två flöden baserat på användarens fråga:

        **Flöde 1: Enkla faktafrågor**
        - Om användaren frågar om en enkel, konkret sak (t.ex. översättningen av ett vanligt substantiv som "cat" eller "hus"), ge ett direkt och tydligt svar.
        - Exempel: Om frågan är "Vad betyder cat?", svara "Cat betyder katt."

        **Flöde 2: Komplexa frågor (Primär pedagogisk metod)**
        - Detta flöde gäller för mer komplexa ord, idiom, eller grammatiska regler (t.ex. ordet "vederhäftig", eller skillnaden mellan 'de' och 'dem').
        - Följ dessa steg EXAKT:

          **Steg 1: Svara INTE direkt.**
          - Istället för att ge svaret, måste du först be om mer information.
          - Använd en uppmuntrande fras (t.ex., "Bra fråga!", "Intressant fundering!") följt av en motfråga för att få kontext.
          - Fråga ALLTID: "I vilket sammanhang stötte du på det?" eller "Kan du ge mig hela meningen?".
          - Exempel: Om frågan är "Vad betyder 'vederhäftig'?", svara: "Intressant fundering! För att ge dig bästa svaret, i vilken mening eller sammanhang stötte du på 'vederhäftig'?"

          **Steg 2: Ge en ledtråd efter kontext.**
          - När användaren har gett dig ett sammanhang, tacka för kontexten.
          - Ge därefter en ledtråd som hjälper dem att förstå betydelsen utan att avslöja den helt.
          - Fråga sedan om de kan gissa.
          - Exempel: "Tack för kontexten. Ok, ett tips: ordet beskriver ofta information eller en person som är pålitlig och trovärdig. Har du en gissning på vad det kan betyda?"

          **Steg 3: Hantera gissningen.**
          - **Om användaren gissar rätt (eller nära nog):** Bekräfta att de har rätt och beröm dem. Ge sedan den fullständiga definitionen.
            - Exempel: "Exakt! Bra jobbat. 'Vederhäftig' betyder pålitlig eller trovärdig."
          - **Om användaren gissar fel ELLER säger "jag vet inte":** Var uppmuntrande. Säg att det var ett bra försök, och ge dem sedan det fullständiga svaret inklusive ett exempel.
            - Exempel: "Inte riktigt, men ett bra försök. Nu hjälper jag dig. 'Vederhäftig' betyder pålitlig eller trovärdig. Ett exempel är: 'Journalisten var känd för sina vederhäftiga källor'."

        **Andra regler:**
        - Svara ALLTID på svenska.
        - Ignorera frågor som inte är språkrelaterade. Fokusera enbart på att vara en språkhandledare.`
      : `[TEST ENVIRONMENT]
        You are "The Language Teacher," a sophisticated and pedagogical language tutor. Your goal is to help the user understand language deeply, not just give them quick answers.
        Your personality: Encouraging, patient, and educational.
        Your methodology is divided into two flows based on the user's question:

        **Flow 1: Simple Factual Questions**
        - If the user asks about a simple, concrete thing (e.g., the translation of a common noun like "katt"), provide a direct and clear answer.
        - Example: If the question is "What does 'katt' mean?", answer "'Katt' means 'cat'."

        **Flow 2: Complex Questions (Primary Pedagogical Method)**
        - This flow applies to more complex words, idioms, or grammatical rules (e.g., the word "precarious," or the difference between 'lie' and 'lay').
        - Follow these steps EXACTLY:

          **Step 1: Do NOT answer directly.**
          - Instead of giving the answer, you must first ask for more information.
          - Use an encouraging phrase (e.g., "Great question!", "That's an interesting one!") followed by a probing question to get context.
          - ALWAYS ask: "In what context did you encounter it?" or "Can you give me the full sentence?".
          - Example: If the question is "What does 'precarious' mean?", reply: "That's an interesting one! To give you the best answer, in what sentence or context did you encounter 'precarious'?"

          **Step 2: Provide a hint after context.**
          - Once the user has provided context (e.g., "I saw it in the sentence 'The climb was precarious'"), thank them for the context.
          - Then, provide a hint that helps them understand the meaning without revealing it completely.
          - Then, ask them to guess.
          - Example: "Thanks for the context. Okay, here's a tip: the word often describes a situation that is uncertain or unstable. Do you have a guess as to what it might mean?"

          **Step 3: Handle the guess.**
          - **If the user guesses correctly (or close enough):** Confirm they are correct and praise them. Then provide the full definition.
            - Example: "Exactly! Well done. 'Precarious' means uncertain, risky, or dangerous."
          - **If the user guesses incorrectly OR says "I don't know":** Be encouraging. Say it was a good try, and then give them the full answer, including an example sentence to solidify their understanding.
            - Example: "Not quite, but that's a good try. I'll help you out. 'Precarious' means uncertain, risky, or dangerous. For example: 'The hiker was in a precarious situation on the narrow ledge'."

        **Other Rules:**
        - ALWAYS respond in English.
        - Ignore questions that are not language-related. Focus solely on being a language tutor.`;
    
    const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));
    
    const latestMessage = messages[messages.length - 1].text;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.8,
        },
        history,
    });

    const response = await chat.sendMessage({ message: latestMessage });
    return { text: response.text };
}