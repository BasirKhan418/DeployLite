"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'

const technologies = {
  "All Technologies": {
    count: 12,
    items: [
      { name: "React", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Vue.js", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
      { name: "Angular", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
      { name: "Next.js", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Node.js", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "MongoDB", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Redis", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
      { name: "Valkey", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
      { name: "QDrant", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "WordPress", category: "Platform", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" },
    ]
  },
  "Frameworks": {
    count: 5,
    items: [
      { name: "React", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Vue.js", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
      { name: "Angular", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
      { name: "Next.js", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Node.js", category: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    ]
  },
  "Databases": {
    count: 5,
    items: [
      { name: "MongoDB", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Redis", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
      { name: "Valkey", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
      { name: "QDrant", category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    ]
  },
  "Platforms": {
    count: 1,
    items: [
      { name: "WordPress", category: "Platform", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" },
    ]
  }
}

export default function TechnologiesSection() {
  const [activeTab, setActiveTab] = useState("All Technologies")

  return (
    <div className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            We use the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              best technologies
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            to build scalable, secure, and high-performance SaaS applications.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(technologies).map(([tabName, tabData]) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === tabName
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tabName} ({tabData.count})
            </button>
          ))}
        </div>

        {/* Technology Grid */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"
        >
          {technologies[activeTab].items.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 mb-3 flex items-center justify-center bg-gray-900 rounded-2xl group-hover:bg-gray-800 transition-all duration-300 group-hover:scale-110">
                <img 
                  src={tech.icon} 
                  alt={tech.name}
                  className="w-10 h-10 object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                />
              </div>
              <h3 className="text-sm font-medium text-center group-hover:text-purple-400 transition-colors">
                {tech.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            All technologies are automatically detected and configured
          </p>
        </div>
      </div>
    </div>
  )
}