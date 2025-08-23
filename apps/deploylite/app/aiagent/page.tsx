"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Database, Globe, MessageSquare, Cloud, Settings, Sparkles, Zap, Code, Server, Terminal, Activity, Monitor, GitBranch } from 'lucide-react';

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
      gradient: 'from-pink-500 to-purple-500'
    },
    { 
      label: 'Create Database', 
      icon: Database, 
      action: () => setInputMessage('I need to create a database'),
      description: 'Set up a new database',
      gradient: 'from-cyan-500 to-blue-500'
    },
    { 
      label: 'Build Chatbot', 
      icon: MessageSquare, 
      action: () => setInputMessage('I want to create a chatbot'),
      description: 'Create an AI chatbot',
      gradient: 'from-emerald-500 to-green-500'
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
      case 'appplatform': return <Globe className="w-5 h-5 text-pink-400" />;
      case 'createDatabase': return <Database className="w-5 h-5 text-cyan-400" />;
      case 'createChatbot': return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'createVirtualSpace': return <Cloud className="w-5 h-5 text-orange-400" />;
      default: return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className=" bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chat' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 shadow-xl shadow-pink-500/10">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                      <Zap className="w-6 h-6 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Quick Actions</h3>
                  </div>
                  <div className="space-y-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="w-full group relative overflow-hidden rounded-xl border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        <div className="relative p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} shadow-lg`}>
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-white group-hover:text-pink-300 transition-colors">
                              {action.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 text-left group-hover:text-gray-300 transition-colors">
                            {action.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* AI Status Indicator */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-300">AI Agent Online</p>
                        <p className="text-xs text-emerald-400/70">Ready to assist with deployments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Chat Interface */}
            <div className="lg:col-span-3">
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl h-[700px] flex flex-col overflow-hidden shadow-xl shadow-pink-500/10">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl" />
                
                {/* Chat Header */}
                <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                  <div className="absolute inset-0 bg-black/20 rounded-t-2xl" />
                  <div className="relative flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">AI Deployment Assistant</h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <p className="text-white/90 text-sm font-medium">Ready to deploy your next project</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                        <span className="text-xs font-semibold">LIVE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="relative flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-gray-900/20">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md relative group ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25'
                            : message.isError
                            ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-100 border border-red-500/30 shadow-lg shadow-red-500/20'
                            : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg border border-gray-600/50'
                        } rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105`}
                      >
                        <div className="p-5">
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              message.role === 'user' 
                                ? 'bg-white/20 backdrop-blur-sm' 
                                : message.isError 
                                ? 'bg-red-500/30' 
                                : 'bg-gradient-to-r from-pink-500/30 to-purple-500/30'
                            } border ${
                              message.role === 'user' 
                                ? 'border-white/30' 
                                : 'border-gray-600/50'
                            }`}>
                              {message.role === 'assistant' ? (
                                <Bot className={`w-5 h-5 ${message.isError ? 'text-red-300' : 'text-pink-300'}`} />
                              ) : (
                                <User className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                              {message.toolResults && message.toolResults.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/20">
                                  <div className="space-y-3">
                                    {message.toolResults.map((result, index) => (
                                      <div
                                        key={index}
                                        className={`text-xs p-3 rounded-lg border transition-all duration-300 ${
                                          result.error
                                            ? 'bg-red-500/20 text-red-200 border-red-500/30'
                                            : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Terminal className="w-3 h-3" />
                                          <span className="font-semibold">{result.message}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <p className="text-xs mt-3 opacity-70 font-medium">
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
                      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-5 shadow-lg border border-gray-600/50 max-w-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full flex items-center justify-center border border-gray-600/50">
                            <Bot className="w-5 h-5 text-pink-300" />
                          </div>
                          <div className="flex items-center space-x-3">
                            <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                            <span className="text-sm text-gray-300 font-medium">Deploylite is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="relative p-6 bg-gradient-to-r from-black via-gray-900/80 to-black border-t border-pink-500/20">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me to deploy an app, create a database, or build something amazing..."
                        className="w-full bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600/50 rounded-2xl px-6 py-4 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 shadow-lg"
                        disabled={isLoading}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Sparkles className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-pink-500/25 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                  
                  {/* Input Helper */}
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Activity className="w-3 h-3" />
                    <span>Powered by advanced AI deployment algorithms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Projects Tab */
          <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-8 shadow-xl shadow-pink-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl" />
            <div className="relative">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                  <Server className="w-8 h-8 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Your Projects</h2>
                  <p className="text-gray-400">Manage and monitor your deployments</p>
                </div>
              </div>
              {projects.length === 0 ? (
                <div className="text-center py-20">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto border border-pink-500/30">
                      <Bot className="w-16 h-16 text-pink-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No projects yet</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                    Start by deploying your first application or creating a database. 
                    Deploylite AI will help you build amazing things!
                  </p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 font-semibold flex items-center gap-3 mx-auto"
                  >
                    <Zap className="w-5 h-5" />
                    Start Building with AI
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl">
                              {getProjectIcon(project.type)}
                            </div>
                            <h3 className="font-bold text-white group-hover:text-pink-300 transition-colors">
                              {project.name}
                            </h3>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            project.status === 'active' 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Type:</span>
                            <span className="text-sm font-semibold text-gray-300 bg-gray-700/50 px-3 py-1 rounded-lg">
                              {project.type.replace('create', '').replace('app', 'App')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Created:</span>
                            <span className="text-sm font-semibold text-gray-300">
                              {project.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-700/50">
                          <button className="w-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 text-pink-300 py-2 rounded-lg transition-all duration-300 text-sm font-semibold">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployliteApp;