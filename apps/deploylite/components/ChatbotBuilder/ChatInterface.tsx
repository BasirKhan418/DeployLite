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
  Clock,
  Brain,
  Sparkles,
  Zap,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
  sources?: string[];
  provider?: 'openai' | 'gemini';
  
}

interface ChatInterfaceProps {
  chatbotUrl: string;
  isLive: boolean;
  url: string;
}

// AI Provider Toggle Component
const AIProviderToggle = ({ provider, onProviderChange }: { 
  provider: 'openai' | 'gemini', 
  onProviderChange: (provider: 'openai' | 'gemini') => void 
}) => {
  return (
    <div className="inline-flex bg-gray-800/80 rounded-lg p-1 border border-gray-600/50">
      <button
        onClick={() => onProviderChange('openai')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          provider === 'openai'
            ? 'bg-purple-500 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        <Brain className="w-4 h-4" />
        OpenAI
      </button>
      <button
        onClick={() => onProviderChange('gemini')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          provider === 'gemini'
            ? 'bg-pink-500 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        Gemini
      </button>
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatbotUrl, isLive ,url}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. I can help answer questions based on the knowledge base you've uploaded. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      provider: 'openai'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('openai');
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
      timestamp: new Date(),
      provider: aiProvider
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
        typing: true,
        provider: aiProvider
      };
      setMessages(prev => [...prev, typingMessage]);

      // Simulate API call to chatbot with provider selection
      const response = await fetch(`/api/aichat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputMessage:inputMessage.trim(),
          aiProvider:aiProvider,
          url: url
        })
      });

      const data = await response.json();

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        const botResponse: Message = {
          id: Date.now().toString(),
          content: data.data || 
                   `I'm sorry, I couldn't process your request at the moment using ${aiProvider.toUpperCase()}. Please try again.`,
          sender: 'bot',
          timestamp: new Date(),
          sources: data.sources || [],
          provider: aiProvider
        };
        return [...filtered, botResponse];
      });

      toast.success(`Response generated using ${aiProvider.toUpperCase()}`);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `I'm experiencing some technical difficulties with ${aiProvider.toUpperCase()}. Please try again in a moment.`,
          sender: 'bot',
          timestamp: new Date(),
          provider: aiProvider
        };
        return [...filtered, errorMessage];
      });
      
      toast.error(`Failed to send message via ${aiProvider.toUpperCase()}`);
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
      timestamp: new Date(),
      provider: aiProvider
    }]);
  };

  const getProviderIcon = (provider?: 'openai' | 'gemini') => {
    if (provider === 'openai') {
      return <Brain className="w-3 h-3 text-purple-400" />;
    } else if (provider === 'gemini') {
      return <Sparkles className="w-3 h-3 text-pink-400" />;
    }
    return <Bot className="w-3 h-3 text-blue-400" />;
  };

  const getProviderColors = (provider?: 'openai' | 'gemini') => {
    if (provider === 'openai') {
      return {
        gradient: 'from-purple-500 to-blue-500',
        border: 'border-purple-500/30',
        bg: 'bg-purple-500/10'
      };
    } else if (provider === 'gemini') {
      return {
        gradient: 'from-pink-500 to-purple-500',
        border: 'border-pink-500/30',
        bg: 'bg-pink-500/10'
      };
    }
    return {
      gradient: 'from-blue-500 to-cyan-500',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10'
    };
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
            <div className="flex items-center gap-4">
              {/* AI Provider Toggle */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-xs text-gray-400 font-medium">AI Model</div>
                <AIProviderToggle provider={aiProvider} onProviderChange={setAiProvider} />
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
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Provider Info Banner */}
            <div className={`p-3 rounded-xl border ${
              aiProvider === 'openai' 
                ? 'bg-purple-500/10 border-purple-500/20' 
                : 'bg-pink-500/10 border-pink-500/20'
            }`}>
              <div className="flex items-center gap-3">
                {aiProvider === 'openai' ? (
                  <Brain className="w-4 h-4 text-purple-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-pink-400" />
                )}
                <div>
                  <span className={`text-sm font-medium ${
                    aiProvider === 'openai' ? 'text-purple-400' : 'text-pink-400'
                  }`}>
                    {aiProvider === 'openai' ? 'OpenAI GPT' : 'Google Gemini'} Active
                  </span>
                  <p className="text-xs text-gray-400">
                    Responses powered by {aiProvider === 'openai' ? 'OpenAI' : 'Google'} AI
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 bg-gray-900/50 rounded-lg border border-gray-700 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => {
                  const providerColors = getProviderColors(message.provider);
                  
                  return (
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
                          : `bg-gradient-to-r ${providerColors.gradient}`
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : message.provider ? (
                          getProviderIcon(message.provider)
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
                            <div className="flex items-center gap-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              </div>
                              <span className="text-sm text-gray-400 ml-2">
                                {aiProvider.toUpperCase()} is thinking...
                              </span>
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
                            
                            {/* Provider indicator for bot messages */}
                            {message.sender === 'bot' && message.provider && (
                              <div className="flex items-center gap-1">
                                {getProviderIcon(message.provider)}
                                <span className={`text-xs ${
                                  message.provider === 'openai' ? 'text-purple-400' : 'text-pink-400'
                                }`}>
                                  {message.provider.toUpperCase()}
                                </span>
                              </div>
                            )}
                            
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
                  );
                })}
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
                  placeholder={`Type your message here... (${aiProvider.toUpperCase()} will respond)`}
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
                <div className="flex items-center gap-1 ml-2">
                  {getProviderIcon(aiProvider)}
                  <span className={aiProvider === 'openai' ? 'text-purple-400' : 'text-pink-400'}>
                    {aiProvider.toUpperCase()}
                  </span>
                </div>
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
          <CardDescription>Try these sample questions to test your chatbot with {aiProvider.toUpperCase()}</CardDescription>
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