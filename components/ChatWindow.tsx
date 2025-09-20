

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Sender } from '../types';
import { ai } from '../services/geminiService';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';

const initialMessage: Message = {
  id: 'init-1',
  text: "Hello! I'm CalmSpace, your personal wellness companion. I'm here to listen without judgment in a safe and confidential space. How are you feeling today?",
  sender: Sender.AI,
  timestamp: new Date().toISOString(),
};

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Memoize the chat instance creation to avoid re-creating it on every render
  const chat = useRef(ai.chats.create({ model: 'gemini-2.5-flash' })).current;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: Sender.USER,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessageId = `ai-${Date.now()}`;
    // Add a placeholder for the AI response
    setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: Sender.AI, timestamp: new Date().toISOString() }]);

    try {
      const stream = await chat.sendMessageStream({ message: inputText });
      // FIX: Updated stream handling to access the .text property of the chunk,
      // aligning with the Gemini API and the updated mock service.
      for await (const chunk of stream) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: chunk.text } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: "I'm sorry, I encountered an issue. Please try again." } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chat]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
      <div className="p-4 border-b border-white/20 dark:border-gray-700/50">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">CalmSpace Companion</h1>
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length-1]?.sender === Sender.USER && (
           <MessageBubble message={{id: 'typing', text: '...', sender: Sender.AI, timestamp: ''}} />
        )}
        <div ref={chatEndRef} />
      </div>
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;