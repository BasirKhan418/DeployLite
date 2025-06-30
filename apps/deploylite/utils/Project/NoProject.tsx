'use client'

import { motion } from 'framer-motion'
import { 
  Plus, 
  Rocket, 
  Code, 
  Globe, 
  Server, 
  Cloud, 
  Database,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  GitBranch,
  Activity,
  Settings,
  PlayCircle,
  CheckCircle,
  Star,
  ExternalLink,
  Layers,
  Terminal
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function NoProject({ name }: { name: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl border border-pink-500/30">
                <Rocket className="h-16 w-16 text-pink-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-3xl blur-xl -z-10" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to DeployLite
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Your journey to seamless deployment starts here. Create your first project and experience the power of AI-driven deployments.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-gray-300">AI Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Secure</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Empty State Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4 text-gray-100">
                No {name.charAt(0).toUpperCase() + name.slice(1)} Projects Yet
              </h2>
              
              <p className="text-gray-400 mb-8 text-lg">
                You haven't created any projects. Let's get started on your first deployment and unlock the full potential of our platform!
              </p>

              {/* Floating Animation Section */}
              <div className="relative h-48 mb-8 overflow-hidden">
                <motion.div
                  className="absolute top-4 left-8 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center"
                  variants={floatingAnimation}
                  animate="animate"
                >
                  <Code className="text-blue-400" size={28} />
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl flex items-center justify-center"
                  variants={pulseAnimation}
                  animate="animate"
                >
                  <Rocket className="text-pink-400" size={36} />
                </motion.div>
                
                <motion.div
                  className="absolute bottom-4 right-8 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center"
                  variants={floatingAnimation}
                  animate="animate"
                  transition={{ delay: 1 }}
                >
                  <Globe className="text-purple-400" size={28} />
                </motion.div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <motion.path
                    d="M 80 60 Q 200 120 320 100"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M 320 140 Q 200 180 80 160"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/project/createproject/${name}`}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Plus className={`mr-3 transition-transform duration-300 ${isHovered ? 'rotate-90' : ''}`} size={24} />
                  Create Your First {name.charAt(0).toUpperCase() + name.slice(1)} Project
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-8 text-gray-100">Why Choose DeployLite?</h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Server className="text-blue-400" size={28} />,
                    title: "Scalable Infrastructure",
                    description: "Deploy and scale your applications with our auto-scaling cloud infrastructure",
                    gradient: "from-blue-500/10 to-cyan-500/10",
                    border: "border-blue-500/20"
                  },
                  {
                    icon: <Sparkles className="text-pink-400" size={28} />,
                    title: "AI-Powered Optimization",
                    description: "Get intelligent build optimization and performance recommendations",
                    gradient: "from-pink-500/10 to-purple-500/10",
                    border: "border-pink-500/20"
                  },
                  {
                    icon: <Database className="text-purple-400" size={28} />,
                    title: "Integrated Services",
                    description: "Seamlessly connect databases, storage, and third-party services",
                    gradient: "from-purple-500/10 to-indigo-500/10",
                    border: "border-purple-500/20"
                  },
                  {
                    icon: <Shield className="text-green-400" size={28} />,
                    title: "Enterprise Security",
                    description: "Built-in security features with SSL certificates and DDoS protection",
                    gradient: "from-green-500/10 to-emerald-500/10",
                    border: "border-green-500/20"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-start p-4 bg-gradient-to-r ${feature.gradient} border ${feature.border} rounded-xl transition-all duration-300 hover:shadow-lg`}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className={`p-2 bg-gradient-to-r ${feature.gradient} border ${feature.border} rounded-lg`}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100 mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Getting Started Steps */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-8 shadow-2xl mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-100">Getting Started is Simple</h2>
              <p className="text-gray-400 text-lg">Follow these three easy steps to deploy your first project</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: <Plus className="text-pink-400" size={32} />,
                  title: "Create Project",
                  description: "Set up your project with our intuitive creation wizard and connect your repository",
                  gradient: "from-pink-500/10 to-purple-500/10",
                  border: "border-pink-500/20"
                },
                {
                  step: "02", 
                  icon: <GitBranch className="text-blue-400" size={32} />,
                  title: "Configure & Connect",
                  description: "Connect your GitHub repository and configure build settings with AI assistance",
                  gradient: "from-blue-500/10 to-cyan-500/10",
                  border: "border-blue-500/20"
                },
                {
                  step: "03",
                  icon: <Rocket className="text-purple-400" size={32} />,
                  title: "Deploy & Scale",
                  description: "Launch your application with one click and scale automatically based on traffic",
                  gradient: "from-purple-500/10 to-indigo-500/10",
                  border: "border-purple-500/20"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className={`relative text-center p-6 bg-gradient-to-br ${step.gradient} border ${step.border} rounded-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute top-4 right-4 text-6xl font-bold text-white/5">
                    {step.step}
                  </div>
                  
                  <div className={`relative rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${step.gradient} border ${step.border}`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="font-bold text-xl mb-4 text-gray-100">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  
                  {index < 2 && (
                    <motion.div
                      className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <ArrowRight className="text-pink-400/50" size={24} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Platform Features Grid */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Platform Features
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to build, deploy, and scale modern applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Terminal className="w-6 h-6 text-pink-400" />, title: "CLI Tools", description: "Deploy from command line" },
              { icon: <GitBranch className="w-6 h-6 text-blue-400" />, title: "Git Integration", description: "Auto-deploy on push" },
              { icon: <Activity className="w-6 h-6 text-green-400" />, title: "Real-time Monitoring", description: "Track performance metrics" },
              { icon: <Globe className="w-6 h-6 text-purple-400" />, title: "Global CDN", description: "Fast worldwide delivery" },
              { icon: <Settings className="w-6 h-6 text-yellow-400" />, title: "Custom Domains", description: "Use your own domain" },
              { icon: <Database className="w-6 h-6 text-cyan-400" />, title: "Database Support", description: "Connect any database" },
              { icon: <Shield className="w-6 h-6 text-red-400" />, title: "SSL Certificates", description: "Automatic HTTPS" },
              { icon: <Layers className="w-6 h-6 text-indigo-400" />, title: "Environment Variables", description: "Secure config management" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative p-6 bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-xl text-center transition-all duration-300 hover:border-pink-500/30 group"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="relative">
                  <div className="inline-flex p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg mb-4 group-hover:border-pink-500/30 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-100 mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-100">Ready to Get Started?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust DeployLite for their deployment needs. Create your first project today and experience the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/project/createproject/${name}`}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-300"
              >
                <Rocket className="mr-2" size={20} />
                Start Your Project
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/docs"
                className="inline-flex items-center px-8 py-4 bg-transparent border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 font-semibold rounded-xl transition-all duration-300"
              >
                <ExternalLink className="mr-2" size={20} />
                View Documentation
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="mt-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Trusted by 10,000+ developers</span>
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">99.9% uptime guaranteed</span>
            </div>
          </div>
          <p className="text-gray-500">© 2024 DeployLite. All rights reserved.</p>
        </motion.footer>
      </motion.div>
    </div>
  )
}