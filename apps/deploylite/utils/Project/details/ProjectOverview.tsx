import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, Settings, MoreVertical, CheckCircle, XCircle, Zap, Cloud, Server, 
  Clock, DollarSign, Bell, Rocket, GitBranch, Terminal, Shield, Database, 
  Loader2, Globe, ExternalLink, Activity as ActivityIcon, TrendingUp, Eye, Copy, 
  RefreshCw, AlertCircle, ChevronRight, Calendar
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Analytics from './Analytics'
import Activity from './Activity'
import RuntimeLogs from './RuntimeLogs'
import Console from './Console'
import ProjectSettings from './ProjectSettings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface ProjectOverviewProps {
  projectdata: any
  deploymentdata: any[]
}

export default function ProjectOverview({ projectdata, deploymentdata }: ProjectOverviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshData, setRefreshData] = useState(null)

  const projectName = projectdata?.name?.toUpperCase() || 'PROJECT'
  const projectUrl = projectdata?.projecturl 
    ? `https://${projectdata.projecturl}` 
    : projectdata?.name 
      ? `https://${projectdata.name}.cloud.deploylite.tech`
      : '#'
  
  const isHealthy = projectdata?.projectstatus === 'live'
  const cpuUtilization = projectdata?.cpuusage || 0
  const memoryUtilization = projectdata?.memoryusage || 0
  const defaultTab = projectdata?.projectstatus === "creating" ? "runtimelogs" : "overview"
  const estimatedCost = projectdata?.planid?.pricepmonth || projectdata?.planid?.price || 0

  const handleRefresh = async () => {
    if (!projectdata?._id) return
    
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/project/details?id=${projectdata._id}`)
      const result = await response.json()
      
      if (result.success) {
        setRefreshData(result.projectdata)
        toast.success("Project data refreshed successfully")
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'building':
        return <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
      case 'creating':
        return <Clock className="w-5 h-5 text-pink-400" />
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
        return 'from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-400'
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

  const currentData = refreshData || projectdata

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-7xl mx-auto"
      >
        {/* Enhanced Header */}
        <motion.div variants={fadeIn}>
          <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl m-6 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />
            <div className="relative p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl">
                    <Cloud className="w-12 h-12 text-pink-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
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
                          window.open(`https://${currentData.projecturl}`, '_blank');
                        }}
                        className="p-0 h-auto hover:text-pink-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="underline underline-offset-2">{projectUrl}</span>
                        <Copy className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {currentData?.techused && (
                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
                          {currentData.techused}
                        </Badge>
                      )}
                      {currentData?.type && (
                        <Badge variant="outline" className="border-pink-500/30 text-pink-300">
                          {currentData.type}
                        </Badge>
                      )}
                      {currentData?.repobranch && (
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                          {currentData.repobranch}
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
                    className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50 text-gray-200 hover:text-pink-300"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50 text-gray-200 hover:text-pink-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50 text-gray-200 hover:text-pink-300"
                      >
                        <MoreVertical className="w-4 h-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                      <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-pink-500/20" />
                      <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300">
                        <Rocket className="mr-2 h-4 w-4" />
                        Deploy
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300">
                        <GitBranch className="mr-2 h-4 w-4" />
                        Branch
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300">
                        <Terminal className="mr-2 h-4 w-4" />
                        Console
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-pink-500/20" />
                      <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Scan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300">
                        <Database className="mr-2 h-4 w-4" />
                        Backup
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div variants={fadeIn} className="px-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-8 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger 
                value="runtimelogs"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Runtime Logs
              </TabsTrigger>
              <TabsTrigger 
                value="console"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Console
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              {/* Project Status Cards */}
              <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* App Health */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">App Status</CardTitle>
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
                        {isHealthy ? 'Application is running' : 'Check logs for details'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Project Type */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Project Type</CardTitle>
                      <Globe className="h-5 w-5 text-blue-400" />
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-2xl font-bold text-blue-400 mb-1 capitalize">
                        {currentData?.type || 'Unknown'}
                      </div>
                      <p className="text-xs text-gray-400">
                        Tech: {currentData?.techused || 'Not specified'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Deployments Count */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Deployments</CardTitle>
                      <Rocket className="h-5 w-5 text-purple-400" />
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {deploymentdata?.length || 0}
                      </div>
                      <p className="text-xs text-gray-400">
                        Total deployments
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Created Date */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
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
                        Project creation date
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Performance Metrics for Backend/Fullstack */}
              {currentData && (currentData.type === "backend" || currentData.type === "fullstack") && (
                <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2">
                  <motion.div variants={scaleIn}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardHeader className="relative">
                        <CardTitle className="flex items-center gap-3 text-blue-400">
                          <Server className="w-5 h-5" />
                          CPU Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-4xl font-bold text-blue-400 mb-4">{cpuUtilization}%</div>
                        <div className="w-full bg-blue-900/30 rounded-full h-3 mb-3">
                          <div 
                            className="bg-blue-400 h-3 rounded-full transition-all duration-1000" 
                            style={{ width: `${cpuUtilization}%` }} 
                          />
                        </div>
                        <p className="text-sm text-gray-400">2 CPU cores allocated</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={scaleIn}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardHeader className="relative">
                        <CardTitle className="flex items-center gap-3 text-purple-400">
                          <Zap className="w-5 h-5" />
                          Memory Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-4xl font-bold text-purple-400 mb-4">{memoryUtilization}%</div>
                        <div className="w-full bg-purple-900/30 rounded-full h-3 mb-3">
                          <div 
                            className="bg-purple-400 h-3 rounded-full transition-all duration-1000" 
                            style={{ width: `${memoryUtilization}%` }} 
                          />
                        </div>
                        <p className="text-sm text-gray-400">2 GB total memory</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {/* Project Info Grid */}
              <motion.div variants={stagger} className="grid gap-8 md:grid-cols-2">
                {/* Recent Deployments */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-3">
                        <ActivityIcon className="w-5 h-5 text-pink-400" />
                        Recent Deployments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {deploymentdata && deploymentdata.length > 0 ? (
                          deploymentdata.slice(0, 5).map((deployment, index) => (
                            <div key={deployment._id || index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(deployment.status)}
                                <div>
                                  <p className="text-sm font-medium text-gray-200">
                                    Deployment #{index + 1}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {deployment.deploymentdate ? formatDate(deployment.deploymentdate) : 'Unknown date'}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-auto">
                                <Badge 
                                  variant="outline" 
                                  className={`${
                                    deployment.status === 'success' || deployment.status === 'live'
                                      ? 'border-emerald-500/30 text-emerald-300'
                                      : deployment.status === 'failed'
                                      ? 'border-red-500/30 text-red-300'
                                      : 'border-yellow-500/30 text-yellow-300'
                                  }`}
                                >
                                  {deployment.status || 'pending'}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-400 py-8">
                            <Rocket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No deployments yet</p>
                            <p className="text-xs mt-1">Deploy your project to see history</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* Project Details */}
                <motion.div variants={scaleIn}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-3 text-yellow-400">
                        <Database className="w-5 h-5" />
                        Project Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-yellow-500/10">
                            <p className="text-xs text-gray-400 mb-1">Plan</p>
                            <p className="font-medium text-yellow-400">
                              {currentData?.planid?.name || 'Basic'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-yellow-500/10">
                            <p className="text-xs text-gray-400 mb-1">Monthly Cost</p>
                            <p className="font-medium text-yellow-400">
                              ₹{estimatedCost || 0}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-500/10">
                            <span className="text-sm text-gray-300">Repository</span>
                            <span className="font-medium text-yellow-400 text-xs truncate max-w-32">
                              {currentData?.repourl ? currentData.repourl.split('/').pop() : 'Not linked'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-500/10">
                            <span className="text-sm text-gray-300">Branch</span>
                            <span className="font-medium text-yellow-400">
                              {currentData?.repobranch || 'main'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-500/10">
                            <span className="text-sm text-gray-300">Build Command</span>
                            <span className="font-medium text-yellow-400 text-xs truncate max-w-32">
                              {currentData?.buildcommand || 'npm run build'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Analytics /> 
            </TabsContent>
            
            <TabsContent value="activity">
              <Activity/> 
            </TabsContent>
            
            <TabsContent value="runtimelogs">
              <RuntimeLogs projectdata={currentData}/> 
            </TabsContent>
            
            <TabsContent value="console">
              <Console/> 
            </TabsContent>
            
            <TabsContent value="settings">
              <ProjectSettings/> 
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}