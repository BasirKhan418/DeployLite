"use client"
import { motion } from 'framer-motion'
import { 
  Globe, 
  Database, 
  BarChart3,
  Clock
} from 'lucide-react'
import { HoverEffect } from "./ui/card-hover-effect";

export const Features = () => {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Infrastructure",
      description: "Deploy to multiple regions worldwide for optimal performance and user experience. Our global CDN ensures your applications load fast everywhere, with edge locations strategically placed for minimal latency.",
      link: "#"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Database Integration",
      description: "Seamlessly connect to PostgreSQL, MongoDB, Redis, and other popular databases. Built-in connection pooling, automated backups, and real-time monitoring keep your data secure and accessible.",
      link: "#"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Monitor performance, track usage, and gain insights with comprehensive analytics. Get detailed metrics on response times, error rates, user behavior, and resource utilization in beautiful dashboards.",
      link: "#"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Auto-scaling",
      description: "Automatically scale your applications based on traffic and resource demands. Smart algorithms predict usage patterns and scale resources up or down to maintain performance while optimizing costs.",
      link: "#"
    },
  ]

  return (
    <div className="bg-gray-950 py-20" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Everything You Need to Deploy
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Powerful features designed to streamline your deployment workflow and scale your applications effortlessly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-all duration-300 hover:bg-gray-900/70 group overflow-hidden min-h-[320px] flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-px">
                <div className="w-full h-full bg-gray-900/80 rounded-xl"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Enhanced icon with glow effect */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-pink-500/25">
                  {feature.icon}
                </div>
                
                {/* Title with better spacing */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-pink-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Enhanced description */}
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300 flex-grow">
                  {feature.description}
                </p>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-all duration-1000"></div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}