import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Database,
  Activity,
  Clock,
  Users,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  Server,
  Timer,
  Target
} from 'lucide-react'

interface DatabaseAnalyticsProps {
  projectdata: any
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function DatabaseAnalytics({ projectdata }: DatabaseAnalyticsProps) {
  const databaseType = projectdata?.dbtype?.toUpperCase() || 'UNKNOWN'
  
  // Mock analytics data - in real implementation, fetch from API
  const analyticsData = {
    connections: {
      current: 25,
      peak: 45,
      average: 32,
      trend: 'up'
    },
    queries: {
      total: 12547,
      slow: 23,
      failed: 5,
      avgResponseTime: 45
    },
    storage: {
      used: parseFloat(projectdata?.storageusage || '0'),
      total: 100,
      growth: '+2.3%'
    },
    performance: {
      cpu: parseFloat(projectdata?.cpuusage || '0'),
      memory: parseFloat(projectdata?.memoryusage || '0'),
      uptime: '99.9%'
    }
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100">Database Analytics</h2>
              <p className="text-gray-400">Performance metrics and usage statistics for your {databaseType} database</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Connections</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-blue-400">{analyticsData.connections.current}</div>
                <p className="text-xs text-gray-400">
                  Peak: {analyticsData.connections.peak} | Avg: {analyticsData.connections.average}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">+12% from last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Query Performance</CardTitle>
                <Zap className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-emerald-400">{analyticsData.queries.avgResponseTime}ms</div>
                <p className="text-xs text-gray-400">
                  {analyticsData.queries.total.toLocaleString()} total queries
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="h-3 w-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">-5ms improvement</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Storage Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-purple-400">{analyticsData.storage.used}%</div>
                <p className="text-xs text-gray-400">
                  of allocated storage
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-amber-400" />
                  <span className="text-xs text-amber-400">{analyticsData.storage.growth} this month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Uptime</CardTitle>
                <Activity className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-orange-400">{analyticsData.performance.uptime}</div>
                <p className="text-xs text-gray-400">
                  Last 30 days
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-400">Operational</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Performance Charts */}
        <motion.div variants={stagger} className="grid gap-8 md:grid-cols-2">
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-100">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Resource Usage Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300">CPU Usage</span>
                      </div>
                      <span className="text-sm font-medium text-purple-400">{analyticsData.performance.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${analyticsData.performance.cpu}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Memory Usage</span>
                      </div>
                      <span className="text-sm font-medium text-blue-400">{analyticsData.performance.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${analyticsData.performance.memory}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">Storage Usage</span>
                      </div>
                      <span className="text-sm font-medium text-green-400">{analyticsData.storage.used}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${analyticsData.storage.used}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-100">
                    <Database className="w-5 h-5 text-blue-400" />
                  Query Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{analyticsData.queries.total.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Total Queries</div>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <div className="text-lg font-bold text-emerald-400">{analyticsData.queries.avgResponseTime}ms</div>
                      <div className="text-xs text-gray-400">Avg Response</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-lg">
                      <div className="text-lg font-bold text-amber-400">{analyticsData.queries.slow}</div>
                      <div className="text-xs text-gray-400">Slow Queries</div>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <div className="text-lg font-bold text-red-400">{analyticsData.queries.failed}</div>
                      <div className="text-xs text-gray-400">Failed Queries</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Query Success Rate</span>
                      <span className="text-emerald-400 font-medium">
                        {(((analyticsData.queries.total - analyticsData.queries.failed) / analyticsData.queries.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Database-specific Analytics */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Target className="w-5 h-5 text-purple-400" />
                {databaseType} Specific Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {databaseType === 'MYSQL' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">InnoDB Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Buffer Pool Hit Rate</span>
                        <span className="text-emerald-400">99.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Lock Wait Time</span>
                        <span className="text-blue-400">12ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Deadlocks</span>
                        <span className="text-amber-400">0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Query Cache</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cache Hit Rate</span>
                        <span className="text-emerald-400">87.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cache Size</span>
                        <span className="text-blue-400">16MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Queries in Cache</span>
                        <span className="text-purple-400">1,247</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Replication</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Slave Lag</span>
                        <span className="text-emerald-400">0s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Binlog Size</span>
                        <span className="text-blue-400">45MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status</span>
                        <span className="text-emerald-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {databaseType === 'POSTGRESQL' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">WAL Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">WAL Files</span>
                        <span className="text-blue-400">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">WAL Size</span>
                        <span className="text-purple-400">192MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Checkpoint Distance</span>
                        <span className="text-emerald-400">78%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Vacuum Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Vacuum</span>
                        <span className="text-emerald-400">2h ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Dead Tuples</span>
                        <span className="text-amber-400">1,234</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Bloat Factor</span>
                        <span className="text-blue-400">2.1%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Index Usage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Index Hit Rate</span>
                        <span className="text-emerald-400">98.7%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Unused Indexes</span>
                        <span className="text-amber-400">2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Indexes</span>
                        <span className="text-blue-400">47</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {databaseType === 'MONGODB' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Collections</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Collections</span>
                        <span className="text-blue-400">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Documents</span>
                        <span className="text-purple-400">125K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Average Doc Size</span>
                        <span className="text-emerald-400">2.4KB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Indexes</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Indexes</span>
                        <span className="text-blue-400">23</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Index Size</span>
                        <span className="text-purple-400">45MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Index Hit Rate</span>
                        <span className="text-emerald-400">94.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Operations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Inserts/sec</span>
                        <span className="text-emerald-400">45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Queries/sec</span>
                        <span className="text-blue-400">78</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Updates/sec</span>
                        <span className="text-amber-400">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {databaseType === 'REDIS' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Memory Usage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Used Memory</span>
                        <span className="text-blue-400">156MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Peak Memory</span>
                        <span className="text-purple-400">178MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fragmentation</span>
                        <span className="text-emerald-400">1.12</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Operations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Ops/sec</span>
                        <span className="text-emerald-400">1,247</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Hit Rate</span>
                        <span className="text-blue-400">96.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Evicted Keys</span>
                        <span className="text-amber-400">23</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Persistence</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Save</span>
                        <span className="text-emerald-400">5m ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">RDB Size</span>
                        <span className="text-blue-400">89MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">AOF Size</span>
                        <span className="text-purple-400">124MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {databaseType === 'QDRANT' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Collections</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Collections</span>
                        <span className="text-blue-400">3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Vectors</span>
                        <span className="text-purple-400">25K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Vector Dimensions</span>
                        <span className="text-emerald-400">768</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Search Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Avg Search Time</span>
                        <span className="text-emerald-400">23ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Searches/sec</span>
                        <span className="text-blue-400">156</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Index Segments</span>
                        <span className="text-purple-400">8</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-200">Memory & Storage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Index Size</span>
                        <span className="text-blue-400">2.1GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Memory Usage</span>
                        <span className="text-purple-400">512MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Disk Usage</span>
                        <span className="text-emerald-400">1.8GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Clock className="w-5 h-5 text-orange-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '2 minutes ago', action: 'Query optimization completed', status: 'success' },
                  { time: '15 minutes ago', action: 'Backup completed successfully', status: 'success' },
                  { time: '1 hour ago', action: 'Connection pool resized', status: 'info' },
                  { time: '3 hours ago', action: 'Slow query detected and logged', status: 'warning' },
                  { time: '6 hours ago', action: 'Database maintenance window started', status: 'info' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-emerald-400' :
                      activity.status === 'warning' ? 'bg-amber-400' :
                      'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Recommendations */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Performance Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-400">Excellent Performance</h4>
                      <p className="text-sm text-emerald-300/80 mt-1">
                        Your database is performing well with good response times and resource utilization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Timer className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-400">Consider Index Optimization</h4>
                      <p className="text-sm text-blue-300/80 mt-1">
                        Some queries could benefit from additional indexes. Review slow query logs for optimization opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <HardDrive className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-400">Monitor Storage Growth</h4>
                      <p className="text-sm text-amber-300/80 mt-1">
                        Storage usage is increasing. Consider setting up automated cleanup policies or upgrading your storage plan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}