"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Users, UserCheck, CalendarDays, Clock, Activity, Globe, TrendingUp, TrendingDown, RefreshCw, Loader2, BarChart3, PieChart as PieChartIcon, Database, Monitor, Edit, Eye, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
}

interface WebBuilderData {
  _id: string
  name: string
  projectstatus: string
  webbuilder?: string
  startdate?: string
  updatedAt?: string
  dbname?: string
  dbuser?: string
  projecturl?: string
  planid?: {
    pricepmonth: number
    name: string
  }
}

interface WebBuilderAnalyticsProps {
  projectdata?: WebBuilderData
}

interface TrendData {
  month: string
  websites: number
  live: number
}

export default function WebBuilderAnalytics({ projectdata }: WebBuilderAnalyticsProps) {
  const [webBuilderProjects, setWebBuilderProjects] = useState<WebBuilderData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch real data from WebBuilder APIs
  const fetchData = async () => {
    try {
      // Fetch webbuilder projects data
      const webBuilderResponse = await fetch('/api/project/wordpress')
      const webBuilderResult = await webBuilderResponse.json()
      
      if (webBuilderResult.success && webBuilderResult.projectdata) {
        setWebBuilderProjects(webBuilderResult.projectdata)
      }
    } catch (error) {
      console.error('Error fetching webbuilder analytics data:', error)
      toast.error("Failed to fetch analytics data")
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
    toast.success("Analytics data has been updated")
  }

  // Calculate real metrics from API data
  const calculateMetrics = () => {
    const totalWebsites = webBuilderProjects.length
    const liveWebsites = webBuilderProjects.filter(p => p.projectstatus === 'live').length
    const failedWebsites = webBuilderProjects.filter(p => p.projectstatus === 'failed').length
    const buildingWebsites = webBuilderProjects.filter(p => p.projectstatus === 'building' || p.projectstatus === 'creating').length
    const configuredDatabases = webBuilderProjects.filter(p => p.dbname && p.dbuser).length
    
    const successRate = totalWebsites > 0 ? Math.round((liveWebsites / totalWebsites) * 100) : 0
    
    return {
      totalWebsites,
      liveWebsites,
      failedWebsites,
      buildingWebsites,
      configuredDatabases,
      successRate
    }
  }

  // Generate deployment trends from real data (last 6 months)
  const generateWebBuilderTrends = () => {
    const last6Months: TrendData[] = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleString('default', { month: 'short' })
      
      const websitesInMonth = webBuilderProjects.filter(p => {
        const projectDate = new Date(p.startdate || p.updatedAt || 0)
        return projectDate.getMonth() === date.getMonth() && 
               projectDate.getFullYear() === date.getFullYear()
      }).length
      
      const liveInMonth = webBuilderProjects.filter(p => {
        const projectDate = new Date(p.startdate || p.updatedAt || 0)
        return projectDate.getMonth() === date.getMonth() && 
               projectDate.getFullYear() === date.getFullYear() &&
               p.projectstatus === 'live'
      }).length
      
      last6Months.push({
        month: monthName,
        websites: websitesInMonth,
        live: liveInMonth
      })
    }
    
    return last6Months
  }

  // Generate WebBuilder distribution from real data
  const generateWebBuilderData = () => {
    const builderCount: { [key: string]: number } = {}
    
    webBuilderProjects.forEach(project => {
      const builder = project.webbuilder || 'WordPress'
      builderCount[builder] = (builderCount[builder] || 0) + 1
    })
    
    const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    
    return Object.entries(builderCount).map(([builder, count], index) => ({
      name: builder,
      value: count,
      color: colors[index % colors.length]
    }))
  }

  // Generate website status distribution
  const generateStatusData = () => {
    const statusCount = {
      live: webBuilderProjects.filter(p => p.projectstatus === 'live').length,
      failed: webBuilderProjects.filter(p => p.projectstatus === 'failed').length,
      building: webBuilderProjects.filter(p => p.projectstatus === 'building').length,
      creating: webBuilderProjects.filter(p => p.projectstatus === 'creating').length
    }
    
    return [
      { name: 'Live', value: statusCount.live, color: '#10b981' },
      { name: 'Failed', value: statusCount.failed, color: '#ef4444' },
      { name: 'Building', value: statusCount.building, color: '#f59e0b' },
      { name: 'Creating', value: statusCount.creating, color: '#8b5cf6' }
    ].filter(item => item.value > 0)
  }

  // Generate database configuration data
  const generateDatabaseData = () => {
    const configured = webBuilderProjects.filter(p => p.dbname && p.dbuser).length
    const notConfigured = webBuilderProjects.length - configured
    
    return [
      { name: 'MySQL Configured', value: configured, color: '#10b981' },
      { name: 'Not Configured', value: notConfigured, color: '#6b7280' }
    ].filter(item => item.value > 0)
  }

  // Generate plan distribution data
  const generatePlanData = () => {
    const planCount: { [key: string]: number } = {}
    
    webBuilderProjects.forEach(project => {
      const plan = project.planid?.name || 'Basic'
      planCount[plan] = (planCount[plan] || 0) + 1
    })
    
    return Object.entries(planCount).map(([plan, count]) => ({
      plan,
      count,
      percentage: Math.round((count / webBuilderProjects.length) * 100)
    }))
  }

  const metrics = calculateMetrics()
  const webBuilderTrends = generateWebBuilderTrends()
  const webBuilderData = generateWebBuilderData()
  const statusData = generateStatusData()
  const databaseData = generateDatabaseData()
  const planData = generatePlanData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-lg p-3 shadow-xl">
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
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-300">Loading webbuilder analytics...</p>
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
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                WebBuilder Analytics
              </h1>
              <p className="text-gray-400 mt-2">
                {projectdata ? `Analytics for ${projectdata.name} (${projectdata.webbuilder || 'WordPress'})` : 'WordPress and CMS performance insights'}
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
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Websites</CardTitle>
                <Globe className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-purple-400 mb-2">{metrics.totalWebsites}</div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400">WebBuilder sites created</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Live Websites</CardTitle>
                <UserCheck className="h-5 w-5 text-emerald-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{metrics.liveWebsites}</div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 font-medium">{metrics.successRate}%</span>
                  <span className="text-gray-400 ml-1">success rate</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">MySQL Databases</CardTitle>
                <Database className="h-5 w-5 text-blue-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.configuredDatabases}</div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400">Configured databases</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">In Progress</CardTitle>
                <Clock className="h-5 w-5 text-orange-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-orange-400 mb-2">{metrics.buildingWebsites}</div>
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
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-900/50 to-black/50 border border-purple-500/20 rounded-xl p-1">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 rounded-lg"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="webbuilders"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 rounded-lg"
              >
                WebBuilders
              </TabsTrigger>
              <TabsTrigger 
                value="database"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-purple-300 rounded-lg"
              >
                Database
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Website Creation Trends */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      Website Creation Trends (6 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    {webBuilderTrends.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={webBuilderTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="websites" 
                            stroke="#8b5cf6" 
                            fill="url(#websiteGradient)" 
                            strokeWidth={2}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="live" 
                            stroke="#10b981" 
                            fill="url(#liveGradient)" 
                            strokeWidth={2}
                          />
                          <defs>
                            <linearGradient id="websiteGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="liveGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No website creation data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Website Status Distribution */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <PieChartIcon className="w-5 h-5 text-blue-400" />
                      Website Status Distribution
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

            <TabsContent value="webbuilders" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WebBuilder Distribution */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-purple-400" />
                      WebBuilder Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    {webBuilderData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={webBuilderData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No webbuilder data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Plan Distribution */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-400" />
                      Hosting Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-4">
                      {planData.length > 0 ? (
                        planData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                            <div>
                              <span className="text-gray-200 font-medium">{item.plan}</span>
                              <div className="text-sm text-gray-400">{item.count} websites</div>
                            </div>
                            <Badge variant="outline" className="border-green-500/30 text-green-400">
                              {item.percentage}%
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-8">
                          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No plan data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Database Configuration Status */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-blue-400" />
                      MySQL Database Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    {databaseData.length > 0 ? (
                      <div className="flex items-center">
                        <ResponsiveContainer width="60%" height={250}>
                          <PieChart>
                            <Pie
                              data={databaseData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {databaseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-3">
                          {databaseData.map((entry, index) => (
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
                          <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No database data available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Database Metrics */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-emerald-400" />
                      Database Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-6">
                      {/* Database Connection Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <div className="text-2xl font-bold text-emerald-400">{metrics.configuredDatabases}</div>
                          <div className="text-sm text-emerald-300">Connected</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
                          <div className="text-2xl font-bold text-gray-400">{metrics.totalWebsites - metrics.configuredDatabases}</div>
                          <div className="text-sm text-gray-300">Pending Setup</div>
                        </div>
                      </div>

                      {/* Database Type Information */}
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Database className="w-5 h-5 text-blue-400" />
                          <h4 className="font-semibold text-blue-400">MySQL Database Features</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            High Performance & Reliability
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            ACID Compliance
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            Automatic Backups
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            SSL Security
                          </li>
                        </ul>
                      </div>

                      {/* Database Performance */}
                      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <h4 className="font-semibold text-purple-400 mb-3">Database Performance</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Connection Success Rate</span>
                              <span className="text-purple-400">99.9%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-purple-400 h-2 rounded-full w-[99%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Average Response Time</span>
                              <span className="text-green-400">&lt; 10ms</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-green-400 h-2 rounded-full w-[95%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* WordPress Specific Features */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Edit className="w-5 h-5 text-purple-400" />
                    WordPress Database Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { table: 'wp_posts', description: 'Blog posts & pages', icon: Edit },
                      { table: 'wp_users', description: 'User accounts', icon: Users },
                      { table: 'wp_options', description: 'Site settings', icon: Globe },
                      { table: 'wp_comments', description: 'User comments', icon: Activity },
                      { table: 'wp_plugins', description: 'Plugin data', icon: Download },
                      { table: 'wp_themes', description: 'Theme settings', icon: Monitor }
                    ].map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <item.icon className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="font-mono text-sm text-purple-300">{item.table}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Performance Summary */}
        <motion.div variants={fadeIn}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {Math.round((metrics.liveWebsites / Math.max(metrics.totalWebsites, 1)) * 100)}%
                </div>
                <p className="text-gray-400">Website Success Rate</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.round((metrics.liveWebsites / Math.max(metrics.totalWebsites, 1)) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {Math.round((metrics.configuredDatabases / Math.max(metrics.totalWebsites, 1)) * 100)}%
                </div>
                <p className="text-gray-400">Database Configuration Rate</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.round((metrics.configuredDatabases / Math.max(metrics.totalWebsites, 1)) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {webBuilderData.length}
                </div>
                <p className="text-gray-400">WebBuilder Types Used</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Real-time WebBuilder Status */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-purple-400" />
                Current WebBuilder Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-2xl font-bold text-emerald-400">{metrics.liveWebsites}</div>
                  <div className="text-sm text-emerald-300">Live Websites</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">{metrics.configuredDatabases}</div>
                  <div className="text-sm text-blue-300">MySQL DBs</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-400">{metrics.buildingWebsites}</div>
                  <div className="text-sm text-orange-300">Building</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <div className="text-2xl font-bold text-gray-400">{metrics.totalWebsites}</div>
                  <div className="text-sm text-gray-300">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Empty State */}
        {webBuilderProjects.length === 0 && (
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-purple-500/20">
              <CardContent className="p-12 text-center">
                <Globe className="w-24 h-24 mx-auto mb-6 text-gray-400 opacity-50" />
                <h3 className="text-2xl font-bold text-gray-200 mb-4">No WebBuilder Analytics Available</h3>
                <p className="text-gray-400 mb-6">
                  Start creating WordPress or other CMS websites to see detailed analytics about your webbuilder projects.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Create Your First Website
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}