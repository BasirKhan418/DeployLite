"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  GitBranch,
  ExternalLink,
  Cpu,
  HardDrive,
  Eye,
  BarChart2,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  CloudUpload,
  Loader2,
  Search,
  Grid3X3,
  List,
  Calendar,
  Activity,
  Code,
  Database,
  Globe,
  Server,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";

import { useAppSelector } from "@/lib/hook";
import Connect from "./Connect";
import NoProject from "./NoProject";

interface Project {
  projecturl: any;
  id?: number;
  _id?: string;
  name: string;
  url?: string;
  lastDeployment?: string;
  branch?: string;
  repobranch?: string;
  status?: string;
  projectstatus?: string;
  cpu?: number;
  memory?: number;
  logo?: string;
  updatedAt?: string;
  techused?: string;
  type?: 'frontend' | 'backend' | 'fullstack'; 
  startdate?: string;
  repourl?: string;
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

const Projecthome = ({ name }: { name: string }) => {
  const user = useAppSelector((state) => state.user.user);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasProjectsLoaded, setHasProjectsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const router = useRouter();

  const getDetails = async () => {
    if (!user) {
      console.log('No user found for project fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Fetching project details for user:', user.email);
    
    try {
      const result = await fetch(`/api/project/crud?email=${user.email}`);
      const data = await result.json();
      
      console.log('Project API Response:', data);
      
      if (data.success && data.projectdata) {
        setProjects(data.projectdata);
        setFilteredProjects(data.projectdata);
        setHasProjectsLoaded(true);
        console.log('Projects loaded successfully:', data.projectdata.length);
      } else {
        console.log('No projects found or API error:', data.message);
        setProjects([]);
        setFilteredProjects([]);
        setHasProjectsLoaded(true);
        if (data.message && !data.message.includes('No Projects found')) {
          toast.error(data.message);
        }
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
      toast.error('Error while fetching data');
      setProjects([]);
      setFilteredProjects([]);
      setHasProjectsLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      getDetails();
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
        project.techused?.toLowerCase().includes(query) ||
        project.type?.toLowerCase().includes(query) ||
        project.repobranch?.toLowerCase().includes(query)
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
        case "type":
          return (a.type || "").localeCompare(b.type || "");
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
      <div className="flex items-center space-x-2 bg-black border border-pink-500/30 rounded-lg p-4">
        <Loader2 className="h-4 w-4 animate-spin text-pink-400" />
        <span className="text-pink-400 font-medium">Creating your project...</span>
      </div>
    ));

    await router.push(`/project/createproject/${name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (id: number | string | undefined) => {
    if (!id) {
      toast.error('Project ID is missing');
      return;
    }
    
    try {
      const confirm = window.confirm('Are you sure you want to delete this project?');
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
        getDetails();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Error while deleting project:', err);
      setLoading(false);
      toast.error('Error while deleting project');
    }
  };

  const handleOpenProject = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.name) {
      const url = `https://${project.name}.cloud.deploylite.tech`;
      window.open(url, '_blank', 'noopener,noreferrer');
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
        return <Clock className="w-4 h-4 text-pink-400" />;
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
        return 'bg-pink-500/10 border-pink-500/30 text-pink-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getTechIcon = (tech: string) => {
    const techLower = tech?.toLowerCase() || '';
    if (techLower.includes('react') || techLower.includes('next')) return <Code className="w-4 h-4" />;
    if (techLower.includes('vue') || techLower.includes('angular')) return <Code className="w-4 h-4" />;
    if (techLower.includes('node') || techLower.includes('express')) return <Server className="w-4 h-4" />;
    if (techLower.includes('python') || techLower.includes('django')) return <Server className="w-4 h-4" />;
    if (techLower.includes('database') || techLower.includes('sql')) return <Database className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Helper function to determine if project should show CPU/RAM
  const shouldShowPerformanceMetrics = (project: Project) => {
    return project.type === 'backend' || project.type === 'fullstack';
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
        <NoProject name={name} />
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
                    <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                      <CloudUpload className="h-8 w-8 text-pink-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        App Platform
                      </h1>
                      <p className="text-gray-400 mt-1">
                        Deploy and manage your applications with ease
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleCreateProject}
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-xl px-6 py-3 font-medium shadow-lg shadow-pink-500/25 transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          New Project
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
                    { label: "Total Projects", value: stats.total, icon: Activity, color: "from-blue-400 to-cyan-400" },
                    { label: "Live", value: stats.live, icon: CheckCircle, color: "from-emerald-400 to-green-400" },
                    { label: "Building", value: stats.building, icon: Zap, color: "from-amber-400 to-orange-400" },
                    { label: "Failed", value: stats.failed, icon: XCircle, color: "from-red-400 to-pink-400" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="relative overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-xl p-4 group transition-all duration-300 hover:border-pink-500/40">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
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
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search projects..."
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
                        <option value="building">Building</option>
                        <option value="failed">Failed</option>
                        <option value="creating">Creating</option>
                      </select>

                      {/* Sort */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="name">Name</option>
                        <option value="status">Status</option>
                        <option value="type">Type</option>
                      </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`${viewMode === "grid" ? "bg-pink-500 hover:bg-pink-600" : "hover:bg-gray-700"} transition-colors`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`${viewMode === "list" ? "bg-pink-500 hover:bg-pink-600" : "hover:bg-gray-700"} transition-colors`}
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
                      className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-6"
                    />
                    <p className="text-gray-200 text-xl font-medium mb-2">Loading your projects</p>
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
                            key={project._id || project.id || index}
                            variants={itemVariants}
                            whileHover="hover"
                            custom={index}
                          >
                            <Card 
                              className="group relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 cursor-pointer h-full"
                              onClick={() => router.push(`/project/overview?id=${project._id || project.id}`)}
                            >
                              <motion.div variants={cardHover}>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <CardHeader className="relative">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                                        {getTechIcon(project.techused || '')}
                                      </div>
                                      <div>
                                        <CardTitle className="text-lg font-semibold text-gray-200 group-hover:text-pink-300 transition-colors line-clamp-1">
                                          {project.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                          {getStatusIcon(project.projectstatus || '')}
                                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.projectstatus || '')}`}>
                                            {project.projectstatus}
                                          </span>
                                          {project.type && (
                                            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                              {project.type}
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
                                      <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/project/overview?id=${project._id || project.id}`);
                                          }}
                                          className="hover:bg-pink-500/10 hover:text-pink-300"
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:bg-pink-500/10 hover:text-pink-300"
                                        >
                                          <BarChart2 className="mr-2 h-4 w-4" />
                                          Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:bg-pink-500/10 hover:text-pink-300"
                                        >
                                          <Settings className="mr-2 h-4 w-4" />
                                          Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-pink-500/20" />
                                        <DropdownMenuItem 
                                          className="text-red-400 hover:bg-red-500/10"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProject(project._id || project.id);
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
                                  {project.name && (
                                    <CardDescription 
                                      className="flex items-center text-sm mb-4 text-gray-400 hover:text-pink-400 transition-colors cursor-pointer"
                                      onClick={(e) => handleOpenProject(project, e)}
                                    >
                                      <ExternalLink className="mr-2 h-3 w-3" />
                                      <span className="truncate" onClick={()=>{
                                        window.open(`https://${project.projecturl}`, '_blank');
                                      }}>{`${project.projecturl}`}</span>
                                    </CardDescription>
                                  )}

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <GitBranch className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{project.repobranch || 'main'}</span>
                                      </div>
                                      {project.techused && (
                                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                          {project.techused}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Conditionally show CPU/RAM based on project type */}
                                    {shouldShowPerformanceMetrics(project) && (
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                          <Cpu className="h-4 w-4 text-pink-400" />
                                          <span className="text-gray-300">CPU: {project.cpu || 15}%</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <HardDrive className="h-4 w-4 text-green-400" />
                                          <span className="text-gray-300">RAM: {project.memory || 25}%</span>
                                        </div>
                                      </div>
                                    )}

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
                                            : "Never deployed"
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
                            key={project._id || project.id || index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, x: 4 }}
                            className="group relative overflow-hidden bg-gradient-to-r from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 rounded-xl p-6 cursor-pointer transition-all duration-300"
                            onClick={() => router.push(`/project/overview?id=${project._id || project.id}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1 min-w-0">
                                <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                                  {getTechIcon(project.techused || '')}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-200 group-hover:text-pink-300 transition-colors truncate">
                                      {project.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(project.projectstatus || '')}
                                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.projectstatus || '')}`}>
                                        {project.projectstatus}
                                      </span>
                                      {project.type && (
                                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                          {project.type}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-6 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                      <GitBranch className="h-4 w-4" />
                                      <span>{project.repobranch || 'main'}</span>
                                    </div>
                                    {project.techused && (
                                      <div className="flex items-center gap-2">
                                        <Code className="h-4 w-4" />
                                        <span>{project.techused}</span>
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
                                          : "Never deployed"
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-6">
                                {/* Performance Metrics - Only show for backend/fullstack projects */}
                                {shouldShowPerformanceMetrics(project) && (
                                  <div className="hidden md:flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Cpu className="h-4 w-4 text-pink-400" />
                                      <span className="text-gray-300">{project.cpu || 15}%</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <HardDrive className="h-4 w-4 text-green-400" />
                                      <span className="text-gray-300">{project.memory || 25}%</span>
                                    </div>
                                  </div>
                                )}

                                {/* URL Link */}
                                {project.name && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-pink-300 transition-colors"
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
                                  <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/project/overview?id=${project._id || project.id}`);
                                      }}
                                      className="hover:bg-pink-500/10 hover:text-pink-300"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-pink-500/10 hover:text-pink-300"
                                    >
                                      <BarChart2 className="mr-2 h-4 w-4" />
                                      Analytics
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-pink-500/10 hover:text-pink-300"
                                    >
                                      <Settings className="mr-2 h-4 w-4" />
                                      Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-pink-500/20" />
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-pink-500/10 hover:text-pink-300"
                                    >
                                      <Play className="mr-2 h-4 w-4" />
                                      Deploy
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-pink-500/10 hover:text-pink-300"
                                    >
                                      <Pause className="mr-2 h-4 w-4" />
                                      Pause
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:bg-pink-500/10 hover:text-pink-300"
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Restart
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-pink-500/20" />
                                    <DropdownMenuItem 
                                      className="text-red-400 hover:bg-red-500/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProject(project._id || project.id);
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
                  <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-12 max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-2xl" />
                    <div className="relative">
                      <div className="text-6xl opacity-20 mb-6">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-200 mb-2">No projects found</h3>
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

              {/* Quick Actions Section */}
              {projects.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-pink-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-pink-400" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={handleCreateProject}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-500/40 hover:from-pink-500/20 hover:to-purple-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                            <PlusCircle className="w-4 h-4 text-pink-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">New Project</div>
                            <div className="text-sm text-gray-400">Create a new deployment</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => router.push('/project/templates')}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                            <Code className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">Templates</div>
                            <div className="text-sm text-gray-400">Browse starter templates</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => router.push('/docs')}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-green-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                            <Activity className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">Documentation</div>
                            <div className="text-sm text-gray-400">Learn how to deploy</div>
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
                      Showing {filteredProjects.length} of {projects.length} projects
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
};

export default Projecthome;