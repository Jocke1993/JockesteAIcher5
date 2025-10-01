export interface Feedback {
  instructionFollowing: string;
  languageFeedback: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
