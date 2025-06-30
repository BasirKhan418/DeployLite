"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown, Rocket, Shield, Users, ArrowRight, Sparkles } from 'lucide-react';

const PricingCard = ({ 
  plan, 
  price, 
  yearlyPrice, 
  description, 
  features, 
  isPopular = false, 
  isPro = false,
  isEnterprise = false,
  delay = 0,
  isYearly,
  buttonText = "Get Started",
  onButtonClick
}) => (
  <motion.div
    className={`relative card-pro p-8 h-full group hover-lift-glow ${
      isPopular ? 'border-pink-500/40 scale-105' : ''
    } ${isEnterprise ? 'border-purple-500/40' : ''}`}
    initial={{ opacity: 0, y: 30, scale: isPopular ? 0.95 : 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: isPopular ? 1.05 : 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ y: -8, scale: isPopular ? 1.07 : 1.02 }}
  >
    {/* Popular Badge */}
    {isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div 
          className="bg-gradient-to-r from-pink-500 to-cyan-500 px-6 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Star className="w-4 h-4" />
          Most Popular
        </motion.div>
      </div>
    )}

    {/* Enterprise Badge */}
    {isEnterprise && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Crown className="w-4 h-4" />
          Enterprise
        </motion.div>
      </div>
    )}

    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>

    {/* Plan Header */}
    <div className="text-center mb-8 relative z-10">
      <div className="flex items-center justify-center mb-4">
        {isPro ? (
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Crown className="w-6 h-6 text-white" />
          </div>
        ) : isEnterprise ? (
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-6 h-6 text-white" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-white/90 mb-4 group-hover:text-glow-pink transition-all duration-300">
        {plan}
      </h3>
      
      <div className="mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-white/70 text-2xl">₹</span>
          <motion.span 
            className="text-white/70 text-5xl font-bold"
            key={isYearly ? 'yearly' : 'monthly'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isYearly ? yearlyPrice : price}
          </motion.span>
          <span className="text-white/70 text-lg">/mo</span>
        </div>
        {isYearly && price > 0 && (
          <motion.p 
            className="text-sm text-green-400 mt-2 flex items-center justify-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Sparkles className="w-3 h-3" />
            Save ₹{(price - yearlyPrice) * 12} yearly
          </motion.p>
        )}
      </div>
      
      <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
        {description}
      </p>
    </div>

    {/* CTA Button */}
    <motion.button
      className={`w-full py-4 px-6 rounded-xl font-semibold mb-8 transition-all duration-300 relative overflow-hidden group/btn ${
        isPopular || isEnterprise
          ? 'btn-glow' 
          : 'btn-outline-glow'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onButtonClick}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {buttonText}
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </span>
    </motion.button>

    {/* Features List */}
    <div className="relative z-10">
      <div className="text-white font-medium mb-4 flex items-center gap-2">
        <Check className="w-4 h-4 text-green-400" />
        Everything included:
      </div>
      <ul className="text-white/70 text-sm space-y-3">
        {features.map((feature, index) => (
          <motion.li 
            key={index} 
            className="flex items-start gap-3 group-hover:text-white/90 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.1 + index * 0.05 }}
          >
            <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="leading-relaxed">{feature}</span>
          </motion.li>
        ))}
      </ul>
    </div>

    {/* Performance Indicator */}
    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-500 group-hover:w-full rounded-b-2xl"></div>
    
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000 rounded-2xl"></div>
  </motion.div>
);

const PlanToggle = ({ isYearly, onToggle }) => (
  <motion.div 
    className="flex justify-center mb-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <div className="relative flex w-full max-w-sm p-1 bg-black/40 rounded-full border border-white/20 backdrop-blur-lg">
      <motion.span 
        className="absolute inset-y-1 w-1/2 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full shadow-lg"
        animate={{ x: isYearly ? '100%' : '0%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      
      <motion.button
        className={`relative flex-1 text-sm font-medium h-10 rounded-full transition-colors duration-200 z-10 ${
          !isYearly ? 'text-white' : 'text-white/60'
        }`}
        onClick={() => onToggle(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Monthly
      </motion.button>
      
      <motion.button
        className={`relative flex-1 text-sm font-medium h-10 rounded-full transition-colors duration-200 z-10 flex items-center justify-center gap-1 ${
          isYearly ? 'text-white' : 'text-white/60'
        }`}
        onClick={() => onToggle(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Yearly
        <span className="text-xs bg-green-400 text-black px-2 py-0.5 rounded-full font-bold">
          -33%
        </span>
      </motion.button>
    </div>
  </motion.div>
);

const StatsSection = () => (
  <motion.div
    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    {[
      { label: "Happy Customers", value: "10K+", icon: Users },
      { label: "Deployments", value: "2M+", icon: Rocket },
      { label: "Uptime", value: "99.9%", icon: Shield },
      { label: "Countries", value: "50+", icon: Star }
    ].map((stat, index) => (
      <motion.div
        key={stat.label}
        className="text-center card-pro p-6 group hover-lift-glow"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          <stat.icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-glow-pink mb-2 group-hover:text-shimmer transition-all duration-300">
          {stat.value}
        </div>
        <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
          {stat.label}
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      plan: "Free",
      price: 0,
      yearlyPrice: 0,
      description: "Start building and deploying for free, ideal for personal projects and learning.",
      features: [
        "1 Project included",
        "100GB bandwidth per month",
        "Community support access",
        "Basic deployment features",
        "GitHub integration",
        "SSL certificates included"
      ],
      buttonText: "Start Free",
      onButtonClick: () => window.location.href = "https://app.deploylite.tech/signup"
    },
    {
      plan: "Pro",
      price: 25,
      yearlyPrice: 20,
      description: "For professional developers and small teams. Get more power and advanced features.",
      features: [
        "5 Projects included",
        "1TB bandwidth per month",
        "Custom domains support",
        "Team collaboration tools",
        "Priority email support",
        "Advanced analytics dashboard",
        "Environment variables",
        "Build logs retention (30 days)"
      ],
      isPopular: true,
      isPro: true,
      buttonText: "Upgrade to Pro",
      onButtonClick: () => window.location.href = "https://app.deploylite.tech/signup?plan=pro"
    },
    {
      plan: "Enterprise",
      price: 60,
      yearlyPrice: 50,
      description: "For larger teams with high performance needs. Secure, scalable, and compliant.",
      features: [
        "Unlimited Projects",
        "5TB bandwidth per month",
        "Dedicated infrastructure",
        "Custom SLAs available",
        "24/7 phone & chat support",
        "Enterprise integrations",
        "Advanced security features",
        "Custom deployment regions",
        "Audit logs & compliance",
        "Dedicated success manager"
      ],
      isEnterprise: true,
      buttonText: "Contact Sales",
      onButtonClick: () => window.location.href = "mailto:sales@deploylite.tech"
    }
  ];

  return (
    <div className="bg-black py-16 sm:py-24 relative overflow-hidden" id="pricing">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/5 to-black"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
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
        {/* Header Section */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pro border border-green-500/20 text-green-400 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4" />
            Transparent Pricing
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Choose Your </span>
            <span className="text-shimmer">Plan</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
              Choose the plan that best fits your needs. Whether you're just starting out or 
              running a large-scale project, we have options tailored to your requirements.
            </p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <StatsSection />

        {/* Plan Toggle */}
        <PlanToggle isYearly={isYearly} onToggle={setIsYearly} />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.plan}
              {...plan}
              isYearly={isYearly}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Enterprise Section */}
        <motion.div
          className="text-center card-pro p-8 sm:p-12 max-w-4xl mx-auto relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-glow-pink transition-all duration-300">
              Need a custom solution?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto group-hover:text-white/90 transition-colors">
              Enterprise plans with custom pricing, dedicated support, on-premise deployment, 
              and tailored SLAs for your specific requirements.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                "Custom Infrastructure",
                "Dedicated Support Team", 
                "SLA Guarantees",
                "Enterprise Security"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-white/80">{feature}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "mailto:enterprise@deploylite.tech"}
              >
                Contact Enterprise Sales
              </motion.button>
              
              <motion.button
                className="btn-outline-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-white/60 mb-6">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Microsoft", "Google", "Amazon", "Netflix", "Spotify", "Uber"].map((company, index) => (
              <motion.div
                key={company}
                className="text-white/40 font-semibold text-lg hover:text-white/60 transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};