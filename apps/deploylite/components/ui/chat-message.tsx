import type React from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    id: string
    text: string
    isUser: boolean
  }
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("flex items-end space-x-2 mb-4", message.isUser ? "justify-end" : "justify-start")}
    >
      {!message.isUser && (
        <Avatar>
          <AvatarImage src="/bot-avatar.png" alt="Bot" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-md p-4 rounded-2xl backdrop-blur-md",
          message.isUser
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            : "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100",
        )}
        style={{
          boxShadow: message.isUser
            ? "0 4px 6px rgba(192, 38, 211, 0.2), 0 1px 3px rgba(192, 38, 211, 0.1)"
            : "0 4px 6px rgba(255, 255, 255, 0.1), 0 1px 3px rgba(255, 255, 255, 0.05)",
        }}
      >
        {message.text}
      </div>
      {message.isUser && (
        <Avatar>
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )
}

