"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Clock, Terminal, GitBranch, User, Calendar, Info, Search, RefreshCw, Eye, Copy, ExternalLink } from "lucide-react"
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

interface Deployment {
  _id: string
  userid: string
  projectid: string
  status: 'success' | 'failed' | 'creating' | 'building' | 'live'
  deploymentdate: string
  logs?: string
}

interface ProjectData {
  _id: string
  name: string
  type: string
  repourl: string
  repobranch: string
  techused: string
  projectstatus: string
  projecturl: string
  startdate: string
}

export default function Activity() {
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('id')
  
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  const fetchProjectData = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/project/details?id=${projectId}`)
      const result = await response.json()
      
      if (result.success) {
        setProjectData(result.projectdata)
        setDeployments(result.deployment || [])
      } else {
        toast.error(result.message || "Failed to fetch project data")
      }
    } catch (error) {
      console.error('Error fetching project data:', error)
      toast.error("Failed to fetch project data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
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

  const getStatusBadgeClass = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
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

  const filteredDeployments = deployments.filter(deployment =>
    deployment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formatDate(deployment.deploymentdate).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyDeploymentInfo = (deployment: Deployment) => {
    const info = `Deployment ID: ${deployment._id}\nStatus: ${deployment.status}\nDate: ${formatDate(deployment.deploymentdate)}`
    navigator.clipboard.writeText(info)
    toast.success("Deployment info copied to clipboard")
  }

  const getRepoName = (repoUrl: string) => {
    if (!repoUrl) return 'Unknown'
    try {
      return repoUrl.split('/').pop()?.replace('.git', '') || 'Unknown'
    } catch {
      return 'Unknown'
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

  if (!projectData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-6"
      >
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-red-500/20">
            <CardContent className="p-12 text-center">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
              <p className="text-gray-400">The project you're looking for doesn't exist or you don't have access to it.</p>
            </CardContent>
          </Card>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Activity Timeline
              </h1>
              <p className="text-gray-400 mt-1">
                Track deployment history for <span className="text-pink-300 font-medium">{projectData.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-pink-500/50"
                />
              </div>
              <Button
                onClick={fetchProjectData}
                variant="outline"
                className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50 text-gray-200 hover:text-pink-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Project Info Bar */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Branch:</span>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                    {projectData.repobranch || 'main'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Tech:</span>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {projectData.techused || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Repository:</span>
                  <span className="text-green-300 font-mono text-xs">
                    {getRepoName(projectData.repourl)}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deployments List */}
          <motion.div variants={fadeIn} className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-pink-400" />
                  <span className="text-white">Recent Deployments</span>
                  <Badge variant="outline" className="border-pink-500/30 text-pink-300">
                    {filteredDeployments.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {filteredDeployments.length > 0 ? (
                    <ul className="space-y-4 p-6">
                      <AnimatePresence>
                        {filteredDeployments.map((deployment, index) => (
                          <motion.li
                            key={deployment._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                          >
                            <div className="flex items-center mb-3">
                              <div className="absolute left-0 mt-1">
                                {getStatusIcon(deployment.status)}
                              </div>
                              <div className="ml-8 flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-white">
                                      Deployment #{deployments.length - index}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-400 space-x-4 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{formatDate(deployment.deploymentdate)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>System</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`${getStatusBadgeClass(deployment.status)} border`}>
                                      {deployment.status}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyDeploymentInfo(deployment)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Card
                              className="ml-8 cursor-pointer hover:shadow-lg transition-all duration-300 bg-gray-800/30 border-gray-700/50 hover:border-pink-500/30 hover:bg-gray-800/50"
                              onClick={() => setSelectedDeployment(deployment)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm">
                                      <GitBranch size={14} className="text-gray-400" />
                                      <span className="text-gray-300">{projectData.repobranch}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-mono">
                                      {deployment._id.slice(-8)}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
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
                      <Terminal className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <div className="space-y-2">
                        <p className="text-xl font-medium">No deployments found</p>
                        <p className="text-sm text-gray-500">
                          {searchQuery ? 'No deployments match your search' : 'Deploy your project to see activity'}
                        </p>
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            onClick={() => setSearchQuery("")}
                            className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 mt-4"
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

          {/* Deployment Details */}
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Deployment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDeployment ? (
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                      <TabsTrigger 
                        value="info" 
                        className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Info
                      </TabsTrigger>
                      <TabsTrigger 
                        value="logs"
                        className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
                      >
                        <Terminal className="w-4 h-4 mr-2" />
                        Logs
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="mt-6">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">Deployment ID</h3>
                          <p className="text-gray-300 font-mono text-sm break-all">{selectedDeployment._id}</p>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">Status</h3>
                          <Badge className={`${getStatusBadgeClass(selectedDeployment.status)} border`}>
                            {selectedDeployment.status}
                          </Badge>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">Deployment Date</h3>
                          <p className="text-gray-300">{formatDate(selectedDeployment.deploymentdate)}</p>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gray-800/30">
                          <h3 className="font-semibold text-white mb-2">Project Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Name:</span>
                              <span className="text-gray-300">{projectData.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Type:</span>
                              <span className="text-gray-300">{projectData.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Branch:</span>
                              <span className="text-gray-300">{projectData.repobranch}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="logs" className="mt-6">
                      <ScrollArea className="h-[300px] w-full rounded border border-gray-700 p-4 bg-gray-900/50">
                        <pre className="font-mono text-sm whitespace-pre-wrap text-gray-300">
                          {selectedDeployment.logs || 'No logs available for this deployment.'}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No deployment selected</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Select a deployment from the list to view details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}