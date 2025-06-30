"use client"
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Monitor, Smartphone, Tablet, Maximize2, BarChart3, Users, Zap, Shield, Code, Database } from 'lucide-react';

const DeviceFrame = ({ children, className = "", device = "desktop" }) => {
  const deviceStyles = {
    desktop: "rounded-t-xl border-4 border-gray-800 bg-gray-900",
    tablet: "rounded-2xl border-4 border-gray-700 bg-gray-800",
    mobile: "rounded-3xl border-4 border-gray-600 bg-gray-700"
  };

  return (
    <div className={`${deviceStyles[device]} ${className} overflow-hidden shadow-2xl`}>
      {device === "desktop" && (
        <div className="h-8 bg-gray-800 flex items-center justify-center gap-2 border-b border-gray-700">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      )}
      {children}
    </div>
  );
};

const FeatureSpotlight = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    className="card-pro p-6 group hover-lift-glow relative overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <div className="relative z-10">
      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-glow-pink transition-all duration-300">
        {title}
      </h3>
      <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
        {description}
      </p>
    </div>
    
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>
  </motion.div>
);

const LiveMetric = ({ label, value, change, color = "text-green-400" }) => (
  <motion.div
    className="glass-pro p-4 rounded-lg border border-white/10"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-white/60 text-xs">{label}</span>
      <span className={`text-xs font-medium ${color}`}>{change}</span>
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
    <div className="w-full bg-white/10 rounded-full h-1 mt-2">
      <motion.div 
        className={`h-1 rounded-full bg-gradient-to-r ${
          color.includes('green') ? 'from-green-400 to-emerald-500' : 
          color.includes('blue') ? 'from-blue-400 to-cyan-500' :
          'from-pink-400 to-purple-500'
        }`}
        initial={{ width: 0 }}
        whileInView={{ width: "75%" }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
    </div>
  </motion.div>
);

export const ProductShowcase = () => {
  const [activeView, setActiveView] = useState('desktop');
  const appImageRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: appImageRef,
    offset: ["start end", "end end"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor your deployments with live metrics and performance insights."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and end-to-end encryption."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Deploy in seconds with our optimized build pipeline and global CDN."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with built-in team management and permissions."
    }
  ];

  return (
    <div className="bg-black py-16 sm:py-24 relative overflow-hidden" id="showcase">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/5 to-black"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-30"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pro border border-blue-500/20 text-blue-400 text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Monitor className="w-4 h-4" />
            Platform Demo
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Intuitive </span>
            <span className="text-shimmer">Interface</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
              Deploy with ease. Our platform offers a simple, user-friendly interface that 
              streamlines your development process, allowing you to focus on building while 
              we handle deployment and scaling.
            </p>
          </div>
        </motion.div>

        {/* Device Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex gap-2 p-2 glass-pro rounded-xl border border-white/20">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'tablet', icon: Tablet, label: 'Tablet' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' }
            ].map((device) => (
              <motion.button
                key={device.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeView === device.id 
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveView(device.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <device.icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{device.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Dashboard Preview */}
        <motion.div
          ref={appImageRef}
          className="relative max-w-7xl mx-auto mb-16"
          style={{ rotateX, opacity }}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
            
            {/* Device Frame */}
            <DeviceFrame device={activeView} className="relative">
              <div className="bg-[#0F0F23] p-6 min-h-[600px]">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <motion.svg 
                        className="w-5 h-5 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                      </motion.svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">DeployLite Dashboard</h3>
                      <p className="text-xs text-white/60">Welcome back, Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button 
                      className="btn-outline-glow px-4 py-2 rounded-lg text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Play className="w-4 h-4 mr-2 inline" />
                      Deploy
                    </motion.button>
                  </div>
                </div>

                {/* Live Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <LiveMetric 
                    label="Active Deployments" 
                    value="127" 
                    change="+12%" 
                    color="text-green-400" 
                  />
                  <LiveMetric 
                    label="Success Rate" 
                    value="98.5%" 
                    change="+2.1%" 
                    color="text-blue-400" 
                  />
                  <LiveMetric 
                    label="Build Time" 
                    value="1.2min" 
                    change="-15%" 
                    color="text-purple-400" 
                  />
                  <LiveMetric 
                    label="Team Members" 
                    value="24" 
                    change="+3" 
                    color="text-pink-400" 
                  />
                </div>

                {/* Recent Activity */}
                <div className="glass-pro p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Recent Activity
                    </h4>
                    <button className="text-white/60 hover:text-white text-sm transition-colors">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { action: "Deployed", project: "my-react-app", time: "2 minutes ago", status: "success" },
                      { action: "Building", project: "api-service", time: "5 minutes ago", status: "building" },
                      { action: "Updated", project: "landing-page", time: "10 minutes ago", status: "success" }
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-green-400' :
                            activity.status === 'building' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {activity.action} <span className="text-pink-400">{activity.project}</span>
                            </p>
                            <p className="text-white/60 text-xs">{activity.time}</p>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === 'success' ? 'bg-green-400/20 text-green-400' :
                          activity.status === 'building' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-400/20 text-red-400'
                        }`}>
                          {activity.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </DeviceFrame>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureSpotlight
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center card-pro p-8 sm:p-12 max-w-4xl mx-auto relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Code className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-glow-pink transition-all duration-300">
              Ready to experience the future?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto group-hover:text-white/90 transition-colors">
              Join thousands of developers who have already transformed their deployment workflow. 
              Start your journey with DeployLite today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "https://app.deploylite.tech/signup"}
              >
                Start Free Trial
              </motion.button>
              
              <motion.button
                className="btn-outline-glow px-8 py-4 rounded-xl text-lg font-semibold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 mr-2 inline" />
                Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};