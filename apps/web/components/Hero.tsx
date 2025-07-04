"use client"
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export const Hero = () => {
  return (
    <div className="relative bg-gray-950 pt-20 pb-16 sm:pt-24 sm:pb-20" id='about'>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-950"></div>
      
      {/* Grid pattern */}
      <div
        className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Version badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 mb-8 bg-gray-800/50 border border-gray-700 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-gray-300">Version 2.0 is here</span>
            <ChevronRight className="ml-2 h-4 w-4 text-gray-400" />
          </motion.div>
          
          {/* Main heading */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Deploy{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Smarter
            </span>
            <br />
            Scale Faster
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            DeployLite makes code deployment effortless and efficient. Launch, scale, and manage your applications with enterprise-grade reliability.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button 
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-200"
              onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
            >
              Start Deploying Free
            </button>
            <button className="text-gray-300 hover:text-white px-8 py-3 rounded-lg font-medium border border-gray-700 hover:border-gray-600 transition-colors duration-200">
              View Documentation
            </button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3k+</div>
              <div className="text-sm text-gray-400">Deployments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-gray-400">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};