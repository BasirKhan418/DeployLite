"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Zap, Cloud, Code, BarChart3, Users, Activity } from 'lucide-react';

const FloatingCard = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={`absolute card-pro p-3 sm:p-4 hover-lift-glow z-20 ${className}`}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 1, -1, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    whileHover={{ scale: 1.05, y: -10 }}
  >
    {children}
  </motion.div>
);

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

const ParticleField = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 opacity-40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -120, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const GlowingOrb = ({ className, delay = 0 }) => (
  <div
    className={`absolute rounded-full bg-gradient-to-r from-pink-500/30 to-cyan-500/30 blur-3xl ${className}`}
    style={{
      animation: `glow-orb ${12 + delay}s ease-in-out infinite ${delay}s`,
    }}
  />
);

const StatsCard = ({ icon: Icon, label, value, trend, trendColor = "text-green-400", delay = 0 }) => (
  <motion.div
    className="card-pro p-4 sm:p-6 relative overflow-hidden group hover-lift-glow w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    {/* Background Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className={`text-xs sm:text-sm font-medium ${trendColor}`}>{trend}</span>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-glow-pink transition-all duration-300">{value}</p>
        <p className="text-xs sm:text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</p>
      </div>
    </div>
    
    {/* Shimmer Effect */}
    <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
  </motion.div>
);

const AnimatedBadge = () => (
  <motion.div 
    className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-pro border border-pink-500/20 text-white/80 text-xs sm:text-sm mb-6 sm:mb-8 relative overflow-hidden group hover-magnetic"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    whileHover={{ scale: 1.05, borderColor: "rgba(255, 27, 107, 0.4)" }}
  >
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <div className="relative flex items-center gap-2 sm:gap-3">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
      </motion.div>
      <span className="relative z-10 hidden sm:inline">Welcome back,</span>
      <motion.div 
        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full status-live"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-green-400 font-medium text-xs sm:text-sm">Last updated: 12:07:19 AM</span>
    </div>
  </motion.div>
);

export const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Reduced parallax effect to prevent shaking
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative">
      {/* Add keyframe for orb animation */}
      <style jsx>{`
        @keyframes glow-orb {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.5;
          }
        }
      `}</style>

      <motion.div 
        ref={containerRef}
        className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center pt-16 sm:pt-20 pb-8 sm:pb-16"
        style={{ y, opacity }}
      >
        {/* Static Background Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 27, 107, 0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 27, 107, 0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Static Glowing Orbs - Removed animation to prevent shaking */}
        <GlowingOrb className="w-72 sm:w-96 h-72 sm:h-96 -top-36 sm:-top-48 -left-36 sm:-left-48" delay={0} />
        <GlowingOrb className="w-64 sm:w-80 h-64 sm:h-80 -bottom-32 sm:-bottom-40 -right-32 sm:-right-40" delay={2} />
        <GlowingOrb className="w-48 sm:w-64 h-48 sm:h-64 top-1/4 left-1/4" delay={4} />
        
        {/* Particle Field */}
        <ParticleField />
        
        {/* Floating Dashboard Elements - Responsive positioning */}
        <FloatingCard delay={0} className="top-16 sm:top-20 left-2 sm:left-10 w-40 sm:w-52 hidden sm:block">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Activity className="w-3 sm:w-5 h-3 sm:h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Active Projects</p>
              <p className="font-bold text-lg sm:text-xl text-white">24</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 rounded-full status-live"></div>
                <span className="text-xs text-green-400">Live: 18</span>
              </div>
            </div>
          </div>
        </FloatingCard>
        
        <FloatingCard delay={1} className="top-24 sm:top-32 right-2 sm:right-16 w-44 sm:w-56 hidden lg:block">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Success Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">98.5%</p>
              </div>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-green-400/20 flex items-center justify-center relative">
                <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-full status-live"></div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
              <motion.div 
                className="h-1.5 sm:h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "98.5%" }}
                transition={{ duration: 2, delay: 1 }}
              ></motion.div>
            </div>
          </div>
        </FloatingCard>
        
        <FloatingCard delay={2} className="bottom-24 sm:bottom-32 left-2 sm:left-16 w-36 sm:w-48 hidden sm:block">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Cloud className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <span className="text-xs text-white/60">Deployments</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">1,247</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/60">Today:</span>
              <span className="text-cyan-400 font-medium">+23</span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard delay={3} className="bottom-32 sm:bottom-40 right-2 sm:right-20 w-32 sm:w-44 hidden lg:block">
          <div className="text-center space-y-1 sm:space-y-2">
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
              <Users className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            </div>
            <p className="text-xs text-white/60">Team Members</p>
            <p className="text-lg sm:text-xl font-bold text-white">12</p>
          </div>
        </FloatingCard>

        {/* Main Content */}
        <div className="relative z-30 container mx-auto px-4 sm:px-6 text-center max-w-7xl">
          {/* Welcome Badge */}
          <AnimatedBadge />

          {/* Main Heading with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
              <motion.span 
                className="block text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Build smarter
              </motion.span>
              <motion.span 
                className="block text-shimmer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{ backgroundSize: '200% 200%', animation: 'gradient-flow 4s ease infinite' }}
              >
                SaaS development
              </motion.span>
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <span className="text-white">made </span>
                <span className="italic text-glow-cyan">scalable</span>
              </motion.span>
            </h1>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.p
            className="text-base sm:text-xl md:text-2xl text-white/70 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            SaaS DevSomeware empowers teams to build enterprise-grade applications with 
            cloud-native architecture, automated deployments, and robust infrastructure — all 
            integrated seamlessly.
          </motion.p>

          {/* Enhanced Feature Cards Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <StatsCard 
              icon={BarChart3} 
              label="Total Deployments" 
              value="0" 
              trend="+0% today" 
              trendColor="text-cyan-400"
              delay={1.4}
            />
            <StatsCard 
              icon={Zap} 
              label="Active Projects" 
              value="0" 
              trend="0 live, 0 building" 
              trendColor="text-green-400"
              delay={1.5}
            />
            <StatsCard 
              icon={Activity} 
              label="Success Rate" 
              value="0%" 
              trend="Last 30 days" 
              trendColor="text-pink-400"
              delay={1.6}
            />
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            <motion.button
              className="btn-glow px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold flex items-center gap-2 sm:gap-3 relative overflow-hidden group w-full sm:w-auto"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                <motion.svg 
                  className="w-4 h-4 sm:w-5 sm:h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </motion.svg>
                Start Building Today
                <motion.div className="group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </span>
            </motion.button>
            
            <motion.button
              className="btn-outline-glow px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold flex items-center gap-2 sm:gap-3 relative overflow-hidden group w-full sm:w-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Enhanced Dashboard Preview */}
          <motion.div
            className="relative max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 1.9 }}
          >
            <div className="relative card-pro p-2 sm:p-3 border border-white/10 group hover-lift-glow">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              
              <div className="relative bg-black rounded-xl p-3 sm:p-6 border border-white/5">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <motion.svg 
                          className="w-4 sm:w-5 h-4 sm:h-5 text-white" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                          <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                        </motion.svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-lg">DeployLite</h3>
                        <p className="text-xs text-white/60">Cloud Platform</p>
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    className="btn-glow px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                      <motion.svg 
                        className="w-3 sm:w-4 h-3 sm:h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </motion.svg>
                      <span className="hidden sm:inline">Refresh</span>
                    </span>
                  </motion.button>
                </div>
                
                {/* Enhanced Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
                  <motion.div 
                    className="card-pro p-3 sm:p-5 relative overflow-hidden group hover-lift-glow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 bg-pink-500/20 rounded-lg border border-pink-500/30">
                          <BarChart3 className="w-3 sm:w-5 h-3 sm:h-5 text-pink-400" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/60">Total Deployments</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">0</p>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-pink-400 animate-pulse"></div>
                        <span className="text-xs text-white/40">Waiting for first deployment</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="card-pro p-3 sm:p-5 relative overflow-hidden group hover-lift-glow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4, duration: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                          <Activity className="w-3 sm:w-5 h-3 sm:h-5 text-cyan-400" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/60">Active Projects</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">0</p>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Live:</span>
                          <span className="text-green-400 font-medium">0</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Building:</span>
                          <span className="text-yellow-400 font-medium">0</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Failed:</span>
                          <span className="text-red-400 font-medium">0</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="card-pro p-3 sm:p-5 relative overflow-hidden group hover-lift-glow"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.6, duration: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                          <Zap className="w-3 sm:w-5 h-3 sm:h-5 text-green-400" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/60">Success Rate</span>
                      </div>
                      <p className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">0%</p>
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs text-white/60">Build Success rate over time</p>
                        <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
                          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full w-0"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section - Only show on larger screens to prevent crowding */}
                <motion.div 
                  className="hidden lg:grid lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.8, duration: 0.8 }}
                >
                  {/* Deployment Trends */}
                  <div className="card-pro p-5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          <h4 className="font-semibold text-white">Deployment Trends</h4>
                        </div>
                        <span className="text-xs text-white/60">Last 6 months</span>
                      </div>
                      
                      <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 opacity-40">
                          <svg className="w-full h-full text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                        <p className="text-white/60 mb-1 text-sm">No deployment data available</p>
                        <p className="text-xs text-white/40">Deploy your first project to see trends</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    {/* Successful Builds */}
                    <div className="card-pro p-4 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                            <span className="text-sm font-bold text-green-400">0%</span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">Successful Builds</p>
                            <p className="text-xs text-white/60">Success</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Failed Builds */}
                    <div className="card-pro p-4 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <span className="text-sm font-bold text-red-400">0%</span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">Failed Builds</p>
                            <p className="text-xs text-white/60">Failed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-pink-500/30 transition-all duration-500"></div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
        >
          <motion.div
            className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/30 rounded-full flex justify-center p-1.5 sm:p-2"
            whileHover={{ scale: 1.1, borderColor: "rgba(255, 27, 107, 0.5)" }}
          >
            <motion.div
              className="w-1 h-2 sm:h-3 bg-gradient-to-b from-pink-500 to-cyan-500 rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};