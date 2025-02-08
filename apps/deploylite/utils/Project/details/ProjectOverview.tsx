import React, { useEffect, useState } from 'react'
import { BarChart, Settings, MoreVertical, CheckCircle, XCircle, Zap, Cloud, Server, Clock, DollarSign, Bell, Rocket, GitBranch, Terminal, Shield, Database, Loader2,Globe

 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
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

export default function ProjectOverview({projectdata,deploymentdata}:any) {
  const projectName = projectdata.name&&projectdata.name.toUpperCase()
  const projectUrl = `https://${projectdata.name}.cloud.deploylite.tech`
  const isHealthy = true
  const cpuUtilization = projectdata.cpuusage
  const memoryUtilization = projectdata.memoryusage
  const defaultvalue = projectdata.projectstatus=="creating"?"runtimelogs":"overview"
  const estimatedCost = projectdata.planid&&projectdata.planid.pricepmonth;

  const recentActivities = [
    { id: 1, type: 'deployment', status: 'success', timestamp: '2023-05-15 14:30', user: 'Alice' },
    { id: 2, type: 'deployment', status: 'failed', timestamp: '2023-05-14 10:15', user: 'Bob' },
    { id: 3, type: 'deployment', status: 'success', timestamp: '2023-05-13 09:00', user: 'Charlie' },
  ]


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center">
                <Cloud className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold">{projectName}</h1>
                  <a href={projectUrl} className="text-blue-200 hover:underline" target='_blank'>{projectUrl}</a>
                </div>
              </div>
              <div className="flex mt-4 sm:mt-0">
                <Button variant="secondary" className="mr-2">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary">
                      <MoreVertical className="w-4 h-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Rocket className="mr-2 h-4 w-4" />
                      <span>Deploy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GitBranch className="mr-2 h-4 w-4" />
                      <span>Branch</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Terminal className="mr-2 h-4 w-4" />
                      <span>Console</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Security Scan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Database className="mr-2 h-4 w-4" />
                      <span>Backup</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <Tabs defaultValue={defaultvalue} className="p-6">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6 dark:bg-gray-900">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="runtimelogs">Runtime Logs</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              {projectdata&&projectdata.type=="backend"&&<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-800 dark:text-green-100">App Health</CardTitle>
                    {isHealthy ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">{isHealthy ? 'Healthy' : 'Unhealthy'}</div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">Last checked: 5 minutes ago</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-100">CPU Utilization</CardTitle>
                    <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{cpuUtilization}%</div>
                    <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2.5 mt-2">
                      <div className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full" style={{ width: `${cpuUtilization}%` }}></div>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">2 CPU cores</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-100">Memory Utilization</CardTitle>
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{memoryUtilization}%</div>
                    <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-2.5 mt-2">
                      <div className="bg-purple-600 dark:bg-purple-400 h-2.5 rounded-full" style={{ width: `${memoryUtilization}%` }}></div>
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">2 GB total memory</p>
                  </CardContent>
                </Card>
              </div>}
              {
                projectdata&&projectdata.type=="frontend"&&<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-800 dark:text-green-100">App Health</CardTitle>
                    {isHealthy ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">{isHealthy ? 'Healthy' : 'Unhealthy'}</div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">Last checked: 5 minutes ago</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-100">Page Views (24h)</CardTitle>
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{50}</div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">+5.2% from yesterday</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-100">Avg. Load Time</CardTitle>
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{5}s</div>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">-0.1s from last week</p>
                  </CardContent>
                </Card>
              </div>
              }

              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {recentActivities.map((activity) => (
                        <li key={activity.id} className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={activity.user} />
                            <AvatarFallback>{activity.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium dark:text-gray-100">{activity.user} deployed</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                          </div>
                          {/* @ts-ignore */}
                          <Badge variant={activity.status === 'success' ? 'success' : 'destructive'}>
                            {activity.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 border-yellow-200 dark:border-yellow-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-900 dark:text-yellow-100">
                      <DollarSign className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                      Estimated App Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">₹{estimatedCost}</div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">per month</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-yellow-800 dark:text-yellow-200 mb-1">
                        <span>Compute</span>
                        <span>₹{estimatedCost/3}</span>
                      </div>
                      <div className="flex justify-between text-sm text-yellow-800 dark:text-yellow-200 mb-1">
                        <span>Storage</span>
                        <span>₹{estimatedCost/3}</span>
                      </div>
                      <div className="flex justify-between text-sm text-yellow-800 dark:text-yellow-200 mb-1">
                        <span>Network</span>
                        <span>₹{estimatedCost/3}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

             
            </TabsContent>
            <TabsContent value="analytics">
          <Analytics /> 
        </TabsContent>
        <TabsContent value="activity">
          <Activity/> 
        </TabsContent>
        <TabsContent value="runtimelogs">
          <RuntimeLogs projectdata={projectdata}/> 
        </TabsContent>
        <TabsContent value="console">
          <Console/> 
        </TabsContent>
        <TabsContent value="settings">
          <ProjectSettings/> 
        </TabsContent>
        
          </Tabs>
        </div>
     
        <div className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🚀 Boost Your App Performance!</h2>
              <p className="text-lg">Upgrade to our Pro plan and get  50% more resources for the same price.</p>
            </div>
            <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}