"use client";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Zap, 
  DollarSign, 
  Cloud, 
  GitBranch, 
  Headphones,
  Settings,
  Heart,
  Rocket,
  Shield,
  Users,
  BarChart3,
  Database,
  Lock,
  Globe,
  Code
} from "lucide-react";

const FeatureIcon = ({ icon: Icon, gradient, delay = 0 }) => (
  <motion.div
    className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center relative overflow-hidden group`}
    initial={{ opacity: 0, scale: 0, rotate: -90 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.6, 
      delay,
      type: "spring",
      stiffness: 200
    }}
    whileHover={{ scale: 1.1, rotate: 5 }}
  >
    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
    <motion.div
      className="absolute inset-0 bg-white/20"
      initial={{ scale: 0 }}
      whileHover={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    />
    <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors"></div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description, gradient, stats, delay = 0 }) => (
  <motion.div
    className="card-pro p-6 sm:p-8 group hover-lift-glow h-full relative overflow-hidden"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
  >
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <div className="relative z-10 h-full flex flex-col">
      {/* Icon */}
      <div className="mb-6">
        <FeatureIcon icon={icon} gradient={gradient} delay={delay + 0.2} />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-glow-pink transition-all duration-300">
          {title}
        </h3>
        <p className="text-white/70 leading-relaxed mb-6 group-hover:text-white/90 transition-colors">
          {description}
        </p>
        
        {/* Stats */}
        {stats && (
          <div className="space-y-3 pt-4 border-t border-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  {stat.label}
                </span>
                <span className="text-sm font-semibold text-glow-cyan group-hover:text-white transition-all duration-300">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-500 group-hover:w-full rounded-full"></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
    </div>
  </motion.div>
);

const AnimatedCounter = ({ value, suffix = "", duration = 2, delay = 0 }) => {
  return (
    <motion.span
      className="text-3xl sm:text-4xl font-bold text-glow-pink"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration }}
        onUpdate={(latest) => {
          if (typeof latest.opacity === 'number' && latest.opacity > 0) {
            const current = Math.floor(latest.opacity * parseInt(value));
            const element = document.getElementById(`counter-${value}-${delay}`);
            if (element) {
              element.textContent = current + suffix;
            }
          }
        }}
      >
        <span id={`counter-${value}-${delay}`}>0{suffix}</span>
      </motion.span>
    </motion.span>
  );
};

const StatsGrid = () => (
  <motion.div
    className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    {[
      { label: "Active Developers", value: "10000", suffix: "+", icon: Users, color: "from-blue-500 to-purple-500" },
      { label: "Deployments Daily", value: "50000", suffix: "+", icon: Rocket, color: "from-purple-500 to-pink-500" },
      { label: "Uptime SLA", value: "99", suffix: ".9%", icon: Shield, color: "from-green-500 to-teal-500" },
      { label: "Countries Served", value: "150", suffix: "+", icon: Globe, color: "from-orange-500 to-red-500" }
    ].map((stat, index) => (
      <motion.div
        key={stat.label}
        className="text-center card-pro p-6 group hover-lift-glow relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        <div className="relative z-10">
          <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <AnimatedCounter 
            value={stat.value} 
            suffix={stat.suffix} 
            delay={0.6 + index * 0.2} 
          />
          <p className="text-sm text-white/60 mt-2 group-hover:text-white/80 transition-colors">
            {stat.label}
          </p>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default function FeaturesSection() {
  const features = [
    {
      title: "Built for developers",
      description: "Built for engineers, developers, dreamers, thinkers and doers. Our platform provides everything you need to turn your ideas into reality.",
      icon: Terminal,
      gradient: "from-blue-500 to-purple-600",
      stats: [
        { label: "API Endpoints", value: "500+" },
        { label: "SDK Languages", value: "12" },
        { label: "Documentation Pages", value: "200+" }
      ]
    },
    {
      title: "Ease of use",
      description: "It's as intuitive as using your favorite app, yet powerful enough to handle enterprise workloads. Simple deployment, complex capabilities.",
      icon: Zap,
      gradient: "from-purple-500 to-pink-600",
      stats: [
        { label: "Setup Time", value: "< 5min" },
        { label: "Learning Curve", value: "Minimal" },
        { label: "User Rating", value: "4.9/5" }
      ]
    },
    {
      title: "Pricing like no other",
      description: "Our prices are best in the market. No cap, no lock, no credit card required to get started. Pay only for what you use.",
      icon: DollarSign,
      gradient: "from-green-500 to-teal-600",
      stats: [
        { label: "Free Tier", value: "Always" },
        { label: "Hidden Fees", value: "None" },
        { label: "Cost Savings", value: "60%" }
      ]
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone. Enterprise-grade infrastructure with global redundancy and automatic failover.",
      icon: Cloud,
      gradient: "from-teal-500 to-blue-600",
      stats: [
        { label: "Uptime SLA", value: "99.99%" },
        { label: "Global Regions", value: "15+" },
        { label: "Load Balancers", value: "Auto" }
      ]
    },
    {
      title: "Multi-tenant Architecture",
      description: "Secure tenant isolation with shared infrastructure efficiency. Scale your SaaS application without complexity.",
      icon: GitBranch,
      gradient: "from-cyan-500 to-purple-600",
      stats: [
        { label: "Tenant Isolation", value: "100%" },
        { label: "Data Security", value: "AES-256" },
        { label: "Compliance", value: "SOC 2" }
      ]
    },
    {
      title: "24/7 Customer Support",
      description: "We are available around the clock. Our expert support team and AI assistants are here to help you succeed.",
      icon: Headphones,
      gradient: "from-orange-500 to-red-600",
      stats: [
        { label: "Response Time", value: "< 1hr" },
        { label: "Resolution Rate", value: "99%" },
        { label: "Satisfaction", value: "4.8/5" }
      ]
    },
    {
      title: "Advanced Analytics",
      description: "Deep insights into your application performance, user behavior, and business metrics with real-time dashboards.",
      icon: BarChart3,
      gradient: "from-purple-600 to-pink-500",
      stats: [
        { label: "Metrics Tracked", value: "100+" },
        { label: "Real-time Data", value: "Yes" },
        { label: "Custom Dashboards", value: "Unlimited" }
      ]
    },
    {
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption, audit logging, and compliance certifications for peace of mind.",
      icon: Lock,
      gradient: "from-red-500 to-pink-600",
      stats: [
        { label: "Encryption", value: "256-bit" },
        { label: "Certifications", value: "5+" },
        { label: "Audit Logs", value: "Complete" }
      ]
    }
  ];

  return (
    <div className="bg-black py-16 sm:py-24 relative overflow-hidden" id="capabilities">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/5 to-black"></div>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255, 27, 107, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 27, 107, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'grid-pulse 8s ease-in-out infinite'
        }}></div>
      </div>
      
      {/* Floating Particles */}
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
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pro border border-cyan-500/20 text-cyan-400 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Code className="w-4 h-4" />
            Platform Capabilities
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Built for </span>
            <span className="text-shimmer">excellence</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
              Every feature designed with developers in mind. From deployment to monitoring, 
              we've got you covered with enterprise-grade tools and consumer-grade simplicity.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              stats={feature.stats}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center card-pro p-8 sm:p-12 relative overflow-hidden group max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <motion.div
              className="flex justify-center items-center gap-4 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-glow-pink transition-all duration-300">
              Join the Developer Revolution
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto group-hover:text-white/90 transition-colors leading-relaxed">
              Experience the future of application deployment. Join thousands of developers 
              who have already transformed their workflow with DeployLite.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-glow px-8 py-4 rounded-xl text-lg font-semibold relative overflow-hidden group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Rocket className="w-5 h-5" />
                  Start Your Journey
                </span>
              </motion.button>
              
              <motion.button
                className="btn-outline-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Features
              </motion.button>
            </div>
          </div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}