"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Bot, 
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
  openaiapikey: string;
  googleapikey: string;
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
    openaiapikey: '',
    googleapikey: ''
  });

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
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

    // At least one API key is required
    if (!formData.openaiapikey.trim() && !formData.googleapikey.trim()) {
      toast.error('Please provide at least one API key (OpenAI or Google)');
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
            Set up your intelligent chatbot with custom knowledge base and AI integration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
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

              {/* AI API Keys */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-200">AI Provider Configuration</h3>
                  <p className="text-gray-400 text-sm">
                    Provide at least one API key. You can use both providers for redundancy.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OpenAI API Key */}
                  <div className="space-y-2">
                    <Label htmlFor="openaiapikey" className="text-gray-300 flex items-center gap-2">
                      🤖 OpenAI API Key
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                        Optional
                      </Badge>
                    </Label>
                    <div className="relative">
                      <Input
                        id="openaiapikey"
                        type={showOpenAIKey ? "text" : "password"}
                        placeholder="sk-..."
                        value={formData.openaiapikey}
                        onChange={(e) => handleInputChange('openaiapikey', e.target.value)}
                        className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500 pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-700"
                        onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                      >
                        {showOpenAIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Best for complex reasoning and large context windows
                    </p>
                  </div>

                  {/* Google API Key */}
                  <div className="space-y-2">
                    <Label htmlFor="googleapikey" className="text-gray-300 flex items-center gap-2">
                      ✨ Google API Key
                      <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                        Optional
                      </Badge>
                    </Label>
                    <div className="relative">
                      <Input
                        id="googleapikey"
                        type={showGoogleKey ? "text" : "password"}
                        placeholder="AIza..."
                        value={formData.googleapikey}
                        onChange={(e) => handleInputChange('googleapikey', e.target.value)}
                        className="bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500 pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-700"
                        onClick={() => setShowGoogleKey(!showGoogleKey)}
                      >
                        {showGoogleKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Fast responses and optimized for smaller contexts
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Your API keys are encrypted and stored securely. The chatbot will automatically use the best available provider.
                  </p>
                </div>
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