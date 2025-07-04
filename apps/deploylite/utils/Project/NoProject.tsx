"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Rocket, 
  CloudLightning, 
  Globe, 
  Database,
  Terminal,
  Code,
  Monitor,
  Sparkles,
  ArrowRight 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FaRobot } from "react-icons/fa";

interface NoProjectProps {
  name: string;
}

const NoProject: React.FC<NoProjectProps> = ({ name }) => {
  const router = useRouter();

  const getProjectConfig = () => {
    switch (name) {
      case "webbuilder":
        return {
          title: "Web Builder",
          subtitle: "Create websites with popular web builders",
          description: "Deploy WordPress, Joomla, Drupal, and other web builders with zero configuration. Get your website online in minutes with database integration.",
          icon: <Globe className="w-16 h-16 text-purple-400" />,
          gradient: "from-purple-400 to-blue-400",
          buttonText: "Create Website",
          features: [
            { text: "WordPress, Joomla, Drupal", icon: <Globe className="w-4 h-4" /> },
            { text: "Database Integration", icon: <Database className="w-4 h-4" /> },
            { text: "SSL Certificates", icon: <Monitor className="w-4 h-4" /> },
            { text: "Domain Mapping", icon: <ArrowRight className="w-4 h-4" /> }
          ]
        };
      case "virtualspace":
        return {
          title: "Virtual Space",
          subtitle: "Cloud development environments",
          description: "Set up containerized development environments with VS Code in the browser. Perfect for coding, testing, and collaboration from anywhere.",
          icon: <CloudLightning className="w-16 h-16 text-pink-400" />,
          gradient: "from-pink-400 to-purple-400",
          buttonText: "Create Virtual Space",
          features: [
            { text: "VS Code in Browser", icon: <Code className="w-4 h-4" /> },
            { text: "Full Linux Terminal", icon: <Terminal className="w-4 h-4" /> },
            { text: "Persistent Storage", icon: <Database className="w-4 h-4" /> },
            { text: "Secure Access", icon: <Monitor className="w-4 h-4" /> }
          ]
        };case "chatbot":
        return {
          title: "ChatBot Builder",
          subtitle: "Cloud development environments",
          description: "Set up containerized development environments with VS Code in the browser. Perfect for coding, testing, and collaboration from anywhere.",
          icon: <FaRobot className="w-16 h-16 text-pink-400" />,
          gradient: "from-pink-400 to-purple-400",
          buttonText: "Create RAG ChatBot",
          features: [
            { text: "VS Code in Browser", icon: <Code className="w-4 h-4" /> },
            { text: "Full Linux Terminal", icon: <Terminal className="w-4 h-4" /> },
            { text: "Persistent Storage", icon: <Database className="w-4 h-4" /> },
            { text: "Secure Access", icon: <Monitor className="w-4 h-4" /> }
          ]
        };
      default:
        return {
          title: "App Platform",
          subtitle: "Deploy web applications",
          description: "Deploy React, Next.js, Angular, Vue.js and other web applications with automatic CI/CD from your GitHub repositories.",
          icon: <Rocket className="w-16 h-16 text-blue-400" />,
          gradient: "from-blue-400 to-cyan-400",
          buttonText: "Create Project",
          features: [
            { text: "Auto Deployments", icon: <Rocket className="w-4 h-4" /> },
            { text: "GitHub Integration", icon: <Code className="w-4 h-4" /> },
            { text: "Custom Domains", icon: <Globe className="w-4 h-4" /> },
            { text: "SSL & CDN", icon: <Monitor className="w-4 h-4" /> }
          ]
        };
    }
  };

  const config = getProjectConfig();

  const handleCreateProject = () => {
    if(name=="chatbot") {
      router.push(`/chatbotbuild`);
      return;
    }
    router.push(`/project/createproject/${name}`);
  };

  const handleViewDocs = () => {
    router.push(`/docs/${name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 rounded-3xl p-12 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl" />
          
          <div className="relative">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
                {config.icon}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-4`}
            >
              {config.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 mb-8"
            >
              {config.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              {config.description}
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
              {config.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-purple-400">
                      {feature.icon}
                    </div>
                    <span className="text-sm text-gray-300 text-center">
                      {feature.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-xl px-8 py-4 text-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center gap-3"
              >
                <PlusCircle className="w-5 h-5" />
                {config.buttonText}
              </Button>
              
              <Button
                onClick={handleViewDocs}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl px-8 py-4 text-lg transition-all duration-300 flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                View Documentation
              </Button>
            </motion.div>

            {/* Bottom Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-500 text-sm mt-8"
            >
              Get started in less than 2 minutes with our guided setup process
            </motion.p>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </motion.div>
    </div>
  );
};

export default NoProject;