"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import {
  PlusCircle,
  MoreHorizontal,
  ExternalLink,
  Eye,
  BarChart2,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Globe,
  Loader2,
  Search,
  Grid3X3,
  List,
  Calendar,
  Activity,
  Database,
  Server,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

import { useAppSelector } from "@/lib/hook";
import Connect from "./Connect";
import NoProject from "./NoProject";

interface WebBuilderProject {
  _id: string;
  name: string;
  dbname: string;
  dbuser: string;
  webbuilder: string;
  projectstatus: string;
  type: string;
  planid: string;
  userid: string;
  startdate: string;
  updatedAt: string;
  projecturl?: string;
  billstatus?: string;
  visits?: number;
  lastActivity?: string;
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

const cardHover = {
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export default function WebBuilder() {
  const user = useAppSelector((state) => state.user.user);
  
  const [projects, setProjects] = useState<WebBuilderProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<WebBuilderProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasProjectsLoaded, setHasProjectsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const router = useRouter();

  const getWebBuilderProjects = async () => {
    if (!user) {
      console.log('No user found for web builder projects fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Fetching web builder projects for user:', user.email);
    
    try {
      // Using the same project API but filtering for webbuilder type
      const result = await fetch(`/api/project/crud?email=${user.email}&type=webbuilder`);
      const data = await result.json();
      
      console.log('Web Builder API Response:', data);
      
      if (data.success && data.projectdata) {
        // Filter for webbuilder projects
        const webBuilderProjects = data.projectdata.filter((project: any) => 
          project.type === 'webbuilder'
        );
        setProjects(webBuilderProjects);
        setFilteredProjects(webBuilderProjects);
        setHasProjectsLoaded(true);
        console.log('Web Builder projects loaded:', webBuilderProjects.length);
      } else {
        console.log('No web builder projects found:', data.message);
        setProjects([]);
        setFilteredProjects([]);
        setHasProjectsLoaded(true);
        if (data.message && !data.message.includes('No Projects found')) {
          toast.error(data.message);
        }
      }
    } catch (err) {
      console.error('Error fetching web builder projects:', err);
      toast.error('Error while fetching web builder projects');
      setProjects([]);
      setFilteredProjects([]);
      setHasProjectsLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      getWebBuilderProjects();
    }
  }, [user]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.webbuilder?.toLowerCase().includes(query) ||
        project.dbname?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.projectstatus === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return (a.projectstatus || "").localeCompare(b.projectstatus || "");
        case "webbuilder":
          return (a.webbuilder || "").localeCompare(b.webbuilder || "");
        case "recent":
        default:
          return new Date(b.updatedAt || b.startdate || 0).getTime() - 
                 new Date(a.updatedAt || a.startdate || 0).getTime();
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, sortBy]);

  const handleCreateProject = async () => {
    setLoading(true);

    toast.custom(() => (
      <div className="flex items-center space-x-2 bg-black border border-purple-500/30 rounded-lg p-4">
        <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
        <span className="text-purple-400 font-medium">Creating your web builder project...</span>
      </div>
    ));

    await router.push(`/project/createproject/webbuilder`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (id: string) => {
    if (!id) {
      toast.error('Project ID is missing');
      return;
    }
    
    try {
      const confirm = window.confirm('Are you sure you want to delete this web builder project?');
      if (!confirm) {
        return;
      }
      
      setLoading(true);
      const deleteproject = await fetch(`/api/project/crud`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const result = await deleteproject.json();
      setLoading(false);
      
      if (result.success) {
        toast.success(result.message);
        getWebBuilderProjects();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Error while deleting web builder project:', err);
      setLoading(false);
      toast.error('Error while deleting project');
    }
  };

  const handleOpenProject = (project: WebBuilderProject, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.projecturl) {
      window.open(`https://${project.projecturl}`, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'building':
        return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
      case 'creating':
        return <Clock className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'failed':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'building':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'creating':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getWebBuilderIcon = (builder: string) => {
    // You can expand this with actual icons for different web builders
    return <Globe className="w-4 h-4" />;
  };

  const getProjectStats = () => {
    const total = projects.length;
    const live = projects.filter(p => p.projectstatus === 'live').length;
    const building = projects.filter(p => p.projectstatus === 'building').length;
    const failed = projects.filter(p => p.projectstatus === 'failed').length;
    
    return { total, live, building, failed };
  };

  const stats = getProjectStats();

  if (!user?.connectgithub) {
    return <Connect />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      {hasProjectsLoaded && projects.length === 0 && !loading ? (
        <NoProject name="webbuilder" />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col"
        >
          <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header Section */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                      <Globe className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Web Builder
                      </h1>
                      <p className="text-gray-400 mt-1">
                        Create and manage websites with popular web builders
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleCreateProject}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-xl px-6 py-3 font-medium shadow-lg shadow-purple-500/25 transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          New Website
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Websites", value: stats.total, icon: Activity, color: "from-blue-400 to-cyan-400" },
                    { label: "Live", value: stats.live, icon: CheckCircle, color: "from-emerald-400 to-green-400" },
                    { label: "Building", value: stats.building, icon: RefreshCw, color: "from-amber-400 to-orange-400" },
                    { label: "Failed", value: stats.failed, icon: XCircle, color: "from-red-400 to-pink-400" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="relative overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 group transition-all duration-300 hover:border-purple-500/40">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <stat.icon className="w-5 h-5 text-gray-400" />
                            <div className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                              {stat.value}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Filters and Controls */}
              {projects.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search websites..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors w-full sm:w-64"
                        />
                      </div>

                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      >
                        <option value="all">All Status</option>
                        <option value="live">Live</option>
                        <option value="building">Building</option>
                        <option value="failed">Failed</option>
                        <option value="creating">Creating</option>
                      </select>

                      {/* Sort */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="name">Name</option>
                        <option value="status">Status</option>
                        <option value="webbuilder">Web Builder</option>
                      </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`${viewMode === "grid" ? "bg-purple-500 hover:bg-purple-600" : "hover:bg-gray-700"} transition-colors`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`${viewMode === "list" ? "bg-purple-500 hover:bg-purple-600" : "hover:bg-gray-700"} transition-colors`}
                      >
                        <List className="w-4 h-4" />
                      </Button>
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
                      className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"
                    />
                    <p className="text-gray-200 text-xl font-medium mb-2">Loading your websites</p>
                    <p className="text-gray-400">Please wait while we fetch your data...</p>
                  </div>
                </motion.div>
              )}

              {/* Projects Grid/List */}
              {!loading && filteredProjects.length > 0 && (
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
                        {filteredProjects.map((project, index) => (
                          <motion.div
                            key={project._id}
                            variants={itemVariants}
                            whileHover="hover"
                            custom={index}
                          >
                            <Card 
                              className="group relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer h-full"
                              onClick={() => router.push(`/project/overview?id=${project._id}&type=webbuilder`)}
                            >
                              <motion.div variants={cardHover}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <CardHeader className="relative">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                                        {getWebBuilderIcon(project.webbuilder || '')}
                                      </div>
                                      <div>
                                        <CardTitle className="text-lg font-semibold text-gray-200 group-hover:text-purple-300 transition-colors line-clamp-1">
                                          {project.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                          {getStatusIcon(project.projectstatus)}
                                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.projectstatus)}`}>
                                            {project.projectstatus}
                                          </span>
                                          {project.webbuilder && (
                                            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                              {project.webbuilder}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
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
                                      <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-purple-500/20">
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/project/overview?id=${project._id}&type=webbuilder`);
                                          }}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => handleOpenProject(project, e)}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <ExternalLink className="mr-2 h-4 w-4" />
                                          Visit Website
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <BarChart2 className="mr-2 h-4 w-4" />
                                          Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <Settings className="mr-2 h-4 w-4" />
                                          Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-purple-500/20" />
                                        <DropdownMenuItem 
                                          className="text-red-400 hover:bg-red-500/10"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProject(project._id);
                                          }}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </CardHeader>

                                <CardContent className="relative">
                                  {project.projecturl && (
                                    <CardDescription 
                                      className="flex items-center text-sm mb-4 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
                                      onClick={(e) => handleOpenProject(project, e)}
                                    >
                                      <ExternalLink className="mr-2 h-3 w-3" />
                                      <span className="truncate">{project.projecturl}</span>
                                    </CardDescription>
                                  )}

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <Database className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{project.dbname || 'No database'}</span>
                                      </div>
                                      {project.webbuilder && (
                                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                          {project.webbuilder}
                                        </Badge>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-blue-400" />
                                        <span className="text-gray-300">Visitors: {project.visits || 0}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4 text-green-400" />
                                        <span className="text-gray-300">Active</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50">
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          {project.updatedAt 
                                            ? new Date(project.updatedAt).toLocaleDateString("en-GB", { 
                                                day: "2-digit", 
                                                month: "short", 
                                                year: "numeric" 
                                              })
                                            : "Never updated"
                                          }
                                        </span>
                                      </div>
                                      {project.projectstatus === 'live' && (
                                        <div className="flex items-center space-x-1 text-emerald-400">
                                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                          <span>Online</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </motion.div>
                            </Card>
                          </motion.div>
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
                        {filteredProjects.map((project, index) => (
                          <motion.div
                            key={project._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, x: 4 }}
                            className="group relative overflow-hidden bg-gradient-to-r from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-6 cursor-pointer transition-all duration-300"
                            onClick={() => router.push(`/project/overview?id=${project._id}&type=webbuilder`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1 min-w-0">
                                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                                  {getWebBuilderIcon(project.webbuilder || '')}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-200 group-hover:text-purple-300 transition-colors truncate">
                                      {project.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(project.projectstatus)}
                                     <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.projectstatus)}`}>
                                        {project.projectstatus}
                                      </span>
                                      {project.webbuilder && (
                                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                          {project.webbuilder}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-6 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                      <Database className="h-4 w-4" />
                                      <span>{project.dbname || 'No database'}</span>
                                    </div>
                                    {project.webbuilder && (
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <span>{project.webbuilder}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {project.updatedAt 
                                          ? new Date(project.updatedAt).toLocaleDateString("en-GB", { 
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
                                    <Users className="h-4 w-4 text-blue-400" />
                                    <span className="text-gray-300">{project.visits || 0}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Server className="h-4 w-4 text-green-400" />
                                    <span className="text-gray-300">{project.billstatus || 'active'}</span>
                                  </div>
                                </div>

                                {/* URL Link */}
                                {project.projecturl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-purple-300 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`https://${project.projecturl}`, '_blank');
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
                                  <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-purple-500/20">
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/project/overview?id=${project._id}&type=webbuilder`);
                                      }}
                                      className="hover:bg-purple-500/10 hover:text-purple-300"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-purple-500/10 hover:text-purple-300"
                                    >
                                      <BarChart2 className="mr-2 h-4 w-4" />
                                      Analytics
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-purple-500/10 hover:text-purple-300"
                                    >
                                      <Settings className="mr-2 h-4 w-4" />
                                      Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-purple-500/20" />
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-purple-500/10 hover:text-purple-300"
                                    >
                                      <Play className="mr-2 h-4 w-4" />
                                      Deploy
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-purple-500/10 hover:text-purple-300"
                                    >
                                      <Pause className="mr-2 h-4 w-4" />
                                      Pause
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-purple-500/10 hover:text-purple-300"
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Restart
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-purple-500/20" />
                                    <DropdownMenuItem 
                                      className="text-red-400 hover:bg-red-500/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProject(project._id);
                                      }}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
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
              {!loading && hasProjectsLoaded && filteredProjects.length === 0 && projects.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20"
                >
                  <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 rounded-2xl p-12 max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl" />
                    <div className="relative">
                      <div className="text-6xl opacity-20 mb-6">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-200 mb-2">No websites found</h3>
                      <p className="text-gray-400 mb-6">
                        Try adjusting your search or filter criteria to find what you&apos;re looking for.
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions Section */}
              {projects.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={handleCreateProject}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/20 hover:to-blue-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                            <PlusCircle className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">New Website</div>
                            <div className="text-sm text-gray-400">Create a new web builder site</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => router.push('/project/templates?type=webbuilder')}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                            <Globe className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">Templates</div>
                            <div className="text-sm text-gray-400">Browse web builder templates</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => router.push('/docs/webbuilder')}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-green-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                            <Activity className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">Documentation</div>
                            <div className="text-sm text-gray-400">Learn web builder deployment</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer Info */}
              {projects.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="text-center text-gray-400 text-sm">
                    <p>
                      Showing {filteredProjects.length} of {projects.length} websites
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </main>
        </motion.div>
      )}
    </div>
  );
}