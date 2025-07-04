"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Database, Globe, MessageSquare, Cloud, Settings, Sparkles, Zap, Code, Server } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolResults?: ToolResult[];
  isError?: boolean;
}

interface ToolResult {
  tool: string;
  result?: {
    projectId: string;
    name: string;
  };
  error?: string;
  message: string;
}

interface Project {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  description: string;
  gradient: string;
}

const DeployliteApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Welcome to Deploylite! I can help you deploy applications, create databases, build chatbots, and more. What would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(`session_${Date.now()}`);
  const [activeTab, setActiveTab] = useState<'chat' | 'projects'>('chat');
  const [projects, setProjects] = useState<Project[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call to your backend
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          sessionId: sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          toolResults: data.toolResults || []
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update projects if there were successful deployments
        if (data.toolResults && data.toolResults.length > 0) {
          const newProjects: Project[] = data.toolResults
            .filter(result => result.result && result.result.projectId)
            .map(result => ({
              id: result.result!.projectId,
              name: result.result!.name || 'Unknown Project',
              type: result.tool,
              status: 'active' as const,
              createdAt: new Date()
            }));
          
          setProjects(prev => [...prev, ...newProjects]);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    { 
      label: 'Deploy Web App', 
      icon: Globe, 
      action: () => setInputMessage('I want to deploy a web application'),
      description: 'Launch your web application',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Create Database', 
      icon: Database, 
      action: () => setInputMessage('I need to create a database'),
      description: 'Set up a new database',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Build Chatbot', 
      icon: MessageSquare, 
      action: () => setInputMessage('I want to create a chatbot'),
      description: 'Create an AI chatbot',
      gradient: 'from-green-500 to-teal-500'
    },
    { 
      label: 'Virtual Space', 
      icon: Cloud, 
      action: () => setInputMessage('Create a virtual space for me'),
      description: 'Deploy cloud infrastructure',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProjectIcon = (type: string): React.ReactNode => {
    switch (type) {
      case 'appplatform': return <Globe className="w-5 h-5 text-blue-600" />;
      case 'createDatabase': return <Database className="w-5 h-5 text-purple-600" />;
      case 'createChatbot': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'createVirtualSpace': return <Cloud className="w-5 h-5 text-orange-600" />;
      default: return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Deploylite
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Deployment Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'projects'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Server className="w-4 h-4 inline mr-2" />
                  Projects
                  {projects.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                      {projects.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chat' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full group relative overflow-hidden rounded-xl border border-gray-200 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="relative p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} text-white`}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-gray-800">
                            {action.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 text-left group-hover:text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Chat Interface */}
            <div className="lg:col-span-3">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 h-[650px] flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">AI Assistant</h2>
                      <p className="text-blue-100 text-sm">Ready to help you deploy and build</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : message.isError
                            ? 'bg-red-50 text-red-800 border border-red-200 shadow-md'
                            : 'bg-white text-gray-800 shadow-md border border-gray-100'
                        } rounded-2xl overflow-hidden`}
                      >
                        <div className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' 
                                ? 'bg-white/20' 
                                : message.isError 
                                ? 'bg-red-100' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}>
                              {message.role === 'assistant' ? (
                                <Bot className={`w-4 h-4 ${message.isError ? 'text-red-600' : 'text-white'}`} />
                              ) : (
                                <User className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              {message.toolResults && message.toolResults.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200/50">
                                  <div className="space-y-2">
                                    {message.toolResults.map((result, index) => (
                                      <div
                                        key={index}
                                        className={`text-xs p-3 rounded-lg ${
                                          result.error
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-green-50 text-green-700 border border-green-200'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Code className="w-3 h-3" />
                                          <span className="font-medium">{result.message}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <p className="text-xs mt-2 opacity-60">
                                {formatTimestamp(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600">Deploylite is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input */}
                <div className="border-t border-gray-200/50 p-6 bg-white/50">
                  <div className="flex space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me to deploy an app, create a database, or anything else..."
                        className="w-full border border-gray-300 rounded-xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm placeholder-gray-400 text-gray-900 shadow-sm"
                        disabled={isLoading}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Sparkles className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Projects Tab */
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <Server className="w-6 h-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Your Projects</h2>
            </div>
            {projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Bot className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No projects yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start by deploying your first application or creating a database. 
                  Deploylite will help you build amazing things!
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <Zap className="w-5 h-5 inline mr-2" />
                  Start Building
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                            {getProjectIcon(project.type)}
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className="text-sm font-medium text-gray-700">
                            {project.type.replace('create', '').replace('app', 'App')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Created:</span>
                          <span className="text-sm font-medium text-gray-700">
                            {project.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployliteApp;