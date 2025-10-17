// FIX: Corrected import path for types.ts
import { type Feedback, type ChatMessage } from './types';

// This function now sends a request to our own secure backend proxy.
export async function getAssignmentFeedback(instructions: string, studentText: string, subject: 'English' | 'Svenska'): Promise<Feedback> {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'get-feedback',
        payload: { instructions, studentText, subject },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || 'Failed to fetch feedback from the server.');
    }

    return await response.json() as Feedback;
  } catch (error) {
    console.error("API proxy call failed for feedback:", error);
    throw new Error("Failed to get feedback from the AI model.");
  }
}

export async function getTestChatResponse(messages: ChatMessage[], subject: 'English' | 'Svenska'): Promise<{ text: string }> {
    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'get-test-chat-response',
                payload: { messages, subject },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || 'Failed to fetch chat response from the server (test environment).');
        }

        return await response.json();
    } catch (error) {
        console.error("API proxy call failed for test chat:", error);
        throw new Error("Failed to get a response from the test chat model.");
    }
}