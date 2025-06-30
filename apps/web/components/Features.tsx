"use client"
import { motion } from 'framer-motion';
import { 
  Server, 
  Shield, 
  Zap, 
  Code, 
  Cloud, 
  Database,
  Settings,
  BarChart3,
  Users,
  Globe,
  Lock,
  Cpu,
  GitBranch,
  Layers,
  Workflow,
  Sparkles
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay = 0, gradient = "from-pink-500 to-purple-600", stats }) => (
  <motion.div
    className="card-pro p-6 sm:p-8 group cursor-pointer h-full relative overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
  >
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <div className="relative z-10 h-full flex flex-col">
      {/* Icon Container */}
      <div className="mb-6">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative`}>
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        </div>
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
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white group-hover:text-glow-cyan transition-all duration-300">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-500 group-hover:w-full rounded-full"></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
    </div>
  </motion.div>
);

const BentoCard = ({ children, className = "", size = "default", delay = 0 }) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    default: "col-span-1 row-span-1 md:col-span-1",
    large: "col-span-1 row-span-2 md:col-span-2 lg:col-span-2",
    wide: "col-span-1 md:col-span-2"
  };

  return (
    <motion.div
      className={`card-pro p-6 sm:p-8 ${sizeClasses[size]} ${className} group hover-lift-glow relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

const TechIcon = ({ name, color, delay = 0 }) => (
  <motion.div
    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center relative overflow-hidden group hover-magnetic`}
    initial={{ opacity: 0, scale: 0, rotate: -180 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.6, 
      delay,
      type: "spring",
      stiffness: 200
    }}
    whileHover={{ scale: 1.15, rotate: 10 }}
  >
    <span className="text-white font-bold text-sm sm:text-lg relative z-10">
      {name.slice(0, 2)}
    </span>
    <motion.div
      className="absolute inset-0 bg-white/20"
      initial={{ x: '-100%' }}
      whileHover={{ x: '100%' }}
      transition={{ duration: 0.5 }}
    />
    <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors"></div>
  </motion.div>
);

const ProgressBar = ({ label, value, color = "from-pink-500 to-cyan-500", delay = 0 }) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="flex justify-between text-sm">
      <span className="text-white/80">{label}</span>
      <span className="text-white font-medium">{value}%</span>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
      <motion.div 
        className={`h-2 bg-gradient-to-r ${color} rounded-full relative`}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
      </motion.div>
    </div>
  </motion.div>
);

export const Features = () => {
  const features = [
    {
      icon: Server,
      title: "Multi-Tenant Architecture",
      description: "Build scalable SaaS applications with enterprise-grade multi-tenancy, data isolation, and customizable tenant configurations out of the box.",
      gradient: "from-pink-500 to-purple-600",
      stats: [
        { label: "Tenants", value: "10K+" },
        { label: "Isolation", value: "100%" }
      ]
    },
    {
      icon: Zap,
      title: "Enterprise SaaS Framework",
      description: "Accelerate development with pre-built SaaS components including subscription management, user authentication, billing integration, and admin dashboards.",
      gradient: "from-purple-500 to-blue-600",
      stats: [
        { label: "Components", value: "50+" },
        { label: "Setup Time", value: "5min" }
      ]
    },
    {
      icon: Cloud,
      title: "Cloud-Native Development",
      description: "Leverage containerized microservices, Kubernetes orchestration, and automated CI/CD pipelines designed specifically for SaaS deployment at scale.",
      gradient: "from-blue-500 to-cyan-600",
      stats: [
        { label: "Deploy Time", value: "30s" },
        { label: "Uptime", value: "99.9%" }
      ]
    },
    {
      icon: Database,
      title: "Managed Cloud Infrastructure",
      description: "Deploy on auto-scaling cloud infrastructure with built-in monitoring, security compliance, and global CDN — no infrastructure management required.",
      gradient: "from-cyan-500 to-teal-600",
      stats: [
        { label: "Regions", value: "15+" },
        { label: "Auto-Scale", value: "∞" }
      ]
    },
    {
      icon: BarChart3,
      title: "SaaS Performance Insights",
      description: "Monitor tenant usage patterns, application performance, subscription metrics, and user engagement with comprehensive analytics tailored for SaaS businesses.",
      gradient: "from-teal-500 to-green-600",
      stats: [
        { label: "Metrics", value: "100+" },
        { label: "Real-time", value: "Yes" }
      ]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built-in security features including SOC 2 compliance, data encryption, audit logging, and enterprise SSO integration for peace of mind.",
      gradient: "from-green-500 to-pink-500",
      stats: [
        { label: "Compliance", value: "SOC2" },
        { label: "Encryption", value: "AES256" }
      ]
    }
  ];

  const techStack = [
    { name: "React", color: "from-blue-400 to-blue-600" },
    { name: "Node.js", color: "from-green-400 to-green-600" },
    { name: "Docker", color: "from-blue-500 to-purple-600" },
    { name: "Kubernetes", color: "from-purple-500 to-pink-600" },
    { name: "AWS", color: "from-orange-400 to-orange-600" },
    { name: "MongoDB", color: "from-green-500 to-teal-600" }
  ];

  return (
    <div className="bg-black py-16 sm:py-24 relative overflow-hidden" id="features">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/10 to-black"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pro border border-pink-500/20 text-pink-400 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            Features & Capabilities
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Everything you </span>
            <span className="text-shimmer">need</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
              DeployLite empowers you to deploy, manage, and scale apps effortlessly. 
              Simplify your workflow with fast, reliable deployments — all in one intuitive platform.
            </p>
          </div>
        </motion.div>

        {/* Enhanced Bento Grid Layout */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-fr">
            {/* Large Feature Card - Growth Chart */}
            <BentoCard size="large" className="lg:col-span-2 lg:row-span-2" delay={0.2}>
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-glow-pink transition-all duration-300">
                    Incredible Growth
                  </h3>
                  <p className="text-white/70 text-lg mb-8 group-hover:text-white/90 transition-colors">
                    Fly through your tasks with rapid-fire keyboard shortcuts for everything. Literally everything.
                  </p>
                </div>
                
                {/* Performance Metrics */}
                <div className="space-y-4">
                  <ProgressBar label="Deployment Speed" value={95} delay={0.5} />
                  <ProgressBar label="Build Success Rate" value={98} color="from-green-500 to-emerald-500" delay={0.7} />
                  <ProgressBar label="Customer Satisfaction" value={97} color="from-purple-500 to-pink-500" delay={0.9} />
                </div>
              </div>
            </BentoCard>

            {/* Tech Stack Card */}
            <BentoCard size="wide" className="lg:col-span-2" delay={0.4}>
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-glow-cyan transition-all duration-300">
                  Multiple Technologies
                </h3>
                <p className="text-white/70 mb-8 group-hover:text-white/90 transition-colors">
                  Seamlessly deploy across multiple technologies with full support for modern frameworks.
                </p>
                
                {/* Tech Icons Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {techStack.map((tech, i) => (
                    <TechIcon 
                      key={tech.name} 
                      name={tech.name} 
                      color={tech.color} 
                      delay={0.6 + i * 0.1} 
                    />
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* AWS Integration Card */}
            <BentoCard size="default" delay={0.6}>
              <div className="text-center h-full flex flex-col justify-center">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Cloud className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-glow-pink transition-all duration-300">
                  AWS Integration
                </h3>
                <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                  Integrate AWS services seamlessly with our platform.
                </p>
              </div>
            </BentoCard>

            {/* Security Card */}
            <BentoCard size="default" delay={0.8}>
              <div className="text-center h-full flex flex-col justify-center">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-glow-cyan transition-all duration-300">
                  Enterprise Security
                </h3>
                <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                  SOC 2 compliant with end-to-end encryption.
                </p>
              </div>
            </BentoCard>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
              gradient={feature.gradient}
              stats={feature.stats}
            />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center card-pro p-8 sm:p-12 relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-glow-pink transition-all duration-300">
              Ready to get started?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto group-hover:text-white/90 transition-colors">
              Join thousands of developers who trust DeployLite for their deployment needs. 
              Start building your next project today with our powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-glow px-8 py-4 rounded-xl text-lg font-semibold relative overflow-hidden group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  Start Building Now
                </span>
              </motion.button>
              
              <motion.button
                className="btn-outline-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Documentation
              </motion.button>
            </div>
          </div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
        </motion.div>
      </div>
    </div>
  );
};