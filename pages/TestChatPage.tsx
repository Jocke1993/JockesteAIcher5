import React, { useState, useRef, useEffect } from 'react';
import { type ChatMessage } from '../types';
import { getTestChatResponse } from '../geminiService';
import { ChatMessageBubble } from '../components/ChatMessage';
import { SendIcon } from '../components/icons/SendIcon';

interface TestChatPageProps {
  t: any; // Translation object
  subject: 'English' | 'Svenska';
}

function TestChatPage({ t, subject }: TestChatPageProps): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear messages when subject changes to start a new "session"
    setMessages([]);
  }, [subject]);
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: trimmedInput };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await getTestChatResponse(newMessages, subject);
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Failed to get response from test chat:", error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error in the test environment. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col max-h-[70vh] h-[70vh]">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-2 space-y-4">
            {messages.length === 0 && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-slate-500 text-center">{t.chatWelcome}</p>
                </div>
            )}
            {messages.map((msg, index) => (
                <ChatMessageBubble key={index} message={msg} />
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-200 text-slate-600 rounded-lg rounded-bl-none px-4 py-2 max-w-sm animate-pulse">
                        {t.thinking}
                    </div>
                </div>
            )}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={t.chatPlaceholder}
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                    disabled={isLoading}
                    aria-label="Chat input"
                />
                <button
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className="flex-shrink-0 inline-flex items-center justify-center p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200"
                    aria-label={t.send}
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    </div>
  );
}

export default TestChatPage;