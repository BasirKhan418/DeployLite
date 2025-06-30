"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Terminal, GitBranch, User, Calendar, Info, RefreshCw, Activity as ActivityIcon, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
}

interface Deployment {
  _id: string
  userid: string
  projectid: string
  status: 'creating' | 'live' | 'failed' | 'building'
  deploymentdate: string
  logs?: string
  error?: string
  buildTime?: number
  commitHash?: string
  branch?: string
}

interface ProjectData {
  _id: string
  name: string
  repourl?: string
  repobranch?: string
  techused?: string
  projectstatus: string
  userid: {
    name: string
    email: string
    img?: string
  }
}

interface ActivityProps {
  projectdata?: ProjectData
}

export default function Activity({ projectdata }: ActivityProps) {
  const { toast } = useToast()
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [allProjects, setAllProjects] = useState<ProjectData[]>([])
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("project")

  // Fetch deployment data
  const fetchDeployments = async () => {
    try {
      if (projectdata?._id) {
        // Fetch deployments for specific project
        const response = await fetch(`/api/project/details?id=${projectdata._id}`)
        const result = await response.json()
        
        if (result.success && result.deployment) {
          setDeployments(result.deployment)
        }
      } else {
        // If no specific project, we would need an endpoint to get all user deployments
        // For now, we'll show a message that this view requires a project context
        setDeployments([])
      }
    } catch (error) {
      console.error('Error fetching deployments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch deployment data",
        variant: "destructive"
      })
    }
  }

  // Fetch all projects for global activity view
  const fetchAllProjects = async () => {
    try {
      const response = await fetch('/api/project/crud')
      const result = await response.json()
      
      if (result.success && result.projectdata) {
        setAllProjects(result.projectdata)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast({
        title: "Error", 
        description: "Failed to fetch projects data",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchDeployments(),
        fetchAllProjects()
      ])
      setLoading(false)
    }
    
    loadData()
  }, [projectdata?._id])

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      fetchDeployments(),
      fetchAllProjects()
    ])
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Activity data has been updated",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="text-emerald-500" size={20} />
      case 'failed':
        return <XCircle className="text-red-500" size={20} />
      case 'building':
      case 'creating':
        return <Loader2 className="text-blue-500 animate-spin" size={20} />
      default:
        return <Clock className="text-gray-500" size={20} />
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'building':
      case 'creating':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getProjectName = (projectId: string) => {
    const project = allProjects.find(p => p._id === projectId)
    return project?.name || 'Unknown Project'
  }

  const getUserName = (userId: string | any) => {
    if (typeof userId === 'object' && userId.name) {
      return userId.name
    }
    return 'System'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-400" />
            <p className="text-gray-300">Loading activity data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Activity Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                {projectdata ? `Activity for ${projectdata.name}` : 'All deployment activities'}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ActivityIcon className="w-6 h-6 text-pink-400" />
                Recent Deployments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-4 p-4">
                  <AnimatePresence>
                    {deployments.length > 0 ? (
                      deployments.map((deployment, index) => (
                        <motion.div
                          key={deployment._id}
                          variants={slideIn}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <div className="flex items-center mb-2">
                            <div className="absolute left-0 mt-1">
                              {getStatusIcon(deployment.status)}
                            </div>
                            <div className="ml-8">
                              <h3 className="text-lg font-semibold text-gray-200">
                                Deployment to {getProjectName(deployment.projectid)}
                              </h3>
                              <div className="flex items-center text-sm text-gray-400 space-x-2">
                                <Calendar size={14} />
                                <span>{formatDate(deployment.deploymentdate)}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className={`ml-auto ${getStatusBadgeClass(deployment.status)}`}>
                              {deployment.status}
                            </Badge>
                          </div>
                          <Card
                            className="ml-8 cursor-pointer hover:shadow-md transition-all duration-300 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-pink-500/30"
                            onClick={() => setSelectedDeployment(deployment)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <GitBranch size={14} className="text-pink-400" />
                                <span className="text-sm font-medium text-gray-300">
                                  {allProjects.find(p => p._id === deployment.projectid)?.repobranch || 'main'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <User size={14} className="text-purple-400" />
                                <span className="text-sm text-gray-300">
                                  {getUserName(deployment.userid)}
                                </span>
                              </div>
                              {deployment.buildTime && (
                                <div className="flex items-center space-x-2">
                                  <Clock size={14} className="text-blue-400" />
                                  <span className="text-sm text-gray-300">
                                    Build time: {deployment.buildTime}s
                                  </span>
                                </div>
                              )}
                              {deployment.error && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <AlertCircle size={14} className="text-red-400" />
                                  <span className="text-sm text-red-300 truncate">
                                    {deployment.error}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        variants={fadeIn}
                        className="text-center text-gray-400 py-12"
                      >
                        <ActivityIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium">No deployment activity found</p>
                          <p className="text-sm text-gray-500">
                            {projectdata 
                              ? 'This project has no deployment history yet' 
                              : 'Start deploying projects to see activity here'
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Deployment Details */}
        <div className="my-2">
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Info className="w-6 h-6 text-pink-400" />
                Deployment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedDeployment ? (
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800/30 m-4 mb-0">
                    <TabsTrigger value="info" className="flex items-center data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
                      <Info className="w-4 h-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="flex items-center data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
                      <Terminal className="w-4 h-4 mr-2" />
                      Logs
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="p-4">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <h3 className="font-semibold text-gray-300 mb-1">Project</h3>
                            <p className="text-gray-200">{getProjectName(selectedDeployment.projectid)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <h3 className="font-semibold text-gray-300 mb-1">Status</h3>
                            <Badge variant="outline" className={getStatusBadgeClass(selectedDeployment.status)}>
                              {selectedDeployment.status}
                            </Badge>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <h3 className="font-semibold text-gray-300 mb-1">Branch</h3>
                            <p className="text-gray-200">
                              {allProjects.find(p => p._id === selectedDeployment.projectid)?.repobranch || 'main'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <h3 className="font-semibold text-gray-300 mb-1">Deploy Time</h3>
                            <p className="text-gray-200">{formatDate(selectedDeployment.deploymentdate)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-800/30">
                            <h3 className="font-semibold text-gray-300 mb-1">Deployment ID</h3>
                            <p className="text-gray-200 font-mono text-sm">{selectedDeployment._id}</p>
                          </div>
                          {selectedDeployment.buildTime && (
                            <div className="p-3 rounded-lg bg-gray-800/30">
                              <h3 className="font-semibold text-gray-300 mb-1">Build Duration</h3>
                              <p className="text-gray-200">{selectedDeployment.buildTime} seconds</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedDeployment.error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                          <h3 className="font-semibold text-red-300 mb-2">Error Details</h3>
                          <code className="text-sm text-red-200 break-all">
                            {selectedDeployment.error}
                          </code>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="logs" className="p-4">
                    <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded border p-4 bg-gray-900/50 text-gray-100">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {selectedDeployment.logs || 'No logs available for this deployment.'}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center text-gray-400 p-8">
                  <Terminal className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select a deployment to view details</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click on any deployment above to see detailed information and logs
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary */}
        <motion.div variants={fadeIn}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {deployments.filter(d => d.status === 'live').length}
                </div>
                <p className="text-gray-400">Successful Deployments</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {deployments.filter(d => d.status === 'failed').length}
                </div>
                <p className="text-gray-400">Failed Deployments</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {deployments.filter(d => d.status === 'creating' || d.status === 'building').length}
                </div>
                <p className="text-gray-400">In Progress</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}