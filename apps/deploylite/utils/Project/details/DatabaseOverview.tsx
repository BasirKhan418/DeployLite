import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, Settings, MoreVertical, CheckCircle, XCircle, Zap, Cloud, Server, 
  Clock, DollarSign, Bell, Rocket, Database as DatabaseIcon, Terminal, Shield, 
  Loader2, ExternalLink, Activity as ActivityIcon, TrendingUp, Eye, Copy, 
  RefreshCw, AlertCircle, ChevronRight, Calendar, Users, Key, User, Lock,
  Monitor, MousePointer, HardDrive, Cpu, Link, Edit, Download, Play, Pause
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import DatabaseAnalytics from './DatabaseAnalytics'
import DatabaseActivity from './DatabaseActivity'
import DatabaseSettings from './DatabaseSettings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
}

interface DatabaseOverviewProps {
  projectdata: any
}

export default function DatabaseOverview({ projectdata }: DatabaseOverviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshData, setRefreshData] = useState(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [showConnectionString, setShowConnectionString] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)

  const databaseName = projectdata?.dbname?.toUpperCase() || 'DATABASE'
  const databaseType = projectdata?.dbtype?.toUpperCase() || 'UNKNOWN'
  const connectionUrl = projectdata?.projecturl || projectdata?.url || ''
  const uiUrl = projectdata?.uiurl || ''
  
  const isHealthy = projectdata?.projectstatus === 'live'
  const defaultTab = projectdata?.projectstatus === "creating" ? "activity" : "overview"
  const estimatedCost = projectdata?.planid?.pricepmonth || projectdata?.planid?.price || 0

  // Check if this is first time access
  useEffect(() => {
    const hasAccessed = localStorage.getItem(`database_${projectdata?._id}_accessed`)
    if (!hasAccessed && projectdata?.projectstatus === 'live') {
      setIsFirstTime(true)
      localStorage.setItem(`database_${projectdata?._id}_accessed`, 'true')
    }
  }, [projectdata?._id])

  const handleRefresh = async () => {
    if (!projectdata?._id) return
    
    setIsRefreshing(true)
    try {
      // Fetch fresh database data
      const response = await fetch(`/api/project/database`)
      const result = await response.json()
      
      if (result.success && result.projectdata) {
        const updatedProject = result.projectdata.find((p: any) => p._id === projectdata._id)
        if (updatedProject) {
          setRefreshData(updatedProject)
          toast.success("Database data refreshed successfully")
        } else {
          toast.error("Database not found")
        }
      } else {
        toast.error("Failed to refresh database data")
      }
    } catch (error) {
      toast.error("Error refreshing database data")
    } finally {
      setIsRefreshing(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'building':
        return <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
      case 'creating':
        return <Clock className="w-5 h-5 text-purple-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400'
      case 'failed':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400'
      case 'building':
        return 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
      case 'creating':
        return 'from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-400'
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDatabaseIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mysql':
        return '🐬'
      case 'postgresql':
        return '🐘'
      case 'mongodb':
        return '🍃'
      case 'redis':
        return '⚡'
      case 'qdrant':
        return '🧠'
      default:
        return '🗄️'
    }
  }

  const getDatabasePort = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mysql':
        return '3306'
      case 'postgresql':
        return '5432'
      case 'mongodb':
        return '27017'
      case 'redis':
        return '6379'
      case 'qdrant':
        return '6333'
      default:
        return projectdata?.dbport || 'Unknown'
    }
  }

  const currentData = refreshData || projectdata

  // First-time access modal content
  const FirstTimeModal = () => (
    <Dialog open={isFirstTime} onOpenChange={setIsFirstTime}>
      <DialogContent className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="text-4xl">{getDatabaseIcon(databaseType)}</div>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your {databaseType} Database is Ready!
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-lg">
            Your {databaseType} database is now live and ready for connections.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <h4 className="font-medium text-emerald-400">Database Online!</h4>
              <p className="text-emerald-300/80 text-sm">Your {databaseType} instance is running and accepting connections.</p>
            </div>
          </div>

          {/* Quick Connection Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-purple-400">Connection Details:</h4>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <span className="text-gray-300">Database:</span>
                <code className="text-purple-400 font-mono">{currentData?.dbname}</code>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <span className="text-gray-300">Port:</span>
                <code className="text-purple-400 font-mono">{getDatabasePort(databaseType)}</code>
              </div>
              {connectionUrl && (
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <span className="text-gray-300">Connection URL:</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(connectionUrl, 'Connection URL')}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => setShowCredentials(true)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Key className="w-4 h-4 mr-2" />
              View Credentials
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsFirstTime(false)}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <FirstTimeModal />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-7xl mx-auto"
      >
        {/* Enhanced Header */}
        <motion.div variants={fadeIn}>
          <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 rounded-2xl m-6 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
            <div className="relative p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl text-4xl">
                    {getDatabaseIcon(databaseType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {databaseName}
                      </h1>
                      <div className={`px-3 py-1 rounded-full border bg-gradient-to-r ${getStatusColor(currentData?.projectstatus)}`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(currentData?.projectstatus)}
                          <span className="text-sm font-medium capitalize">
                            {currentData?.projectstatus || 'unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      {connectionUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(connectionUrl, 'Connection URL')}
                          className="p-0 h-auto hover:text-purple-400 transition-colors"
                        >
                          <DatabaseIcon className="w-4 h-4 mr-2" />
                          <span className="underline underline-offset-2 font-mono text-sm truncate max-w-md">{connectionUrl}</span>
                          <Copy className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <span className="text-gray-400">Connection URL not available</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
                        {databaseType}
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                        Port {getDatabasePort(databaseType)}
                      </Badge>
                      {currentData?.planid?.name && (
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                          {currentData.planid.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 text-gray-200 hover:text-purple-300"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    onClick={() => setShowCredentials(true)}
                    variant="outline"
                    className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 text-gray-200 hover:text-purple-300"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Credentials
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 text-gray-200 hover:text-purple-300"
                      >
                        <MoreVertical className="w-4 h-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/95 backdrop-blur-xl border-purple-500/20">
                      <DropdownMenuLabel>Database Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      {uiUrl && (
                        <DropdownMenuItem 
                          onClick={() => window.open(uiUrl, '_blank')}
                          className="hover:bg-purple-500/10 hover:text-purple-300"
                        >
                          <Monitor className="mr-2 h-4 w-4" />
                          Admin UI
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Download className="mr-2 h-4 w-4" />
                        Backup
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Terminal className="mr-2 h-4 w-4" />
                        Query Console
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Pause className="mr-2 h-4 w-4" />
                        Stop
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Restart
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Scan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Database Credentials Modal */}
        <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
          <DialogContent className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <DatabaseIcon className="w-6 h-6 text-purple-400" />
                Database Credentials
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Use these credentials to connect to your {databaseType} database.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Name</p>
                    <p className="font-mono text-purple-300">{currentData?.dbname || 'Not set'}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(currentData?.dbname || '', 'Database name')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database User</p>
                    <p className="font-mono text-purple-300">{currentData?.dbuser || 'Not set'}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(currentData?.dbuser || '', 'Database user')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Password</p>
                    <p className="font-mono text-purple-300">••••••••••••</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(currentData?.dbpass || '', 'Database password')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Host</p>
                    <p className="font-mono text-purple-300">{currentData?.url || 'localhost'}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(currentData?.url || 'localhost', 'Database host')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Port</p>
                    <p className="font-mono text-purple-300">{getDatabasePort(databaseType)}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(getDatabasePort(databaseType), 'Database port')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {connectionUrl && (
                  <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400">Connection URL</p>
                      <p className="font-mono text-purple-300 text-xs truncate max-w-64">{connectionUrl}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(connectionUrl, 'Connection URL')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-amber-400 font-medium">Important</h4>
                    <p className="text-amber-300/80 text-sm mt-1">
                      Keep these credentials secure. Use SSL/TLS encryption for production connections to your {databaseType} database.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Tabs */}
        <motion.div variants={fadeIn} className="px-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-4 mb-8 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              {/* Database Status Cards */}
              <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Database Status */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Database Status</CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(currentData?.projectstatus)}
                        {isHealthy && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-2xl font-bold text-emerald-400 mb-1 capitalize">
                        {currentData?.projectstatus || 'Unknown'}
                      </div>
                      <p className="text-xs text-gray-400">
                        {isHealthy ? `${databaseType} is accessible` : 'Check deployment status'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Database Type */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Database Type</CardTitle>
                      <div className="text-2xl">{getDatabaseIcon(databaseType)}</div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {databaseType}
                      </div>
                      <p className="text-xs text-gray-400">
                        Port {getDatabasePort(databaseType)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Connections */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Connections</CardTitle>
                      <Users className="h-5 w-5 text-blue-400" />
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-lg font-bold text-blue-400 mb-1">
                        {currentData?.connections || '0'}
                      </div>
                      <p className="text-xs text-gray-400">
                        Active connections
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Created Date */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Created</CardTitle>
                      <Calendar className="h-5 w-5 text-yellow-400" />
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-lg font-bold text-yellow-400 mb-1">
                        {formatDate(currentData?.startdate)}
                      </div>
                      <p className="text-xs text-gray-400">
                        Database creation date
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Database Quick Actions */}
              <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group cursor-pointer"
                        onClick={() => copyToClipboard(connectionUrl, 'Connection URL')}>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="relative p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl">
                          <Copy className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-400">Copy Connection</h3>
                          <p className="text-sm text-gray-400">Get connection string</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group cursor-pointer"
                        onClick={() => setShowCredentials(true)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="relative p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                          <Key className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-purple-400">Credentials</h3>
                          <p className="text-sm text-gray-400">View database access details</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {uiUrl && (
                  <motion.div variants={scaleIn}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group cursor-pointer"
                          onClick={() => window.open(uiUrl, '_blank')}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="relative p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
                            <Monitor className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-400">Admin UI</h3>
                            <p className="text-sm text-gray-400">Open database interface</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>

              {/* Project Info Grid */}
              <motion.div variants={stagger} className="grid gap-8 md:grid-cols-2">
                {/* Connection Information */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-3">
                        <DatabaseIcon className="w-5 h-5 text-blue-400" />
                        Connection Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-3 rounded-lg bg-blue-500/10">
                            <p className="text-xs text-gray-400 mb-1">Database Name</p>
                            <p className="font-mono text-blue-400 text-sm">
                              {currentData?.dbname || 'Not configured'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-500/10">
                            <p className="text-xs text-gray-400 mb-1">Database User</p>
                            <p className="font-mono text-blue-400 text-sm">
                              {currentData?.dbuser || 'Not configured'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                            <span className="text-sm text-gray-300">Database Host</span>
                            <span className="font-mono text-blue-400 text-sm">{currentData?.url || 'localhost'}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                            <span className="text-sm text-gray-300">Database Port</span>
                            <span className="font-mono text-blue-400 text-sm">{getDatabasePort(databaseType)}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                            <span className="text-sm text-gray-300">Database Type</span>
                            <span className="font-mono text-blue-400 text-sm">{databaseType}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => setShowCredentials(true)}
                          className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-300"
                          variant="outline"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          View All Credentials
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* Database Details */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-3 text-purple-400">
                        <Server className="w-5 h-5" />
                        Database Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-purple-500/10">
                            <p className="text-xs text-gray-400 mb-1">Plan</p>
                            <p className="font-medium text-purple-400">
                              {currentData?.planid?.name || 'Basic'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-500/10">
                            <p className="text-xs text-gray-400 mb-1">Monthly Cost</p>
                            <p className="font-medium text-purple-400">
                              ₹{estimatedCost || 0}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
                            <span className="text-sm text-gray-300">Database</span>
                            <span className="font-medium text-purple-400">
                              {databaseType}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
                            <span className="text-sm text-gray-300">Storage</span>
                            <span className="font-medium text-purple-400">
                              {currentData?.planid?.storage || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
                            <span className="text-sm text-gray-300">SSL Certificate</span>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="font-medium text-emerald-400 text-sm">Active</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => copyToClipboard(connectionUrl, 'Connection URL')}
                            className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300"
                            variant="outline"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy URL
                          </Button>
                          {uiUrl && (
                            <Button 
                              onClick={() => window.open(uiUrl, '_blank')}
                              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300"
                              variant="outline"
                              size="sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Resource Usage */}
              <motion.div variants={scaleIn}>
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3 text-green-400">
                      <ActivityIcon className="w-5 h-5" />
                      Resource Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">CPU Usage</span>
                          <span className="text-sm font-medium text-purple-400">{currentData?.cpuusage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${currentData?.cpuusage || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Memory Usage</span>
                          <span className="text-sm font-medium text-blue-400">{currentData?.memoryusage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${currentData?.memoryusage || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Storage Usage</span>
                          <span className="text-sm font-medium text-green-400">{currentData?.storageusage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${currentData?.storageusage || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <DatabaseAnalytics projectdata={currentData} /> 
            </TabsContent>
            
            <TabsContent value="activity">
              <DatabaseActivity /> 
            </TabsContent>

            <TabsContent value="settings">
              <DatabaseSettings/>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}