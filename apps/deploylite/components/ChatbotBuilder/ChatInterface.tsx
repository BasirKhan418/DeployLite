"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
  sources?: string[];
}

interface ChatInterfaceProps {
  chatbotUrl: string;
  isLive: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatbotUrl, isLive }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. I can help answer questions based on the knowledge base you've uploaded. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending || !isLive) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);
    setIsTyping(true);

    try {
      // Add typing indicator
      const typingMessage: Message = {
        id: `typing-${Date.now()}`,
        content: '',
        sender: 'bot',
        timestamp: new Date(),
        typing: true
      };
      setMessages(prev => [...prev, typingMessage]);

      // Simulate API call to chatbot
      const response = await fetch('/api/chat/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHAT_API_KEY}` // This would be set up
        },
        body: JSON.stringify({
          question: inputMessage.trim(),
          stream: false
        })
      });

      const data = await response.json();

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        const botResponse: Message = {
          id: Date.now().toString(),
          content: data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request at the moment. Please try again.",
          sender: 'bot',
          timestamp: new Date(),
          sources: data.sources || []
        };
        return [...filtered, botResponse];
      });

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "I'm experiencing some technical difficulties. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date()
        };
        return [...filtered, errorMessage];
      });
      
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Hello! I'm your AI assistant. I can help answer questions based on the knowledge base you've uploaded. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  if (!isLive) {
    return (
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <MessageSquare className="w-5 h-5 text-pink-400" />
            Test Chat Interface
          </CardTitle>
          <CardDescription>Test your chatbot before it goes live</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Chatbot Not Available</h3>
            <p className="text-gray-400 mb-6">
              Your chatbot is still deploying. Please wait for it to become live before testing.
            </p>
            <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400">
              Status: Deploying
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <MessageSquare className="w-5 h-5 text-pink-400" />
                Test Chat Interface
              </CardTitle>
              <CardDescription>Test your chatbot's responses and knowledge base</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="border-gray-600 hover:border-pink-500/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(chatbotUrl, '_blank')}
                className="border-gray-600 hover:border-pink-500/50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Live Chat
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="h-96 bg-gray-900/50 rounded-lg border border-gray-700 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-[70%] ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-gray-800 text-gray-200 border border-gray-700'
                      }`}>
                        {message.typing ? (
                          <div className="flex items-center gap-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-sm text-gray-400 ml-2">AI is thinking...</span>
                          </div>
                        ) : (
                          <div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            
                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-600">
                                <p className="text-xs text-gray-400 mb-1">Sources:</p>
                                <div className="flex flex-wrap gap-1">
                                  {message.sources.map((source, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs bg-gray-700 text-gray-300"
                                    >
                                      {source}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Message Actions and Timestamp */}
                      {!message.typing && (
                        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                          
                          {message.sender === 'bot' && (
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0 hover:bg-gray-700"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-gray-700 text-green-400"
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-gray-700 text-red-400"
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  disabled={isSending}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500 pr-12"
                />
                {isSending && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400 animate-spin" />
                )}
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isSending}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Chat Status */}
            <div className="flex items-center justify-between text-sm text-gray-400 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Chatbot is online and ready</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{messages.filter(m => !m.typing).length} messages</span>
                <span>•</span>
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Test Questions */}
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <CardTitle className="text-gray-200">Quick Test Questions</CardTitle>
          <CardDescription>Try these sample questions to test your chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "What can you help me with?",
              "Tell me about your knowledge base",
              "How do you process information?",
              "What are your capabilities?"
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => {
                  setInputMessage(question);
                  inputRef.current?.focus();
                }}
                className="text-left justify-start h-auto p-3 border-gray-700 hover:border-pink-500/50 hover:bg-pink-500/5"
                disabled={isSending}
              >
                <MessageSquare className="w-4 h-4 mr-2 text-pink-400 flex-shrink-0" />
                <span className="text-gray-300">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;