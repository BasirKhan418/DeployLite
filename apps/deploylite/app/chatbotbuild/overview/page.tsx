"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatbotStats from "@/components/ChatbotBuilder/ChatbotStats";
import KnowledgeBaseManager from "@/components/ChatbotBuilder/KnowledgeBaseManager";
import ChatbotSettings from "@/components/ChatbotBuilder/ChatbotSettings";
import ChatInterface from "@/components/ChatbotBuilder/ChatInterface";
import { useAppSelector } from "@/lib/hook";
import {
  ArrowLeft,
  Bot,
  ExternalLink,
  Settings,
  Database,
  MessageSquare,
  BarChart3,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Copy,
  Eye
} from "lucide-react";

interface ChatbotData {
  dburl: any;
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

const ChatbotOverviewPage = () => {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatbotId = searchParams?.get('id');

  const [chatbotData, setChatbotData] = useState<ChatbotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }


    fetchChatbotData();
  }, [user, chatbotId, router]);

  const fetchChatbotData = async () => {
    if (!chatbotId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/project/chatbot/details?id=${chatbotId}`);
      const data = await response.json();

      if (data.success) {
        setChatbotData(data.data);
      } else {
        toast.error(data.message || "Failed to fetch chatbot details");
       
      }
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
      toast.error("Error fetching chatbot details");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChatbotData();
    setRefreshing(false);
    toast.success("Chatbot data refreshed");
  };

  const handleDeleteChatbot = async () => {
    if (!chatbotData) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${chatbotData.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch('/api/project/chatbot', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: chatbotData._id }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Chatbot deleted successfully");
        router.push("/project");
      } else {
        toast.error(result.message || "Failed to delete chatbot");
      }
    } catch (error) {
      console.error("Error deleting chatbot:", error);
      toast.error("Error deleting chatbot");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'creating':
      case 'deploying':
        return <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'failed':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'creating':
      case 'deploying':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-400 mx-auto mb-4" />
          <p className="text-gray-200 text-xl font-medium">Loading chatbot details...</p>
        </div>
      </div>
    );
  }

  if (!chatbotData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-200 mb-2">Chatbot Not Found</h2>
          <p className="text-gray-400 mb-6">The requested chatbot could not be found.</p>
          <Button onClick={() => router.push("/project/chatbot")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/project/chatbot')}
              className="text-gray-400 hover:text-pink-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-gray-600 hover:border-pink-500/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChatbot}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>

        {/* Chatbot Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                    <Bot className="h-8 w-8 text-pink-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-200 flex items-center gap-3">
                      {chatbotData.name}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(chatbotData.projectstatus)}
                        <Badge className={`${getStatusColor(chatbotData.projectstatus)}`}>
                          {chatbotData.projectstatus}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      AI Chatbot with RAG capabilities • {chatbotData.planid.name} Plan
                    </CardDescription>
                  </div>
                </div>

                {chatbotData.projectstatus === 'live' && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.open(`${chatbotData.dburl}/dashboard`, '_blank');
                      }}
                      className="border-gray-600 hover:border-pink-500/50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open DB UI
                    </Button>
                    <Button
                      onClick={() => window.open(`http://${chatbotData.url}?url=http://${chatbotData.url}:5080`, '_blank')}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Chatbot
                    </Button>
                  </div>
                )}
              </div>

              {chatbotData.projecturl && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Chatbot URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-pink-400 bg-black/50 px-2 py-1 rounded text-sm flex-1">
                      https://{chatbotData.projecturl}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://${chatbotData.projecturl}`, '_blank')}
                      className="text-gray-400 hover:text-pink-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="knowledge" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <Database className="w-4 h-4 mr-2" />
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Test Chat
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <ChatbotStats chatbotData={chatbotData} />
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-6">
              <KnowledgeBaseManager 
                chatbotId={chatbotData._id}
                knowledgeBase={chatbotData.knowledgebase}
                onUpdate={fetchChatbotData}
              />
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <ChatInterface 
                chatbotUrl={`https://${chatbotData.projecturl}`}
                isLive={chatbotData.projectstatus === 'live'}
                url={chatbotData.url || 'localhost'}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <ChatbotSettings 
                chatbotData={chatbotData}
                onUpdate={fetchChatbotData}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Analytics Dashboard</CardTitle>
                    <CardDescription>
                      Detailed analytics and usage statistics for your chatbot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-200 mb-2">Analytics Coming Soon</h3>
                      <p className="text-gray-400">
                        Detailed usage analytics and conversation insights will be available here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatbotOverviewPage;