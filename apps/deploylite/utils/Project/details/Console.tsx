"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Send, Trash2, Download, Copy, History, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

interface CommandEntry {
  id: string
  command: string
  output: string
  timestamp: Date
  type: 'success' | 'error' | 'info'
}

export default function Console() {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isExecuting, setIsExecuting] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Simulate command execution with real-like responses
  const executeCommand = async (command: string): Promise<{ output: string; type: 'success' | 'error' | 'info' }> => {
    const cmd = command.trim().toLowerCase()
    
    // Simulate API calls or real command execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    
    if (cmd === 'help') {
      return {
        output: `Available commands:
  help          - Show this help message
  status        - Check deployment status
  logs          - Show recent logs
  env           - List environment variables
  restart       - Restart the application
  deploy        - Trigger new deployment
  clear         - Clear terminal
  whoami        - Show current user info`,
        type: 'info'
      }
    }
    
    if (cmd === 'status') {
      return {
        output: `Application Status: RUNNING
Uptime: 2d 14h 23m
Memory Usage: 45%
CPU Usage: 12%
Active Connections: 127`,
        type: 'success'
      }
    }
    
    if (cmd === 'logs') {
      return {
        output: `[2024-01-15 10:30:45] INFO: Application started successfully
[2024-01-15 10:30:46] INFO: Database connection established
[2024-01-15 10:31:12] INFO: Serving requests on port 3000
[2024-01-15 10:45:33] INFO: Health check passed
[2024-01-15 11:02:17] INFO: Background job completed`,
        type: 'info'
      }
    }
    
    if (cmd === 'env') {
      return {
        output: `NODE_ENV=production
PORT=3000
DATABASE_URL=***hidden***
API_KEY=***hidden***
REDIS_URL=***hidden***`,
        type: 'info'
      }
    }
    
    if (cmd === 'restart') {
      return {
        output: `Restarting application...
Application stopped
Starting new instance...
Application started successfully
New PID: 15847`,
        type: 'success'
      }
    }
    
    if (cmd === 'deploy') {
      return {
        output: `Triggering new deployment...
Fetching latest code from repository
Building application...
Running tests...
Deployment successful!
New version: v1.2.4`,
        type: 'success'
      }
    }
    
    if (cmd === 'whoami') {
      return {
        output: `User: deploylite-user
Role: admin
Project: ${typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'current-project'}
Permissions: read, write, deploy`,
        type: 'info'
      }
    }
    
    if (cmd === 'clear') {
      return { output: '', type: 'info' }
    }
    
    // For unknown commands
    return {
      output: `Command '${command}' not found. Type 'help' for available commands.`,
      type: 'error'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isExecuting) return

    const command = input.trim()
    setIsExecuting(true)
    
    // Handle clear command specially
    if (command.toLowerCase() === 'clear') {
      setCommandHistory([])
      setInput("")
      setIsExecuting(false)
      return
    }

    try {
      const result = await executeCommand(command)
      
      const newEntry: CommandEntry = {
        id: Date.now().toString(),
        command,
        output: result.output,
        timestamp: new Date(),
        type: result.type
      }

      setCommandHistory(prev => [...prev, newEntry])
      setInput("")
      setHistoryIndex(-1)
    } catch (error) {
      const errorEntry: CommandEntry = {
        id: Date.now().toString(),
        command,
        output: 'An error occurred while executing the command.',
        timestamp: new Date(),
        type: 'error'
      }
      setCommandHistory(prev => [...prev, errorEntry])
    } finally {
      setIsExecuting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const commands = commandHistory.map(entry => entry.command)
      if (commands.length > 0) {
        const newIndex = historyIndex === -1 ? commands.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commands[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const commands = commandHistory.map(entry => entry.command)
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= commands.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(commands[newIndex])
        }
      }
    }
  }

  const clearTerminal = () => {
    setCommandHistory([])
    toast.success("Terminal cleared")
  }

  const exportHistory = () => {
    const historyText = commandHistory
      .map(entry => `[${entry.timestamp.toLocaleString()}] $ ${entry.command}\n${entry.output}`)
      .join('\n\n')
    
    const blob = new Blob([historyText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `console-history-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Console history exported")
  }

  const copyOutput = (output: string) => {
    navigator.clipboard.writeText(output)
    toast.success("Output copied to clipboard")
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={fadeIn}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                <Terminal className="w-8 h-8 text-pink-400" />
                Web Console
              </h1>
              <p className="text-gray-400 mt-1">Execute commands and manage your deployment</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={clearTerminal}
                variant="outline"
                size="sm"
                className="bg-black/50 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={exportHistory}
                variant="outline"
                size="sm"
                disabled={commandHistory.length === 0}
                className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50 text-gray-200 hover:text-pink-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Terminal */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-green-400" />
                  <span className="text-white">Terminal</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    Connected
                  </Badge>
                  <Badge variant="outline" className="border-gray-500/30 text-gray-400">
                    {commandHistory.length} commands
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-black/90 border-t border-gray-700">
                <ScrollArea className="h-[60vh] min-h-[400px]">
                  <div
                    ref={terminalRef}
                    className="p-6 font-mono text-sm space-y-3"
                  >
                    {/* Welcome message */}
                    {commandHistory.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400 mb-6"
                      >
                        <div className="mb-2">Welcome to DeployLite Web Console</div>
                        <div className="text-gray-400 text-xs">Type 'help' for available commands</div>
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {commandHistory.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="group"
                        >
                          {/* Command input */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-green-400">$</span>
                            <span className="text-white">{entry.command}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyOutput(entry.command)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ml-auto"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          {/* Command output */}
                          {entry.output && (
                            <div className={`mb-4 pl-4 border-l-2 ${
                              entry.type === 'error' 
                                ? 'border-red-500 text-red-300' :
                              entry.type === 'success' 
                                ? 'border-green-500 text-green-300' :
                              'border-blue-500 text-blue-300'
                            }`}>
                              <pre className="whitespace-pre-wrap text-sm">
                                {entry.output}
                              </pre>
                            </div>
                          )}
                          
                          {/* Timestamp */}
                          <div className="text-xs text-gray-500 mb-4">
                            {entry.timestamp.toLocaleTimeString()}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Current input line */}
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <div className="flex-1 relative">
                        {isExecuting && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                
                {/* Input form */}
                <div className="border-t border-gray-700 p-4">
                  <form onSubmit={handleSubmit} className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isExecuting}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 font-mono transition-all duration-300"
                        placeholder={isExecuting ? "Executing..." : "Enter command..."}
                      />
                      {isExecuting && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        </div>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!input.trim() || isExecuting}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 px-6 font-medium shadow-lg shadow-pink-500/25 transition-all duration-300"
                    >
                      {isExecuting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                  
                  {/* Hints */}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>↑↓ Navigate history</span>
                      <span>Tab Complete</span>
                      <span>Ctrl+C Cancel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <History className="w-3 h-3" />
                      <span>{commandHistory.length} commands in history</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Commands */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-purple-400" />
                <span className="text-white">Quick Commands</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { cmd: 'status', desc: 'App Status', icon: '📊' },
                  { cmd: 'logs', desc: 'Recent Logs', icon: '📋' },
                  { cmd: 'restart', desc: 'Restart App', icon: '🔄' },
                  { cmd: 'deploy', desc: 'New Deploy', icon: '🚀' },
                  { cmd: 'env', desc: 'Environment', icon: '⚙️' },
                  { cmd: 'help', desc: 'Help', icon: '❓' },
                  { cmd: 'whoami', desc: 'User Info', icon: '👤' },
                  { cmd: 'clear', desc: 'Clear Terminal', icon: '🧹' }
                ].map((quickCmd) => (
                  <Button
                    key={quickCmd.cmd}
                    onClick={() => setInput(quickCmd.cmd)}
                    variant="outline"
                    className="bg-gray-800/30 border-gray-600/50 hover:border-pink-500/50 hover:bg-pink-500/10 text-gray-300 hover:text-pink-300 p-3 h-auto flex-col space-y-1 transition-all duration-300"
                  >
                    <span className="text-lg">{quickCmd.icon}</span>
                    <span className="text-xs font-medium">{quickCmd.desc}</span>
                    <code className="text-xs text-gray-500">{quickCmd.cmd}</code>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}