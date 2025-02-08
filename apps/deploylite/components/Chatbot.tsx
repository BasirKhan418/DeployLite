"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import LottieAnimation1 from '@/components/ui/LottieAnimation1';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 **Welcome to DeployBot AI!** How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const formatMessagesForApi = (messages: Message[]): ApiMessage[] => {
    return messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));
  };

  const MessageContent: React.FC<{ content: string }> = ({ content }) => (
    <ReactMarkdown
      components={{
        strong: ({ node, ...props }) => (
          <span className="font-bold text-pink-200" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-2 last:mb-0" {...props} />
        ),
        code: ({ node, ...props }) => (
          <code className="bg-pink-900 bg-opacity-50 px-1 rounded" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true
    };
    setMessages(prev => [...prev, botMessage]);

    try {
      const response = await fetch('https://agent-353168299ceba8da1ed5-p7tro.ondigitalocean.app/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DG}`
        },
        body: JSON.stringify({
          messages: formatMessagesForApi([...messages, userMessage]),
          stream: true,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;
            
            try {
              const jsonData = JSON.parse(jsonStr);
              const newContent = jsonData.choices[0]?.delta?.content || '';
              accumulatedText += newContent;
              
              setMessages(prev => prev.map(msg => 
                msg.id === botMessage.id 
                  ? { ...msg, text: accumulatedText }
                  : msg
              ));
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === botMessage.id 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessage.id 
          ? { ...msg, text: '**Error:** Unable to process your request. Please try again.', isStreaming: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <LottieAnimation1 width={65} height={65} />
          </button>
          <span className="text-sm font-medium text-white -mt-4">DeployBot AI</span>
        </div>
      )}

      {isOpen && (
        <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-lg shadow-xl w-96 sm:w-[420px] h-[650px] flex flex-col text-white">
          <div className="flex items-center justify-between p-4 border-b border-pink-500">
            <h3 className="font-semibold text-white">DeployBot AI Chat Support</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-pink-300 hover:text-pink-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <div className="text-sm">
                    <MessageContent content={message.text} />
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-pink-300 animate-pulse" />
                    )}
                  </div>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-pink-500 p-4">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 border border-pink-500 bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:border-pink-600 disabled:opacity-50 placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;