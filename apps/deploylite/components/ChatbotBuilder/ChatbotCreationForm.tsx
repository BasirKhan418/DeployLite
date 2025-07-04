"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, 
  Bot, 
  Zap, 
  Eye, 
  EyeOff, 
  Info, 
  Crown,
  Sparkles,
  Cpu,
  HardDrive,
  Globe
} from "lucide-react";

interface PricingPlan {
  _id: string;
  name: string;
  pcategory: string;
  features: string[];
  ram?: string;
  cpu?: string;
  bandwidth?: string;
  storage?: string;
  pricephour?: string;
  pricepmonth?: string;
  isfree: boolean;
}

interface FormData {
  name: string;
  planid: string;
  llmProvider: 'openai' | 'gemini';
  apiKey: string;
  contextSize: string;
  description?: string;
}

interface ChatbotCreationFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const ChatbotCreationForm: React.FC<ChatbotCreationFormProps> = ({
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    planid: '',
    llmProvider: 'openai',
    apiKey: '',
    contextSize: '4096',
    description: ''
  });

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [nameError, setNameError] = useState('');

  // Fetch pricing plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/project/getplans');
        const data = await response.json();
        
        if (data.success) {
          // Filter plans suitable for chatbots
          const chatbotPlans = data.data.filter((plan: PricingPlan) => 
            plan.pcategory.toLowerCase().includes('chatbot') || 
            plan.pcategory.toLowerCase().includes('ai') ||
            plan.pcategory.toLowerCase().includes('standard')
          );
          setPlans(chatbotPlans);
        } else {
          toast.error('Failed to load pricing plans');
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Error loading pricing plans');
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear name error when user types
    if (field === 'name' && nameError) {
      setNameError('');
    }
  };

  const handleLLMProviderChange = (provider: 'openai' | 'gemini') => {
    setFormData(prev => ({
      ...prev,
      llmProvider: provider,
      contextSize: provider === 'openai' ? '4096' : '2048', // Default context sizes
      apiKey: '' // Clear API key when switching providers
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Please enter a chatbot name');
      return false;
    }

    if (formData.name.length < 3) {
      setNameError('Name must be at least 3 characters long');
      return false;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(formData.name)) {
      setNameError('Name can only contain letters, numbers, and hyphens');
      return false;
    }

    if (!formData.planid) {
      toast.error('Please select a pricing plan');
      return false;
    }

    if (!formData.apiKey.trim()) {
      toast.error(`Please enter your ${formData.llmProvider.toUpperCase()} API key`);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const getLLMProviderInfo = (provider: 'openai' | 'gemini') => {
    return {
      openai: {
        name: 'OpenAI GPT',
        description: 'Best for larger context windows and complex reasoning',
        maxContext: '128K tokens',
        icon: '🤖',
        color: 'from-green-400 to-emerald-400'
      },
      gemini: {
        name: 'Google Gemini',
        description: 'Optimized for smaller context and faster responses',
        maxContext: '32K tokens',
        icon: '✨',
        color: 'from-blue-400 to-cyan-400'
      }
    }[provider];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-gray-200">
            <Bot className="w-6 h-6 text-pink-400" />
            Configure Your AI Chatbot
          </CardTitle>
          <CardDescription className="text-gray-400">
            Set up your intelligent chatbot with custom knowledge base and LLM integration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Chatbot Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="my-awesome-chatbot"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`bg-black/50 border-gray-700 text-white placeholder-gray-400 ${
                    nameError ? 'border-red-500' : 'focus:border-pink-500'
                  }`}
                  disabled={isLoading}
                />
                {nameError && (
                  <p className="text-red-400 text-sm">{nameError}</p>
                )}
                <p className="text-gray-500 text-sm">
                  Only letters, numbers, and hyphens allowed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your chatbot's purpose..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500 min-h-[100px]"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* LLM Provider Selection */}
            <div className="space-y-4">
              <Label className="text-gray-300 text-lg">LLM Provider *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['openai', 'gemini'] as const).map((provider) => {
                  const info = getLLMProviderInfo(provider);
                  const isSelected = formData.llmProvider === provider;
                  
                  return (
                    <motion.div
                      key={provider}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-purple-500/10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                        }`}
                        onClick={() => handleLLMProviderChange(provider)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${info.color} flex items-center justify-center text-xl`}>
                                {info.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-200">{info.name}</h3>
                                <p className="text-sm text-gray-400">{info.maxContext}</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              isSelected ? 'border-pink-500 bg-pink-500' : 'border-gray-500'
                            }`}>
                              {isSelected && (
                                <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{info.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* API Key and Context Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-gray-300">
                  {formData.llmProvider.toUpperCase()} API Key *
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    placeholder={`Enter your ${formData.llmProvider.toUpperCase()} API key`}
                    value={formData.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500 pr-10"
                    disabled={isLoading}
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
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Your API key is encrypted and stored securely
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contextSize" className="text-gray-300">
                  Context Window Size
                </Label>
                <select
                  id="contextSize"
                  value={formData.contextSize}
                  onChange={(e) => handleInputChange('contextSize', e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:border-pink-500 focus:outline-none"
                  disabled={isLoading}
                >
                  {formData.llmProvider === 'openai' ? (
                    <>
                      <option value="4096">4K tokens (Standard)</option>
                      <option value="8192">8K tokens (Enhanced)</option>
                      <option value="16384">16K tokens (Large)</option>
                      <option value="32768">32K tokens (Extra Large)</option>
                    </>
                  ) : (
                    <>
                      <option value="2048">2K tokens (Standard)</option>
                      <option value="4096">4K tokens (Enhanced)</option>
                      <option value="8192">8K tokens (Large)</option>
                    </>
                  )}
                </select>
                <p className="text-gray-500 text-sm">
                  Larger context allows more conversation history
                </p>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="space-y-4">
              <Label className="text-gray-300 text-lg">Select Hosting Plan *</Label>
              
              {loadingPlans ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-pink-400" />
                  <span className="ml-2 text-gray-400">Loading plans...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${
                          formData.planid === plan._id
                            ? 'border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-purple-500/10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                        }`}
                        onClick={() => handleInputChange('planid', plan._id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-gray-200 flex items-center gap-2">
                              {plan.isfree && <Crown className="w-4 h-4 text-yellow-400" />}
                              {plan.name}
                            </CardTitle>
                            {plan.isfree && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                Free
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-gray-400">
                            {plan.pcategory}
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-3">
                            {/* Pricing */}
                            <div className="text-center py-2">
                              {plan.isfree ? (
                                <div className="text-2xl font-bold text-emerald-400">Free</div>
                              ) : (
                                <div>
                                  <div className="text-2xl font-bold text-gray-200">
                                    ${plan.pricepmonth}
                                    <span className="text-sm font-normal text-gray-400">/month</span>
                                  </div>
                                  {plan.pricephour && (
                                    <div className="text-sm text-gray-400">
                                      or ${plan.pricephour}/hour
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {plan.cpu && (
                                <div className="flex items-center gap-1 text-gray-300">
                                  <Cpu className="w-3 h-3 text-pink-400" />
                                  {plan.cpu}
                                </div>
                              )}
                              {plan.ram && (
                                <div className="flex items-center gap-1 text-gray-300">
                                  <HardDrive className="w-3 h-3 text-green-400" />
                                  {plan.ram}
                                </div>
                              )}
                              {plan.bandwidth && (
                                <div className="flex items-center gap-1 text-gray-300">
                                  <Globe className="w-3 h-3 text-blue-400" />
                                  {plan.bandwidth}
                                </div>
                              )}
                              {plan.storage && (
                                <div className="flex items-center gap-1 text-gray-300">
                                  <HardDrive className="w-3 h-3 text-purple-400" />
                                  {plan.storage}
                                </div>
                              )}
                            </div>

                            {/* Features */}
                            <div className="space-y-1">
                              {plan.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                                  {feature}
                                </div>
                              ))}
                              {plan.features.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{plan.features.length - 3} more features
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || loadingPlans}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-pink-500/25 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Chatbot...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Chatbot
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatbotCreationForm;