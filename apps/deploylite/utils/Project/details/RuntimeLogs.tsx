"use client"
import { Search, Download, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { BarChart, Settings, MoreVertical, CheckCircle, XCircle, Zap, Cloud, Server, Clock, DollarSign, Bell, Rocket, GitBranch, Terminal, Shield, Database, Loader2,Globe} from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, RefreshCcw, Link } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { io, Socket } from 'socket.io-client';
export default function RuntimeLogs({projectdata}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [projectdata2,setProjectData2]=useState(projectdata)
  const [deploymentdata,setDeploymentdata]=useState([]);
  const [loading,setLoading]=useState(false)
  const [logLevel, setLogLevel] = useState("all")
  const [messages, setMessages] = useState<string[]>([]);
  
      const [isConnected, setIsConnected] = useState(false);
  //fetch data
  const fetchdata =async(id:any)=>{
    try{
     setLoading(true)
  let data = await fetch(`/api/project/details?id=${id}`)
  const result = await data.json();
  setLoading(false);
  if(result.success){
 //logs
 console.log(result.projectdata)
 console.log(result.deployment)
 //setting data in states
 setProjectData2(result.projectdata)
 setDeploymentdata(result.deployment)
  }
  else{
 console.log(result.message)
 //triggered error page that you failed to fetch
  }
    }
    catch(err){
     console.log("Our service is temporarily down please try again after some time !")
    }
   }
      useEffect(() => {
          const socket: Socket = io('http://localhost:9000', {
              transports: ['websocket'], // ✅ Force WebSocket
              reconnection: true,        // ✅ Auto-reconnect enabled
              reconnectionAttempts: 5,   // ✅ Max retry attempts
              reconnectionDelay: 2000    // ✅ Delay before retrying
          });
  
          socket.on('connect', () => {
              console.log('✅ Connected to Socket.io server');
              setIsConnected(true);
              socket.emit('subscribe', `logs:${projectdata.name}`);
          });
  
          socket.on('message', (msg) => {
              console.log('📥 New message received:', msg);
              if(msg.includes(`{"log":"Success"}`)){
                fetchdata(projectdata._id);
              }
              if(msg.includes(`{"log":"Failed"}`)){
                fetchdata(projectdata._id);
              }
              if(msg.includes(`{"log":"Error"}`)){
                fetchdata(projectdata._id);
              }
              setMessages((prev) => [...prev, msg]);
          });
  
          socket.on('disconnect', (reason) => {
              console.warn('❌ Disconnected:', reason);
              setIsConnected(false);
          });
  
          socket.on('connect_error', (error) => {
              console.error('🚨 Connection Error:', error);
          });
  
          return () => {
              socket.disconnect();
              console.log('🔌 Socket disconnected');
          };
      }, []);
  // Simulated log entries


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      {/* // */}
       {projectdata2.projectstatus=="creating"&&<div className="mt-6 mb-4">
                      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 border-indigo-200 dark:border-indigo-700">
                        <CardHeader>
                          <CardTitle className="flex items-center text-indigo-900 dark:text-indigo-100">
                            <Rocket className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                            Deployment Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Deployment in Progress</h3>
                              <p className="text-sm text-indigo-700 dark:text-indigo-300">Deploying version 2.1.0 to production</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="w-full bg-indigo-200 dark:bg-indigo-700 rounded-full h-2.5">
                              <div className="bg-indigo-600 dark:bg-indigo-400 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">Estimated time remaining: 2 minutes</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>}
                    {projectdata2.projectstatus=="live"&&<SuccessCard />}
                    {projectdata2.projectstatus=="failed"&&<FailureCard />}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Runtime Logs</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700">
                <span className="text-sm font-medium">Log Output</span>
                <Button variant="outline" size="sm" className="text-xs">
                  Clear Logs
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <pre className="p-4 text-sm font-mono">
                  {messages.map((log, index) => (
                    <div key={index} className="pb-1">
                      <span className="text-gray-500 dark:text-gray-400">{index}</span>{" "}
                     
                        {log}
                      
                      
                    </div>
                  ))}
                </pre>
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-4">
    
          </div>
        </div>
      </div>
    </div>
  )
}


const SuccessCard = () => (
  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 border-emerald-200 dark:border-emerald-700 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 right-10">
        <CheckCircle2 className="w-32 h-32 text-emerald-500" />
      </div>
      <div className="absolute bottom-10 left-10">
        <Link className="w-24 h-24 text-emerald-500" />
      </div>
    </div>
    <CardHeader>
      <CardTitle className="flex items-center text-emerald-900 dark:text-emerald-100">
        <Rocket className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
        Deployment Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="rounded-full h-10 w-10 bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Deployment Successful
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Version 2.1.0 deployed to production
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-emerald-700 dark:text-emerald-300">
          <span>Build Time</span>
          <span>1m 45s</span>
        </div>
        <div className="flex items-center justify-between text-sm text-emerald-700 dark:text-emerald-300">
          <span>Environment</span>
          <span>Production</span>
        </div>
        <div className="w-full bg-emerald-200 dark:bg-emerald-700 rounded-full h-2">
          <div className="bg-emerald-600 dark:bg-emerald-400 h-2 rounded-full w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const FailureCard = () => (
  <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200 dark:border-red-700 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 right-10">
        <XCircle className="w-32 h-32 text-red-500" />
      </div>
      <div className="absolute bottom-10 left-10">
        <RefreshCcw className="w-24 h-24 text-red-500" />
      </div>
    </div>
    <CardHeader>
      <CardTitle className="flex items-center text-red-900 dark:text-red-100">
        <Rocket className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
        Deployment Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="rounded-full h-10 w-10 bg-red-500 dark:bg-red-400 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Build Failed
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">
            Error during deployment of version 2.1.0
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-red-700 dark:text-red-300">
          <span>Error Type</span>
          <span>Build Error</span>
        </div>
        <div className="flex items-center justify-between text-sm text-red-700 dark:text-red-300">
          <span>Failed Step</span>
          <span>npm build</span>
        </div>
        <div className="p-3 bg-red-200 dark:bg-red-800/50 rounded-md text-sm text-red-800 dark:text-red-200 font-mono">
          Error: Check the logs for more details
        </div>
      </div>
    </CardContent>
  </Card>
);