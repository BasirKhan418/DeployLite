"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  CheckCircle, 
  Package, 
  Server, 
  Bot, 
  Rocket,
  Container,
  Database,
  Zap
} from "lucide-react";

interface DeploymentProgressProps {
  progress: number;
  projectName: string;
  status: 'deploying' | 'complete' | 'failed';
}

const DeploymentProgress: React.FC<DeploymentProgressProps> = ({
  progress,
  projectName,
  status
}) => {
  const deploymentSteps = [
    {
      id: 'initializing',
      label: 'Initializing Project',
      description: 'Setting up your chatbot configuration',
      icon: Package,
      threshold: 10
    },
    {
      id: 'container',
      label: 'Building Container',
      description: 'Creating containerized environment',
      icon: Container,
      threshold: 25
    },
    {
      id: 'deployment',
      label: 'Deploying to Cloud',
      description: 'Spinning up ECS Fargate instance',
      icon: Server,
      threshold: 50
    },
    {
      id: 'database',
      label: 'Setting up Knowledge Base',
      description: 'Preparing vector database',
      icon: Database,
      threshold: 75
    },
    {
      id: 'finalizing',
      label: 'Finalizing Setup',
      description: 'Configuring LLM integration',
      icon: Bot,
      threshold: 90
    },
    {
      id: 'complete',
      label: 'Ready to Use',
      description: 'Your chatbot is live!',
      icon: Rocket,
      threshold: 100
    }
  ];

  const getCurrentStep = () => {
    for (let i = deploymentSteps.length - 1; i >= 0; i--) {
      if (progress >= deploymentSteps[i].threshold) {
        return i;
      }
    }
    return 0;
  };

  const currentStepIndex = getCurrentStep();

  const getStepStatus = (stepIndex: number) => {
    if (status === 'failed') return 'failed';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  const getEstimatedTime = () => {
    const remaining = 100 - progress;
    const estimatedMinutes = Math.ceil((remaining / 100) * 5); 
    return estimatedMinutes;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-200">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-8 h-8 text-pink-400" />
            </motion.div>
            Deploying {projectName}
          </CardTitle>
          <p className="text-gray-400 mt-2">
            Setting up your AI chatbot infrastructure...
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-pink-400 font-semibold">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-3 bg-gray-800"
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Started</span>
              <span>Estimated: {getEstimatedTime()} min remaining</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Deployment Steps */}
          <div className="space-y-4">
            {deploymentSteps.map((step, index) => {
              const stepStatus = getStepStatus(index);
              const StepIcon = step.icon;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    stepStatus === 'active'
                      ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30'
                      : stepStatus === 'completed'
                      ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30'
                      : stepStatus === 'failed'
                      ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30'
                      : 'bg-gray-800/50 border border-gray-700'
                  }`}
                >
                  {/* Step Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    stepStatus === 'active'
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500'
                      : stepStatus === 'completed'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-500'
                      : stepStatus === 'failed'
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500'
                      : 'bg-gray-700 border-2 border-gray-600'
                  }`}>
                    <AnimatePresence mode="wait">
                      {stepStatus === 'active' ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
                        </motion.div>
                      ) : stepStatus === 'completed' ? (
                        <motion.div
                          key="completed"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <StepIcon className={`w-6 h-6 ${
                            stepStatus === 'failed' ? 'text-red-400' : 'text-gray-400'
                          }`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step Details */}
                  <div className="flex-1">
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      stepStatus === 'active'
                        ? 'text-pink-300'
                        : stepStatus === 'completed'
                        ? 'text-emerald-300'
                        : stepStatus === 'failed'
                        ? 'text-red-300'
                        : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      stepStatus === 'active' || stepStatus === 'completed'
                        ? 'text-gray-300'
                        : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Step Status Indicator */}
                  <div className="flex items-center">
                    {stepStatus === 'active' && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-pink-400 rounded-full"
                      />
                    )}
                    {stepStatus === 'completed' && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    )}
                    {stepStatus === 'failed' && (
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Current Action */}
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
              {deploymentSteps[currentStepIndex]?.label || 'Processing...'}
            </h3>
            
            <p className="text-gray-400 mb-4">
              {deploymentSteps[currentStepIndex]?.description || 'Setting up your chatbot...'}
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-4 h-4" />
              </motion.div>
              <span>This may take a few minutes...</span>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4"
          >
            <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              What's happening?
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Creating a dedicated container environment</li>
              <li>• Setting up vector database for knowledge storage</li>
              <li>• Configuring LLM API integration</li>
              <li>• Preparing real-time chat interface</li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeploymentProgress;