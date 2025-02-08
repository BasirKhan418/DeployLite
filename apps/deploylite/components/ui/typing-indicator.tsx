import type React from "react"
import { motion } from "framer-motion"

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <motion.div
        className="w-2 h-2 rounded-full bg-purple-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-pink-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-purple-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
      />
    </div>
  )
}

