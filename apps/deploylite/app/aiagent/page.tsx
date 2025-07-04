"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Database, Globe, MessageSquare, Cloud, Settings } from 'lucide-react';

const DeployliteApp = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Welcome to Deploylite! I can help you deploy applications, create databases, build chatbots, and more. What would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [activeTab, setActiveTab] = useState('chat');
  const [projects, setProjects] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
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
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          toolResults: data.toolResults || []
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update projects if there were successful deployments
        if (data.toolResults && data.toolResults.length > 0) {
          const newProjects = data.toolResults
            .filter(result => result.result && result.result.projectId)
            .map(result => ({
              id: result.result.projectId,
              name: result.result.name || 'Unknown Project',
              type: result.tool,
              status: 'active',
              createdAt: new Date()
            }));
          
          setProjects(prev => [...prev, ...newProjects]);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Deploy Web App', icon: Globe, action: () => setInputMessage('I want to deploy a web application') },
    { label: 'Create Database', icon: Database, action: () => setInputMessage('I need to create a database') },
    { label: 'Build Chatbot', icon: MessageSquare, action: () => setInputMessage('I want to create a chatbot') },
    { label: 'Virtual Space', icon: Cloud, action: () => setInputMessage('Create a virtual space for me') }
  ];

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProjectIcon = (type) => {
    switch (type) {
      case 'appplatform': return <Globe className="w-4 h-4" />;
      case 'createDatabase': return <Database className="w-4 h-4" />;
      case 'createChatbot': return <MessageSquare className="w-4 h-4" />;
      case 'createVirtualSpace': return <Cloud className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chat' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <action.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm h-[600px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.isError
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            {message.toolResults && message.toolResults.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                {message.toolResults.map((result, index) => (
                                  <div
                                    key={index}
                                    className={`text-xs p-2 rounded ${
                                      result.error
                                        ? 'bg-red-50 text-red-700'
                                        : 'bg-green-50 text-green-700'
                                    }`}
                                  >
                                    {result.message}
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-xs mt-1 opacity-70">
                              {formatTimestamp(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-5 h-5" />
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me to deploy an app, create a database, or anything else..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Projects Tab */
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-4">
                  Start by deploying your first application or creating a database
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Building
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getProjectIcon(project.type)}
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Type: {project.type.replace('create', '').replace('app', 'App')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {project.createdAt.toLocaleDateString()}
                    </p>
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