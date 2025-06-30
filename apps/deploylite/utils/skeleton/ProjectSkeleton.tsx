import React from 'react'
import { motion } from 'framer-motion'

// Modern Project Skeleton
export const ProjectSkeleton = () => {
  const shimmer = {
    hidden: { opacity: 0.3 },
    visible: { 
      opacity: [0.3, 0.8, 0.3],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-6">
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl"
            />
            <div className="space-y-3">
              <motion.div 
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-8 w-48 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-lg"
              />
              <motion.div 
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-4 w-64 bg-gray-700/50 rounded"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-10 w-24 bg-gray-700/50 rounded-lg"
            />
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-10 w-32 bg-pink-500/20 rounded-lg"
            />
          </div>
        </motion.div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className="w-5 h-5 bg-pink-400/30 rounded"
                />
                <motion.div 
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  className="w-8 h-4 bg-gray-700/50 rounded"
                />
              </div>
              <motion.div 
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-8 w-16 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded mb-2"
              />
              <motion.div 
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-3 w-24 bg-gray-600/50 rounded"
              />
            </motion.div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div 
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className="w-5 h-5 bg-pink-400/30 rounded"
                  />
                  <motion.div 
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className="h-6 w-32 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded"
                  />
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                      <motion.div 
                        variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        className="w-10 h-10 bg-gray-700/50 rounded-full"
                      />
                      <div className="flex-1 space-y-2">
                        <motion.div 
                          variants={shimmer}
                          initial="hidden"
                          animate="visible"
                          className="h-4 w-3/4 bg-gray-700/50 rounded"
                        />
                        <motion.div 
                          variants={shimmer}
                          initial="hidden"
                          animate="visible"
                          className="h-3 w-1/2 bg-gray-600/50 rounded"
                        />
                      </div>
                      <motion.div 
                        variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        className="w-16 h-6 bg-gray-700/50 rounded-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading indicator */}
        <motion.div 
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-3 text-gray-400">
            <motion.div
              className="w-2 h-2 bg-pink-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-pink-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
            <span className="ml-3 text-sm font-medium">Loading your projects...</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Modern Repo Skeleton
export const RepoSkeleton = () => {
  const shimmer = {
    hidden: { opacity: 0.3 },
    visible: { 
      opacity: [0.3, 0.8, 0.3],
      transition: { 
        duration: 1.2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  }

  return (
    <motion.div 
      className="space-y-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Repository Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl">
        <div className="flex items-center space-x-3">
          <motion.div 
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="w-8 h-8 bg-pink-500/30 rounded-lg"
          />
          <div className="space-y-2">
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-5 w-48 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded"
            />
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-3 w-32 bg-gray-600/50 rounded"
            />
          </div>
        </div>
        <motion.div 
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="w-20 h-8 bg-gray-700/50 rounded-lg"
        />
      </div>

      {/* Repository Files/Folders */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex items-center space-x-4 p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 transition-all duration-300"
          >
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="w-5 h-5 bg-blue-400/30 rounded"
            />
            <div className="flex-1 space-y-2">
              <motion.div 
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className={`h-4 bg-gray-700/50 rounded ${
                  i % 3 === 0 ? 'w-32' : i % 3 === 1 ? 'w-24' : 'w-40'
                }`}
              />
              <motion.div 
                variants={shimmer}
                initial="hidden"
                animate="visible"
                className="h-3 w-16 bg-gray-600/50 rounded"
              />
            </div>
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="w-20 h-3 bg-gray-600/50 rounded"
            />
          </motion.div>
        ))}
      </div>

      {/* Repository Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {['Commits', 'Branches', 'Contributors'].map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
            className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
          >
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-6 w-12 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded mx-auto mb-2"
            />
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-3 w-16 bg-gray-600/50 rounded mx-auto"
            />
          </motion.div>
        ))}
      </div>

      {/* Loading indicator */}
      <motion.div 
        className="flex items-center justify-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center space-x-2 text-gray-400">
          <motion.div
            className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-sm font-medium">Loading repository data...</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', color = 'pink' }: { 
  size?: 'sm' | 'md' | 'lg'
  color?: 'pink' | 'purple' | 'blue' | 'green'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }
  
  const colorClasses = {
    pink: 'border-pink-500',
    purple: 'border-purple-500', 
    blue: 'border-blue-500',
    green: 'border-green-500'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

export default ProjectSkeleton