"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Users, UserCheck, CalendarDays, Clock, Activity, Globe, TrendingUp, TrendingDown, RefreshCw, Loader2, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
}

interface ProjectData {
  _id: string
  name: string
  projectstatus: string
  techused?: string
  type?: string
  startdate?: string
  updatedAt?: string
  planid?: {
    pricepmonth: number
  }
}

interface DeploymentData {
  _id: string
  status: string
  deploymentdate: string
  projectid: string
}

interface MonthlyData {
  month: string
  projects: number
  deployments: number
}

interface AnalyticsProps {
  projectdata?: ProjectData
}

export default function Analytics({ projectdata }: AnalyticsProps) {
  const { toast } = useToast()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [deployments, setDeployments] = useState<DeploymentData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch real data from APIs
  const fetchData = async () => {
    try {
      // Fetch projects data
      const projectsResponse = await fetch('/api/project/crud')
      const projectsResult = await projectsResponse.json()
      
      if (projectsResult.success && projectsResult.projectdata) {
        setProjects(projectsResult.projectdata)
      }

      // If we have a specific project, fetch its deployment details
      if (projectdata?._id) {
        const deploymentResponse = await fetch(`/api/project/details?id=${projectdata._id}`)
        const deploymentResult = await deploymentResponse.json()
        
        if (deploymentResult.success && deploymentResult.deployment) {
          setDeployments(deploymentResult.deployment)
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchData()
      setLoading(false)
    }
    
    loadData()
  }, [projectdata?._id])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Analytics data has been updated",
    })
  }

  // Calculate real metrics from API data
  const calculateMetrics = () => {
    const totalProjects = projects.length
    const liveProjects = projects.filter(p => p.projectstatus === 'live').length
    const failedProjects = projects.filter(p => p.projectstatus === 'failed').length
    const buildingProjects = projects.filter(p => p.projectstatus === 'building' || p.projectstatus === 'creating').length
    
    const successRate = totalProjects > 0 ? Math.round((liveProjects / totalProjects) * 100) : 0
    
    return {
      totalProjects,
      liveProjects,
      failedProjects,
      buildingProjects,
      successRate
    }
  }

  // Generate deployment trends from real data
  const generateDeploymentTrends = () => {
    const last6Months: MonthlyData[] = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleString('default', { month: 'short' })
      
      const projectsInMonth = projects.filter(p => {
        const projectDate = new Date(p.startdate || p.updatedAt || 0)
        return projectDate.getMonth() === date.getMonth() && 
               projectDate.getFullYear() === date.getFullYear()
      }).length
      
      const deploymentsInMonth = deployments.filter(d => {
        const deployDate = new Date(d.deploymentdate)
        return deployDate.getMonth() === date.getMonth() && 
               deployDate.getFullYear() === date.getFullYear()
      }).length
      
      last6Months.push({
        month: monthName,
        projects: projectsInMonth,
        deployments: deploymentsInMonth || projectsInMonth
      })
    }
    
    return last6Months
  }

  // Generate tech stack distribution from real data
  const generateTechStackData = () => {
    const techCount: { [key: string]: number } = {}
    
    projects.forEach(project => {
      const tech = project.techused || 'Unknown'
      techCount[tech] = (techCount[tech] || 0) + 1
    })
    
    const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    
    return Object.entries(techCount).map(([tech, count], index) => ({
      name: tech,
      value: count,
      color: colors[index % colors.length]
    }))
  }

  // Generate project status distribution
  const generateStatusData = () => {
    const statusCount = {
      live: projects.filter(p => p.projectstatus === 'live').length,
      failed: projects.filter(p => p.projectstatus === 'failed').length,
      building: projects.filter(p => p.projectstatus === 'building').length,
      creating: projects.filter(p => p.projectstatus === 'creating').length
    }
    
    return [
      { name: 'Live', value: statusCount.live, color: '#10b981' },
      { name: 'Failed', value: statusCount.failed, color: '#ef4444' },
      { name: 'Building', value: statusCount.building, color: '#f59e0b' },
      { name: 'Creating', value: statusCount.creating, color: '#8b5cf6' }
    ].filter(item => item.value > 0)
  }

  // Generate project types data
  const generateProjectTypesData = () => {
    const typeCount: { [key: string]: number } = {}
    
    projects.forEach(project => {
      const type = project.type || 'Unknown'
      typeCount[type] = (typeCount[type] || 0) + 1
    })
    
    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / projects.length) * 100)
    }))
  }

  const metrics = calculateMetrics()
  const deploymentTrends = generateDeploymentTrends()
  const techStackData = generateTechStackData()
  const statusData = generateStatusData()
  const projectTypesData = generateProjectTypesData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-pink-500/20 rounded-lg p-3 shadow-xl">
          <p className="text-gray-200 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-400" />
            <p className="text-gray-300">Loading analytics data...</p>
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
                Analytics Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                {projectdata ? `Analytics for ${projectdata.name}` : 'Project performance insights and metrics'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">Real-time Data</span>
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
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Projects</CardTitle>
                <BarChart3 className="h-5 w-5 text-pink-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-pink-400 mb-2">{metrics.totalProjects}</div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400">Total deployments created</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Live Projects</CardTitle>
                <UserCheck className="h-5 w-5 text-emerald-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{metrics.liveProjects}</div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 font-medium">{metrics.successRate}%</span>
                  <span className="text-gray-400 ml-1">success rate</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Failed Deployments</CardTitle>
                <Globe className="h-5 w-5 text-red-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-red-400 mb-2">{metrics.failedProjects}</div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400">Requires attention</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">In Progress</CardTitle>
                <Clock className="h-5 w-5 text-blue-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.buildingProjects}</div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400">Currently deploying</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={fadeIn}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-900/50 to-black/50 border border-pink-500/20 rounded-xl p-1">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 rounded-lg"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="technology"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 rounded-lg"
              >
                Technology
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-pink-300 rounded-lg"
              >
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deployment Trends */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-pink-400" />
                      Deployment Trends (6 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    {deploymentTrends.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={deploymentTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="deployments" 
                            stroke="#ec4899" 
                            fill="url(#deploymentGradient)" 
                            strokeWidth={2}
                          />
                          <defs>
                            <linearGradient id="deploymentGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No deployment data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project Status Distribution */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <PieChartIcon className="w-5 h-5 text-purple-400" />
                      Project Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    {statusData.length > 0 ? (
                      <div className="flex items-center">
                        <ResponsiveContainer width="60%" height={250}>
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-3">
                          {statusData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm text-gray-300">{entry.name}</span>
                              <span className="text-sm font-medium text-gray-200 ml-auto">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <PieChartIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No status data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technology" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Technology Stack Distribution */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-blue-400" />
                      Technology Stack Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    {techStackData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={techStackData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" fill="#06b6d4" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No technology data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project Types */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-400" />
                      Project Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-4">
                      {projectTypesData.length > 0 ? (
                        projectTypesData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                            <div>
                              <span className="text-gray-200 font-medium capitalize">{item.type}</span>
                              <div className="text-sm text-gray-400">{item.count} projects</div>
                            </div>
                            <Badge variant="outline" className="border-green-500/30 text-green-400">
                              {item.percentage}%
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-8">
                          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No project type data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-8">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">
                      {Math.round((metrics.liveProjects / Math.max(metrics.totalProjects, 1)) * 100)}%
                    </div>
                    <p className="text-gray-400">Success Rate</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.round((metrics.liveProjects / Math.max(metrics.totalProjects, 1)) * 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {deployments.length || metrics.totalProjects}
                    </div>
                    <p className="text-gray-400">Total Deployments</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {techStackData.length}
                    </div>
                    <p className="text-gray-400">Technologies Used</p>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Status */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-pink-400" />
                    Current Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-2xl font-bold text-emerald-400">{metrics.liveProjects}</div>
                      <div className="text-sm text-emerald-300">Live</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-400">{metrics.buildingProjects}</div>
                      <div className="text-sm text-blue-300">Building</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">{metrics.failedProjects}</div>
                      <div className="text-sm text-red-300">Failed</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
                      <div className="text-2xl font-bold text-gray-400">{metrics.totalProjects}</div>
                      <div className="text-sm text-gray-300">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Summary Cards */}
        {projects.length === 0 && (
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-24 h-24 mx-auto mb-6 text-gray-400 opacity-50" />
                <h3 className="text-2xl font-bold text-gray-200 mb-4">No Analytics Data Available</h3>
                <p className="text-gray-400 mb-6">
                  Start deploying projects to see detailed analytics and insights about your deployments.
                </p>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}