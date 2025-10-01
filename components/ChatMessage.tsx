import React from 'react';
import { type ChatMessage } from '../types';

interface ChatMessageProps {
    message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser
        ? 'bg-indigo-600 text-white rounded-br-none'
        : 'bg-slate-200 text-slate-800 rounded-bl-none';
    const containerClasses = isUser ? 'justify-end' : 'justify-start';

    return (
        <div className={`flex ${containerClasses}`}>
            <div className={`rounded-lg px-4 py-2 max-w-sm md:max-w-md ${bubbleClasses}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};
