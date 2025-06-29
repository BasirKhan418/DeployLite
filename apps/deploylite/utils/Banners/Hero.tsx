"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Activity, 
  PieChart, 
  ArrowRight, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Clock,
  Server,
  GitBranch,
  Code,
  Database,
  Cloud,
  Zap
} from "lucide-react";
import { useAppSelector } from "@/lib/hook";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  img: string;
  authtoken?: string;
  githubid?: string;
  githubtoken?: string;
  isverified: boolean;
  is0auth: boolean;
  bio: string;
  phone: string;
  twofactor?: boolean;
  connectgithub?: boolean;
}

interface ChartDataPoint {
  name: string;
  deployments: number;
}

interface DeploymentStats {
  chartData: ChartDataPoint[];
  totalDeployments: number;
  activeProjects: number;
}

interface BuildStats {
  successfulBuildPercentage: number;
  failedBuildPercentage: number;
}

interface RecentDeployment {
  id: string;
  projectName: string;
  status: 'live' | 'failed' | 'building' | 'creating';
  timestamp: Date;
  techStack?: string;
  projectUrl?: string;
}

interface ProjectData {
  _id: string;
  name: string;
  projectstatus: string;
  techused: string;
  projecturl?: string;
  lastdeploy?: Date;
  startdate?: Date;
  type: string;
  repourl?: string;
  planid?: string;
}

// Professional animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
};

// Professional Interactive Line Chart
const InteractiveLineChart = ({ data }: { data: ChartDataPoint[] }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const maxValue = Math.max(...data.map(d => d.deployments), 1);
  const width = 600;
  const height = 300;
  const padding = 60;

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = padding + (height - padding * 2) - (item.deployments / maxValue) * (height - padding * 2);
    return { x, y, value: item.deployments, name: item.name, index };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const areaPath = pathData + ` L ${points[points.length - 1]?.x || 0} ${height - padding} L ${padding} ${height - padding} Z`;

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No deployment data available</p>
          <p className="text-sm text-gray-500">Deploy your first project to see trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#a855f7" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            y1={padding + (height - padding * 2) * ratio}
            x2={width - padding}
            y2={padding + (height - padding * 2) * ratio}
            stroke="#374151"
            strokeDasharray="2 4"
            opacity={0.2}
          />
        ))}
        
        {points.map((point, index) => (
          <line
            key={index}
            x1={point.x}
            y1={padding}
            x2={point.x}
            y2={height - padding}
            stroke="#374151"
            strokeDasharray="1 3"
            opacity={0.1}
          />
        ))}

        {/* Area under curve */}
        <motion.path
          d={areaPath}
          fill="url(#chartGradient)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Main line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        <AnimatePresence>
          {points.map((point, index) => (
            <g key={index}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === index ? 8 : 6}
                fill={hoveredPoint === index ? "#a855f7" : "#ec4899"}
                stroke="#000"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
                initial={{ scale: 0 }}
                animate={{ scale: animationComplete ? 1 : 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 1.5 }}
                whileHover={{ scale: 1.2 }}
              />
              
              {/* Tooltip */}
              {hoveredPoint === index && (
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <rect
                    x={point.x - 45}
                    y={point.y - 55}
                    width="90"
                    height="40"
                    fill="#000"
                    stroke="#ec4899"
                    strokeWidth="1"
                    rx="6"
                    opacity={0.95}
                  />
                  <text
                    x={point.x}
                    y={point.y - 38}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {point.name}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 25}
                    textAnchor="middle"
                    fill="#ec4899"
                    fontSize="14"
                    fontWeight="700"
                  >
                    {point.value} deploys
                  </text>
                </motion.g>
              )}
            </g>
          ))}
        </AnimatePresence>
        
        {/* Axis labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - 15}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize="12"
            fontWeight="500"
          >
            {point.name}
          </text>
        ))}
        
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <text
            key={ratio}
            x={25}
            y={padding + (height - padding * 2) * (1 - ratio) + 4}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize="12"
          >
            {Math.round(maxValue * ratio)}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Professional Donut Chart
const DonutChart = ({ percentage, color, label }: { percentage: number; color: string; label: string }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  const size = 120;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <motion.div 
      className="relative flex items-center justify-center transition-transform duration-300 cursor-pointer"
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-xl font-bold transition-all duration-300" 
          style={{ color }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
        >
          {animatedPercentage}%
        </motion.span>
        <span className="text-xs text-gray-400 mt-1 font-medium">{label}</span>
      </div>
    </motion.div>
  );
};

const DashboardHero = () => {
  const user = useAppSelector((state) => state.user.user) as User | null;
  const router = useRouter();

  // State management
  const [deploymentStats, setDeploymentStats] = useState<DeploymentStats>({
    chartData: [],
    totalDeployments: 0,
    activeProjects: 0,
  });

  const [buildStats, setBuildStats] = useState<BuildStats>({
    successfulBuildPercentage: 0,
    failedBuildPercentage: 0,
  });

  const [recentDeployments, setRecentDeployments] = useState<RecentDeployment[]>([]);
  const [activeProjects, setActiveProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());



const fetchDashboardData = async () => {
  if (!user?._id && !user?.username) {
    console.log('No user identifier found');
    return;
  }
  
  setIsLoading(true);
  try {
    // Try different API endpoints based on available user data
    let apiUrl = '';
    if (user._id) {
      apiUrl = `/api/project/crud?id=${user._id}`;
    } else if (user.username) {
      apiUrl = `/api/project/crud?username=${user.username}`;
    }

    console.log('Fetching from:', apiUrl);
    const projectsRes = await fetch(apiUrl);
    const projectsData = await projectsRes.json();
    
    console.log('API Response:', projectsData);
    
    if (projectsData.success && projectsData.projectdata) {
      const projects = projectsData.projectdata;
      setActiveProjects(projects);
      
      const totalDeployments = projects.length;
      const activeProjectsCount = projects.filter((p: ProjectData) => 
        p.projectstatus === 'live' || p.projectstatus === 'building'
      ).length;
      
      const chartData = generateChartDataFromProjects(projects);
      
      setDeploymentStats({
        chartData,
        totalDeployments,
        activeProjects: activeProjectsCount,
      });
      
      const liveProjects = projects.filter((p: ProjectData) => p.projectstatus === 'live').length;
      const failedProjects = projects.filter((p: ProjectData) => p.projectstatus === 'failed').length;
      const totalFinished = liveProjects + failedProjects;
      
      const successRate = totalFinished > 0 ? Math.round((liveProjects / totalFinished) * 100) : 0;
      
      setBuildStats({
        successfulBuildPercentage: successRate,
        failedBuildPercentage: 100 - successRate,
      });
      
      const recentDeployments = projects
        .filter((p: ProjectData) => p.lastdeploy || p.startdate)
        .map((p: ProjectData) => ({
          id: p._id,
          projectName: p.name,
          status: p.projectstatus as 'live' | 'failed' | 'building' | 'creating',
          timestamp: new Date(p.lastdeploy || p.startdate || new Date()),
          techStack: p.techused,
          projectUrl: p.projecturl,
        }))
        .sort((a: RecentDeployment, b: RecentDeployment) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 8);
      
      setRecentDeployments(recentDeployments);
    } else {
      console.log('No project data or unsuccessful response:', projectsData);
      setDeploymentStats({
        chartData: [],
        totalDeployments: 0,
        activeProjects: 0,
      });
      setBuildStats({
        successfulBuildPercentage: 0,
        failedBuildPercentage: 0,
      });
      setRecentDeployments([]);
      setActiveProjects([]);
    }

    setLastUpdated(new Date());
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    toast.error('Failed to load dashboard data');
    setDeploymentStats({
      chartData: [],
      totalDeployments: 0,
      activeProjects: 0,
    });
  } finally {
    setIsLoading(false);
  }
};

// Also update the useEffect to better handle user changes:
useEffect(() => {
  if (user && (user._id || user.username)) {
    console.log('User available, fetching dashboard data:', user);
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  } else {
    console.log('No user available or missing identifier');
    setIsLoading(false);
  }
}, [user]);

  const generateChartDataFromProjects = (projects: ProjectData[]) => {
    const last6Months: ChartDataPoint[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const deploymentsInMonth = projects.filter((p: ProjectData) => {
        const projectDate = new Date(p.startdate || p.lastdeploy || 0);
        return projectDate.getMonth() === date.getMonth() && 
               projectDate.getFullYear() === date.getFullYear();
      }).length;
      
      last6Months.push({
        name: monthName,
        deployments: deploymentsInMonth,
      });
    }
    
    return last6Months;
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, [user]);

 

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'failed': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'building': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'creating': return 'bg-pink-500/10 border-pink-500/30 text-pink-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getTechStackIcon = (techStack: string) => {
    switch (techStack?.toLowerCase()) {
      case 'react': return 'React';
      case 'vue': case 'vue.js': return 'Vue';
      case 'angular': return 'Angular';
      case 'next.js': return 'Next.js';
      case 'svelte': return 'Svelte';
      case 'node.js': return 'Node';
      case 'python': return 'Python';
      case 'django': return 'Django';
      case 'flask': return 'Flask';
      case 'html,css,js': return 'Web';
      default: return 'Code';
    }
  };

  const calculateTrend = () => {
    if (deploymentStats.chartData.length < 2) return null;
    const current = deploymentStats.chartData[deploymentStats.chartData.length - 1]?.deployments || 0;
    const previous = deploymentStats.chartData[deploymentStats.chartData.length - 2]?.deployments || 0;
    const change = previous === 0 ? 0 : ((current - previous) / previous * 100);
    return { change: Math.abs(change).toFixed(1), isPositive: current >= previous };
  };

  const trend = calculateTrend();

 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-200 text-xl font-medium mb-2">Loading your dashboard</p>
            <p className="text-gray-400">Preparing your deployment insights...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <motion.div
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
            <motion.button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-pink-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">Refresh</span>
            </motion.button>
          </motion.div>

          {/* Key Metrics - Fixed uniform sizing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Deployments */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 h-full group transition-all duration-300 hover:border-pink-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-pink-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Total Deployments</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {deploymentStats.totalDeployments}
                  </div>
                  {trend && (
                    <div className={`text-sm flex items-center gap-1 ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {trend.change}% from last period
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Active Projects */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 h-full group transition-all duration-300 hover:border-pink-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Active Projects</span>
                    </div>
                    <motion.div
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {deploymentStats.activeProjects}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Live:</span>
                      <span className="text-emerald-400 font-medium">{activeProjects.filter(p => p.projectstatus === 'live').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Building:</span>
                      <span className="text-amber-400 font-medium">{activeProjects.filter(p => p.projectstatus === 'building').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Failed:</span>
                      <span className="text-red-400 font-medium">{activeProjects.filter(p => p.projectstatus === 'failed').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Success Rate */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 h-full group transition-all duration-300 hover:border-emerald-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg">
                        <PieChart className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Success Rate</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {buildStats.successfulBuildPercentage}%
                  </div>
                  <div className="text-sm text-gray-400">
                    Build success rate over time
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deployment Trends Chart */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-2 relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-pink-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                        <PieChart className="w-5 h-5 text-pink-400" />
                      </div>
                      Deployment Trends
                      <motion.div
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Last 6 months</span>
                    </div>
                  </div>
                  <InteractiveLineChart data={deploymentStats.chartData} />
                </div>
              </div>
            </motion.div>

            {/* Build Success Stats */}
            <motion.div variants={fadeIn} className="space-y-6">
              {/* Successful Builds */}
              <div className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-emerald-900/20 via-black to-black border border-emerald-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-emerald-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-emerald-100 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg">
                        <Server className="w-5 h-5 text-emerald-400" />
                      </div>
                      Successful Builds
                    </h3>
                    <div className="flex justify-center">
                      <DonutChart 
                        percentage={buildStats.successfulBuildPercentage} 
                        color="#10b981" 
                        label="Success"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Failed Builds */}
              <div className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-red-900/20 via-black to-black border border-red-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-red-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-red-100 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg">
                        <GitBranch className="w-5 h-5 text-red-400" />
                      </div>
                      Failed Builds
                    </h3>
                    <div className="flex justify-center">
                      <DonutChart 
                        percentage={buildStats.failedBuildPercentage} 
                        color="#ef4444" 
                        label="Failed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Deployments */}
            <motion.div
              variants={fadeIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-pink-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      Recent Deployments
                    </h2>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    <AnimatePresence>
                      {recentDeployments.length > 0 ? (
                        recentDeployments.map((deployment, index) => (
                          <motion.div 
                            key={deployment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="group/item relative"
                          >
                            <div className="relative flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all duration-300 border border-transparent hover:border-pink-500/20">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className={`w-3 h-3 rounded-full ${
                                    deployment.status === 'live' ? 'bg-emerald-400' :
                                    deployment.status === 'failed' ? 'bg-red-400' :
                                    deployment.status === 'building' ? 'bg-amber-400' : 'bg-pink-400'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-200 group-hover/item:text-pink-300 transition-colors">
                                      {deployment.projectName}
                                    </span>
                                    {deployment.techStack && (
                                      <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md">
                                        {getTechStackIcon(deployment.techStack)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-400 mt-1">
                                    {deployment.timestamp.toLocaleString()}
                                  </div>
                                  {deployment.projectUrl && deployment.status === 'live' && (
                                    <motion.a 
                                      href={`https://${deployment.projectUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 mt-1 group-hover/item:translate-x-1 transition-transform"
                                      whileHover={{ x: 2 }}
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      {deployment.projectUrl}
                                    </motion.a>
                                  )}
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(deployment.status)}`}>
                                {deployment.status}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center text-gray-400 py-12"
                        >
                          <div className="text-6xl opacity-20 mb-4">🚀</div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium">No deployments yet</p>
                            <p className="text-sm text-gray-500">Create your first project to see deployment history</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={fadeIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-pink-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    Quick Actions
                  </h2>
                  <div className="space-y-4">
                    <motion.button
                      onClick={() => router.push("/project/createproject/app-platform")}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl transition-all duration-300 group/btn shadow-lg shadow-pink-500/25"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-white/20 rounded-lg">
                          <Code className="w-4 h-4" />
                        </div>
                        <span className="font-medium">New Deployment</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => router.push("/project/app-platform")}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-300 group/btn border border-gray-700/50 hover:border-pink-500/30"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-gray-600/50 rounded-lg">
                          <Database className="w-4 h-4 text-gray-400 group-hover/btn:text-pink-400 transition-colors" />
                        </div>
                        <span className="font-medium">View All Projects</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform text-gray-400 group-hover/btn:text-pink-400" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => router.push("/settings")}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-300 group/btn border border-gray-700/50 hover:border-pink-500/30"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-gray-600/50 rounded-lg">
                          <Cloud className="w-4 h-4 text-gray-400 group-hover/btn:text-pink-400 transition-colors" />
                        </div>
                        <span className="font-medium">Settings</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform text-gray-400 group-hover/btn:text-pink-400" />
                    </motion.button>
                  </div>

                  {/* Project Status Overview */}
                  <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <div className="p-1 bg-gray-600/50 rounded-lg">
                        <Server className="w-4 h-4 text-pink-400" />
                      </div>
                      Your Projects ({activeProjects.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                      <AnimatePresence>
                        {activeProjects.slice(0, 4).map((project, index) => (
                          <motion.div 
                            key={project._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: index * 0.05 }}
                            className="group/project relative"
                          >
                            <div 
                              className="relative flex items-center justify-between text-sm p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all duration-300 border border-transparent hover:border-pink-500/20 cursor-pointer"
                              onClick={() => router.push(`/project/overview?id=${project._id}`)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md">
                                  {getTechStackIcon(project.techused)}
                                </span>
                                <span className="truncate font-medium group-hover/project:text-pink-300 transition-colors max-w-32">
                                  {project.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(project.projectstatus)}`}>
                                  {project.projectstatus}
                                </span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/project:opacity-100 transition-opacity text-pink-400" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {activeProjects.length === 0 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-gray-400 py-6"
                        >
                          <div className="text-3xl mb-2 opacity-50">📦</div>
                          <div className="text-sm">No projects yet</div>
                          <div className="text-xs text-gray-500 mt-1">Create your first project to get started</div>
                        </motion.div>
                      )}
                      
                      {activeProjects.length > 4 && (
                        <motion.button 
                          onClick={() => router.push("/project/app-platform")}
                          className="w-full text-center text-gray-400 text-sm py-3 hover:text-pink-400 transition-colors rounded-lg hover:bg-gray-800/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          View all {activeProjects.length} projects →
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Stats Row - FIXED: Use proper icon rendering */}
          <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                value: activeProjects.filter(p => p.techused?.toLowerCase() === 'react').length,
                label: "React Apps",
                iconName: "Code",
                gradient: "from-cyan-400 to-blue-400"
              },
              {
                value: activeProjects.filter(p => p.projectstatus === 'live').length,
                label: "Live Projects",
                iconName: "Server",
                gradient: "from-emerald-400 to-green-400"
              },
              {
                value: deploymentStats.chartData.reduce((sum, month) => sum + month.deployments, 0),
                label: "Total This Year",
                iconName: "BarChart3",
                gradient: "from-purple-400 to-pink-400"
              },
              {
                value: Math.round((activeProjects.filter(p => p.projectstatus === 'live').length / Math.max(activeProjects.length, 1)) * 100),
                label: "Success Rate",
                iconName: "Activity",
                gradient: "from-yellow-400 to-orange-400",
                suffix: "%"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden"
              >
                <div className="relative bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50 border border-gray-700/50 hover:border-pink-500/30 rounded-xl p-4 text-center transition-all duration-300 backdrop-blur-sm group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                        {stat.iconName === "Code" && <Code className="w-5 h-5 text-pink-400" />}
                        {stat.iconName === "Server" && <Server className="w-5 h-5 text-pink-400" />}
                        {stat.iconName === "BarChart3" && <BarChart3 className="w-5 h-5 text-pink-400" />}
                        {stat.iconName === "Activity" && <Activity className="w-5 h-5 text-pink-400" />}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                      {stat.value}{stat.suffix || ''}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default DashboardHero;