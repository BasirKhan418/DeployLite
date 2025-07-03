"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
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
  Database as DatabaseIcon,
  Loader2,
  Search,
  Grid3X3,
  List,
  Calendar,
  Activity,
  Server,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  Key,
  Shield,
  Copy,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Link,
  Gauge,
} from "lucide-react";

import { useAppSelector } from "@/lib/hook";
import Connect from "./Connect";
import NoProject from "./NoProject";

interface DatabaseProject {
  _id: string;
  dbname: string;
  dbuser: string;
  dbtype: string;
  dbport: string;
  projectstatus: string;
  planid: any;
  userid: string;
  startdate: string;
  updatedAt: string;
  projecturl?: string;
  billstatus?: string;
  url?: string;
  uiurl?: string;
  cpuusage?: string;
  memoryusage?: string;
  storageusage?: string;
  arn?: string;
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

export default function DatabaseComp() {
  const user = useAppSelector((state) => state.user.user);
  
  const [databases, setDatabases] = useState<DatabaseProject[]>([]);
  const [filteredDatabases, setFilteredDatabases] = useState<DatabaseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasProjectsLoaded, setHasProjectsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const router = useRouter();

  const getDatabaseProjects = async () => {
    if (!user) {
      console.log('No user found for database projects fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Fetching database projects for user:', user.email);
    
    try {
      const result = await fetch(`/api/project/database`);
      const data = await result.json();
      
      console.log('Database API Response:', data);
      
      if (data.success && data.projectdata) {
        setDatabases(data.projectdata);
        setFilteredDatabases(data.projectdata);
        setHasProjectsLoaded(true);
      } else {
        console.log('No database projects found:', data.message);
        setDatabases([]);
        setFilteredDatabases([]);
        setHasProjectsLoaded(true);
        if (data.message && !data.message.includes('No Projects found')) {
          toast.error(data.message);
        }
      }
    } catch (err) {
      console.error('Error fetching database projects:', err);
      toast.error('Error while fetching database projects');
      setDatabases([]);
      setFilteredDatabases([]);
      setHasProjectsLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      getDatabaseProjects();
    }
  }, [user]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...databases];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(database =>
        database.dbname.toLowerCase().includes(query) ||
        database.dbtype?.toLowerCase().includes(query) ||
        database.dbuser?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(database => database.projectstatus === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(database => database.dbtype === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.dbname.localeCompare(b.dbname);
        case "type":
          return (a.dbtype || "").localeCompare(b.dbtype || "");
        case "status":
          return (a.projectstatus || "").localeCompare(b.projectstatus || "");
        case "recent":
        default:
          return new Date(b.updatedAt || b.startdate || 0).getTime() - 
                 new Date(a.updatedAt || a.startdate || 0).getTime();
      }
    });

    setFilteredDatabases(filtered);
  }, [databases, searchQuery, statusFilter, typeFilter, sortBy]);

  const handleCreateDatabase = () => {
    router.push(`/project/createproject/database`);
  };

  const handleDeleteDatabase = async (id: string) => {
    if (!id) {
      toast.error('Database ID is missing');
      return;
    }
    
    try {
      const confirm = window.confirm('Are you sure you want to delete this database? This action cannot be undone.');
      if (!confirm) {
        return;
      }
      
      setLoading(true);
      const deleteDatabase = await fetch(`/api/project/database`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const result = await deleteDatabase.json();
      setLoading(false);
      
      if (result.success) {
        toast.success(result.message);
        getDatabaseProjects(); // Refresh the list
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Error while deleting database:', err);
      setLoading(false);
      toast.error('Error while deleting database');
    }
  };

  const handleViewDatabase = (database: DatabaseProject) => {
    console.log('Navigating to database overview:', database._id);
    router.push(`/project/overview?id=${database._id}&type=database`);
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

  const getDatabaseIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mysql':
        return '/sql.svg';
      case 'mongodb':
        return '/MongoDB.svg';
      case 'redis':
        return '/redis.svg';
      case 'qdrant':
        return '/qdrant.svg';
      default:
        return '/MongoDB.svg';
    }
  };

  const getProjectStats = () => {
    const total = databases.length;
    const live = databases.filter(p => p.projectstatus === 'live').length;
    const creating = databases.filter(p => p.projectstatus === 'creating').length;
    const failed = databases.filter(p => p.projectstatus === 'failed').length;
    
    return { total, live, creating, failed };
  };

  const stats = getProjectStats();

  // Get unique database types for filter
  const databaseTypes = Array.from(new Set(databases.map(db => db.dbtype).filter(Boolean)));

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  if (!user?.connectgithub) {
    return <Connect />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      {hasProjectsLoaded && databases.length === 0 && !loading ? (
        <NoProject name="database" />
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
                      <DatabaseIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Database Management
                      </h1>
                      <p className="text-gray-400 mt-1">
                        Deploy and manage production-ready databases
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleCreateDatabase}
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
                          New Database
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
                    { label: "Total Databases", value: stats.total, icon: Activity, color: "from-blue-400 to-cyan-400" },
                    { label: "Live", value: stats.live, icon: CheckCircle, color: "from-emerald-400 to-green-400" },
                    { label: "Creating", value: stats.creating, icon: Clock, color: "from-amber-400 to-orange-400" },
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
              {databases.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search databases..."
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
                        <option value="creating">Creating</option>
                        <option value="building">Building</option>
                        <option value="failed">Failed</option>
                      </select>

                      {/* Type Filter */}
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      >
                        <option value="all">All Types</option>
                        {databaseTypes.map(type => (
                          <option key={type} value={type}>{type.toUpperCase()}</option>
                        ))}
                      </select>

                      {/* Sort */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="name">Name</option>
                        <option value="type">Type</option>
                        <option value="status">Status</option>
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
                    <p className="text-gray-200 text-xl font-medium mb-2">Loading your databases</p>
                    <p className="text-gray-400">Please wait while we fetch your data...</p>
                  </div>
                </motion.div>
              )}

              {/* Databases Grid/List */}
              {!loading && filteredDatabases.length > 0 && (
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
                        {filteredDatabases.map((database, index) => (
                          <motion.div
                            key={database._id}
                            variants={itemVariants}
                            whileHover="hover"
                            custom={index}
                          >
                            <Card 
                              className="group relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer h-full"
                              onClick={() => handleViewDatabase(database)}
                            >
                              <motion.div variants={cardHover}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <CardHeader className="relative">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg text-xl">
                                        <Image
                                         src={getDatabaseIcon(database.dbtype)}
                                         width={50}
                                         height={50}
                                         alt="logo"
                                         />
                                      </div>
                                      <div>
                                        <CardTitle className="text-lg font-semibold text-gray-200 group-hover:text-purple-300 transition-colors line-clamp-1">
                                          {database.dbname}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                          {getStatusIcon(database.projectstatus)}
                                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(database.projectstatus)}`}>
                                            {database.projectstatus}
                                          </span>
                                          {database.dbtype && (
                                            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                              {database.dbtype.toUpperCase()}
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
                                            handleViewDatabase(database);
                                          }}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(database.projecturl || '', 'Connection URL');
                                          }}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <Copy className="mr-2 h-4 w-4" />
                                          Copy URL
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <Key className="mr-2 h-4 w-4" />
                                          Credentials
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:bg-purple-500/10 hover:text-purple-300"
                                        >
                                          <BarChart2 className="mr-2 h-4 w-4" />
                                          Monitoring
                                        </DropdownMenuItem>
                                        {database.uiurl && (
                                          <DropdownMenuItem 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              window.open(database.uiurl, '_blank');
                                            }}
                                            className="hover:bg-purple-500/10 hover:text-purple-300"
                                          >
                                            <Monitor className="mr-2 h-4 w-4" />
                                            Admin UI
                                          </DropdownMenuItem>
                                        )}
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
                                            handleDeleteDatabase(database._id);
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
                                  {database.projecturl && (
                                    <div 
                                      className="flex items-center text-sm mb-4 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(database.projecturl || '', 'Connection URL');
                                      }}
                                    >
                                      <Copy className="mr-2 h-3 w-3" />
                                      <span className="truncate font-mono text-xs">{database.projecturl}</span>
                                    </div>
                                  )}

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <DatabaseIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{database.dbuser || 'No user'}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Link className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300">{database.dbport || 'No port'}</span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                      <div className="text-center p-2 bg-purple-500/10 rounded">
                                        <div className="flex items-center justify-center mb-1">
                                          <Cpu className="h-3 w-3 text-purple-400" />
                                        </div>
                                        <span className="text-gray-300 text-xs">{database.cpuusage || '0'}%</span>
                                      </div>
                                      <div className="text-center p-2 bg-blue-500/10 rounded">
                                        <div className="flex items-center justify-center mb-1">
                                          <MemoryStick className="h-3 w-3 text-blue-400" />
                                        </div>
                                        <span className="text-gray-300 text-xs">{database.memoryusage || '0'}%</span>
                                      </div>
                                      <div className="text-center p-2 bg-green-500/10 rounded">
                                        <div className="flex items-center justify-center mb-1">
                                          <HardDrive className="h-3 w-3 text-green-400" />
                                        </div>
                                        <span className="text-gray-300 text-xs">{database.storageusage || '0'}%</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50">
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          {database.updatedAt 
                                            ? new Date(database.updatedAt).toLocaleDateString("en-GB", { 
                                                day: "2-digit", 
                                                month: "short", 
                                                year: "numeric" 
                                              })
                                            : "Never updated"
                                          }
                                        </span>
                                      </div>
                                      {database.projectstatus === 'live' && (
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
                      // List view implementation
                      <div className="space-y-4">
                        {filteredDatabases.map((database) => (
                          <Card 
                            key={database._id}
                            className="bg-gradient-to-r from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-6 cursor-pointer transition-all duration-300"
                            onClick={() => handleViewDatabase(database)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl text-2xl">
                                  <Image 
                                  src={getDatabaseIcon(database.dbtype)}
                                  width={20}
                                  height={20}
                                  alt="logo"
                                  />

                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-200">{database.dbname}</h3>
                                  <p className="text-gray-400">{database.dbtype?.toUpperCase()} • {database.dbuser}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {getStatusIcon(database.projectstatus)}
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(database.projectstatus)}`}>
                                  {database.projectstatus}
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* No Results State */}
              {!loading && hasProjectsLoaded && filteredDatabases.length === 0 && databases.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20"
                >
                  <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 rounded-2xl p-12 max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl" />
                    <div className="relative">
                      <div className="text-6xl opacity-20 mb-6">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-200 mb-2">No databases found</h3>
                      <p className="text-gray-400 mb-6">
                        Try adjusting your search or filter criteria to find what you&apos;re looking for.
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                          setTypeFilter("all");
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
              {databases.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={handleCreateDatabase}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/20 hover:to-blue-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                            <PlusCircle className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">New Database</div>
                            <div className="text-sm text-gray-400">Create a new database instance</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => router.push('/project/templates?type=database')}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                            <DatabaseIcon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">Templates</div>
                            <div className="text-sm text-gray-400">Browse database templates</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => router.push('/docs/database')}
                        className="justify-start h-auto p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-green-500/20 text-left transition-all duration-300"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                            <Activity className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">Documentation</div>
                            <div className="text-sm text-gray-400">Learn database deployment</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer Info */}
              {databases.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="text-center text-gray-400 text-sm">
                    <p>
                      Showing {filteredDatabases.length} of {databases.length} databases
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