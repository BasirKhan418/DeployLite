"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Globe, Zap, CreditCard, Users, Clock, Shield, AlertTriangle, 
  ExternalLink, GitBranch, Code, Trash2, Plus, Copy, RefreshCw,
  Settings, Database, Server, Eye, EyeOff
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

interface ProjectData {
  _id: string
  name: string
  type: string
  repourl: string
  repobranch: string
  techused: string
  buildcommand: string
  startcommand: string
  rootfolder: string
  outputfolder: string
  installcommand: string
  planid: any
  projectstatus: string
  projecturl?: string
  startdate: string
  env?: string
}

interface DeploymentData {
  _id: string
  status: string
  deploymentdate: string
}

interface EnvVar {
  key: string
  value: string
  isSecret: boolean
}

export default function ProjectSettings() {
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('id')
  
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [deploymentData, setDeploymentData] = useState<DeploymentData[]>([])
  const [customDomain, setCustomDomain] = useState('')
  const [envVars, setEnvVars] = useState<EnvVar[]>([])
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})

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
        setDeploymentData(result.deployment || [])
        
        // Parse environment variables if they exist
        if (result.projectdata.env) {
          try {
            const parsedEnv = result.projectdata.env.split('\n')
              .filter((line: string) => line.trim() && line.includes('='))
              .map((line: string) => {
                const [key, ...valueParts] = line.split('=')
                const value = valueParts.join('=')
                return {
                  key: key.trim(),
                  value: value.trim(),
                  isSecret: key.toLowerCase().includes('secret') || 
                          key.toLowerCase().includes('key') || 
                          key.toLowerCase().includes('password') ||
                          key.toLowerCase().includes('token')
                }
              })
            setEnvVars(parsedEnv)
          } catch (error) {
            console.error('Error parsing environment variables:', error)
          }
        }
      } else {
        toast.error("Failed to fetch project data")
      }
    } catch (error) {
      toast.error("Error loading project settings")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomDomain = () => {
    if (!customDomain.trim()) {
      toast.error("Please enter a valid domain")
      return
    }
    toast.success(`Custom domain ${customDomain} configuration initiated`)
    setCustomDomain('')
  }

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '', isSecret: false }])
  }

  const updateEnvVar = (index: number, field: 'key' | 'value', newValue: string) => {
    const updated = [...envVars]
    updated[index][field] = newValue
    if (field === 'key') {
      updated[index].isSecret = newValue.toLowerCase().includes('secret') || 
                               newValue.toLowerCase().includes('key') || 
                               newValue.toLowerCase().includes('password') ||
                               newValue.toLowerCase().includes('token')
    }
    setEnvVars(updated)
  }

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index))
  }

  const toggleSecretVisibility = (index: number) => {
    setShowSecrets(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const getStatusBadgeClass = (status: string) => {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-800/50 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-800/50 rounded-xl"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
          <p className="text-gray-400">Unable to load project settings</p>
        </div>
      </div>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                <Settings className="w-8 h-8 text-pink-400" />
                Project Settings
              </h1>
              <p className="text-gray-400 mt-1">Manage your project configuration and deployment settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`${getStatusBadgeClass(projectData.projectstatus)} border`}>
                Status: {projectData.projectstatus}
              </Badge>
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
        
        {/* Stats Cards */}
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Deployments</CardTitle>
                <Globe className="h-4 w-4 text-pink-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-400">{deploymentData.length}</div>
                <p className="text-xs text-gray-400">
                  {deploymentData.filter(d => d.status === 'live' || d.status === 'success').length} successful
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Project Type</CardTitle>
                <Code className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400 capitalize">{projectData.type}</div>
                <p className="text-xs text-gray-400">{projectData.techused}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Environment Variables</CardTitle>
                <Database className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{envVars.length}</div>
                <p className="text-xs text-gray-400">
                  {envVars.filter(env => env.isSecret).length} secrets
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Current Plan</CardTitle>
                <CreditCard className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400 capitalize">
                  {projectData.planid?.name || 'Basic'}
                </div>
                <p className="text-xs text-gray-400">
                  ₹{projectData.planid?.pricepmonth || projectData.planid?.price || 0}/month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Settings Tabs */}
        <motion.div variants={fadeIn}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-1">
              <TabsTrigger 
                value="general"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                General
              </TabsTrigger>
              <TabsTrigger 
                value="domains"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Domains
              </TabsTrigger>
              <TabsTrigger 
                value="env"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Environment
              </TabsTrigger>
              <TabsTrigger 
                value="deployments"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Deployments
              </TabsTrigger>
              <TabsTrigger 
                value="build"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Build & Deploy
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-500/30 rounded-lg transition-all duration-300"
              >
                Security
              </TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Project Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Basic information about your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-name" className="text-gray-300">Project Name</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="project-name" 
                          value={projectData.name}
                          readOnly
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(projectData.name, 'Project name')}
                          className="bg-black/50 border-gray-700 hover:bg-pink-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project-type" className="text-gray-300">Project Type</Label>
                      <Input 
                        id="project-type" 
                        value={projectData.type}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white capitalize"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tech-stack" className="text-gray-300">Technology Stack</Label>
                      <Input 
                        id="tech-stack" 
                        value={projectData.techused}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="created-date" className="text-gray-300">Created Date</Label>
                      <Input 
                        id="created-date" 
                        value={formatDate(projectData.startdate)}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Repository Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="repo-url" className="text-gray-300">Repository URL</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="repo-url" 
                            value={projectData.repourl}
                            readOnly
                            className="bg-gray-800/50 border-gray-700 text-white"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(projectData.repourl, '_blank')}
                            className="bg-black/50 border-gray-700 hover:bg-pink-500/10"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="repo-branch" className="text-gray-300">Branch</Label>
                        <div className="flex gap-2 items-center">
                          <GitBranch className="w-4 h-4 text-gray-400" />
                          <Input 
                            id="repo-branch" 
                            value={projectData.repobranch}
                            readOnly
                            className="bg-gray-800/50 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Domains Tab */}
            <TabsContent value="domains" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Domain Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your project's domain names
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="assigned-domain" className="text-gray-300">Assigned Domain</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="assigned-domain" 
                        value={projectData.projecturl || `${projectData.name}.cloud.deploylite.tech`}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.cloud.deploylite.tech`}`, '_blank')}
                        className="bg-black/50 border-gray-700 hover:bg-pink-500/10"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custom-domain" className="text-gray-300">Add Custom Domain</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="custom-domain" 
                        value={customDomain} 
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="example.com"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                      />
                      <Button 
                        onClick={handleAddCustomDomain}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold mb-3 text-white">Active Domains</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className="text-gray-300">{projectData.projecturl || `${projectData.name}.cloud.deploylite.tech`}</span>
                        <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Primary</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Environment Variables Tab */}
            <TabsContent value="env" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Environment Variables</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your project's environment variables and secrets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {envVars.map((env, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex space-x-2 items-center p-3 bg-gray-800/30 rounded-lg"
                      >
                        <Input 
                          value={env.key} 
                          onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                          placeholder="VARIABLE_NAME"
                          className="bg-gray-900/50 border-gray-700 text-white"
                        />
                        <div className="relative flex-1">
                          <Input 
                            value={env.value} 
                            onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                            placeholder="value"
                            type={env.isSecret && !showSecrets[index] ? "password" : "text"}
                            className="bg-gray-900/50 border-gray-700 text-white pr-10"
                          />
                          {env.isSecret && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSecretVisibility(index)}
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            >
                              {showSecrets[index] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          )}
                        </div>
                        {env.isSecret && (
                          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
                            Secret
                          </Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeEnvVar(index)}
                          className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    onClick={addEnvVar}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variable
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-black/50 border-gray-700 hover:bg-pink-500/10"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Deployments Tab */}
            <TabsContent value="deployments" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Deployment History</CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage your project deployments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deploymentData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Deployment ID</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deploymentData.slice(0, 10).map((deployment, index) => (
                          <TableRow key={deployment._id} className="border-gray-700">
                            <TableCell>
                              <Badge className={`${getStatusBadgeClass(deployment.status)} border`}>
                                {deployment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-300">
                              {deployment._id.slice(-8)}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {formatDate(deployment.deploymentdate)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <Server className="w-16 h-16 mx-auto mb-4 opacity-20 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-300 mb-2">No deployments yet</h3>
                      <p className="text-gray-500">Deploy your project to see deployment history</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    Deploy New Version
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Build & Deploy Tab */}
            <TabsContent value="build" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Build & Deploy Configuration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your build and deployment settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="install-command" className="text-gray-300">Install Command</Label>
                      <Input 
                        id="install-command" 
                        value={projectData.installcommand}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="build-command" className="text-gray-300">Build Command</Label>
                      <Input 
                        id="build-command" 
                        value={projectData.buildcommand}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="start-command" className="text-gray-300">Start Command</Label>
                      <Input 
                        id="start-command" 
                        value={projectData.startcommand}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="output-folder" className="text-gray-300">Output Directory</Label>
                      <Input 
                        id="output-folder" 
                        value={projectData.outputfolder}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="root-folder" className="text-gray-300">Root Directory</Label>
                      <Input 
                        id="root-folder" 
                        value={projectData.rootfolder}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white font-mono"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="node-version" className="text-gray-300">Runtime Version</Label>
                      <Input 
                        id="node-version" 
                        value="Node.js 18.x"
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-400 mb-1">Build Configuration</h4>
                        <p className="text-sm text-amber-300/80">
                          These settings are configured during project creation. Contact support to modify build configurations.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your project's security settings and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">SSL Certificate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-emerald-400">Valid</div>
                            <p className="text-xs text-gray-400">Auto-renewed</p>
                          </div>
                          <Shield className="h-8 w-8 text-emerald-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">HTTPS Enforcement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-emerald-400">Enabled</div>
                            <p className="text-xs text-gray-400">Force HTTPS redirects</p>
                          </div>
                          <Switch checked disabled />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">Access Control</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-blue-400">Public</div>
                            <p className="text-xs text-gray-400">Accessible to everyone</p>
                          </div>
                          <Globe className="h-8 w-8 text-blue-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">Security Headers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-emerald-400">Enabled</div>
                            <p className="text-xs text-gray-400">HSTS, CSP, X-Frame-Options</p>
                          </div>
                          <Shield className="h-8 w-8 text-emerald-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Security Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <Label className="text-gray-300">DDoS Protection</Label>
                          <p className="text-sm text-gray-500">Automatic protection against DDoS attacks</p>
                        </div>
                        <Switch checked disabled />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <Label className="text-gray-300">Bot Protection</Label>
                          <p className="text-sm text-gray-500">Block malicious bots and scrapers</p>
                        </div>
                        <Switch checked disabled />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <Label className="text-gray-300">Rate Limiting</Label>
                          <p className="text-sm text-gray-500">Limit requests per IP address</p>
                        </div>
                        <Switch checked disabled />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-400 mb-1">Security Notice</h4>
                        <p className="text-sm text-blue-300/80">
                          All security features are automatically configured and managed by DeployLite. 
                          Your application benefits from enterprise-grade security out of the box.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    className="w-full bg-black/50 border-gray-700 hover:bg-pink-500/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Run Security Audit
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}