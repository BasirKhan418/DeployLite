"use client"
import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import { RxHamburgerMenu } from "react-icons/rx";
import Link from 'next/link';
import { 
  Home, 
  Info, 
  Layers, 
  HelpCircle, 
  DollarSign, 
  Rocket,
  Monitor,
} from 'lucide-react';

const mainNavItems = [
  { href: "#about", label: "About", icon: Info, description: "Learn about our platform" },
  { href: "#features", label: "Features", icon: Layers, description: "Explore what we offer" },
  { href: "#product", label: "Product", icon: Monitor, description: "See our dashboard" },
  { href: "#faq", label: "FAQ", icon: HelpCircle, description: "Common questions" },
  { href: "#pricing", label: "Pricing", icon: DollarSign, description: "Choose your plan" },
];

export const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="fixed w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800 text-white z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"}>
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DEPLOYLITE
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 items-center">
            {mainNavItems.map((item) => (
              <motion.a 
                key={item.label}
                href={item.href} 
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
            <motion.button 
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
              onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </nav>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            <motion.button 
              onClick={toggleSidebar} 
              aria-label="Open sidebar" 
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RxHamburgerMenu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      
      {/* Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 z-50 lg:hidden overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-gray-950/95"></div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
                <motion.span 
                  className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Navigation
                </motion.span>
                <motion.button 
                  onClick={toggleSidebar} 
                  className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoClose className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Main Navigation Items */}
              <div className="flex-1 py-6 px-6">
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Main Menu
                  </h3>
                  <nav className="space-y-2">
                    {mainNavItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.a 
                          key={item.label}
                          href={item.href} 
                          className="flex items-center space-x-4 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
                          onClick={toggleSidebar}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * (index + 1) }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-colors duration-200">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                              {item.description}
                            </div>
                          </div>
                          <div className="w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-4 transition-all duration-300"></div>
                        </motion.a>
                      );
                    })}
                  </nav>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="p-6 border-t border-gray-800/50">
                <motion.button 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  onClick={() => {
                    window.location.href = "https://app.deploylite.tech/signup"
                    toggleSidebar()
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Rocket className="w-5 h-5" />
                  <span>Get Started Free</span>
                </motion.button>
                
                {/* Status Badge */}
                <motion.div 
                  className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
