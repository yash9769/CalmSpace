
import React from 'react';
import { Message, Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
    </div>
);


const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;
  const isTyping = message.text === '...';

  const bubbleClasses = isUser
    ? 'bg-purple-600 text-white rounded-br-none'
    : 'bg-white/50 dark:bg-gray-700/50 backdrop-blur-md text-gray-800 dark:text-gray-200 border border-white/20 dark:border-gray-600/50 rounded-bl-none';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-end gap-3 ${containerClasses}`}>
       {!isUser && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex-shrink-0"></div>}
      <div
        className={`max-w-md md:max-w-lg px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${bubbleClasses}`}
      >
        {isTyping && !isUser ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.text}</p>}
      </div>
    </div>
  );
};

export default MessageBubble;
