"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ChatbotCreationForm from "@/components/ChatbotBuilder/ChatbotCreationForm";
import DeploymentProgress from "@/components/ChatbotBuilder/DeploymentProgress";
import { useAppSelector } from "@/lib/hook";
import { Loader2, Bot, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  const pollForChatbotCompletion = async (chatbotName: string) => {
    const maxAttempts = 30; 
    let attempts = 0;

    const checkChatbot = async (): Promise<void> => {
      try {
        const response = await fetch('/api/project/chatbot');
        const data = await response.json();

        if (data.success && data.projectdata) {
          // Look for the chatbot we just created
          const foundChatbot = data.projectdata.find((bot: any) => bot.name === chatbotName);
          
          if (foundChatbot) {
            if (foundChatbot.projectstatus === 'live') {
              setDeploymentData(foundChatbot);
              return; // Success!
            } else if (foundChatbot.projectstatus === 'failed') {
              throw new Error('Chatbot deployment failed');
            }
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          // Update progress based on time elapsed
          const progressIncrement = Math.min(20, (attempts / maxAttempts) * 20);
          setDeploymentProgress(prev => Math.min(95, prev + progressIncrement));
          
          await new Promise(resolve => setTimeout(resolve, 5000)); 
          return checkChatbot();
        } else {
          throw new Error('Deployment timeout');
        }
      } catch (error: any) {
        console.error('Status check error:', error);
        throw error;
      }
    };

    await checkChatbot();
  };

  
  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    
    if (!user.connectgithub) {
      toast.error("Please connect your GitHub account first");
      router.push("/project");
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
    setDeploymentProgress(10);

    try {
      setDeploymentProgress(25);

      // Create chatbot project - send data exactly as backend expects
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
      
      setDeploymentProgress(50);

      if (!createResult.success) {
        throw new Error(createResult.message);
      }

      setDeploymentProgress(75);

     
      toast.success('Chatbot creation initiated successfully!');
      
      setTimeout(() => {
        setDeploymentProgress(100);
        setCurrentStep('complete');
        setIsDeploying(false);
        toast.success('Chatbot deployed successfully!');
       
        setTimeout(() => {
          router.push('/project'); 
        }, 2000);
      }, 8000); 

    } catch (error: any) {
      console.error('Chatbot creation error:', error);
      toast.error(error.message || 'Failed to create chatbot');
      setCurrentStep('create');
      setIsDeploying(false);
      setDeploymentProgress(0);
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
              onClick={() => router.push('/project')}
              className="text-gray-400 hover:text-pink-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
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
              { step: 'deploy', label: 'Deployment', icon: '🚀' },
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
              <DeploymentProgress
                progress={deploymentProgress}
                projectName={deploymentData?.name || 'Your Chatbot'}
                status="deploying"
              />
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
                  Your AI chatbot is now being deployed and will be available shortly in your projects dashboard.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/project')}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    Go to Projects
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push('/chatbotbuild')}
                    className="border-gray-600 hover:border-pink-500/50"
                  >
                    Create Another
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