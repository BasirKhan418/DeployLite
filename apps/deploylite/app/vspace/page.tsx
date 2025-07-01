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
  Users,
  Settings,
  Shield,
  CloudLightning,
  Database,
  GitBranch,
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
  Brain,
  Rocket,
  Globe,
  Lock,
  Calendar,
  BarChart3,
  Layers,
  Server,
  Wifi,
} from "lucide-react";

// Workspace Interface
interface Workspace {
  id: string;
  name: string;
  template: string;
  status: "running" | "stopped" | "building" | "error";
  lastAccessed: string;
  cpu: number;
  memory: number;
  storage: number;
  ide: string;
  owner: string;
  team?: string;
  uptime: string;
  cost: number;
  aiAgents: number;
  environment: "development" | "staging" | "production";
  repository?: string;
  branch?: string;
  buildTime?: string;
}

// Mock data
const mockWorkspaces: Workspace[] = [
  {
    id: "ws-001",
    name: "e-commerce-api",
    template: "Node.js + PostgreSQL",
    status: "running",
    lastAccessed: "2 minutes ago",
    cpu: 45,
    memory: 60,
    storage: 25,
    ide: "VS Code",
    owner: "John Doe",
    team: "Backend Team",
    uptime: "2h 34m",
    cost: 0.45,
    aiAgents: 2,
    environment: "development",
    repository: "deploylite/e-commerce",
    branch: "feature/payment",
    buildTime: "3m 21s"
  },
  {
    id: "ws-002",
    name: "ai-dashboard",
    template: "Python + ML Stack",
    status: "running",
    lastAccessed: "15 minutes ago",
    cpu: 80,
    memory: 85,
    storage: 60,
    ide: "JetBrains",
    owner: "Sarah Wilson",
    team: "AI Team",
    uptime: "1h 12m",
    cost: 1.25,
    aiAgents: 5,
    environment: "development",
    repository: "deploylite/ai-models",
    branch: "main",
    buildTime: "8m 15s"
  },
  {
    id: "ws-003",
    name: "mobile-client",
    template: "React Native",
    status: "stopped",
    lastAccessed: "3 hours ago",
    cpu: 0,
    memory: 0,
    storage: 15,
    ide: "VS Code",
    owner: "Mike Chen",
    team: "Mobile Team",
    uptime: "0m",
    cost: 0.00,
    aiAgents: 1,
    environment: "development",
    repository: "deploylite/mobile-app",
    branch: "develop"
  },
  {
    id: "ws-004",
    name: "data-pipeline",
    template: "Apache Spark",
    status: "building",
    lastAccessed: "5 minutes ago",
    cpu: 25,
    memory: 40,
    storage: 80,
    ide: "Jupyter",
    owner: "Alex Rodriguez",
    team: "Data Team",
    uptime: "0m",
    cost: 0.15,
    aiAgents: 0,
    environment: "staging",
    repository: "deploylite/data-pipeline",
    branch: "feature/optimization"
  }
];

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
const StatusBadge: React.FC<{ status: Workspace["status"] }> = ({ status }) => {
  const statusConfig = {
    running: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
    stopped: { color: "bg-gray-500/10 text-gray-400 border-gray-500/30", icon: Square },
    building: { color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: Loader2 },
    error: { color: "bg-red-500/10 text-red-400 border-red-500/30", icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${config.color}`}>
      <Icon className={`w-3 h-3 ${status === "building" ? "animate-spin" : ""}`} />
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

const QuickStats: React.FC = () => {
  const stats = [
    { label: "Active Workspaces", value: "12", change: "+3", icon: Activity, color: "text-emerald-400" },
    { label: "Total Users", value: "48", change: "+5", icon: Users, color: "text-blue-400" },
    { label: "Monthly Cost", value: "$1,247", change: "-12%", icon: TrendingUp, color: "text-purple-400" },
    { label: "AI Agents", value: "23", change: "+8", icon: Brain, color: "text-pink-400" },
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
                <div className={`text-xs px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.change}
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

const WorkspaceCard: React.FC<{ workspace: Workspace; onAction: (action: string, workspace: Workspace) => void }> = ({ 
  workspace, 
  onAction 
}) => {
  const getIdeIcon = (ide: string) => {
    switch (ide.toLowerCase()) {
      case "vs code": return Code;
      case "jetbrains": return Terminal;
      case "jupyter": return Database;
      default: return Monitor;
    }
  };

  const IdeIcon = getIdeIcon(workspace.ide);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 rounded-xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
              <IdeIcon className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-pink-300 transition-colors">
                {workspace.name}
              </h3>
              <p className="text-sm text-gray-400">{workspace.template}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={workspace.status} />
            <button
              onClick={() => onAction("menu", workspace)}
              className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Environment & Repository */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Layers className="w-4 h-4" />
            <span className="capitalize">{workspace.environment}</span>
          </div>
          {workspace.repository && (
            <div className="flex items-center gap-2 text-gray-400">
              <GitBranch className="w-4 h-4" />
              <span className="truncate max-w-32">{workspace.branch}</span>
            </div>
          )}
        </div>

        {/* Resource Usage */}
        <div className="space-y-3 mb-4">
          <ResourceBar value={workspace.cpu} label="CPU" color="bg-pink-500" />
          <ResourceBar value={workspace.memory} label="Memory" color="bg-purple-500" />
          <ResourceBar value={workspace.storage} label="Storage" color="bg-blue-500" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{workspace.uptime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">{workspace.aiAgents} agents</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Users className="w-3 h-3" />
            <span>{workspace.owner}</span>
            {workspace.team && <span>• {workspace.team}</span>}
          </div>
          <div className="text-xs text-gray-400">
            ${workspace.cost.toFixed(2)}/hr
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          {workspace.status === "running" ? (
            <>
              <button
                onClick={() => onAction("access", workspace)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Access IDE
              </button>
              <button
                onClick={() => onAction("pause", workspace)}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
            </>
          ) : workspace.status === "stopped" ? (
            <button
              onClick={() => onAction("start", workspace)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Workspace
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-700/30 text-gray-500 text-sm py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {workspace.status === "building" ? "Building..." : "Processing..."}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CreateWorkspaceButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
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
        <h3 className="text-lg font-semibold mb-2">Create New Workspace</h3>
        <p className="text-sm text-gray-500">Choose from our templates or bring your own</p>
      </div>
    </button>
  </motion.div>
);

export default function VirtualSpace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || workspace.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleWorkspaceAction = (action: string, workspace: Workspace) => {
    console.log(`Action: ${action} on workspace:`, workspace.name);
    // Implement actual actions here
    switch (action) {
      case "start":
        setWorkspaces(prev => prev.map(w => 
          w.id === workspace.id ? { ...w, status: "building" } : w
        ));
        // Simulate build process
        setTimeout(() => {
          setWorkspaces(prev => prev.map(w => 
            w.id === workspace.id ? { ...w, status: "running", uptime: "0m" } : w
          ));
        }, 3000);
        break;
      case "pause":
        setWorkspaces(prev => prev.map(w => 
          w.id === workspace.id ? { ...w, status: "stopped", uptime: "0m", cpu: 0, memory: 0 } : w
        ));
        break;
      case "access":
        // Open IDE in new tab/window
        window.open(`/ai/workspace/${workspace.id}/ide`, "_blank");
        break;
      default:
        break;
    }
  };

  const handleCreateWorkspace = () => {
    console.log("Create new workspace");
    // Navigate to workspace creation flow
    window.location.href = "/ai/configure";
  };

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
                    Cloud development environments powered by infrastructure-as-code
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCreateWorkspace}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-xl px-6 py-3 font-medium shadow-lg shadow-pink-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Workspace
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Filters and Controls */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
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
                  <option value="running">Running</option>
                  <option value="stopped">Stopped</option>
                  <option value="building">Building</option>
                  <option value="error">Error</option>
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

          {/* Workspaces Grid */}
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
                  <CreateWorkspaceButton onClick={handleCreateWorkspace} />
                  {filteredWorkspaces.map((workspace) => (
                    <WorkspaceCard
                      key={workspace.id}
                      workspace={workspace}
                      onAction={handleWorkspaceAction}
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
                  {/* List view would go here - implement as needed */}
                  <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-6 text-center">
                    <p className="text-gray-400">List view coming soon...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.location.href = "/ai/templates"}
                  className="justify-start h-auto p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-500/40 hover:from-pink-500/20 hover:to-purple-500/20 text-left transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                      <Rocket className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">Browse Templates</div>
                      <div className="text-sm text-gray-400">Start with pre-configured environments</div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = "/ai/monitor"}
                  className="justify-start h-auto p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20 text-left transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                      <Brain className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">AI Agents</div>
                      <div className="text-sm text-gray-400">Deploy coding assistants</div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = "/ai/monitor"}
                  className="justify-start h-auto p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-green-500/20 text-left transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">Analytics</div>
                      <div className="text-sm text-gray-400">Monitor usage and costs</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}