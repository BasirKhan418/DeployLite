"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import Link from 'next/link';

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#showcase", label: "Showcase" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      <motion.header 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrollY > 50 
            ? 'glass-pro border-b border-white/5' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div 
                className="relative flex items-center space-x-3 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
                  
                  {/* Icon Container */}
                  <div className="relative w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl border border-white/10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 animate-glow-pulse opacity-20"></div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-shimmer">
                    DeployLite
                  </span>
                  <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                    Cloud Platform
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="relative text-white/80 hover:text-white transition-all duration-300 group py-2 px-4 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  {/* Bottom Border */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 blur-lg opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                </motion.a>
              ))}
              
              <motion.button
                className="btn-glow px-6 py-3 rounded-xl font-semibold relative overflow-hidden group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </motion.svg>
                  Create
                </span>
              </motion.button>
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-3 text-white hover:text-pink-400 transition-colors rounded-xl glass-pro hover-magnetic"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RxHamburgerMenu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className="fixed top-0 right-0 h-full w-80 glass-pro border-l border-pink-500/20 z-50 lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Sidebar Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/5 to-cyan-500/5 pointer-events-none"></div>
            
            <div className="relative p-6 h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-glow-pink">Menu</span>
                </div>
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2 text-white hover:text-pink-400 transition-colors rounded-lg glass-pro hover-magnetic"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoClose className="h-6 w-6" />
                </motion.button>
              </div>
              
              <nav className="space-y-4 mb-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="block p-4 text-white/80 hover:text-white transition-all duration-300 text-lg rounded-xl glass-pro-hover group relative overflow-hidden"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={toggleSidebar}
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                      {item.label}
                    </div>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </motion.a>
                ))}
                
                <motion.button
                  className="w-full mt-8 btn-glow px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
                >
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </motion.svg>
                  Get Started
                  
                  {/* Button Shimmer Effect */}
                  <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-700"></div>
                </motion.button>
              </nav>

              {/* Enhanced Balance Display */}
              <motion.div 
                className="card-pro p-4 border border-white/5 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center relative">
                    <span className="text-sm font-bold">₹</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 animate-glow-pulse opacity-30"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Current Balance</p>
                    <p className="font-semibold text-white text-lg">₹0.00</p>
                  </div>
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-400 status-live"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                </div>
                
                {/* Stats Row */}
                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-white/60">Projects</p>
                    <p className="text-sm font-semibold text-white">0</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Deployments</p>
                    <p className="text-sm font-semibold text-white">0</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Success</p>
                    <p className="text-sm font-semibold text-green-400">0%</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                className="mt-6 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-sm text-white/60 font-medium">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button 
                    className="btn-outline-glow p-3 rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                    </svg>
                    Analytics
                  </motion.button>
                  <motion.button 
                    className="btn-outline-glow p-3 rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;