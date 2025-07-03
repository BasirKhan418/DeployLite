"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CloudLightning,
  ExternalLink,
  Terminal,
  Settings,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Clock,
  Calendar,
  Server,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Activity,
  Code,
  Monitor,
  Globe,
  Shield,
  Zap,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VirtualSpaceProject {
  _id: string;
  name: string;
  projectstatus: string;
  startdate: string;
  updatedAt: string;
  projecturl?: string;
  url?: string;
  billstatus?: string;
  cpuusage: string;
  memoryusage: string;
  storageusage: string;
  arn?: string;
  planid: {
    name: string;
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
    pricephour: string;
    pricepmonth: string;
    features: string[];
  };
}

interface VirtualSpaceOverviewProps {
  projectdata: VirtualSpaceProject;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'live':
        return { color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", icon: CheckCircle };
      case 'failed':
        return { color: "bg-red-500/10 border-red-500/30 text-red-400", icon: XCircle };
      case 'deploying':
        return { color: "bg-amber-500/10 border-amber-500/30 text-amber-400", icon: Loader2 };
      case 'creating':
        return { color: "bg-purple-500/10 border-purple-500/30 text-purple-400", icon: Clock };
      default:
        return { color: "bg-gray-500/10 border-gray-500/30 text-gray-400", icon: AlertCircle };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${config.color}`}>
      <Icon className={`w-4 h-4 ${status === "deploying" ? "animate-spin" : ""}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

const ResourceUsageCard: React.FC<{ 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string;
  maxValue?: number;
}> = ({ title, value, icon, color, maxValue = 100 }) => {
  const numValue = parseInt(value) || 0;
  const percentage = Math.min((numValue / maxValue) * 100, 100);

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-gray-400">{title}</span>
          </div>
          <span className="text-lg font-bold text-gray-100">{numValue}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const VirtualSpaceOverview: React.FC<VirtualSpaceOverviewProps> = ({ projectdata }) => {
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!projectdata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-pink-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading virtual space details...</p>
        </div>
      </div>
    );
  }

  const handleAccessIDE = () => {
    if (projectdata.url) {
      window.open(`http://${projectdata.url}`, '_blank', 'noopener,noreferrer');
    } else if (projectdata.url) {
      window.open(`https://${projectdata.url}`, '_blank', 'noopener,noreferrer');
    } else {
      toast.error("Virtual space is not yet accessible");
    }
  };

  const handleCopyUrl = () => {
    const url = projectdata.url ? `http://${projectdata.url}` : 
                 projectdata.url ? `https://${projectdata.url}` : '';
    if (url) {
      navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } else {
      toast.error("No URL available to copy");
    }
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${projectdata.name}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch('/api/project/virtualspace', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: projectdata._id }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Virtual space deleted successfully');
        router.push('/project/virtualspace');
      } else {
        toast.error(result.message || 'Failed to delete virtual space');
      }
    } catch (error) {
      console.error('Error deleting virtual space:', error);
      toast.error('An error occurred while deleting the virtual space');
    } finally {
      setLoading(false);
    }
  };

  const getUptime = () => {
    const start = new Date(projectdata.startdate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHourlyRate = (planName: string) => {
    const rates = {
      "Starter": 5,
      "Pro": 10,
      "Enterprise": 20
    };
    return rates[planName as keyof typeof rates] || 5;
  };

  const hourlyRate = projectdata.planid?.pricephour ? 
    parseFloat(projectdata.planid.pricephour) : 
    getHourlyRate(projectdata.planid?.name || "Starter");
  const estimatedMonthlyCost = hourlyRate * 24 * 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                <CloudLightning className="h-8 w-8 text-pink-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {projectdata.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={projectdata.projectstatus} />
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
                    Virtual Space
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {projectdata.projectstatus === 'live' && (
                <>
                  <Button
                    onClick={handleAccessIDE}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-xl px-6 py-3 font-medium shadow-lg shadow-pink-500/25 transition-all duration-300"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Access IDE
                  </Button>
                  <Button
                    onClick={handleCopyUrl}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy URL
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Card */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-pink-400" />
                    Virtual Space Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Access Information */}
                  {(projectdata.url || projectdata.url) && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-blue-400" />
                          <div>
                            <h4 className="text-blue-400 font-medium">IDE Access</h4>
                            <p className="text-blue-300/80 text-sm">
                              {projectdata.url ? `http://${projectdata.url}` : `https://${projectdata.url}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleAccessIDE}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gray-400 text-sm mb-2">Created</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-200">
                          {new Date(projectdata.startdate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm mb-2">Uptime</h4>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-200">{getUptime()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Resource Usage */}
                  <div>
                    <h4 className="text-gray-200 font-medium mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Resource Usage
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ResourceUsageCard
                        title="CPU"
                        value={projectdata.cpuusage}
                        icon={<Cpu className="w-4 h-4 text-pink-400" />}
                        color="bg-pink-500"
                      />
                      <ResourceUsageCard
                        title="Memory"
                        value={projectdata.memoryusage}
                        icon={<MemoryStick className="w-4 h-4 text-purple-400" />}
                        color="bg-purple-500"
                      />
                      <ResourceUsageCard
                        title="Storage"
                        value={projectdata.storageusage}
                        icon={<HardDrive className="w-4 h-4 text-blue-400" />}
                        color="bg-blue-500"
                      />
                    </div>
                  </div>

                  {/* Advanced Information */}
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-gray-400 hover:text-gray-300 p-0 h-auto"
                    >
                      <div className="flex items-center gap-2">
                        {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showAdvanced ? 'Hide' : 'Show'} Advanced Information
                      </div>
                    </Button>
                    
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Project ID:</span>
                            <code className="block bg-gray-800/50 p-2 rounded text-gray-300 mt-1 font-mono text-xs">
                              {projectdata._id}
                            </code>
                          </div>
                          {projectdata.arn && (
                            <div>
                              <span className="text-gray-400">Task ARN:</span>
                              <code className="block bg-gray-800/50 p-2 rounded text-gray-300 mt-1 font-mono text-xs truncate">
                                {projectdata.arn}
                              </code>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-pink-400" />
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectdata.projectstatus === 'live' ? (
                      <>
                        <Button
                          variant="outline"
                          className="justify-start h-auto p-4 border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <Pause className="w-4 h-4" />
                            <div className="text-left">
                              <div className="font-medium">Pause Virtual Space</div>
                              <div className="text-sm text-gray-400">Temporarily stop the environment</div>
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start h-auto p-4 border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <RefreshCw className="w-4 h-4" />
                            <div className="text-left">
                              <div className="font-medium">Restart</div>
                              <div className="text-sm text-gray-400">Restart the virtual space</div>
                            </div>
                          </div>
                        </Button>
                      </>
                    ) : projectdata.projectstatus === 'failed' ? (
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-4 border-amber-600 text-amber-300 hover:bg-amber-800/20"
                      >
                        <div className="flex items-center gap-3">
                          <Play className="w-4 h-4" />
                          <div className="text-left">
                            <div className="font-medium">Retry Deployment</div>
                            <div className="text-sm text-gray-400">Try deploying again</div>
                          </div>
                        </div>
                      </Button>
                    ) : (
                      <div className="text-gray-400 text-sm p-4 border border-gray-700 rounded-lg">
                        Actions will be available once the virtual space is live.
                      </div>
                    )}
                  </div>

                  <Separator className="my-6 bg-gray-700" />

                  {/* Danger Zone */}
                  <div className="space-y-4">
                    <h4 className="text-red-400 font-medium">Danger Zone</h4>
                    <Button
                      onClick={handleDeleteProject}
                      disabled={loading}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <div className="flex items-center gap-3">
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <div className="text-left">
                          <div className="font-medium">Delete Virtual Space</div>
                          <div className="text-sm text-red-400/70">
                            Permanently delete this virtual space and all its data
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Plan Information */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Plan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400 mb-2">
                      {projectdata.planid?.name || "Unknown Plan"}
                    </div>
                    <div className="text-2xl font-bold text-gray-100">
                      ₹{hourlyRate}
                      <span className="text-base font-normal text-gray-400">/hour</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      ~₹{(hourlyRate * 24 * 30).toFixed(0)}/month
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">CPU:</span>
                      <span className="text-gray-200">{projectdata.planid?.cpu || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">RAM:</span>
                      <span className="text-gray-200">{projectdata.planid?.ram || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Storage:</span>
                      <span className="text-gray-200">{projectdata.planid?.storage || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Bandwidth:</span>
                      <span className="text-gray-200">{projectdata.planid?.bandwidth || "N/A"}</span>
                    </div>
                  </div>

                  {projectdata.planid?.features && projectdata.planid.features.length > 0 && (
                    <>
                      <Separator className="bg-gray-700" />
                      <div>
                        <h4 className="text-gray-200 font-medium mb-2">Features</h4>
                        <div className="space-y-1">
                          {projectdata.planid.features.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                          {projectdata.planid.features.length > 4 && (
                            <div className="text-xs text-gray-400">
                              +{projectdata.planid.features.length - 4} more features
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Cost Estimation */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Cost Estimation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Hourly Rate:</span>
                      <span className="text-gray-200">₹{hourlyRate.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Daily (24h):</span>
                      <span className="text-gray-200">₹{(hourlyRate * 24).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Weekly:</span>
                      <span className="text-gray-200">₹{(hourlyRate * 24 * 7).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                      <span className="text-gray-200 font-medium">Monthly (est.):</span>
                      <span className="text-green-400 font-bold">₹{estimatedMonthlyCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-400 text-sm font-medium">Cost Optimization</p>
                        <p className="text-amber-300/80 text-xs mt-1">
                          Pause your virtual space when not in use to save costs.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Access */}
              <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Security & Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Access Type:</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        Password Protected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">IDE Type:</span>
                      <span className="text-gray-200">VS Code (Web)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Terminal:</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Full Access
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-400 text-sm font-medium">Secure Environment</p>
                        <p className="text-blue-300/80 text-xs mt-1">
                          Your virtual space is isolated and secure with encrypted connections.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VirtualSpaceOverview;