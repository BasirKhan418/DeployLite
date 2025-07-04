"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ChatbotCreationForm from "@/components/ChatbotBuilder/ChatbotCreationForm";
import { useAppSelector } from "@/lib/hook";
import { Loader2, Bot, Sparkles, ArrowLeft, CheckCircle, Zap, Container, Database, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatbotProject {
  _id: string;
  name: string;
  projectstatus: string;
  projecturl: string;
}

interface DeploymentResponse {
  success: boolean;
  message: string;
  project?: ChatbotProject;
}

const ChatbotBuildPage = () => {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<'create' | 'deploy' | 'complete'>('create');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentData, setDeploymentData] = useState<ChatbotProject | null>(null);
  const [containerProgress, setContainerProgress] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');

  // Container spinning loader for 22 seconds
  const startContainerDeployment = async (chatbotName: string) => {
    setContainerProgress(0);
    setDeploymentStatus('Initializing container environment...');
    
    const progressSteps = [
      { time: 2000, progress: 10, status: 'Setting up project configuration...' },
      { time: 4000, progress: 25, status: 'Building container image...' },
      { time: 8000, progress: 50, status: 'Deploying to ECS Fargate...' },
      { time: 12000, progress: 70, status: 'Setting up vector database...' },
      { time: 16000, progress: 85, status: 'Configuring AI integration...' },
      { time: 20000, progress: 95, status: 'Finalizing deployment...' },
      { time: 22000, progress: 100, status: 'Container is live!' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, step.time - (progressSteps[progressSteps.indexOf(step) - 1]?.time || 0)));
      setContainerProgress(step.progress);
      setDeploymentStatus(step.status);
    }

    // After 22 seconds, check if chatbot is in database
    await checkChatbotStatus(chatbotName);
  };

  const checkChatbotStatus = async (chatbotName: string) => {
    try {
      const response = await fetch('/api/project/chatbot');
      const data = await response.json();

      if (data.success && data.projectdata) {
        const foundChatbot = data.projectdata.find((bot: any) => bot.name === chatbotName);
        
        if (foundChatbot) {
          setDeploymentData(foundChatbot);
          setCurrentStep('complete');
          setIsDeploying(false);
          toast.success('Chatbot deployed successfully!');
          
          // Redirect to overview page after 2 seconds
          setTimeout(() => {
            router.push(`/chatbot/overview?id=${foundChatbot._id}`);
          }, 2000);
        } else {
          // If not found, show error but stay on page
          setIsDeploying(false);
          setCurrentStep('create');
          toast.error('Chatbot deployment verification failed. Please try again.');
        }
      } else {
        setIsDeploying(false);
        setCurrentStep('create');
        toast.error('Failed to verify chatbot deployment. Please try again.');
      }
    } catch (error) {
      console.error('Error checking chatbot status:', error);
      setIsDeploying(false);
      setCurrentStep('create');
      toast.error('Error verifying deployment. Please try again.');
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    
  }, [user, router]);

  const handleCreateChatbot = async (formData: {
    name: string;
    planid: string;
    openaiapikey: string;
    googleapikey: string;
  }) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsDeploying(true);
    setCurrentStep('deploy');
    setContainerProgress(0);

    try {
      // Create chatbot project
      const createResponse = await fetch('/api/project/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          planid: formData.planid,
          openaiapikey: formData.openaiapikey,
          googleapikey: formData.googleapikey,
        }),
      });

      const createResult: DeploymentResponse = await createResponse.json();

      if (!createResult.success) {
        // Stay on the same page, don't redirect
        setCurrentStep('create');
        setIsDeploying(false);
        toast.error(createResult.message || 'Failed to create chatbot');
        return;
      }

      toast.success('Chatbot creation initiated successfully!');
      router.push(`/chatbotbuild/overview?id=${createResult.project?._id}`);

    } catch (error: any) {
      console.error('Chatbot creation error:', error);
      toast.error(error.message || 'Failed to create chatbot');
      setCurrentStep('create');
      setIsDeploying(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/project/chatbot')}
              className="text-gray-400 hover:text-pink-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chatbots
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
              <Bot className="h-8 w-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Chatbot Builder
              </h1>
              <p className="text-gray-400">Create intelligent AI chatbots with RAG capabilities</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 'create', label: 'Configuration', icon: '⚙️' },
              { step: 'deploy', label: 'Container Deployment', icon: '🚀' },
              { step: 'complete', label: 'Complete', icon: '✅' }
            ].map((item, index) => (
              <div
                key={item.step}
                className={`flex items-center space-x-2 ${
                  currentStep === item.step 
                    ? 'text-pink-400' 
                    : index < ['create', 'deploy', 'complete'].indexOf(currentStep)
                    ? 'text-emerald-400'
                    : 'text-gray-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === item.step
                    ? 'bg-pink-500/20 border-2 border-pink-500'
                    : index < ['create', 'deploy', 'complete'].indexOf(currentStep)
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : 'bg-gray-700 border-2 border-gray-600'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-4xl mx-auto"
            >
              <ChatbotCreationForm
                onSubmit={handleCreateChatbot}
                isLoading={isDeploying}
              />
            </motion.div>
          )}

          {currentStep === 'deploy' && (
            <motion.div
              key="deploy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-200">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Container className="w-8 h-8 text-pink-400" />
                    </motion.div>
                    Container Deployment
                  </CardTitle>
                  <p className="text-gray-400 mt-2">
                    Setting up your AI chatbot infrastructure...
                  </p>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Container Progress</span>
                      <span className="text-pink-400 font-semibold">{containerProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
                        style={{ width: `${containerProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="text-center text-sm text-gray-400">
                      Estimated time: ~22 seconds
                    </div>
                  </div>

                  {/* Current Status */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <motion.div
                      animate={{ 
                        background: [
                          "linear-gradient(45deg, #ec4899, #8b5cf6)",
                          "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                          "linear-gradient(45deg, #06b6d4, #ec4899)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                      <Bot className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      {deploymentStatus}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      <span>Container is spinning up...</span>
                    </div>
                  </motion.div>

                  {/* Deployment Steps */}
                  <div className="space-y-4">
                    {[
                      { icon: Container, label: 'Container Setup', threshold: 25, color: 'text-blue-400' },
                      { icon: Database, label: 'Vector Database', threshold: 50, color: 'text-green-400' },
                      { icon: Zap, label: 'AI Integration', threshold: 75, color: 'text-purple-400' },
                      { icon: Rocket, label: 'Going Live', threshold: 100, color: 'text-pink-400' }
                    ].map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          containerProgress >= step.threshold
                            ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30'
                            : containerProgress >= step.threshold - 25
                            ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30'
                            : 'bg-gray-800/50 border border-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          containerProgress >= step.threshold
                            ? 'bg-emerald-500/20'
                            : containerProgress >= step.threshold - 25
                            ? 'bg-amber-500/20'
                            : 'bg-gray-700'
                        }`}>
                          {containerProgress >= step.threshold ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : containerProgress >= step.threshold - 25 ? (
                            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                          ) : (
                            <step.icon className={`w-4 h-4 ${step.color}`} />
                          )}
                        </div>
                        <span className={`font-medium ${
                          containerProgress >= step.threshold
                            ? 'text-emerald-300'
                            : containerProgress >= step.threshold - 25
                            ? 'text-amber-300'
                            : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-blue-400 font-medium">What's happening?</h4>
                        <p className="text-blue-300/80 text-sm mt-1">
                          We're creating a dedicated container environment with vector database for your chatbot's knowledge base and setting up AI API integrations.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="w-10 h-10 text-emerald-400" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">
                  Chatbot Deployed Successfully!
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Your AI chatbot container is now live and ready to use. You can now manage knowledge base and test conversations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push(`/chatbot/overview?id=${deploymentData?._id}`)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    Go to Overview
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push('/project/chatbot')}
                    className="border-gray-600 hover:border-pink-500/50"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatbotBuildPage;