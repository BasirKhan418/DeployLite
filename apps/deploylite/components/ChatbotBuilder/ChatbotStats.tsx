"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Cpu,
  HardDrive,
  Globe,
  Clock,
  MessageSquare,
  Users,
  TrendingUp,
  Zap,
  Database,
  Brain,
  Activity,
  Calendar,
  DollarSign,
  Server
} from "lucide-react";

interface ChatbotData {
  _id: string;
  name: string;
  projectstatus: string;
  projecturl: string;
  url?: string;
  cpuusage: string;
  memoryusage: string;
  storageusage: string;
  startdate: string;
  planid: {
    name: string;
    pcategory: string;
    pricepmonth: string;
  };
  knowledgebase: any[];
  arn?: string;
}

interface ChatbotStatsProps {
  chatbotData: ChatbotData;
}

const ChatbotStats: React.FC<ChatbotStatsProps> = ({ chatbotData }) => {
  // Mock data for demo - in real app, this would come from analytics API
  const mockStats = {
    totalConversations: 1247,
    activeUsers: 89,
    avgResponseTime: 1.2,
    uptime: 99.8,
    messagesPerDay: 145,
    knowledgeBaseQueries: 67,
    apiCallsToday: 234,
    satisfactionScore: 4.6
  };

  const formatUptime = (days: number) => {
    return `${Math.floor(days)} days`;
  };

  const getUptimeSince = () => {
    const startDate = new Date(chatbotData.startdate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statCards = [
    {
      title: "Total Conversations",
      value: mockStats.totalConversations.toLocaleString(),
      change: "+12%",
      changeType: "positive",
      icon: MessageSquare,
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Active Users",
      value: mockStats.activeUsers.toString(),
      change: "+8%",
      changeType: "positive",
      icon: Users,
      color: "from-emerald-400 to-green-400"
    },
    {
      title: "Avg Response Time",
      value: `${mockStats.avgResponseTime}s`,
      change: "-5%",
      changeType: "positive",
      icon: Zap,
      color: "from-amber-400 to-orange-400"
    },
    {
      title: "Satisfaction Score",
      value: `${mockStats.satisfactionScore}/5`,
      change: "+0.3",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-pink-400 to-rose-400"
    }
    
  ];

  const resourceUsage = [
    {
      label: "CPU Usage",
      value: parseInt(chatbotData.cpuusage) || 15,
      icon: Cpu,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20"
    },
    {
      label: "Memory Usage",
      value: parseInt(chatbotData.memoryusage) || 25,
      icon: HardDrive,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    },
    {
      label: "Storage Usage",
      value: parseInt(chatbotData.storageusage) || 8,
      icon: Database,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-2xl font-bold text-gray-200">{stat.value}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          stat.changeType === 'positive'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                    <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Resource Usage and System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Server className="w-5 h-5 text-pink-400" />
                Resource Usage
              </CardTitle>
              <CardDescription>Current system resource utilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {resourceUsage.map((resource) => (
                <div key={resource.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${resource.bgColor}`}>
                        <resource.icon className={`w-4 h-4 ${resource.color}`} />
                      </div>
                      <span className="text-gray-300 font-medium">{resource.label}</span>
                    </div>
                    <span className={`font-semibold ${resource.color}`}>
                      {resource.value}%
                    </span>
                  </div>
                  <Progress value={resource.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Activity className="w-5 h-5 text-emerald-400" />
                System Information
              </CardTitle>
              <CardDescription>Deployment and performance details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Uptime</span>
                  </div>
                  <span className="text-blue-400 font-semibold">
                    {formatUptime(getUptimeSince())}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Deployed</span>
                  </div>
                  <span className="text-purple-400 font-semibold">
                    {new Date(chatbotData.startdate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-pink-400" />
                    <span className="text-gray-300">Knowledge Files</span>
                  </div>
                  <span className="text-pink-400 font-semibold">
                    {chatbotData.knowledgebase?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300">Plan</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">
                    {chatbotData.planid.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Today's chatbot performance and usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {mockStats.messagesPerDay}
                </div>
                <div className="text-sm text-gray-400">Messages Today</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-500/20">
                <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {mockStats.uptime}%
                </div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {mockStats.knowledgeBaseQueries}
                </div>
                <div className="text-sm text-gray-400">KB Queries</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-amber-400 mb-1">
                  {mockStats.apiCallsToday}
                </div>
                <div className="text-sm text-gray-400">API Calls</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <Activity className="w-5 h-5 text-pink-400" />
              Quick Status Overview
            </CardTitle>
            <CardDescription>Current chatbot status and health checks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-emerald-400 font-semibold">System Status</div>
                    <div className="text-sm text-gray-300">All systems operational</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-blue-400 font-semibold">API Status</div>
                    <div className="text-sm text-gray-300">Connected and responding</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-purple-400 font-semibold">Knowledge Base</div>
                    <div className="text-sm text-gray-300">Ready and indexed</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChatbotStats;