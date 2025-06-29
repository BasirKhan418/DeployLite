"use client"
import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, Terminal, GitBranch, User, Calendar, Info } from "lucide-react"

interface Deployment {
    id: number; 
    name: string; 
    status: 'success' | 'failed' | 'in-progress'; 
    timestamp: string; 
    branch: string; 
    author: string; 
    commitMessage: string; 
    logs: string; 
}

export default function Activity() {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)

  const deployments: Deployment[] = [
    { 
      id: 1, 
      name: 'Main Branch Deploy', 
      status: 'success', 
      timestamp: '2023-05-15 14:30', 
      branch: 'main',
      author: 'Jane Doe',
      commitMessage: 'Update user authentication flow',
      logs: 'Cloning repository...\nInstalling dependencies...\nRunning tests...\nBuilding project...\nDeploying to production...\nDeployment successful!',
    },
    { 
      id: 2, 
      name: 'Feature Branch Deploy', 
      status: 'failed', 
      timestamp: '2023-05-15 13:45', 
      branch: 'feature/new-dashboard',
      author: 'John Smith',
      commitMessage: 'Implement new dashboard components',
      logs: 'Cloning repository...\nInstalling dependencies...\nRunning tests...\nTest failure in DashboardSpec.js\nDeployment failed.',
    },
    { 
      id: 3, 
      name: 'Hotfix Deploy', 
      status: 'in-progress', 
      timestamp: '2023-05-15 15:00', 
      branch: 'hotfix/login-issue',
      author: 'Alice Johnson',
      commitMessage: 'Fix critical login bug',
      logs: 'Cloning repository...\nInstalling dependencies...\nRunning tests...\nBuilding project...',
    },
  ]

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />
      case 'failed':
        return <XCircle className="text-red-500" size={20} />
      case 'in-progress':
        return (
          <div className="animate-spin">
            <Clock className="text-blue-500" size={20} />
          </div>
        )
      default:
        return <Clock className="text-gray-500" size={20} />
    }
  }

  const getStatusBadgeClass = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white dark:bg-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <ul className="space-y-4 p-4">
                {deployments.map((deployment) => (
                  <li key={deployment.id} className="relative">
                    <div className="flex items-center mb-2">
                      <div className="absolute left-0 mt-1">
                        {getStatusIcon(deployment.status)}
                      </div>
                      <div className="ml-8">
                        <h3 className="text-lg font-semibold">{deployment.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                          <Calendar size={14} />
                          <span>{deployment.timestamp}</span>
                        </div>
                      </div>
                      <Badge className={`ml-auto ${getStatusBadgeClass(deployment.status)}`}>
                        {deployment.status}
                      </Badge>
                    </div>
                    <Card
                      className="ml-8 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedDeployment(deployment)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <GitBranch size={14} />
                          <span className="text-sm font-medium">{deployment.branch}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User size={14} />
                          <span className="text-sm">{deployment.author}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{deployment.commitMessage}</p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      <div className='my-2'>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Deployment Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {selectedDeployment ? (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info" className="flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    More Info
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="flex items-center">
                    <Terminal className="w-4 h-4 mr-2" />
                    Logs
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Deployment Name</h3>
                      <p>{selectedDeployment.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Status</h3>
                      <Badge className={getStatusBadgeClass(selectedDeployment.status)}>
                        {selectedDeployment.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">Branch</h3>
                      <p>{selectedDeployment.branch}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Author</h3>
                      <p>{selectedDeployment.author}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Commit Message</h3>
                      <p>{selectedDeployment.commitMessage}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Timestamp</h3>
                      <p>{selectedDeployment.timestamp}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="logs" className="p-4">
                  <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded border p-4 bg-gray-900 text-gray-100">
                    <pre className="font-mono text-sm whitespace-pre-wrap">{selectedDeployment.logs}</pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 p-4">Select a deployment to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}