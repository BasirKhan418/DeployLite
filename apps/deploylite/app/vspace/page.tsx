"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Monitor,
  Terminal,
  Code,
  Play,
  Pause,
  Square,
  MoreHorizontal,
  Cpu,
  HardDrive,
  Zap,
  Clock,
  Settings,
  CloudLightning,
  Activity,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Sparkles,
  Calendar,
  BarChart3,
  Server,
  Globe,
  MemoryStick,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hook";
import Connect from "@/utils/Project/Connect";
import NoProject from "@/utils/Project/NoProject";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Virtual Space Interface based on the actual model
interface VirtualSpace {
  _id: string;
  name: string;
  projectstatus: "creating" | "live" | "failed" | "deploying";
  startdate: string;
  updatedAt: string;
  url?: string;
  projecturl?: string;
  cpuusage: string;
  memoryusage: string;
  storageusage: string;
  billstatus: string;
  arn?: string;
  userid: string;
  planid: {
    name: string;
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
    pricephour: string;
    pricepmonth: string;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

// Utility Components
const StatusBadge: React.FC<{ status: VirtualSpace["projectstatus"] }> = ({ status }) => {
  const statusConfig = {
    live: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
    creating: { color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: Clock },
    deploying: { color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: Loader2 },
    failed: { color: "bg-red-500/10 text-red-400 border-red-500/30", icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${config.color}`}>
      <Icon className={`w-3 h-3 ${status === "deploying" ? "animate-spin" : ""}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

const ResourceBar: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-300">{value}%</span>
    </div>
    <div className="w-full bg-gray-700/50 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const QuickStats: React.FC<{ spaces: VirtualSpace[] }> = ({ spaces }) => {
  const activeSpaces = spaces.filter(s => s.projectstatus === 'live').length;
  const totalCost = spaces.reduce((sum, space) => sum + parseFloat(space.planid?.pricephour || '0'), 0);
  
  const stats = [
    { label: "Active Spaces", value: activeSpaces.toString(), change: "", icon: Activity, color: "text-emerald-400" },
    { label: "Total Spaces", value: spaces.length.toString(), change: "", icon: CloudLightning, color: "text-blue-400" },
    { label: "Hourly Cost", value: `₹${totalCost.toFixed(2)}`, change: "", icon: TrendingUp, color: "text-purple-400" },
    { label: "This Month", value: `₹${(totalCost * 24 * 30).toFixed(0)}`, change: "", icon: BarChart3, color: "text-pink-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative overflow-hidden"
        >
          <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-xl p-6 group transition-all duration-300 hover:border-pink-500/40">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const VirtualSpaceCard: React.FC<{ 
  workspace: VirtualSpace; 
  onAction: (action: string, workspace: VirtualSpace) => void;
  onCardClick: (workspace: VirtualSpace) => void;
}> = ({ workspace, onAction, onCardClick }) => {
  
  const getUptime = (startdate: string) => {
    const start = new Date(startdate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger card click if not clicking on buttons or dropdown
    if (
      !(e.target as HTMLElement).closest('button') &&
      !(e.target as HTMLElement).closest('[role="menuitem"]')
    ) {
      onCardClick(workspace);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 rounded-xl transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
              <Terminal className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-pink-300 transition-colors">
                {workspace.name}
              </h3>
              <p className="text-sm text-gray-400">Virtual Development Space</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={workspace.projectstatus} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardClick(workspace);
                  }}
                  className="hover:bg-pink-500/10 hover:text-pink-300"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {workspace.projectstatus === 'live' && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction("access", workspace);
                    }}
                    className="hover:bg-pink-500/10 hover:text-pink-300"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Access IDE
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction("settings", workspace);
                  }}
                  className="hover:bg-pink-500/10 hover:text-pink-300"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-pink-500/20" />
                {workspace.projectstatus === 'live' && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction("pause", workspace);
                    }}
                    className="hover:bg-amber-500/10 hover:text-amber-300"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </DropdownMenuItem>
                )}
                {workspace.projectstatus === 'failed' && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction("retry", workspace);
                    }}
                    className="hover:bg-amber-500/10 hover:text-amber-300"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Retry Deploy
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-pink-500/20" />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction("delete", workspace);
                  }}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="space-y-3 mb-4">
          <ResourceBar 
            value={parseInt(workspace.cpuusage) || 0} 
            label="CPU" 
            color="bg-pink-500" 
          />
          <ResourceBar 
            value={parseInt(workspace.memoryusage) || 0} 
            label="Memory" 
            color="bg-purple-500" 
          />
          <ResourceBar 
            value={parseInt(workspace.storageusage) || 0} 
            label="Storage" 
            color="bg-blue-500" 
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{getUptime(workspace.startdate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">{workspace.planid?.cpu || "N/A"}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-400">
            {workspace.planid?.name || "No plan"}
          </div>
          <div className="text-xs text-gray-400">
            ₹{workspace.planid?.pricephour || "0"}/hr
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          {workspace.projectstatus === "live" ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("access", workspace);
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Access IDE
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("pause", workspace);
                }}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
            </>
          ) : workspace.projectstatus === "creating" || workspace.projectstatus === "deploying" ? (
            <button
              disabled
              className="flex-1 bg-gray-700/30 text-gray-500 text-sm py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {workspace.projectstatus === "creating" ? "Creating..." : "Deploying..."}
            </button>
          ) : workspace.projectstatus === "failed" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction("retry", workspace);
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Retry Deploy
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction("start", workspace);
              }}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Space
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CreateVirtualSpaceButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -4 }}
    className="group relative overflow-hidden"
  >
    <button
      onClick={onClick}
      className="w-full h-full min-h-[400px] bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border-2 border-dashed border-pink-500/30 hover:border-pink-500/60 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-pink-300"
    >
      <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full">
        <Plus className="w-8 h-8" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Create Virtual Space</h3>
        <p className="text-sm text-gray-500">Set up your cloud development environment</p>
      </div>
    </button>
  </motion.div>
);

export default function VirtualSpace() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  
  const [virtualSpaces, setVirtualSpaces] = useState<VirtualSpace[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [hasProjectsLoaded, setHasProjectsLoaded] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch virtual spaces
  const fetchVirtualSpaces = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/project/virtualspace');
      const data = await response.json();
      
      if (data.success && data.projectdata) {
        setVirtualSpaces(data.projectdata);
        setHasProjectsLoaded(true);
      } else {
        console.log('No virtual spaces found:', data.message);
        setVirtualSpaces([]);
        setHasProjectsLoaded(true);
        if (data.message && !data.message.includes('No Projects found')) {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching virtual spaces:', error);
      toast.error('Failed to fetch virtual spaces');
      setVirtualSpaces([]);
      setHasProjectsLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchVirtualSpaces();
    }
  }, [user]);

  const filteredSpaces = virtualSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || space.projectstatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVirtualSpaceAction = async (action: string, workspace: VirtualSpace) => {
    console.log(`Action: ${action} on virtual space:`, workspace.name);
    
    switch (action) {
      case "access":
        if (workspace.url) {
          window.open(`http://${workspace.url}`, "_blank");
        } else if (workspace.projecturl) {
          window.open(`https://${workspace.projecturl}`, "_blank");
        } else {
          toast.error("Virtual space URL not available");
        }
        break;
      case "pause":
        toast.info("Pause functionality coming soon");
        break;
      case "start":
        toast.info("Start functionality coming soon");
        break;
      case "retry":
        toast.info("Retry functionality coming soon");
        break;
      case "settings":
        toast.info("Settings functionality coming soon");
        break;
      case "delete":
        await handleDeleteVirtualSpace(workspace._id, workspace.name);
        break;
      default:
        break;
    }
  };

  const handleCardClick = (workspace: VirtualSpace) => {
    // Navigate to overview page
    router.push(`/project/overview?id=${workspace._id}&type=virtualspace`);
  };

  const handleCreateVirtualSpace = () => {
    router.push("/project/createproject/virtualspace");
  };

  const handleDeleteVirtualSpace = async (id: string, name: string) => {
    if (!id) {
      toast.error('Virtual space ID is missing');
      return;
    }
    
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?\n\nThis action cannot be undone and will permanently delete the virtual space and all its data.`
    );
    
    if (!confirmDelete) {
      return;
    }
    
    try {
      setDeleteLoading(id);
      
      // Show loading toast
      const loadingToast = toast.loading('Deleting virtual space...');
      
      const response = await fetch(`/api/project/virtualspace`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      
      const result = await response.json();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success(`Virtual space "${name}" deleted successfully`);
        // Refresh the list
        fetchVirtualSpaces();
      } else {
        toast.error(result.message || 'Failed to delete virtual space');
      }
    } catch (err) {
      console.error('Error while deleting virtual space:', err);
      toast.error('Error while deleting virtual space');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Check if user is authenticated and has GitHub connected
  if (!user?.connectgithub) {
    return <Connect />;
  }

  // Show NoProject component if no virtual spaces and not loading
  if (hasProjectsLoaded && virtualSpaces.length === 0 && !loading) {
    return <NoProject name="virtualspace" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                  <CloudLightning className="h-8 w-8 text-pink-400" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Virtual Space
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Cloud development environments powered by containerized infrastructure
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleCreateVirtualSpace}
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-xl px-6 py-3 font-medium shadow-lg shadow-pink-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  New Virtual Space
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          {virtualSpaces.length > 0 && (
            <QuickStats spaces={virtualSpaces} />
          )}

          {/* Filters and Controls */}
          {virtualSpaces.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search virtual spaces..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 transition-colors w-full sm:w-64"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="live">Live</option>
                    <option value="creating">Creating</option>
                    <option value="deploying">Deploying</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-6"
                />
                <p className="text-gray-200 text-xl font-medium mb-2">Loading virtual spaces</p>
                <p className="text-gray-400">Please wait while we fetch your data...</p>
              </div>
            </motion.div>
          )}

          {/* Virtual Spaces Grid */}
          {!loading && (
            <motion.div variants={itemVariants}>
              <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <CreateVirtualSpaceButton onClick={handleCreateVirtualSpace} />
                    {filteredSpaces.map((workspace) => (
                      <VirtualSpaceCard
                        key={workspace._id}
                        workspace={workspace}
                        onAction={handleVirtualSpaceAction}
                        onCardClick={handleCardClick}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Create Button for List View */}
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="group relative overflow-hidden bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border-2 border-dashed border-pink-500/30 hover:border-pink-500/60 rounded-xl p-6 cursor-pointer transition-all duration-300"
                      onClick={handleCreateVirtualSpace}
                    >
                      <div className="relative flex items-center justify-center gap-4 text-gray-400 hover:text-pink-300 transition-colors">
                        <div className="p-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg">
                          <Plus className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Create Virtual Space</h3>
                          <p className="text-sm text-gray-500">Set up your cloud development environment</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Virtual Space List Items */}
                    {filteredSpaces.map((workspace) => (
                      <motion.div
                        key={workspace._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="group relative overflow-hidden bg-gradient-to-r from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 rounded-xl p-6 cursor-pointer transition-all duration-300"
                        onClick={() => handleCardClick(workspace)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                              <Terminal className="w-6 h-6 text-pink-400" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-200 group-hover:text-pink-300 transition-colors truncate">
                                  {workspace.name}
                                </h3>
                                <StatusBadge status={workspace.projectstatus} />
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                  <CloudLightning className="h-4 w-4" />
                                  <span>Development Environment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {workspace.updatedAt 
                                      ? new Date(workspace.updatedAt).toLocaleDateString("en-GB", { 
                                          day: "2-digit", 
                                          month: "short", 
                                          year: "numeric" 
                                        })
                                      : "Never updated"
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            {/* Metrics */}
                            <div className="hidden md:flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Cpu className="h-4 w-4 text-pink-400" />
                                <span className="text-gray-300">{workspace.cpuusage || "0"}%</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MemoryStick className="h-4 w-4 text-purple-400" />
                                <span className="text-gray-300">{workspace.memoryusage || "0"}%</span>
                              </div>
                            </div>

                            {/* Access Button */}
                            {workspace.projectstatus === 'live' && (workspace.url || workspace.projecturl) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-pink-300 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVirtualSpaceAction("access", workspace);
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Actions Menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(workspace);
                                  }}
                                  className="hover:bg-pink-500/10 hover:text-pink-300"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {workspace.projectstatus === 'live' && (
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVirtualSpaceAction("access", workspace);
                                    }}
                                    className="hover:bg-pink-500/10 hover:text-pink-300"
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Access IDE
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVirtualSpaceAction("settings", workspace);
                                  }}
                                  className="hover:bg-pink-500/10 hover:text-pink-300"
                                >
                                  <Settings className="mr-2 h-4 w-4" />
                                  Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-pink-500/20" />
                                {workspace.projectstatus === 'live' && (
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVirtualSpaceAction("pause", workspace);
                                    }}
                                    className="hover:bg-amber-500/10 hover:text-amber-300"
                                  >
                                    <Pause className="mr-2 h-4 w-4" />
                                    Pause
                                  </DropdownMenuItem>
                                )}
                                {workspace.projectstatus === 'failed' && (
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVirtualSpaceAction("retry", workspace);
                                    }}
                                    className="hover:bg-amber-500/10 hover:text-amber-300"
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    Retry Deploy
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-pink-500/20" />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVirtualSpaceAction("delete", workspace);
                                  }}
                                  className="text-red-400 hover:bg-red-500/10"
                                  disabled={deleteLoading === workspace._id}
                                >
                                  {deleteLoading === workspace._id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* No Results State */}
          {!loading && hasProjectsLoaded && filteredSpaces.length === 0 && virtualSpaces.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-20"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-12 max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl" />
                <div className="relative">
                  <div className="text-6xl opacity-20 mb-6">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">No virtual spaces found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search or filter criteria to find what you&apos;re looking for.
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          {virtualSpaces.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={handleCreateVirtualSpace}
                    className="justify-start h-auto p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-500/40 hover:from-pink-500/20 hover:to-purple-500/20 text-left transition-all duration-300 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                        <Plus className="w-4 h-4 text-pink-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">New Virtual Space</div>
                        <div className="text-sm text-gray-400">Create development environment</div>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/docs/virtualspace')}
                    className="justify-start h-auto p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20 text-left transition-all duration-300 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                        <Monitor className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">Documentation</div>
                        <div className="text-sm text-gray-400">Learn about virtual spaces</div>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/project/virtualspace')}
                    className="justify-start h-auto p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-green-500/20 text-left transition-all duration-300 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">Management</div>
                        <div className="text-sm text-gray-400">Manage virtual spaces</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          {virtualSpaces.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="text-center text-gray-400 text-sm">
                <p>
                  Showing {filteredSpaces.length} of {virtualSpaces.length} virtual spaces
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}