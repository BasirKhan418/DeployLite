"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bot,
  Brain,
  Shield,
  Palette,
  Code,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Info,
  AlertTriangle,
  Zap,
  Globe,
  MessageSquare,
  Lock,
  Sliders,
  RefreshCw
} from "lucide-react";

interface ChatbotData {
  _id: string;
  name: string;
  projectstatus: string;
  projecturl: string;
  url?: string;
  cpuusage: string;
  memoryusage: string;
  storageusage: string;
  startdate: string;
  planid: {
    name: string;
    pcategory: string;
    pricepmonth: string;
  };
  knowledgebase: any[];
  arn?: string;
}

interface ChatbotSettingsProps {
  chatbotData: ChatbotData;
  onUpdate: () => void;
}

const ChatbotSettings: React.FC<ChatbotSettingsProps> = ({ chatbotData, onUpdate }) => {
  const [settings, setSettings] = useState({
    // General Settings
    displayName: chatbotData.name || '',
    description: '',
    welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
    
    // AI Configuration
    llmProvider: 'openai',
    apiKey: '',
    contextWindow: '4096',
    temperature: 0.7,
    maxTokens: 150,
    systemPrompt: 'You are a helpful AI assistant.',
    
    // Response Settings
    enableSourceCitations: true,
    maxResponseTime: 30,
    fallbackMessage: "I'm sorry, I couldn't find an answer to your question.",
    
    // Security Settings
    enableRateLimit: true,
    rateLimitRequests: 10,
    rateLimitWindow: 60,
    enableProfanityFilter: true,
    allowedDomains: '',
    
    // Appearance
    themeColor: '#ec4899',
    botAvatar: '',
    customCSS: '',
    
    // Features
    enableMemory: true,
    enableAnalytics: true,
    enableFeedback: true,
    enableFileUpload: false,
    
    // Integration
    webhookUrl: '',
    enableWebhook: false,
    customHeaders: ''
  });

  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      const response = await fetch(`/api/chatbot/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId: chatbotData._id,
          settings
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Settings saved successfully');
        onUpdate();
      } else {
        toast.error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all settings to default values?');
    if (confirmReset) {
      // Reset to default values
      setSettings({
        displayName: chatbotData.name,
        description: '',
        welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
        llmProvider: 'openai',
        apiKey: '',
        contextWindow: '4096',
        temperature: 0.7,
        maxTokens: 150,
        systemPrompt: 'You are a helpful AI assistant.',
        enableSourceCitations: true,
        maxResponseTime: 30,
        fallbackMessage: "I'm sorry, I couldn't find an answer to your question.",
        enableRateLimit: true,
        rateLimitRequests: 10,
        rateLimitWindow: 60,
        enableProfanityFilter: true,
        allowedDomains: '',
        themeColor: '#ec4899',
        botAvatar: '',
        customCSS: '',
        enableMemory: true,
        enableAnalytics: true,
        enableFeedback: true,
        enableFileUpload: false,
        webhookUrl: '',
        enableWebhook: false,
        customHeaders: ''
      });
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Settings className="w-5 h-5 text-pink-400" />
                Chatbot Settings
              </CardTitle>
              <CardDescription>Configure your chatbot's behavior and appearance</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                className="border-gray-600 hover:border-amber-500/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
              <TabsTrigger 
                value="general" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <Bot className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Config
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-gray-300">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => handleSettingChange('displayName', e.target.value)}
                      className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                      placeholder="Your chatbot's name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxResponseTime" className="text-gray-300">
                      Max Response Time (seconds)
                    </Label>
                    <Input
                      id="maxResponseTime"
                      type="number"
                      value={settings.maxResponseTime}
                      onChange={(e) => handleSettingChange('maxResponseTime', parseInt(e.target.value))}
                      className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                      min="5"
                      max="60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => handleSettingChange('description', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                    placeholder="Brief description of your chatbot's purpose"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage" className="text-gray-300">
                    Welcome Message
                  </Label>
                  <Textarea
                    id="welcomeMessage"
                    value={settings.welcomeMessage}
                    onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                    placeholder="First message users see"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fallbackMessage" className="text-gray-300">
                    Fallback Message
                  </Label>
                  <Textarea
                    id="fallbackMessage"
                    value={settings.fallbackMessage}
                    onChange={(e) => handleSettingChange('fallbackMessage', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                    placeholder="Message when AI can't answer"
                    rows={2}
                  />
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-200">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'enableMemory', label: 'Conversation Memory', desc: 'Remember previous conversations' },
                      { key: 'enableAnalytics', label: 'Analytics', desc: 'Track usage and performance' },
                      { key: 'enableFeedback', label: 'User Feedback', desc: 'Allow thumbs up/down ratings' },
                      { key: 'enableFileUpload', label: 'File Upload', desc: 'Allow users to upload documents' }
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div>
                          <div className="text-gray-200 font-medium">{feature.label}</div>
                          <div className="text-sm text-gray-400">{feature.desc}</div>
                        </div>
                        <Switch
                          checked={settings[feature.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => handleSettingChange(feature.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* AI Configuration */}
            <TabsContent value="ai" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="llmProvider" className="text-gray-300">
                      LLM Provider
                    </Label>
                    <select
                      id="llmProvider"
                      value={settings.llmProvider}
                      onChange={(e) => handleSettingChange('llmProvider', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:border-pink-500 focus:outline-none"
                    >
                      <option value="openai">OpenAI GPT</option>
                      <option value="gemini">Google Gemini</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contextWindow" className="text-gray-300">
                      Context Window
                    </Label>
                    <select
                      id="contextWindow"
                      value={settings.contextWindow}
                      onChange={(e) => handleSettingChange('contextWindow', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:border-pink-500 focus:outline-none"
                    >
                      <option value="2048">2K tokens</option>
                      <option value="4096">4K tokens</option>
                      <option value="8192">8K tokens</option>
                      <option value="16384">16K tokens</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-gray-300">
                    API Key
                  </Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={settings.apiKey}
                      onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                      className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500 pr-10"
                      placeholder="Enter your API key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-700"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="text-gray-300">
                      Temperature: {settings.temperature}
                    </Label>
                    <div className="px-3">
                      <input
                        type="range"
                        id="temperature"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTokens" className="text-gray-300">
                      Max Tokens
                    </Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={settings.maxTokens}
                      onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                      className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                      min="50"
                      max="4000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt" className="text-gray-300">
                    System Prompt
                  </Label>
                  <Textarea
                    id="systemPrompt"
                    value={settings.systemPrompt}
                    onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                    placeholder="Instructions for the AI behavior"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    This defines how your AI should behave and respond
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div>
                    <div className="text-gray-200 font-medium">Source Citations</div>
                    <div className="text-sm text-gray-400">Include knowledge base sources in responses</div>
                  </div>
                  <Switch
                    checked={settings.enableSourceCitations}
                    onCheckedChange={(checked) => handleSettingChange('enableSourceCitations', checked)}
                  />
                </div>
              </motion.div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-semibold">Security Settings</span>
                  </div>
                  <p className="text-sm text-amber-200/80">
                    Configure security measures to protect your chatbot from abuse and ensure safe interactions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div>
                      <div className="text-gray-200 font-medium">Rate Limiting</div>
                      <div className="text-sm text-gray-400">Limit requests per user to prevent abuse</div>
                    </div>
                    <Switch
                      checked={settings.enableRateLimit}
                      onCheckedChange={(checked) => handleSettingChange('enableRateLimit', checked)}
                    />
                  </div>

                  {settings.enableRateLimit && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                      <div className="space-y-2">
                        <Label htmlFor="rateLimitRequests" className="text-gray-300">
                          Max Requests
                        </Label>
                        <Input
                          id="rateLimitRequests"
                          type="number"
                          value={settings.rateLimitRequests}
                          onChange={(e) => handleSettingChange('rateLimitRequests', parseInt(e.target.value))}
                          className="bg-black/50 border-gray-700 text-white focus:border-pink-500"
                          min="1"
                          max="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rateLimitWindow" className="text-gray-300">
                          Time Window (seconds)
                        </Label>
                        <Input
                          id="rateLimitWindow"
                          type="number"
                          value={settings.rateLimitWindow}
                          onChange={(e) => handleSettingChange('rateLimitWindow', parseInt(e.target.value))}
                          className="bg-black/50 border-gray-700 text-white focus:border-pink-500"
                          min="10"
                          max="3600"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div>
                      <div className="text-gray-200 font-medium">Profanity Filter</div>
                      <div className="text-sm text-gray-400">Filter inappropriate content from user messages</div>
                    </div>
                    <Switch
                      checked={settings.enableProfanityFilter}
                      onCheckedChange={(checked) => handleSettingChange('enableProfanityFilter', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowedDomains" className="text-gray-300">
                    Allowed Domains (Optional)
                  </Label>
                  <Textarea
                    id="allowedDomains"
                    value={settings.allowedDomains}
                    onChange={(e) => handleSettingChange('allowedDomains', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                    placeholder="example.com, subdomain.example.com (one per line)"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Restrict chatbot usage to specific domains. Leave empty to allow all domains.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl" className="text-gray-300">
                    Webhook URL (Optional)
                  </Label>
                  <Input
                    id="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                    placeholder="https://your-server.com/webhook"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Receive notifications for conversations and events
                    </p>
                    <Switch
                      checked={settings.enableWebhook}
                      onCheckedChange={(checked) => handleSettingChange('enableWebhook', checked)}
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="themeColor" className="text-gray-300">
                      Theme Color
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="themeColor"
                        type="color"
                        value={settings.themeColor}
                        onChange={(e) => handleSettingChange('themeColor', e.target.value)}
                        className="w-16 h-10 bg-black/50 border-gray-700 rounded cursor-pointer"
                      />
                      <Input
                        value={settings.themeColor}
                        onChange={(e) => handleSettingChange('themeColor', e.target.value)}
                        className="flex-1 bg-black/50 border-gray-700 text-white focus:border-pink-500"
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="botAvatar" className="text-gray-300">
                      Bot Avatar URL (Optional)
                    </Label>
                    <Input
                      id="botAvatar"
                      value={settings.botAvatar}
                      onChange={(e) => handleSettingChange('botAvatar', e.target.value)}
                      className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500"
                      placeholder="https://example.com/avatar.png"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCSS" className="text-gray-300">
                    Custom CSS (Advanced)
                  </Label>
                  <Textarea
                    id="customCSS"
                    value={settings.customCSS}
                    onChange={(e) => handleSettingChange('customCSS', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500 font-mono text-sm"
                    placeholder="/* Custom styles for your chatbot */
.chat-message { 
  border-radius: 8px; 
}"
                    rows={8}
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    Add custom styles to personalize your chatbot's appearance
                  </p>
                </div>

                {/* Preview Section */}
                <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Preview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: settings.themeColor }}
                      >
                        {settings.botAvatar ? (
                          <img src={settings.botAvatar} alt="Bot" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div 
                        className="p-3 rounded-lg text-white max-w-xs"
                        style={{ backgroundColor: settings.themeColor }}
                      >
                        {settings.welcomeMessage}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Preview of how your welcome message will appear
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotSettings;