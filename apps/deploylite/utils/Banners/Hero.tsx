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
  GitBranch
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

// Design system
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Enhanced Interactive Line Chart
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

  // Create gradient area path
  const areaPath = pathData + ` L ${points[points.length - 1]?.x || 0} ${height - padding} L ${padding} ${height - padding} Z`;

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" aria-hidden="true" />
          <p>No deployment data available</p>
          <p className="text-sm">Deploy your first project to see trends</p>
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
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
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
            opacity={0.3}
          />
        ))}
        
        {/* Vertical grid lines */}
        {points.map((point, index) => (
          <line
            key={index}
            x1={point.x}
            y1={padding}
            x2={point.x}
            y2={height - padding}
            stroke="#374151"
            strokeDasharray="2 4"
            opacity={0.2}
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
                fill={hoveredPoint === index ? "#f97316" : "#ec4899"}
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
              
              {/* Hover tooltip */}
              {hoveredPoint === index && (
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <rect
                    x={point.x - 40}
                    y={point.y - 50}
                    width="80"
                    height="35"
                    fill="#000"
                    stroke="#ec4899"
                    strokeWidth="1"
                    rx="6"
                    opacity={0.95}
                  />
                  <text
                    x={point.x}
                    y={point.y - 35}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {point.name}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 22}
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
        
        {/* X-axis labels */}
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
        
        {/* Y-axis labels */}
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

// Enhanced Donut Chart
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
    <div 
      className="relative flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer"
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <span className="text-xs text-gray-400 mt-1">{label}</span>
      </div>
    </div>
  );
};

const DashboardHero = () => {
  const user = useAppSelector((state) => state.user.user) as User | null;
  const router = useRouter();

  // Real data states
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

  // Fetch real data from your actual APIs
  const fetchDashboardData = async () => {
    if (!user?._id) return;
    
    setIsLoading(true);
    try {
      // Fetch user projects using your actual API endpoint
      const projectsRes = await fetch(`/api/project/crud?id=${user._id}`);
      const projectsData = await projectsRes.json();
      
      if (projectsData.success && projectsData.projectdata) {
        const projects = projectsData.projectdata;
        setActiveProjects(projects);
        
        // Calculate real deployment stats from project data
        const totalDeployments = projects.length;
        const activeProjectsCount = projects.filter((p: ProjectData) => 
          p.projectstatus === 'live' || p.projectstatus === 'building'
        ).length;
        
        // Create chart data based on project creation dates
        const chartData = generateChartDataFromProjects(projects);
        
        setDeploymentStats({
          chartData,
          totalDeployments,
          activeProjects: activeProjectsCount,
        });
        
        // Calculate build success rate from project statuses
        const liveProjects = projects.filter((p: ProjectData) => p.projectstatus === 'live').length;
        const failedProjects = projects.filter((p: ProjectData) => p.projectstatus === 'failed').length;
        const totalFinished = liveProjects + failedProjects;
        
        const successRate = totalFinished > 0 ? Math.round((liveProjects / totalFinished) * 100) : 0;
        
        setBuildStats({
          successfulBuildPercentage: successRate,
          failedBuildPercentage: 100 - successRate,
        });
        
        // Create recent deployments from project data
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
        // Set default values if no projects
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
      // Set fallback data on error
      setDeploymentStats({
        chartData: [],
        totalDeployments: 0,
        activeProjects: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate chart data from project creation dates
  const generateChartDataFromProjects = (projects: ProjectData[]) => {
    const last6Months = [];
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'building': return 'text-orange-400';
      case 'creating': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return '✅';
      case 'failed': return '❌';
      case 'building': return '🔄';
      case 'creating': return '⏳';
      default: return '⚪';
    }
  };

  const getTechStackIcon = (techStack: string) => {
    switch (techStack?.toLowerCase()) {
      case 'react': return '⚛️';
      case 'vue': case 'vue.js': return '💚';
      case 'angular': return '🅰️';
      case 'next.js': return '▲';
      case 'svelte': return '🧡';
      case 'node.js': return '💚';
      case 'python': return '🐍';
      case 'django': return '🎸';
      case 'flask': return '🌶️';
      case 'html,css,js': return '🌐';
      default: return '💻';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={fadeIn} className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                Welcome back, {user?.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-400 mt-1">
                <Clock className="w-4 h-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={fadeIn}
              className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <BarChart3 className="w-5 h-5 text-pink-500" />
                    <span>Total Deployments</span>
                  </div>
                  <div className="text-3xl font-bold text-pink-500">
                    {deploymentStats.totalDeployments}
                  </div>
                  {trend && (
                    <div className={`text-sm flex items-center gap-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {trend.change}% from last period
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Activity className="w-5 h-5 text-pink-500" />
                <span>Active Projects</span>
              </div>
              <div className="text-3xl font-bold text-pink-500">
                {deploymentStats.activeProjects}
              </div>
              <div className="text-sm text-gray-400">
                Live: {activeProjects.filter(p => p.projectstatus === 'live').length} • 
                Building: {activeProjects.filter(p => p.projectstatus === 'building').length} • 
                Failed: {activeProjects.filter(p => p.projectstatus === 'failed').length}
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <PieChart className="w-5 h-5 text-pink-500" />
                <span>Success Rate</span>
              </div>
              <div className="text-3xl font-bold text-green-400">
                {buildStats.successfulBuildPercentage}%
              </div>
              <div className="text-sm text-gray-400">
                Last 30 days build success rate
              </div>
            </motion.div>
          </div>

          {/* Charts and Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deployment Trends */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-pink-500" />
                Deployment Trends
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </h2>
              <InteractiveLineChart data={deploymentStats.chartData} />
            </motion.div>

            {/* Build Success Stats */}
            <motion.div variants={fadeIn} className="space-y-6">
              <div className="bg-green-900/20 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-colors">
                <h3 className="text-lg font-semibold text-green-100 mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5" />
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

              <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-colors">
                <h3 className="text-lg font-semibold text-red-100 mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
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
            </motion.div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Deployments */}
            <motion.div
              variants={fadeIn}
              className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-4">Recent Deployments</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentDeployments.length > 0 ? (
                  recentDeployments.map((deployment) => (
                    <motion.div 
                      key={deployment.id} 
                      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group"
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getStatusIcon(deployment.status)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{deployment.projectName}</span>
                            {deployment.techStack && (
                              <span className="text-sm">{getTechStackIcon(deployment.techStack)}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {deployment.timestamp.toLocaleString()}
                          </div>
                          {deployment.projectUrl && deployment.status === 'live' && (
                            <a 
                              href={`https://${deployment.projectUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {deployment.projectUrl}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${getStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-2">🚀</div>
                    <div>No deployments yet</div>
                    <div className="text-sm">Create your first project to get started</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={fadeIn}
              className="bg-gray-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <motion.button
                  onClick={() => router.push("/project/createproject/app-platform")}
                  className="w-full flex items-center justify-between p-4 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>New Deployment</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => router.push("/project/app-platform")}
                  className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => router.push("/settings")}
                  className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Settings</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Project Status Overview */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="font-semibold mb-3">Your Projects ({activeProjects.length})</h3>
                <div className="space-y-2">
                  {activeProjects.slice(0, 4).map((project) => (
                    <motion.div 
                      key={project._id} 
                      className="flex items-center justify-between text-sm p-2 bg-gray-800/30 rounded hover:bg-gray-800/50 transition-colors group cursor-pointer"
                      whileHover={{ x: 2 }}
                      onClick={() => router.push(`/project/overview?id=${project._id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{getTechStackIcon(project.techused)}</span>
                        <span className="truncate font-medium group-hover:text-pink-400 transition-colors">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(project.projectstatus)} bg-gray-700/50`}>
                          {project.projectstatus}
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                  {activeProjects.length === 0 && (
                    <div className="text-center text-gray-400 py-4">
                      <div className="text-2xl mb-1">📦</div>
                      <div className="text-sm">No projects yet</div>
                    </div>
                  )}
                  {activeProjects.length > 4 && (
                    <motion.button 
                      onClick={() => router.push("/project/app-platform")}
                      className="w-full text-center text-gray-400 text-sm py-2 hover:text-pink-400 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      View all {activeProjects.length} projects →
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Stats Row */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-500">
                {activeProjects.filter(p => p.techused?.toLowerCase() === 'react').length}
              </div>
              <div className="text-sm text-gray-400">React Apps</div>
            </div>
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-500">
                {activeProjects.filter(p => p.projectstatus === 'live').length}
              </div>
              <div className="text-sm text-gray-400">Live Projects</div>
            </div>
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-500">
                {deploymentStats.chartData.reduce((sum, month) => sum + month.deployments, 0)}
              </div>
              <div className="text-sm text-gray-400">Total This Year</div>
            </div>
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-500">
                {Math.round((activeProjects.filter(p => p.projectstatus === 'live').length / Math.max(activeProjects.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardHero;