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
  ExternalLink, Database, Code, Trash2, Plus, Copy, RefreshCw,
  Settings, Server, Eye, EyeOff, Key, User, Lock, Download,
  Edit, FileText, Palette, Plug, UserCheck, HardDrive
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface WebBuilderProjectData {
  _id: string
  name: string
  webbuilder: string
  projectstatus: string
  projecturl?: string
  startdate: string
  planid: any
  dbname?: string
  dbuser?: string
  dbpass?: string
  arn?: string
  url?: string
}

interface WordPressTheme {
  name: string
  version: string
  active: boolean
  description: string
}

interface WordPressPlugin {
  name: string
  version: string
  active: boolean
  description: string
}

interface WordPressUser {
  username: string
  email: string
  role: string
  registered: string
}

export default function WebBuilderProjectSettings() {
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('id')
  
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState<WebBuilderProjectData | null>(null)
  const [customDomain, setCustomDomain] = useState('')
  const [showDbPassword, setShowDbPassword] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  // Mock WordPress data - in real implementation, these would come from WordPress API
  const [themes] = useState<WordPressTheme[]>([
    { name: 'Twenty Twenty-Four', version: '1.0', active: true, description: 'Default WordPress theme' },
    { name: 'Astra', version: '4.1.0', active: false, description: 'Fast & lightweight theme' },
    { name: 'OceanWP', version: '3.4.2', active: false, description: 'Multipurpose theme' }
  ])

  const [plugins] = useState<WordPressPlugin[]>([
    { name: 'Akismet Anti-Spam', version: '5.2', active: true, description: 'Spam protection' },
    { name: 'Yoast SEO', version: '21.0', active: true, description: 'SEO optimization' },
    { name: 'WooCommerce', version: '8.0.1', active: false, description: 'E-commerce platform' },
    { name: 'Elementor', version: '3.15.0', active: false, description: 'Page builder' }
  ])

  const [users] = useState<WordPressUser[]>([
    { username: 'admin', email: 'admin@example.com', role: 'Administrator', registered: '2024-01-15' },
    { username: 'editor', email: 'editor@example.com', role: 'Editor', registered: '2024-02-20' }
  ])

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  const fetchProjectData = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/project/wdetails?id=${projectId}`)
      const result = await response.json()
      
      if (result.success) {
        setProjectData(result.projectdata)
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
          <h2 className="text-2xl font-bold text-white mb-4">WebBuilder Project Not Found</h2>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                <div className="text-4xl">{getWebBuilderIcon(projectData.webbuilder || 'WordPress')}</div>
                <span className="flex items-center gap-3">
                  <Settings className="w-8 h-8 text-purple-400" />
                  {projectData.webbuilder || 'WordPress'} Settings
                </span>
              </h1>
              <p className="text-gray-400 mt-1">Manage your {projectData.webbuilder || 'WordPress'} website configuration and settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`${getStatusBadgeClass(projectData.projectstatus)} border`}>
                Status: {projectData.projectstatus}
              </Badge>
              <Button
                onClick={fetchProjectData}
                variant="outline"
                className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 text-gray-200 hover:text-purple-300"
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
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Website Status</CardTitle>
                <Globe className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400 capitalize">{projectData.projectstatus}</div>
                <p className="text-xs text-gray-400">
                  {projectData.projectstatus === 'live' ? 'Online and accessible' : 'Deployment in progress'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">WebBuilder Type</CardTitle>
                <Code className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{projectData.webbuilder || 'WordPress'}</div>
                <p className="text-xs text-gray-400">Content Management System</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Database Status</CardTitle>
                <Database className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {projectData.dbname ? 'Connected' : 'Not Set'}
                </div>
                <p className="text-xs text-gray-400">MySQL Database</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
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

        {/* Database Credentials Modal */}
        <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
          <DialogContent className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Database className="w-6 h-6 text-purple-400" />
                Database Credentials
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Use these credentials for your {projectData.webbuilder || 'WordPress'} database configuration.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Name</p>
                    <p className="font-mono text-purple-300">{projectData.dbname || 'Not set'}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(projectData.dbname || '', 'Database name')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database User</p>
                    <p className="font-mono text-purple-300">{projectData.dbuser || 'Not set'}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(projectData.dbuser || '', 'Database user')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Password</p>
                    <p className="font-mono text-purple-300">
                      {showDbPassword ? projectData.dbpass || 'Not set' : '••••••••••••'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowDbPassword(!showDbPassword)}
                    >
                      {showDbPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(projectData.dbpass || '', 'Database password')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Database Host</p>
                    <p className="font-mono text-purple-300">localhost</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard('localhost', 'Database host')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Settings Tabs */}
        <motion.div variants={fadeIn}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-1">
              <TabsTrigger 
                value="general"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                General
              </TabsTrigger>
              <TabsTrigger 
                value="database"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Database
              </TabsTrigger>
              <TabsTrigger 
                value="domains"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Domains
              </TabsTrigger>
              <TabsTrigger 
                value="wordpress"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                {projectData.webbuilder || 'WordPress'}
              </TabsTrigger>
              <TabsTrigger 
                value="backup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Backup
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300"
              >
                Security
              </TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Project Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Basic information about your {projectData.webbuilder || 'WordPress'} website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-name" className="text-gray-300">Website Name</Label>
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
                          onClick={() => copyToClipboard(projectData.name, 'Website name')}
                          className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webbuilder-type" className="text-gray-300">WebBuilder Type</Label>
                      <Input 
                        id="webbuilder-type" 
                        value={projectData.webbuilder || 'WordPress'}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website-url" className="text-gray-300">Website URL</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="website-url" 
                          value={projectData.projecturl || `${projectData.name}.host.deploylite.tech`}
                          readOnly
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.host.deploylite.tech`}`, '_blank')}
                          className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.host.deploylite.tech`}`, '_blank')}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                    <Button 
                      onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.host.deploylite.tech`}/wp-admin`, '_blank')}
                      variant="outline"
                      className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                    <Button 
                      onClick={() => setShowCredentials(true)}
                      variant="outline"
                      className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      DB Credentials
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Tab */}
            <TabsContent value="database" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Database Configuration</CardTitle>
                  <CardDescription className="text-gray-400">
                    MySQL database settings for your {projectData.webbuilder || 'WordPress'} installation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="db-name" className="text-gray-300">Database Name</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="db-name" 
                          value={projectData.dbname || 'Not configured'}
                          readOnly
                          className="bg-gray-800/50 border-gray-700 text-white font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(projectData.dbname || '', 'Database name')}
                          className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="db-user" className="text-gray-300">Database User</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="db-user" 
                          value={projectData.dbuser || 'Not configured'}
                          readOnly
                          className="bg-gray-800/50 border-gray-700 text-white font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(projectData.dbuser || '', 'Database user')}
                          className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="db-password" className="text-gray-300">Database Password</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="db-password" 
                          value={showDbPassword ? (projectData.dbpass || 'Not configured') : '••••••••••••'}
                          readOnly
                          type={showDbPassword ? "text" : "password"}
                          className="bg-gray-800/50 border-gray-700 text-white font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowDbPassword(!showDbPassword)}
                          className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
                        >
                          {showDbPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                       <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(projectData.dbpass || '', 'Database password')}
                          className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="db-host" className="text-gray-300">Database Host</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="db-host" 
                          value="localhost"
                          readOnly
                          className="bg-gray-800/50 border-gray-700 text-white font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard('localhost', 'Database host')}
                          className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="db-port" className="text-gray-300">Database Port</Label>
                      <Input 
                        id="db-port" 
                        value="3306"
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="db-type" className="text-gray-300">Database Type</Label>
                      <Input 
                        id="db-type" 
                        value="MySQL 8.0"
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-400 mb-1">Database Connection</h4>
                        <p className="text-sm text-blue-300/80">
                          Your {projectData.webbuilder || 'WordPress'} installation is connected to a dedicated MySQL database. 
                          Use these credentials during the {projectData.webbuilder || 'WordPress'} setup process.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => setShowCredentials(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    View All Credentials
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Domains Tab */}
            <TabsContent value="domains" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Domain Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your website's domain names and SSL certificates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="assigned-domain" className="text-gray-300">Assigned Domain</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="assigned-domain" 
                        value={projectData.projecturl || `${projectData.name}.host.deploylite.tech`}
                        readOnly
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.host.deploylite.tech`}`, '_blank')}
                        className="bg-black/50 border-gray-700 hover:bg-purple-500/10"
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
                        placeholder="yourdomain.com"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                      />
                      <Button 
                        onClick={handleAddCustomDomain}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        Add Domain
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold mb-3 text-white">Active Domains</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className="text-gray-300">{projectData.projecturl || `${projectData.name}.host.deploylite.tech`}</span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Primary</Badge>
                          <Badge className="bg-blue-500/10 border-blue-500/30 text-blue-400">SSL Active</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-medium text-emerald-400">SSL Certificate</h4>
                      </div>
                      <p className="text-sm text-emerald-300/80">Auto-renewed SSL certificate active</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <h4 className="font-medium text-blue-400">CDN Enabled</h4>
                      </div>
                      <p className="text-sm text-blue-300/80">Global content delivery network active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* WordPress/WebBuilder Tab */}
            <TabsContent value="wordpress" className="mt-8">
              <div className="space-y-6">
                {/* WordPress Management */}
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <div className="text-2xl">{getWebBuilderIcon(projectData.webbuilder || 'WordPress')}</div>
                      {projectData.webbuilder || 'WordPress'} Management
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your {projectData.webbuilder || 'WordPress'} installation, themes, plugins, and users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.host.deploylite.tech`}/wp-admin`, '_blank')}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-auto p-4"
                      >
                        <div className="text-center">
                          <Settings className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Admin Dashboard</div>
                          <div className="text-xs opacity-80">Access wp-admin</div>
                        </div>
                      </Button>
                      <Button 
                        onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.host.deploylite.tech`}/wp-admin/themes.php`, '_blank')}
                        variant="outline"
                        className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 h-auto p-4"
                      >
                        <div className="text-center">
                          <Palette className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Themes</div>
                          <div className="text-xs opacity-80">Customize appearance</div>
                        </div>
                      </Button>
                      <Button 
                        onClick={() => window.open(`https://${projectData.projecturl || `${projectData.name}.host.deploylite.tech`}/wp-admin/plugins.php`, '_blank')}
                        variant="outline"
                        className="bg-black/50 border-purple-500/30 hover:bg-purple-500/10 h-auto p-4"
                      >
                        <div className="text-center">
                          <Plug className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Plugins</div>
                          <div className="text-xs opacity-80">Extend functionality</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Themes Section */}
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Palette className="w-5 h-5 text-purple-400" />
                      Installed Themes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {themes.map((theme, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-200">{theme.name}</h4>
                              {theme.active && (
                                <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Active</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{theme.description}</p>
                            <p className="text-xs text-gray-500">Version {theme.version}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!theme.active && (
                              <Button size="sm" variant="outline" className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10">
                                Activate
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-200">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Plugins Section */}
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Plug className="w-5 h-5 text-blue-400" />
                      Installed Plugins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {plugins.map((plugin, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-200">{plugin.name}</h4>
                              {plugin.active ? (
                                <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Active</Badge>
                              ) : (
                                <Badge className="bg-gray-500/10 border-gray-500/30 text-gray-400">Inactive</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{plugin.description}</p>
                            <p className="text-xs text-gray-500">Version {plugin.version}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className={plugin.active 
                                ? "text-red-400 border-red-500/30 hover:bg-red-500/10" 
                                : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                              }
                            >
                              {plugin.active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-200">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Users Section */}
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-green-400" />
                      Website Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Username</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300">Role</TableHead>
                          <TableHead className="text-gray-300">Registered</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user, index) => (
                          <TableRow key={index} className="border-gray-700">
                            <TableCell className="font-medium text-gray-200">{user.username}</TableCell>
                            <TableCell className="text-gray-300">{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                user.role === 'Administrator' 
                                  ? "border-red-500/30 text-red-400" 
                                  : "border-blue-500/30 text-blue-400"
                              }>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">{formatDate(user.registered)}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Backup Tab */}
            <TabsContent value="backup" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Backup & Restore</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your website and database backups
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Automatic Backups</h3>
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <HardDrive className="w-5 h-5 text-emerald-400" />
                          <h4 className="font-medium text-emerald-400">Daily Backups Enabled</h4>
                        </div>
                        <p className="text-sm text-emerald-300/80">
                          Automatic daily backups of your website files and database
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <Label className="text-gray-300">Database Backup</Label>
                            <p className="text-sm text-gray-500">Backup database every 24 hours</p>
                          </div>
                          <Switch checked disabled />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <Label className="text-gray-300">File Backup</Label>
                            <p className="text-sm text-gray-500">Backup website files daily</p>
                          </div>
                          <Switch checked disabled />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Manual Backup</h3>
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Create Backup Now
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full bg-black/50 border-purple-500/30 hover:bg-purple-500/10"
                        >
                          <Database className="w-4 h-4 mr-2" />
                          Download Database
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full bg-black/50 border-purple-500/30 hover:bg-purple-500/10"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Download Files
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Recent Backups</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Type</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                          <TableHead className="text-gray-300">Size</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-gray-700">
                          <TableCell className="text-gray-300">Full Backup</TableCell>
                          <TableCell className="text-gray-300">Today, 2:00 AM</TableCell>
                          <TableCell className="text-gray-300">45.2 MB</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Complete</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                Restore
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-gray-700">
                          <TableCell className="text-gray-300">Database</TableCell>
                          <TableCell className="text-gray-300">Yesterday, 2:00 AM</TableCell>
                          <TableCell className="text-gray-300">12.8 MB</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Complete</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                Restore
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="mt-8">
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your website's security settings and access controls
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
                            <div className="text-lg font-bold text-emerald-400">Active</div>
                            <p className="text-xs text-gray-400">Auto-renewed SSL</p>
                          </div>
                          <Shield className="h-8 w-8 text-emerald-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">WordPress Security</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-blue-400">Protected</div>
                            <p className="text-xs text-gray-400">Security plugins active</p>
                          </div>
                          <Lock className="h-8 w-8 text-blue-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">Firewall</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-emerald-400">Enabled</div>
                            <p className="text-xs text-gray-400">Web Application Firewall</p>
                          </div>
                          <Shield className="h-8 w-8 text-emerald-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">Malware Scanning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-emerald-400">Active</div>
                            <p className="text-xs text-gray-400">Daily malware scans</p>
                          </div>
                          <Eye className="h-8 w-8 text-emerald-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Security Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <Label className="text-gray-300">Login Protection</Label>
                          <p className="text-sm text-gray-500">Protect wp-admin from brute force attacks</p>
                        </div>
                        <Switch checked disabled />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <Label className="text-gray-300">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">2FA for WordPress admin users</p>
                        </div>
                        <Switch checked disabled />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <Label className="text-gray-300">File Monitoring</Label>
                          <p className="text-sm text-gray-500">Monitor file changes and integrity</p>
                        </div>
                        <Switch checked disabled />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <Label className="text-gray-300">DDoS Protection</Label>
                          <p className="text-sm text-gray-500">Automatic protection against DDoS attacks</p>
                        </div>
                        <Switch checked disabled />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-emerald-400 mb-1">Security Status: Excellent</h4>
                        <p className="text-sm text-emerald-300/80">
                          Your {projectData.webbuilder || 'WordPress'} website is protected with enterprise-grade security features. 
                          All security measures are automatically managed and updated.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    className="w-full bg-black/50 border-gray-700 hover:bg-purple-500/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Run Security Scan
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