import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Clock,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Shield,
  RefreshCw,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  Server,
  Terminal,
  Eye,
  AlertCircle
} from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function DatabaseActivity() {
  const [filter, setFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')

  // Mock activity data - in real implementation, fetch from API
  const activities = [
    {
      id: 1,
      type: 'backup',
      status: 'success',
      message: 'Automated backup completed successfully',
      details: 'Full database backup created (2.3GB)',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      duration: '45s',
      user: 'system'
    },
    {
      id: 2,
      type: 'query',
      status: 'warning',
      message: 'Slow query detected',
      details: 'SELECT * FROM users WHERE created_at > ... (2.4s)',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      duration: '2.4s',
      user: 'app_user'
    },
    {
      id: 3,
      type: 'connection',
      status: 'info',
      message: 'New connection established',
      details: 'Client connected from 192.168.1.100',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      duration: '-',
      user: 'api_service'
    },
    {
      id: 4,
      type: 'maintenance',
      status: 'success',
      message: 'Index optimization completed',
      details: 'Rebuilt 5 indexes, improved query performance by 23%',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: '3m 15s',
      user: 'system'
    },
    {
      id: 5,
      type: 'security',
      status: 'warning',
      message: 'Failed login attempt',
      details: 'Authentication failed for user admin from 203.0.113.1',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      duration: '-',
      user: 'unknown'
    },
    {
      id: 6,
      type: 'backup',
      status: 'error',
      message: 'Backup validation failed',
      details: 'Checksum mismatch detected in backup file',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      duration: '1m 12s',
      user: 'system'
    },
    {
      id: 7,
      type: 'performance',
      status: 'info',
      message: 'Connection pool resized',
      details: 'Increased max connections from 100 to 150',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      duration: '-',
      user: 'system'
    },
    {
      id: 8,
      type: 'query',
      status: 'success',
      message: 'Bulk insert operation completed',
      details: 'Inserted 50,000 records in batch operation',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      duration: '12.3s',
      user: 'data_importer'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'backup':
        return Database
      case 'query':
        return Terminal
      case 'connection':
        return Zap
      case 'maintenance':
        return RefreshCw
      case 'security':
        return Shield
      case 'performance':
        return Activity
      default:
        return Info
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />
      default:
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'backup':
        return 'bg-blue-500/10 text-blue-400'
      case 'query':
        return 'bg-purple-500/10 text-purple-400'
      case 'connection':
        return 'bg-green-500/10 text-green-400'
      case 'maintenance':
        return 'bg-orange-500/10 text-orange-400'
      case 'security':
        return 'bg-red-500/10 text-red-400'
      case 'performance':
        return 'bg-cyan-500/10 text-cyan-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.type === filter || activity.status === filter
  })

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-100">Database Activity</h2>
                <p className="text-gray-400">Real-time activity logs and system events</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
              <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : 'border-gray-600 hover:bg-gray-800'}
                  >
                    All Events
                  </Button>
                  <Button
                    variant={filter === 'backup' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('backup')}
                    className={filter === 'backup' ? 'bg-purple-500 hover:bg-purple-600' : 'border-gray-600 hover:bg-gray-800'}
                  >
                    Backups
                  </Button>
                  <Button
                    variant={filter === 'query' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('query')}
                    className={filter === 'query' ? 'bg-purple-500 hover:bg-purple-600' : 'border-gray-600 hover:bg-gray-800'}
                  >
                    Queries
                  </Button>
                  <Button
                    variant={filter === 'security' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('security')}
                    className={filter === 'security' ? 'bg-purple-500 hover:bg-purple-600' : 'border-gray-600 hover:bg-gray-800'}
                  >
                    Security
                  </Button>
                  <Button
                    variant={filter === 'error' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('error')}
                    className={filter === 'error' ? 'bg-purple-500 hover:bg-purple-600' : 'border-gray-600 hover:bg-gray-800'}
                  >
                    Errors
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-1 bg-black/50 border border-gray-700 rounded text-white text-sm"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Stats */}
        <motion.div variants={stagger} className="grid gap-6 md:grid-cols-4">
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {activities.filter(a => a.status === 'success').length}
                    </div>
                    <div className="text-sm text-gray-400">Successful</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">
                      {activities.filter(a => a.status === 'warning').length}
                    </div>
                    <div className="text-sm text-gray-400">Warnings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {activities.filter(a => a.status === 'error').length}
                    </div>
                    <div className="text-sm text-gray-400">Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Info className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {activities.filter(a => a.status === 'info').length}
                    </div>
                    <div className="text-sm text-gray-400">Info</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Clock className="w-5 h-5 text-purple-400" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type)
                  return (
                    <motion.div
                      key={activity.id}
                      variants={fadeIn}
                      className="group relative p-4 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 bg-gray-800/20 hover:bg-gray-800/40"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                            <IconComponent className="w-5 h-5 text-purple-400" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                                  {activity.message}
                                </h4>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(activity.status)}
                                  <Badge variant="secondary" className={`text-xs ${getStatusColor(activity.status)}`}>
                                    {activity.status}
                                  </Badge>
                                  <Badge variant="outline" className={`text-xs ${getTypeColor(activity.type)}`}>
                                    {activity.type}
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-400 mb-3">
                                {activity.details}
                              </p>
                              
                              <div className="flex items-center gap-6 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeAgo(activity.timestamp)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{activity.user}</span>
                                </div>
                                {activity.duration !== '-' && (
                                  <div className="flex items-center gap-1">
                                    <Activity className="w-3 h-3" />
                                    <span>{activity.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-purple-300"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Activity className="w-12 h-12 mx-auto opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No activities found</h3>
                  <p className="text-gray-400">No activities match your current filter criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Terminal className="w-5 h-5 text-green-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-medium text-gray-200">Create Backup</div>
                      <div className="text-sm text-gray-400">Manual database backup</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="font-medium text-gray-200">Query Console</div>
                      <div className="text-sm text-gray-400">Run SQL queries</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-left"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-medium text-gray-200">Optimize</div>
                      <div className="text-sm text-gray-400">Run maintenance tasks</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}