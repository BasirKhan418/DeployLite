"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Clock, Database, Globe, User, Calendar, Info, Search, RefreshCw, Eye, Copy, ExternalLink, Edit, Download, Settings, Monitor, Key } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from 'next/navigation'

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

interface WebBuilderActivity {
  _id: string
  name: string
  webbuilder: string
  projectstatus: 'live' | 'failed' | 'creating' | 'building'
  startdate: string
  updatedAt: string
  dbname?: string
  dbuser?: string
  projecturl?: string
  planid?: {
    name: string
  }
}

interface WebBuilderData {
  _id: string
  name: string
  webbuilder: string
  projectstatus: string
  startdate: string
  dbname?: string
  dbuser?: string
  projecturl?: string
  planid?: {
    name: string
  }
}

export default function WebBuilderActivity() {
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('id')
  const isWebBuilder = searchParams?.get('type') === 'webbuilder'
  
  const [selectedActivity, setSelectedActivity] = useState<WebBuilderActivity | null>(null)
  const [activities, setActivities] = useState<WebBuilderActivity[]>([])
  const [projectData, setProjectData] = useState<WebBuilderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (projectId) {
      fetchWebBuilderData()
    } else {
      fetchAllWebBuilderActivities()
    }
  }, [projectId])

  const fetchWebBuilderData = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      // Use webbuilder-specific API endpoint
      const response = await fetch(`/api/project/wdetails?id=${projectId}`)
      const result = await response.json()
      
      if (result.success) {
        setProjectData(result.projectdata)
        // For single project, create activity entries based on project status changes
        const activityEntries = [{
          _id: result.projectdata._id,
          name: result.projectdata.name,
          webbuilder: result.projectdata.webbuilder || 'WordPress',
          projectstatus: result.projectdata.projectstatus,
          startdate: result.projectdata.startdate,
          updatedAt: result.projectdata.updatedAt || result.projectdata.startdate,
          dbname: result.projectdata.dbname,
          dbuser: result.projectdata.dbuser,
          projecturl: result.projectdata.projecturl,
          planid: result.projectdata.planid
        }]
        setActivities(activityEntries)
      } else {
        toast.error(result.message || "Failed to fetch webbuilder project data")
      }
    } catch (error) {
      console.error('Error fetching webbuilder project data:', error)
      toast.error("Failed to fetch webbuilder project data")
    } finally {
      setLoading(false)
    }
  }

  const fetchAllWebBuilderActivities = async () => {
    setLoading(true)
    try {
      // Fetch all webbuilder projects for general activity view
      const response = await fetch('/api/project/wordpress')
      const result = await response.json()
      
      if (result.success && result.projectdata) {
        const activityEntries = result.projectdata.map((project: any) => ({
          _id: project._id,
          name: project.name,
          webbuilder: project.webbuilder || 'WordPress',
          projectstatus: project.projectstatus,
          startdate: project.startdate,
          updatedAt: project.updatedAt || project.startdate,
          dbname: project.dbname,
          dbuser: project.dbuser,
          projecturl: project.projecturl,
          planid: project.planid
        }))
        
        // Sort by most recent activity
        activityEntries.sort((a: any, b: any) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        
        setActivities(activityEntries)
      } else {
        toast.error("Failed to fetch webbuilder activities")
      }
    } catch (error) {
      console.error('Error fetching webbuilder activities:', error)
      toast.error("Failed to fetch webbuilder activities")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: WebBuilderActivity['projectstatus']) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="text-emerald-400" size={20} />
      case 'failed':
        return <XCircle className="text-red-400" size={20} />
      case 'building':
      case 'creating':
        return (
          <div className="animate-spin">
            <Clock className="text-amber-400" size={20} />
          </div>
        )
      default:
        return <Clock className="text-gray-400" size={20} />
    }
  }

  const getStatusBadgeClass = (status: WebBuilderActivity['projectstatus']) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      case 'failed':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'building':
      case 'creating':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
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

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.webbuilder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.projectstatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formatDate(activity.startdate).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyActivityInfo = (activity: WebBuilderActivity) => {
    const info = `Website: ${activity.name}\nWebBuilder: ${activity.webbuilder}\nStatus: ${activity.projectstatus}\nDatabase: ${activity.dbname || 'Not configured'}\nCreated: ${formatDate(activity.startdate)}`
    navigator.clipboard.writeText(info)
    toast.success("Website info copied to clipboard")
  }

  const getActivityType = (activity: WebBuilderActivity) => {
    if (activity.projectstatus === 'live' && activity.dbname) {
      return 'Website Live with Database'
    } else if (activity.projectstatus === 'live') {
      return 'Website Live'
    } else if (activity.projectstatus === 'creating') {
      return 'Setting up Website'
    } else if (activity.projectstatus === 'building') {
      return 'Building Website'
    } else {
      return 'Website Failed'
    }
  }

  const handleRefresh = () => {
    if (projectId) {
      fetchWebBuilderData()
    } else {
      fetchAllWebBuilderActivities()
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-6"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-800/50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                WebBuilder Activity
              </h1>
              <p className="text-gray-400 mt-1">
                {projectData 
                  ? `Activity timeline for ${projectData.name} (${projectData.webbuilder || 'WordPress'})`
                  : 'Track webbuilder website creation and management activities'
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500/50"
                />
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 text-gray-200 hover:text-purple-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Project Info Bar (for single project) */}
        {projectData && (
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{getWebBuilderIcon(projectData.webbuilder || 'WordPress')}</div>
                    <span className="text-gray-300">WebBuilder:</span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {projectData.webbuilder || 'WordPress'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Database:</span>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                      {projectData.dbname ? 'MySQL Configured' : 'Not Configured'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">URL:</span>
                    <span className="text-green-300 font-mono text-xs">
                      {projectData.projecturl || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Created:</span>
                    <span className="text-yellow-300 text-xs">
                      {formatDate(projectData.startdate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activities List */}
          <motion.div variants={fadeIn} className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Recent Activities</span>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {filteredActivities.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {filteredActivities.length > 0 ? (
                    <ul className="space-y-4 p-6">
                      <AnimatePresence>
                        {filteredActivities.map((activity, index) => (
                          <motion.li
                            key={activity._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                          >
                            <div className="flex items-center mb-3">
                              <div className="absolute left-0 mt-1">
                                {getStatusIcon(activity.projectstatus)}
                              </div>
                              <div className="ml-8 flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                      <span className="text-xl">{getWebBuilderIcon(activity.webbuilder)}</span>
                                      {activity.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-400 space-x-4 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{formatDate(activity.startdate)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{activity.webbuilder || 'WordPress'}</span>
                                      </div>
                                      {activity.dbname && (
                                        <div className="flex items-center gap-1">
                                          <Database size={14} />
                                          <span>MySQL</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`${getStatusBadgeClass(activity.projectstatus)} border`}>
                                      {activity.projectstatus}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyActivityInfo(activity)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Card
                              className="ml-8 cursor-pointer hover:shadow-lg transition-all duration-300 bg-gray-800/30 border-gray-700/50 hover:border-purple-500/30 hover:bg-gray-800/50"
                              onClick={() => setSelectedActivity(activity)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm">
                                      <Globe size={14} className="text-gray-400" />
                                      <span className="text-gray-300">{getActivityType(activity)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                      <Database size={14} className="text-gray-400" />
                                      <span className="text-gray-300">
                                        {activity.dbname ? `Database: ${activity.dbname}` : 'No database configured'}
                                      </span>
                                    </div>
                                    {activity.projecturl && (
                                      <div className="flex items-center space-x-2 text-sm">
                                        <ExternalLink size={14} className="text-gray-400" />
                                        <span className="text-gray-300 font-mono text-xs">
                                          {activity.projecturl}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center text-gray-400 py-20"
                    >
                      <Globe className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <div className="space-y-2">
                        <p className="text-xl font-medium">No webbuilder activities found</p>
                        <p className="text-sm text-gray-500">
                          {searchQuery ? 'No activities match your search' : 'Create your first website to see activity'}
                        </p>
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            onClick={() => setSearchQuery("")}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 mt-4"
                          >
                            Clear Search
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Details */}
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Website Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedActivity ? (
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                      <TabsTrigger 
                        value="info" 
                        className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Info
                      </TabsTrigger>
                      <TabsTrigger 
                        value="database"
                        className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Database
                      </TabsTrigger>
                      <TabsTrigger 
                        value="actions"
                        className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Actions
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="mt-6">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">Website Name</h3>
                          <p className="text-gray-300 font-medium">{selectedActivity.name}</p>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">WebBuilder Type</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getWebBuilderIcon(selectedActivity.webbuilder)}</span>
                            <span className="text-gray-300">{selectedActivity.webbuilder || 'WordPress'}</span>
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">Current Status</h3>
                          <Badge className={`${getStatusBadgeClass(selectedActivity.projectstatus)} border`}>
                            {selectedActivity.projectstatus}
                          </Badge>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">Creation Date</h3>
                          <p className="text-gray-300">{formatDate(selectedActivity.startdate)}</p>
                        </div>
                        
                        {selectedActivity.projecturl && (
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <h3 className="font-semibold text-white mb-2">Website URL</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-300 font-mono text-sm break-all">{selectedActivity.projecturl}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`https://${selectedActivity.projecturl}`, '_blank')}
                                className="text-purple-400 hover:text-purple-300"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedActivity.planid && (
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <h3 className="font-semibold text-white mb-2">Hosting Plan</h3>
                            <p className="text-gray-300">{selectedActivity.planid.name || 'Basic Plan'}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="database" className="mt-6">
                      <div className="space-y-4">
                        {selectedActivity.dbname ? (
                          <>
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <h3 className="font-semibold text-emerald-400">MySQL Database Configured</h3>
                              </div>
                              <p className="text-emerald-300/80 text-sm">
                                Database is ready for {selectedActivity.webbuilder || 'WordPress'} installation
                              </p>
                            </div>

                            <div className="p-3 rounded-lg bg-gray-800/30">
                              <h3 className="font-semibold text-white mb-2">Database Name</h3>
                              <div className="flex items-center justify-between">
                                <code className="text-blue-400 font-mono text-sm">{selectedActivity.dbname}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedActivity.dbname || '')
                                    toast.success('Database name copied')
                                  }}
                                  className="text-gray-400 hover:text-blue-300"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-gray-800/30">
                              <h3 className="font-semibold text-white mb-2">Database User</h3>
                              <div className="flex items-center justify-between">
                                <code className="text-blue-400 font-mono text-sm">{selectedActivity.dbuser}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedActivity.dbuser || '')
                                    toast.success('Database user copied')
                                  }}
                                  className="text-gray-400 hover:text-blue-300"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-gray-800/30">
                              <h3 className="font-semibold text-white mb-2">Connection Details</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Host:</span>
                                  <span className="text-gray-300 font-mono">localhost</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Port:</span>
                                  <span className="text-gray-300 font-mono">3306</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Type:</span>
                                  <span className="text-gray-300">MySQL</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <div className="flex items-start gap-2">
                                <Key className="w-4 h-4 text-amber-400 mt-0.5" />
                                <div>
                                  <h4 className="text-amber-400 font-medium text-sm">Database Password</h4>
                                  <p className="text-amber-300/80 text-xs mt-1">
                                    Password is securely stored. Use the credentials modal to view it.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="p-4 rounded-lg bg-gray-500/10 border border-gray-500/20 text-center">
                            <Database className="w-12 h-12 mx-auto mb-3 text-gray-400 opacity-50" />
                            <h3 className="text-gray-300 font-medium mb-2">No Database Configured</h3>
                            <p className="text-gray-400 text-sm">
                              This website doesn't have a database configured yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="actions" className="mt-6">
                      <div className="space-y-3">
                        {selectedActivity.projectstatus === 'live' && (
                          <>
                            <Button
                              onClick={() => window.open(`https://${selectedActivity.projecturl}`, '_blank')}
                              className="w-full justify-start bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300"
                              variant="outline"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit Website
                            </Button>

                            <Button
                              onClick={() => window.open(`https://${selectedActivity.projecturl}/wp-admin`, '_blank')}
                              className="w-full justify-start bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-300"
                              variant="outline"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Admin Dashboard
                            </Button>

                            <Button
                              onClick={() => window.open(`https://${selectedActivity.projecturl}/wp-admin/themes.php`, '_blank')}
                              className="w-full justify-start bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-300"
                              variant="outline"
                            >
                              <Monitor className="w-4 h-4 mr-2" />
                              Manage Themes
                            </Button>

                            <Button
                              onClick={() => window.open(`https://${selectedActivity.projecturl}/wp-admin/plugins.php`, '_blank')}
                              className="w-full justify-start bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-300"
                              variant="outline"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Manage Plugins
                            </Button>

                            <Button
                              onClick={() => window.open(`https://${selectedActivity.projecturl}/wp-admin/edit.php`, '_blank')}
                              className="w-full justify-start bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-300"
                              variant="outline"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Posts
                            </Button>
                          </>
                        )}

                        {selectedActivity.projectstatus === 'creating' && (
                          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-amber-400 animate-spin" />
                            <h3 className="text-amber-400 font-medium">Website is being created</h3>
                            <p className="text-amber-300/80 text-sm mt-1">
                              Please wait while we set up your {selectedActivity.webbuilder || 'WordPress'} website
                            </p>
                          </div>
                        )}

                        {selectedActivity.projectstatus === 'failed' && (
                          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                            <XCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                            <h3 className="text-red-400 font-medium">Website creation failed</h3>
                            <p className="text-red-300/80 text-sm mt-1">
                              There was an issue creating your website. Please try again or contact support.
                            </p>
                            <Button
                              className="mt-3 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300"
                              variant="outline"
                              size="sm"
                            >
                              Retry Deployment
                            </Button>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-700">
                          <Button
                            onClick={() => copyActivityInfo(selectedActivity)}
                            className="w-full justify-start bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20 text-gray-300"
                            variant="outline"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Website Info
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No website selected</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Select a website from the activity list to view details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats */}
        {!projectData && activities.length > 0 && (
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  WebBuilder Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-2xl font-bold text-emerald-400">
                      {activities.filter(a => a.projectstatus === 'live').length}
                    </div>
                    <div className="text-sm text-emerald-300">Live Websites</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">
                      {activities.filter(a => a.dbname).length}
                    </div>
                    <div className="text-sm text-blue-300">With Database</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="text-2xl font-bold text-amber-400">
                      {activities.filter(a => a.projectstatus === 'creating' || a.projectstatus === 'building').length}
                    </div>
                    <div className="text-sm text-amber-300">In Progress</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
                    <div className="text-2xl font-bold text-gray-400">{activities.length}</div>
                    <div className="text-sm text-gray-300">Total Websites</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}