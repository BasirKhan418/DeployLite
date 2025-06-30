"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Check, Mail, Star, Zap, Users, Globe, Shield } from 'lucide-react';
import { toast, Toaster } from "react-hot-toast";

const FloatingElement = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const TrustBadge = ({ icon: Icon, text, delay = 0 }) => (
  <motion.div
    className="flex items-center gap-2 glass-pro px-4 py-2 rounded-full border border-white/20 group hover-magnetic"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05, borderColor: "rgba(255, 27, 107, 0.3)" }}
  >
    <Icon className="w-4 h-4 text-pink-400 group-hover:text-cyan-400 transition-colors" />
    <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
      {text}
    </span>
  </motion.div>
);

const FeatureCheck = ({ text, delay = 0 }) => (
  <motion.div
    className="flex items-center gap-3 group"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ x: 5 }}
  >
    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
      <Check className="w-3 h-3 text-white" />
    </div>
    <span className="text-white/80 group-hover:text-white transition-colors">
      {text}
    </span>
  </motion.div>
);

export const CallToAction = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address!");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("🎉 Welcome aboard! Redirecting to your dashboard...");
      setTimeout(() => {
        window.location.href = `https://app.deploylite.tech/signup?email=${encodeURIComponent(email)}`;
      }, 1500);
      setIsSubmitting(false);
    }, 1000);
  };

  const features = [
    "Deploy in under 30 seconds",
    "99.9% uptime guarantee", 
    "24/7 expert support",
    "Enterprise-grade security"
  ];

  const trustIndicators = [
    { icon: Users, text: "10K+ Developers" },
    { icon: Globe, text: "50+ Countries" },
    { icon: Shield, text: "SOC 2 Certified" },
    { icon: Star, text: "4.9/5 Rating" }
  ];

  return (
    <div className="bg-black py-16 sm:py-24 relative overflow-hidden" id="cta">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(17, 17, 17, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 27, 107, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
          },
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/10 to-black"></div>
      
      {/* Floating Elements */}
      <FloatingElement delay={0} className="top-20 left-10 hidden lg:block">
        <div className="w-20 h-20 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
      </FloatingElement>
      
      <FloatingElement delay={2} className="top-32 right-16 hidden lg:block">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
      </FloatingElement>
      
      <FloatingElement delay={4} className="bottom-20 left-20 hidden lg:block">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
      </FloatingElement>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pro border border-pink-500/20 text-pink-400 text-sm mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Rocket className="w-4 h-4" />
                Start Your Journey
              </motion.div>

              {/* Main Heading */}
              <motion.h2 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">Get Instant </span>
                <span className="text-shimmer">Access</span>
              </motion.h2>

              {/* Subtitle */}
              <motion.p 
                className="text-xl text-white/70 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Start deploying your web apps instantly with our easy-to-use platform. 
                No setup required—just fast, reliable hosting at your fingertips.
              </motion.p>

              {/* Features List */}
              <motion.div 
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {features.map((feature, index) => (
                  <FeatureCheck 
                    key={feature} 
                    text={feature} 
                    delay={0.8 + index * 0.1} 
                  />
                ))}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {trustIndicators.map((indicator, index) => (
                  <TrustBadge 
                    key={indicator.text} 
                    icon={indicator.icon} 
                    text={indicator.text} 
                    delay={1.3 + index * 0.1} 
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Email Form */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
              
              {/* Form Container */}
              <div className="relative card-pro p-8 sm:p-12 group hover-lift-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-glow-pink transition-all duration-300">
                      Start Building Today
                    </h3>
                    <p className="text-white/70 group-hover:text-white/90 transition-colors">
                      Join thousands of developers already using DeployLite
                    </p>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"
                        animate={{ rotate: [0, 1, -1, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                      />
                      
                      <div className="relative flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/60 backdrop-blur-lg focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <motion.button
                          type="submit"
                          className="btn-glow h-14 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 min-w-[140px] relative overflow-hidden group/btn"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {isSubmitting ? (
                              <motion.div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                            ) : (
                              <>
                                Get Access
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </>
                            )}
                          </span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-white/60 text-center">
                      By signing up, you agree to our{" "}
                      <button className="text-pink-400 hover:text-pink-300 transition-colors underline">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button className="text-pink-400 hover:text-pink-300 transition-colors underline">
                        Privacy Policy
                      </button>
                    </p>
                  </form>

                  {/* Social Proof */}
                  <motion.div
                    className="mt-8 pt-8 border-t border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    <div className="text-center mb-4">
                      <p className="text-white/60 text-sm mb-3">Trusted by developers at</p>
                      <div className="flex justify-center items-center gap-6 opacity-60">
                        {["Google", "Microsoft", "Netflix", "Spotify"].map((company, index) => (
                          <motion.span
                            key={company}
                            className="text-white/40 font-semibold text-sm hover:text-white/60 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 + index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {company}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.8 + i * 0.1 }}
                          >
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-white/80 text-sm font-medium">4.9/5</span>
                      <span className="text-white/60 text-sm">(2,847 reviews)</span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000 rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-16 sm:mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: "10K+", label: "Developers", subtext: "trust our platform" },
              { number: "2M+", label: "Deployments", subtext: "completed successfully" },
              { number: "99.9%", label: "Uptime", subtext: "guaranteed SLA" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-glow-pink mb-2 group-hover:text-shimmer transition-all duration-300">
                  {stat.number}
                </div>
                <div className="text-white font-medium mb-1 group-hover:text-glow-cyan transition-all duration-300">
                  {stat.label}
                </div>
                <div className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                  {stat.subtext}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};