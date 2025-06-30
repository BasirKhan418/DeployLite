'use client'

import { motion } from 'framer-motion'
import { Plus, Rocket, Code, Globe, Server, Cloud, Database } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {useTheme} from 'next-themes'

export default function NoProject({name}:{name:string}) {
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme=="dark"? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        

        <main>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Welcome to DeployLite
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8">
              Your journey to seamless web deployment starts here
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              className={`rounded-lg shadow-lg p-6 ${theme=="dark" ? 'bg-gray-800' : 'bg-white'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">No {name.slice(0,1).toUpperCase()+name.slice(1)} Projects Yet</h2>
              <p className={`mb-6 ${theme=="dark" ? 'text-gray-400' : 'text-gray-600'}`}>
                You haven&apos;t created any projects. Let&apos;s get started on your first deployment!
              </p>
              <motion.div
                className="relative h-40 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div
                  className="absolute top-0 left-1/4 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Code className="text-blue-500 dark:text-blue-300" size={24} />
                </motion.div>
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Rocket className="text-green-500 dark:text-green-300" size={32} />
                </motion.div>
                <motion.div
                  className="absolute bottom-0 right-1/4 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Globe className="text-purple-500 dark:text-purple-300" size={24} />
                </motion.div>
              </motion.div>
              <Link
                href={`/project/createproject/${name}`}
                className={`inline-flex items-center px-6 py-3 ${theme=="dark" ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Plus className={`mr-2 transition-transform duration-300 ${isHovered ? 'rotate-90' : ''}`} size={20} />
                Create Your First {name.slice(0,1).toUpperCase()+name.slice(1)} Project
              </Link>
            </motion.div>

            <motion.div
              className={`rounded-lg shadow-lg p-6 ${theme=="dark" ? 'bg-gray-800' : 'bg-white'}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Why Choose DeployPro?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Server className="mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold">Scalable Infrastructure</h3>
                    <p className={`${theme=="dark" ? 'text-gray-400' : 'text-gray-600'}`}>Deploy and scale your applications with ease</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Cloud className="mr-3 text-green-500 dark:text-green-400 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold">Multi-Cloud Support</h3>
                    <p className={`${theme=="dark" ? 'text-gray-400' : 'text-gray-600'}`}>Deploy to your preferred cloud provider</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Database className="mr-3 text-purple-500 dark:text-purple-400 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold">Integrated Databases</h3>
                    <p className={`${theme=="dark" ? 'text-gray-400' : 'text-gray-600'}`}>Easily manage and connect to your databases</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            className={`rounded-lg shadow-lg p-6 ${theme=="dark" ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${theme=="dark" ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <Plus className={`${theme=="dark" ? 'text-blue-300' : 'text-blue-500'}`} size={32} />
                </div>
                <h3 className="font-semibold mb-2">Create a Project</h3>
                <p className={`${theme=="dark" ? 'text-gray-400' : 'text-gray-600'}`}>Set up your first project with our intuitive wizard</p>
              </div>
              <div className="text-center">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${theme=="dark" ? 'bg-green-900' : 'bg-green-100'}`}>
                  <Code className={`${theme=="dark" ? 'text-green-300' : 'text-green-500'}`} size={32} />
                </div>
                <h3 className="font-semibold mb-2">Connect Your Code</h3>
                <p className={`${theme=="dark" ? 'text-gray-400' : 'text-gray-600'}`}>Link your repository and set up automatic deployments</p>
              </div>
              <div className="text-center">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${theme=="dark" ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <Rocket className={`${theme=="dark" ? 'text-purple-300' : 'text-purple-500'}`} size={32} />
                </div>
                <h3 className="font-semibold mb-2">Deploy</h3>
                <p className={`${theme=="dark" ? 'text-gray-400' : 'text-gray-600'}`}>Launch your application with a single click</p>
              </div>
            </div>
          </motion.div>
        </main>

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 DeployLite. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}