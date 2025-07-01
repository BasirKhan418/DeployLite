import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, Settings, MoreVertical, CheckCircle, XCircle, Zap, Cloud, Server, 
  Clock, DollarSign, Bell, Rocket, Globe, Terminal, Shield, Database, 
  Loader2, ExternalLink, Activity as ActivityIcon, TrendingUp, Eye, Copy, 
  RefreshCw, AlertCircle, ChevronRight, Calendar, Users, Key, User, Lock,
  Monitor, MousePointer, HardDrive, Cpu, Link, Edit, Download
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import WebBuilderAnalytics from './WebBuilderAnalytics'
import WebBuilderActivity from './WebBuilderActivity'
import WebBuilderProjectSettings from './WebBuilderSettings'
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

interface WebBuilderOverviewProps {
  projectdata: any
}

export default function WebBuilderOverview({ projectdata }: WebBuilderOverviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshData, setRefreshData] = useState(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)

  const projectName = projectdata?.name?.toUpperCase() || 'WEBBUILDER PROJECT'
  const projectUrl = projectdata?.projecturl 
    ? `https://${projectdata.projecturl}` 
    : projectdata?.name 
      ? `https://${projectdata.name}.host.deploylite.tech`
      : '#'
  
  const isHealthy = projectdata?.projectstatus === 'live'
  const defaultTab = projectdata?.projectstatus === "creating" ? "runtimelogs" : "overview"
  const estimatedCost = projectdata?.planid?.pricepmonth || projectdata?.planid?.price || 0
  const webBuilderType = projectdata?.webbuilder || 'WordPress'

  // Check if this is first time access (you can implement logic based on user activity)
  useEffect(() => {
    // Check if user has accessed this project before
    const hasAccessed = localStorage.getItem(`webbuilder_${projectdata?._id}_accessed`)
    if (!hasAccessed && projectdata?.projectstatus === 'live') {
      setIsFirstTime(true)
      localStorage.setItem(`webbuilder_${projectdata?._id}_accessed`, 'true')
    }
  }, [projectdata?._id])

  const handleRefresh = async () => {
    if (!projectdata?._id) return
    
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/project/wdetails?id=${projectdata._id}`)
      const result = await response.json()
      
      if (result.success) {
        setRefreshData(result.projectdata)
        toast.success("WebBuilder project data refreshed successfully")
      } else {
        toast.error("Failed to refresh project data")
      }
    } catch (error) {
      toast.error("Error refreshing project data")
    } finally {
      setIsRefreshing(false)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(projectUrl)
    toast.success("Project URL copied to clipboard")
  }

  const copyCredentials = (text: string, type: string) => {
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

  const getWebBuilderIcon = (builder: string) => {
    switch (builder?.toLowerCase()) {
      case 'wordpress':
        return '🏗️'
      case 'joomla':
        return '⚡'
      case 'drupal':
        return '🛡️'
      case 'prestashop':
        return '🛒'
      case 'opencart':
        return '🛍️'
      case 'magento':
        return '💼'
      default:
        return '🌐'
    }
  }

  const currentData = refreshData || projectdata

  // First-time access modal content
  const FirstTimeModal = () => (
    <Dialog open={isFirstTime} onOpenChange={setIsFirstTime}>
      <DialogContent className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="text-4xl">{getWebBuilderIcon(webBuilderType)}</div>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to Your {webBuilderType} Site!
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-lg">
            Your {webBuilderType} website is now live and ready for setup.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <h4 className="font-medium text-emerald-400">Deployment Successful!</h4>
              <p className="text-emerald-300/80 text-sm">Your {webBuilderType} site is running and accessible.</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-purple-400">Next Steps:</h4>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium text-gray-200">Access your website</p>
                  <p className="text-gray-400 text-sm">Click the URL below to open your {webBuilderType} site</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium text-gray-200">Complete {webBuilderType} setup</p>
                  <p className="text-gray-400 text-sm">Follow the {webBuilderType} installation wizard</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium text-gray-200">Use database credentials</p>
                  <p className="text-gray-400 text-sm">Use the credentials shown below during setup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => window.open(projectUrl, '_blank')}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open {webBuilderType} Site
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
                    {getWebBuilderIcon(webBuilderType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {projectName}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          copyUrl();
                          window.open(projectUrl, '_blank');
                        }}
                        className="p-0 h-auto hover:text-purple-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="underline underline-offset-2">{projectUrl}</span>
                        <Copy className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
                        {webBuilderType}
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                        Web Builder
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
                      <DropdownMenuLabel>WebBuilder Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Site
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Download className="mr-2 h-4 w-4" />
                        Backup
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-purple-500/10 hover:text-purple-300">
                        <Terminal className="mr-2 h-4 w-4" />
                        File Manager
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
                <Database className="w-6 h-6 text-purple-400" />
                Database Credentials
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Use these credentials to configure your {webBuilderType} database connection.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Name</p>
                    <p className="font-mono text-purple-300">{projectdata?.dbname || 'Not set'}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyCredentials(projectdata?.dbname || '', 'Database name')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database User</p>
                    <p className="font-mono text-purple-300">{projectdata?.dbuser || 'Not set'}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyCredentials(projectdata?.dbuser || '', 'Database user')}
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
                    onClick={() => copyCredentials(projectdata?.dbpass || '', 'Database password')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Host</p>
                    <p className="font-mono text-purple-300">localhost</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyCredentials('localhost', 'Database host')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-amber-400 font-medium">Important</h4>
                    <p className="text-amber-300/80 text-sm mt-1">
                      Save these credentials securely. You'll need them during your {webBuilderType} setup process.
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
              {/* WebBuilder Status Cards */}
              <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Website Status */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Website Status</CardTitle>
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
                        {isHealthy ? `${webBuilderType} is accessible` : 'Check deployment status'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* WebBuilder Type */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">WebBuilder</CardTitle>
                      <div className="text-2xl">{getWebBuilderIcon(webBuilderType)}</div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {webBuilderType}
                      </div>
                      <p className="text-xs text-gray-400">
                        Content Management System
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Database Status */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Database</CardTitle>
                      <Database className="h-5 w-5 text-blue-400" />
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-lg font-bold text-blue-400 mb-1">
                        {currentData?.dbname ? 'Connected' : 'Not Set'}
                      </div>
                      <p className="text-xs text-gray-400">
                        MySQL Database
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
                        Website creation date
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* WebBuilder Quick Actions */}
              <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group cursor-pointer"
                        onClick={() => window.open(projectUrl, '_blank')}>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="relative p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl">
                          <ExternalLink className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-400">Visit Website</h3>
                          <p className="text-sm text-gray-400">Open your {webBuilderType} site</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group cursor-pointer"
                        onClick={() => window.open(`${projectUrl}/wp-admin`, '_blank')}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="relative p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                          <Settings className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-purple-400">Admin Panel</h3>
                          <p className="text-sm text-gray-400">Access {webBuilderType} dashboard</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group cursor-pointer"
                        onClick={() => setShowCredentials(true)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="relative p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
                          <Key className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-400">Database Info</h3>
                          <p className="text-sm text-gray-400">View connection details</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Project Info Grid */}
              <motion.div variants={stagger} className="grid gap-8 md:grid-cols-2">
                {/* Database Information */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-blue-400" />
                        Database Configuration
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
                            <span className="font-mono text-blue-400 text-sm">localhost</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                            <span className="text-sm text-gray-300">Database Port</span>
                            <span className="font-mono text-blue-400 text-sm">3306</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
                            <span className="text-sm text-gray-300">Database Type</span>
                            <span className="font-mono text-blue-400 text-sm">MySQL</span>
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
                
                {/* Website Details */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-3 text-purple-400">
                        <Globe className="w-5 h-5" />
                        Website Details
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
                            <span className="text-sm text-gray-300">WebBuilder</span>
                            <span className="font-medium text-purple-400">
                              {webBuilderType}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
                            <span className="text-sm text-gray-300">Domain</span>
                            <span className="font-medium text-purple-400 text-xs truncate max-w-32">
                              {currentData?.projecturl || 'Not configured'}
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
                            onClick={() => window.open(projectUrl, '_blank')}
                            className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300"
                            variant="outline"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Site
                          </Button>
                          <Button 
                            onClick={() => copyUrl()}
                            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300"
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* WebBuilder Specific Features */}
              <motion.div variants={scaleIn}>
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3 text-green-400">
                      <ActivityIcon className="w-5 h-5" />
                      {webBuilderType} Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors cursor-pointer"
                           onClick={() => window.open(`${projectUrl}/wp-admin/themes.php`, '_blank')}>
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Monitor className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-400">Themes</p>
                          <p className="text-xs text-gray-400">Customize appearance</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors cursor-pointer"
                           onClick={() => window.open(`${projectUrl}/wp-admin/plugins.php`, '_blank')}>
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Zap className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-400">Plugins</p>
                          <p className="text-xs text-gray-400">Extend functionality</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors cursor-pointer"
                           onClick={() => window.open(`${projectUrl}/wp-admin/users.php`, '_blank')}>
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-400">Users</p>
                          <p className="text-xs text-gray-400">Manage access</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors cursor-pointer"
                           onClick={() => window.open(`${projectUrl}/wp-admin/options-general.php`, '_blank')}>
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Settings className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-400">Settings</p>
                          <p className="text-xs text-gray-400">Configure site</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Setup Guide */}
                    {currentData?.projectstatus === 'live' && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                        <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                          <Rocket className="w-4 h-4" />
                          Quick Setup Guide
                        </h4>
                        <div className="grid gap-3">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <span className="text-gray-300">Visit your website and complete the {webBuilderType} installation</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => window.open(projectUrl, '_blank')}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <span className="text-gray-300">Use the database credentials provided above</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setShowCredentials(true)}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <span className="text-gray-300">Access the admin panel to customize your site</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => window.open(`${projectUrl}/wp-admin`, '_blank')}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <WebBuilderAnalytics projectdata={currentData} /> 
            </TabsContent>
            
            <TabsContent value="activity">
              <WebBuilderActivity /> 
             </TabsContent>

            <TabsContent value="settings">
              <WebBuilderProjectSettings/>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}