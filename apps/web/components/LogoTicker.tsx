"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';
import acmeLogo from "../assets/images/acme.png";
import quantumLogo from "../assets/images/quantum.png";
import echoLogo from "../assets/images/echo.png";
import celestialLogo from "../assets/images/celestial.png";
import pulseLogo from "../assets/images/pulse.png";
import apexLogo from "../assets/images/apex.png";

// Enhanced company data with metrics
const companies = [
  { 
    src: acmeLogo, 
    alt: "Acme Corp", 
    name: "Acme Corp",
    metric: "2M+ deployments",
    growth: "+150% YoY"
  },
  { 
    src: quantumLogo, 
    alt: "Quantum Systems", 
    name: "Quantum",
    metric: "500K+ users", 
    growth: "+200% YoY"
  },
  { 
    src: echoLogo, 
    alt: "Echo Technologies", 
    name: "Echo Tech",
    metric: "1M+ projects",
    growth: "+120% YoY"
  },
  { 
    src: celestialLogo, 
    alt: "Celestial Solutions", 
    name: "Celestial",
    metric: "750K+ builds",
    growth: "+180% YoY"
  },
  { 
    src: pulseLogo, 
    alt: "Pulse Innovations", 
    name: "Pulse",
    metric: "300K+ teams",
    growth: "+90% YoY"
  },
  { 
    src: apexLogo, 
    alt: "Apex Dynamics", 
    name: "Apex",
    metric: "1.5M+ APIs",
    growth: "+160% YoY"
  },
];

const LogoCard = ({ company, index, delay = 0 }) => (
  <motion.div
    className="group relative card-pro p-6 hover-lift-glow w-64 flex-shrink-0 mx-4"
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.6, 
      delay: delay + index * 0.1,
      ease: [0.4, 0, 0.2, 1]
    }}
    whileHover={{ 
      scale: 1.05, 
      y: -10,
      transition: { duration: 0.3 }
    }}
  >
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    {/* Logo Container */}
    <div className="relative z-10 text-center space-y-4">
      <div className="relative">
        {/* Glow Effect Behind Logo */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
        
        {/* Logo */}
        <div className="relative bg-white/5 rounded-xl p-4 border border-white/10 group-hover:border-pink-500/30 transition-all duration-500">
          <Image 
            src={company.src} 
            alt={company.alt}
            className="w-16 h-16 mx-auto object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
          />
        </div>
      </div>
      
      {/* Company Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-white group-hover:text-glow-pink transition-all duration-300">
          {company.name}
        </h3>
        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
          {company.metric}
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">{company.growth}</span>
        </div>
      </div>
    </div>
    
    {/* Shimmer Effect */}
    <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
  </motion.div>
);

const InfiniteScrollLogos = () => (
  <div className="flex items-center space-x-8 animate-infinite-scroll">
    {companies.map((company, index) => (
      <motion.div
        key={`scroll-${index}`}
        className="flex items-center justify-center w-20 h-20 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all duration-300 group hover-magnetic flex-shrink-0"
        whileHover={{ scale: 1.1, y: -5 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
          <Image 
            src={company.src} 
            alt={company.alt}
            className="relative w-10 h-10 object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
          />
        </div>
      </motion.div>
    ))}
  </div>
);

const StatsDisplay = () => (
  <motion.div
    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    {[
      { label: "Global Enterprises", value: "500+", icon: "🏢" },
      { label: "Countries Served", value: "50+", icon: "🌍" },
      { label: "Total Deployments", value: "10M+", icon: "🚀" },
      { label: "Uptime SLA", value: "99.9%", icon: "⚡" }
    ].map((stat, index) => (
      <motion.div
        key={stat.label}
        className="text-center card-pro p-6 hover-lift-glow group"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 * index }}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {stat.icon}
        </div>
        <div className="text-2xl md:text-3xl font-bold text-glow-pink mb-2 group-hover:text-shimmer transition-all duration-300">
          {stat.value}
        </div>
        <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
          {stat.label}
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export const LogoTicker = () => {
  return (
    <div className="bg-black py-16 sm:py-24 relative overflow-hidden" id="partners">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black"></div>
      
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-lg sm:text-xl text-white/70 mb-4 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Trusted by world's most innovative teams
          </motion.h2>
          
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        {/* Stats Display */}
        <StatsDisplay />

        {/* Enhanced Logo Cards Grid */}
        <motion.div
          className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {companies.map((company, index) => (
            <LogoCard key={company.name} company={company} index={index} delay={0.8} />
          ))}
        </motion.div>

        {/* Infinite Scroll for Mobile/Tablet */}
        <div className="lg:hidden mb-16">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
            
            {/* Scrolling Container */}
            <div className="flex animate-infinite-scroll">
              <InfiniteScrollLogos />
              <InfiniteScrollLogos />
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            {
              icon: "🛡️",
              title: "Enterprise Security",
              description: "SOC 2 Type II certified with enterprise-grade security",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: "⚡",
              title: "99.9% Uptime",
              description: "Reliable infrastructure trusted by Fortune 500 companies",
              color: "from-yellow-500 to-orange-500"
            },
            {
              icon: "🌍",
              title: "Global Scale",
              description: "Multi-region deployment with edge computing capabilities",
              color: "from-blue-500 to-purple-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center card-pro p-6 hover-lift-glow group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-3 group-hover:text-glow-pink transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.button
            className="btn-outline-glow px-8 py-4 rounded-xl text-lg font-semibold relative overflow-hidden group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Join These Industry Leaders
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};