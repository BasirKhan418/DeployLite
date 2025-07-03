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
  Zap,
  Globe,
  Layers,
  Monitor,
  Settings,
  CloudLightning,
  Terminal,
  Shield,
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
  webbuilders: number;
  virtualspaces: number;
}

interface DeploymentStats {
  chartData: ChartDataPoint[];
  totalDeployments: number;
  totalWebBuilders: number;
  totalVirtualSpaces: number;
  activeProjects: number;
  activeWebBuilders: number;
  activeVirtualSpaces: number;
}

interface BuildStats {
  successfulBuildPercentage: number;
  failedBuildPercentage: number;
  webBuilderSuccessRate: number;
  virtualSpaceSuccessRate: number;
}

interface RecentDeployment {
  id: string;
  projectName: string;
  status: 'live' | 'failed' | 'building' | 'creating';
  timestamp: Date;
  techStack?: string;
  projectUrl?: string;
  type: 'app-platform' | 'webbuilder' | 'virtualspace';
  webBuilderType?: string;
}

interface ProjectData {
  _id: string;
  name: string;
  projectstatus: string;
  techused?: string;
  projecturl?: string;
  lastdeploy?: Date;
  startdate?: Date;
  type: string;
  repourl?: string;
  planid?: string;
  webbuilder?: string;
}

interface WebBuilderData {
  _id: string;
  name: string;
  projectstatus: string;
  projecturl?: string;
  startdate?: Date;
  updatedAt?: Date;
  webbuilder?: string;
  planid?: string;
}

interface VirtualSpaceData {
  _id: string;
  name: string;
  projectstatus: string;
  startdate?: Date;
  updatedAt?: Date;
  url?: string;
  projecturl?: string;
  cpuusage?: string;
  memoryusage?: string;
  storageusage?: string;
  planid?: {
    name: string;
    pricephour: string;
  };
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
  
  const maxDeployments = Math.max(...data.map(d => d.deployments), 1);
  const maxWebBuilders = Math.max(...data.map(d => d.webbuilders), 1);
  const maxVirtualSpaces = Math.max(...data.map(d => d.virtualspaces), 1);
  const maxValue = Math.max(maxDeployments, maxWebBuilders, maxVirtualSpaces);
  
  const width = 600;
  const height = 300;
  const padding = 60;

  const deploymentPoints = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = padding + (height - padding * 2) - (item.deployments / maxValue) * (height - padding * 2);
    return { x, y, value: item.deployments, name: item.name, index, type: 'deployments' };
  });

  const webBuilderPoints = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = padding + (height - padding * 2) - (item.webbuilders / maxValue) * (height - padding * 2);
    return { x, y, value: item.webbuilders, name: item.name, index, type: 'webbuilders' };
  });

  const virtualSpacePoints = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = padding + (height - padding * 2) - (item.virtualspaces / maxValue) * (height - padding * 2);
    return { x, y, value: item.virtualspaces, name: item.name, index, type: 'virtualspaces' };
  });

  const deploymentPath = deploymentPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const webBuilderPath = webBuilderPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const virtualSpacePath = virtualSpacePoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const deploymentAreaPath = deploymentPath + ` L ${deploymentPoints[deploymentPoints.length - 1]?.x || 0} ${height - padding} L ${padding} ${height - padding} Z`;

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
          <linearGradient id="deploymentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#a855f7" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="webBuilderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="virtualSpaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="deploymentLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="webBuilderLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="virtualSpaceLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
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
        
        {deploymentPoints.map((point, index) => (
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

        {/* Area under deployment curve */}
        <motion.path
          d={deploymentAreaPath}
          fill="url(#deploymentGradient)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Deployment line */}
        <motion.path
          d={deploymentPath}
          fill="none"
          stroke="url(#deploymentLineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* WebBuilder line */}
        <motion.path
          d={webBuilderPath}
          fill="none"
          stroke="url(#webBuilderLineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Virtual Space line */}
        <motion.path
          d={virtualSpacePath}
          fill="none"
          stroke="url(#virtualSpaceLineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3,3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Deployment data points */}
        <AnimatePresence>
          {deploymentPoints.map((point, index) => (
            <g key={`deployment-${index}`}>
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
              
              {/* Tooltip for deployments */}
              {hoveredPoint === index && (
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <rect
                    x={point.x - 70}
                    y={point.y - 90}
                    width="140"
                    height="75"
                    fill="#000"
                    stroke="#ec4899"
                    strokeWidth="1"
                    rx="6"
                    opacity={0.95}
                  />
                  <text
                    x={point.x}
                    y={point.y - 70}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {point.name}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 55}
                    textAnchor="middle"
                    fill="#ec4899"
                    fontSize="11"
                    fontWeight="600"
                  >
                    Apps: {point.value}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 40}
                    textAnchor="middle"
                    fill="#06b6d4"
                    fontSize="11"
                    fontWeight="600"
                  >
                    WebBuilders: {webBuilderPoints[index]?.value || 0}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 25}
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="11"
                    fontWeight="600"
                  >
                    Virtual Spaces: {virtualSpacePoints[index]?.value || 0}
                  </text>
                </motion.g>
              )}
            </g>
          ))}
        </AnimatePresence>

        {/* WebBuilder data points */}
        <AnimatePresence>
          {webBuilderPoints.map((point, index) => (
            <motion.circle
              key={`webbuilder-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="#06b6d4"
              stroke="#000"
              strokeWidth="1"
              className="cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ scale: animationComplete ? 1 : 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 2 }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </AnimatePresence>

        {/* Virtual Space data points */}
        <AnimatePresence>
          {virtualSpacePoints.map((point, index) => (
            <motion.circle
              key={`virtualspace-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="#10b981"
              stroke="#000"
              strokeWidth="1"
              className="cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ scale: animationComplete ? 1 : 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 2.5 }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </AnimatePresence>
        
        {/* Axis labels */}
        {deploymentPoints.map((point, index) => (
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

        {/* Legend */}
        <g transform="translate(420, 20)">
          <rect x="0" y="0" width="170" height="70" fill="#000" stroke="#374151" strokeWidth="1" rx="4" opacity={0.9} />
          <circle cx="15" cy="15" r="4" fill="#ec4899" />
          <text x="25" y="19" fill="#fff" fontSize="11">App Platform</text>
          <circle cx="15" cy="35" r="4" fill="#06b6d4" />
          <text x="25" y="39" fill="#fff" fontSize="11">WebBuilder</text>
          <circle cx="15" cy="55" r="4" fill="#10b981" />
          <text x="25" y="59" fill="#fff" fontSize="11">Virtual Space</text>
        </g>
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
    totalWebBuilders: 0,
    totalVirtualSpaces: 0,
    activeProjects: 0,
    activeWebBuilders: 0,
    activeVirtualSpaces: 0,
  });

  const [buildStats, setBuildStats] = useState<BuildStats>({
    successfulBuildPercentage: 0,
    failedBuildPercentage: 0,
    webBuilderSuccessRate: 0,
    virtualSpaceSuccessRate: 0,
  });

  const [recentDeployments, setRecentDeployments] = useState<RecentDeployment[]>([]);
  const [activeProjects, setActiveProjects] = useState<ProjectData[]>([]);
  const [activeWebBuilders, setActiveWebBuilders] = useState<WebBuilderData[]>([]);
  const [activeVirtualSpaces, setActiveVirtualSpaces] = useState<VirtualSpaceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    if (!user?._id && !user?.username) {
      console.log('No user identifier found');
      return;
    }
    
    setIsLoading(true);
    try {
      // Fetch App Platform projects
      const projectsRes = await fetch('/api/project/crud');
      const projectsData = await projectsRes.json();
      
      // Fetch WebBuilder projects
      const webBuildersRes = await fetch('/api/project/wordpress');
      const webBuildersData = await webBuildersRes.json();

      // Fetch Virtual Space projects
      const virtualSpacesRes = await fetch('/api/project/virtualspace');
      const virtualSpacesData = await virtualSpacesRes.json();
      
      let projects: ProjectData[] = [];
      let webBuilders: WebBuilderData[] = [];
      let virtualSpaces: VirtualSpaceData[] = [];

      if (projectsData.success && projectsData.projectdata) {
        projects = projectsData.projectdata;
        setActiveProjects(projects);
      }

      if (webBuildersData.success && webBuildersData.projectdata) {
        webBuilders = webBuildersData.projectdata;
        setActiveWebBuilders(webBuilders);
      }

      if (virtualSpacesData.success && virtualSpacesData.projectdata) {
        virtualSpaces = virtualSpacesData.projectdata;
        setActiveVirtualSpaces(virtualSpaces);
      }
      
      const totalDeployments = projects.length;
      const totalWebBuilders = webBuilders.length;
      const totalVirtualSpaces = virtualSpaces.length;
      const activeProjectsCount = projects.filter((p: ProjectData) => 
        p.projectstatus === 'live' || p.projectstatus === 'building'
      ).length;
      const activeWebBuildersCount = webBuilders.filter((w: WebBuilderData) => 
        w.projectstatus === 'live' || w.projectstatus === 'building'
      ).length;
      const activeVirtualSpacesCount = virtualSpaces.filter((v: VirtualSpaceData) => 
        v.projectstatus === 'live' || v.projectstatus === 'creating'
      ).length;
      
      const chartData = generateChartDataFromProjects(projects, webBuilders, virtualSpaces);
      
      setDeploymentStats({
        chartData,
        totalDeployments,
        totalWebBuilders,
        totalVirtualSpaces,
        activeProjects: activeProjectsCount,
        activeWebBuilders: activeWebBuildersCount,
        activeVirtualSpaces: activeVirtualSpacesCount,
      });
      
      // Calculate success rates
      const liveProjects = projects.filter((p: ProjectData) => p.projectstatus === 'live').length;
      const failedProjects = projects.filter((p: ProjectData) => p.projectstatus === 'failed').length;
      const totalFinishedProjects = liveProjects + failedProjects;
      
      const liveWebBuilders = webBuilders.filter((w: WebBuilderData) => w.projectstatus === 'live').length;
      const failedWebBuilders = webBuilders.filter((w: WebBuilderData) => w.projectstatus === 'failed').length;
      const totalFinishedWebBuilders = liveWebBuilders + failedWebBuilders;

      const liveVirtualSpaces = virtualSpaces.filter((v: VirtualSpaceData) => v.projectstatus === 'live').length;
      const failedVirtualSpaces = virtualSpaces.filter((v: VirtualSpaceData) => v.projectstatus === 'failed').length;
      const totalFinishedVirtualSpaces = liveVirtualSpaces + failedVirtualSpaces;
      
      const projectSuccessRate = totalFinishedProjects > 0 ? Math.round((liveProjects / totalFinishedProjects) * 100) : 0;
      const webBuilderSuccessRate = totalFinishedWebBuilders > 0 ? Math.round((liveWebBuilders / totalFinishedWebBuilders) * 100) : 0;
      const virtualSpaceSuccessRate = totalFinishedVirtualSpaces > 0 ? Math.round((liveVirtualSpaces / totalFinishedVirtualSpaces) * 100) : 0;
      
      setBuildStats({
        successfulBuildPercentage: projectSuccessRate,
        failedBuildPercentage: 100 - projectSuccessRate,
        webBuilderSuccessRate: webBuilderSuccessRate,
        virtualSpaceSuccessRate: virtualSpaceSuccessRate,
      });
      
      // Combine recent deployments from all sources
      const projectDeployments = projects
        .filter((p: ProjectData) => p.lastdeploy || p.startdate)
        .map((p: ProjectData) => ({
          id: p._id,
          projectName: p.name,
          status: p.projectstatus as 'live' | 'failed' | 'building' | 'creating',
          timestamp: new Date(p.lastdeploy || p.startdate || new Date()),
          techStack: p.techused,
          projectUrl: p.projecturl,
          type: 'app-platform' as const,
        }));

      const webBuilderDeployments = webBuilders
        .filter((w: WebBuilderData) => w.startdate || w.updatedAt)
        .map((w: WebBuilderData) => ({
          id: w._id,
          projectName: w.name,
          status: w.projectstatus as 'live' | 'failed' | 'building' | 'creating',
          timestamp: new Date(w.updatedAt || w.startdate || new Date()),
          projectUrl: w.projecturl,
          type: 'webbuilder' as const,
          webBuilderType: w.webbuilder,
        }));

      const virtualSpaceDeployments = virtualSpaces
        .filter((v: VirtualSpaceData) => v.startdate || v.updatedAt)
        .map((v: VirtualSpaceData) => ({
          id: v._id,
          projectName: v.name,
          status: v.projectstatus as 'live' | 'failed' | 'building' | 'creating',
          timestamp: new Date(v.updatedAt || v.startdate || new Date()),
          projectUrl: v.url || v.projecturl,
          type: 'virtualspace' as const,
        }));

      const allDeployments = [...projectDeployments, ...webBuilderDeployments, ...virtualSpaceDeployments]
        .sort((a: RecentDeployment, b: RecentDeployment) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);
      
      setRecentDeployments(allDeployments);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateChartDataFromProjects = (projects: ProjectData[], webBuilders: WebBuilderData[], virtualSpaces: VirtualSpaceData[]) => {
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

      const webBuildersInMonth = webBuilders.filter((w: WebBuilderData) => {
        const webBuilderDate = new Date(w.startdate || w.updatedAt || 0);
        return webBuilderDate.getMonth() === date.getMonth() && 
               webBuilderDate.getFullYear() === date.getFullYear();
      }).length;

      const virtualSpacesInMonth = virtualSpaces.filter((v: VirtualSpaceData) => {
        const virtualSpaceDate = new Date(v.startdate || v.updatedAt || 0);
        return virtualSpaceDate.getMonth() === date.getMonth() && 
               virtualSpaceDate.getFullYear() === date.getFullYear();
      }).length;
      
      last6Months.push({
        name: monthName,
        deployments: deploymentsInMonth,
        webbuilders: webBuildersInMonth,
        virtualspaces: virtualSpacesInMonth,
      });
    }
    
    return last6Months;
  };

  useEffect(() => {
    if (user && (user._id || user.username)) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 120000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
    }
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

  const getTechStackIcon = (techStack?: string, webBuilderType?: string, type?: string) => {
    if (type === 'virtualspace') {
      return '💻 Virtual Space';
    }

    if (webBuilderType) {
      switch (webBuilderType.toLowerCase()) {
        case 'wordpress': return '🏗️ WordPress';
        case 'joomla': return '⚡ Joomla';
        case 'drupal': return '🛡️ Drupal';
        case 'prestashop': return '🛒 PrestaShop';
        case 'opencart': return '🛍️ OpenCart';
        case 'magento': return '💼 Magento';
        default: return '🌐 WebBuilder';
      }
    }

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
    const current = deploymentStats.chartData[deploymentStats.chartData.length - 1];
    const previous = deploymentStats.chartData[deploymentStats.chartData.length - 2];
    const currentTotal = (current?.deployments || 0) + (current?.webbuilders || 0) + (current?.virtualspaces || 0);
    const previousTotal = (previous?.deployments || 0) + (previous?.webbuilders || 0) + (previous?.virtualspaces || 0);
    const change = previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal * 100);
    return { change: Math.abs(change).toFixed(1), isPositive: currentTotal >= previousTotal };
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

          {/* Key Metrics - Updated for all three platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total App Platform Deployments */}
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
                        <Code className="w-5 h-5 text-pink-400" />
                      </div>
                      <span className="text-gray-300 font-medium">App Platform</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {deploymentStats.totalDeployments}
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
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total WebBuilder Projects */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 h-full group transition-all duration-300 hover:border-purple-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                        <Globe className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-gray-300 font-medium">WebBuilder</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {deploymentStats.totalWebBuilders}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Live:</span>
                      <span className="text-emerald-400 font-medium">{activeWebBuilders.filter(w => w.projectstatus === 'live').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>WordPress:</span>
                      <span className="text-blue-400 font-medium">{activeWebBuilders.filter(w => w.webbuilder === 'WordPress').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Virtual Spaces */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 h-full group transition-all duration-300 hover:border-emerald-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                        <CloudLightning className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Virtual Space</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                    {deploymentStats.totalVirtualSpaces}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Live:</span>
                      <span className="text-emerald-400 font-medium">{activeVirtualSpaces.filter(v => v.projectstatus === 'live').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Creating:</span>
                      <span className="text-amber-400 font-medium">{activeVirtualSpaces.filter(v => v.projectstatus === 'creating').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Combined Active Projects */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 h-full group transition-all duration-300 hover:border-cyan-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                        <Activity className="w-5 h-5 text-cyan-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Active Total</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {deploymentStats.activeProjects + deploymentStats.activeWebBuilders + deploymentStats.activeVirtualSpaces}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Apps:</span>
                      <span className="text-pink-400 font-medium">{deploymentStats.activeProjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Web:</span>
                      <span className="text-purple-400 font-medium">{deploymentStats.activeWebBuilders}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Combined Success Rate */}
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 h-full group transition-all duration-300 hover:border-yellow-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                        <PieChart className="w-5 h-5 text-yellow-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Success Rate</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                    {Math.round(((buildStats.successfulBuildPercentage + buildStats.webBuilderSuccessRate + buildStats.virtualSpaceSuccessRate) / 3) || 0)}%
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Apps:</span>
                      <span className="text-emerald-400 font-medium">{buildStats.successfulBuildPercentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>V-Space:</span>
                      <span className="text-emerald-400 font-medium">{buildStats.virtualSpaceSuccessRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Combined Deployment Trends Chart */}
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
                        <BarChart3 className="w-5 h-5 text-pink-400" />
                      </div>
                      Platform Deployment Trends
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

            {/* Success Rate Stats */}
            <motion.div variants={fadeIn} className="space-y-6">
              {/* App Platform Success */}
              <div className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-emerald-900/20 via-black to-black border border-emerald-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-emerald-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-emerald-100 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg">
                        <Code className="w-5 h-5 text-emerald-400" />
                      </div>
                      App Platform
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

              {/* Virtual Space Success */}
              <div className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-emerald-900/20 via-black to-black border border-emerald-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-emerald-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-emerald-100 mb-4 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
                        <CloudLightning className="w-5 h-5 text-emerald-400" />
                      </div>
                      Virtual Space
                    </h3>
                    <div className="flex justify-center">
                      <DonutChart 
                        percentage={buildStats.virtualSpaceSuccessRate} 
                        color="#22c55e" 
                        label="Success"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Deployments - Combined */}
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
                      Recent Activity
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
                                    <span className={`text-xs px-2 py-1 rounded-md border ${
                                      deployment.type === 'webbuilder' 
                                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                                        : deployment.type === 'virtualspace'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                        : 'bg-pink-500/10 border-pink-500/30 text-pink-300'
                                    }`}>
                                      {deployment.type === 'webbuilder' ? 'WebBuilder' : 
                                       deployment.type === 'virtualspace' ? 'Virtual Space' : 'App Platform'}
                                    </span>
                                    {(deployment.techStack || deployment.webBuilderType) && (
                                      <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md">
                                        {getTechStackIcon(deployment.techStack, deployment.webBuilderType, deployment.type)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-400 mt-1">
                                    {deployment.timestamp.toLocaleString()}
                                  </div>
                                  {deployment.projectUrl && deployment.status === 'live' && (
                                    <motion.a 
                                      href={deployment.type === 'virtualspace' 
                                        ? `http://${deployment.projectUrl}` 
                                        : `https://${deployment.projectUrl}`}
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

            {/* Quick Actions - Updated for all three platforms */}
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
                        <span className="font-medium">New App Deployment</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      onClick={() => router.push("/project/createproject/webbuilder")}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl transition-all duration-300 group/btn shadow-lg shadow-purple-500/25"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-white/20 rounded-lg">
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="font-medium">New WebBuilder Site</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      onClick={() => router.push("/project/createproject/virtualspace")}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-xl transition-all duration-300 group/btn shadow-lg shadow-emerald-500/25"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-white/20 rounded-lg">
                          <CloudLightning className="w-4 h-4" />
                        </div>
                        <span className="font-medium">New Virtual Space</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => router.push("/project")}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-300 group/btn border border-gray-700/50 hover:border-pink-500/30"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-gray-600/50 rounded-lg">
                          <Layers className="w-4 h-4 text-gray-400 group-hover/btn:text-pink-400 transition-colors" />
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
                          <Settings className="w-4 h-4 text-gray-400 group-hover/btn:text-pink-400 transition-colors" />
                        </div>
                        <span className="font-medium">Settings</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform text-gray-400 group-hover/btn:text-pink-400" />
                    </motion.button>
                  </div>

                  {/* Combined Project Status Overview */}
                  <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <div className="p-1 bg-gray-600/50 rounded-lg">
                        <Monitor className="w-4 h-4 text-pink-400" />
                      </div>
                      Your Projects ({activeProjects.length + activeWebBuilders.length + activeVirtualSpaces.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                      <AnimatePresence>
                        {/* Show App Platform projects */}
                        {activeProjects.slice(0, 2).map((project, index) => (
                          <motion.div 
                            key={`app-${project._id}`}
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
                                <span className="text-xs px-2 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-300 rounded-md">
                                  App
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md">
                                  {getTechStackIcon(project.techused)}
                                </span>
                                <span className="truncate font-medium group-hover/project:text-pink-300 transition-colors max-w-24">
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

                        {/* Show WebBuilder projects */}
                        {activeWebBuilders.slice(0, 2).map((webBuilder, index) => (
                          <motion.div 
                            key={`web-${webBuilder._id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: (activeProjects.length + index) * 0.05 }}
                            className="group/project relative"
                          >
                            <div 
                              className="relative flex items-center justify-between text-sm p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all duration-300 border border-transparent hover:border-purple-500/20 cursor-pointer"
                              onClick={() => router.push(`/project/overview?id=${webBuilder._id}&type=webbuilder`)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-md">
                                  Web
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md">
                                  {getTechStackIcon(undefined, webBuilder.webbuilder)}
                                </span>
                                <span className="truncate font-medium group-hover/project:text-purple-300 transition-colors max-w-24">
                                  {webBuilder.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(webBuilder.projectstatus)}`}>
                                  {webBuilder.projectstatus}
                                </span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/project:opacity-100 transition-opacity text-purple-400" />
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Show Virtual Space projects */}
                        {activeVirtualSpaces.slice(0, 2).map((virtualSpace, index) => (
                          <motion.div 
                            key={`vspace-${virtualSpace._id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: (activeProjects.length + activeWebBuilders.length + index) * 0.05 }}
                            className="group/project relative"
                          >
                            <div 
                              className="relative flex items-center justify-between text-sm p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all duration-300 border border-transparent hover:border-emerald-500/20 cursor-pointer"
                              onClick={() => router.push(`/project/overview?id=${virtualSpace._id}&type=virtualspace`)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-md">
                                  VS
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md">
                                  💻 IDE
                                </span>
                                <span className="truncate font-medium group-hover/project:text-emerald-300 transition-colors max-w-24">
                                  {virtualSpace.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(virtualSpace.projectstatus)}`}>
                                  {virtualSpace.projectstatus}
                                </span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/project:opacity-100 transition-opacity text-emerald-400" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {(activeProjects.length === 0 && activeWebBuilders.length === 0 && activeVirtualSpaces.length === 0) && (
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
                      
                      {(activeProjects.length + activeWebBuilders.length + activeVirtualSpaces.length > 6) && (
                        <motion.button 
                          onClick={() => router.push("/project")}
                          className="w-full text-center text-gray-400 text-sm py-3 hover:text-pink-400 transition-colors rounded-lg hover:bg-gray-800/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          View all {activeProjects.length + activeWebBuilders.length + activeVirtualSpaces.length} projects →
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Stats Row - Updated for all three platforms */}
          <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                value: activeProjects.filter(p => p.techused?.toLowerCase().includes('react')).length,
                label: "React Apps",
                iconComponent: <Code className="w-5 h-5 text-pink-400" />,
                gradient: "from-cyan-400 to-blue-400"
              },
              {
                value: activeWebBuilders.filter(w => w.webbuilder === 'WordPress').length,
                label: "WordPress Sites",
                iconComponent: <Globe className="w-5 h-5 text-pink-400" />,
                gradient: "from-purple-400 to-blue-400"
              },
              {
                value: activeVirtualSpaces.filter(v => v.projectstatus === 'live').length,
                label: "Live V-Spaces",
                iconComponent: <CloudLightning className="w-5 h-5 text-pink-400" />,
                gradient: "from-emerald-400 to-green-400"
              },
              {
                value: deploymentStats.chartData.reduce((sum, month) => sum + month.deployments + month.webbuilders + month.virtualspaces, 0),
                label: "Total This Year",
                iconComponent: <BarChart3 className="w-5 h-5 text-pink-400" />,
                gradient: "from-purple-400 to-pink-400"
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
                        {stat.iconComponent}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Platform Comparison Section */}
          <motion.div variants={fadeIn}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* App Platform Summary */}
              <div className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-pink-900/20 via-black to-black border border-pink-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-pink-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl">
                        <Code className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-pink-100">App Platform</h3>
                        <p className="text-pink-300/60 text-sm">Deploy applications from Git repositories</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-pink-400">{deploymentStats.totalDeployments}</div>
                        <div className="text-xs text-pink-300">Total Apps</div>
                      </div>
                      <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-400">{deploymentStats.activeProjects}</div>
                        <div className="text-xs text-emerald-300">Active</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-pink-400 font-medium">{buildStats.successfulBuildPercentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Most Used:</span>
                        <span className="text-pink-400 font-medium">
                          {activeProjects.reduce((prev, current) => {
                            const prevCount = activeProjects.filter(p => p.techused === prev.techused).length;
                            const currentCount = activeProjects.filter(p => p.techused === current.techused).length;
                            return currentCount > prevCount ? current : prev;
                          }, activeProjects[0])?.techused || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => router.push("/project/app-platform")}
                      className="w-full mt-4 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 hover:from-pink-500/30 hover:to-purple-500/30 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-pink-300 font-medium">View App Platform</span>
                      <ArrowRight className="w-4 h-4 text-pink-400 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* WebBuilder Summary */}
              <div className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-purple-900/20 via-black to-black border border-purple-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-purple-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                        <Globe className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-100">WebBuilder</h3>
                        <p className="text-purple-300/60 text-sm">Deploy CMS and website builders</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{deploymentStats.totalWebBuilders}</div>
                        <div className="text-xs text-purple-300">Total Sites</div>
                      </div>
                      <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-400">{deploymentStats.activeWebBuilders}</div>
                        <div className="text-xs text-emerald-300">Active</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-purple-400 font-medium">{buildStats.webBuilderSuccessRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Most Used:</span>
                        <span className="text-purple-400 font-medium">
                          {activeWebBuilders.reduce((prev, current) => {
                            const prevCount = activeWebBuilders.filter(w => w.webbuilder === prev.webbuilder).length;
                            const currentCount = activeWebBuilders.filter(w => w.webbuilder === current.webbuilder).length;
                            return currentCount > prevCount ? current : prev;
                          }, activeWebBuilders[0])?.webbuilder || 'WordPress'}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => router.push("/project/webbuilder")}
                      className="w-full mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-blue-500/30 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-purple-300 font-medium">View WebBuilder</span>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Virtual Space Summary */}
              <div className="relative overflow-hidden">
                <div className="relative bg-gradient-to-br from-emerald-900/20 via-black to-black border border-emerald-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-emerald-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl">
                        <CloudLightning className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-100">Virtual Space</h3>
                        <p className="text-emerald-300/60 text-sm">Cloud development environments</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-400">{deploymentStats.totalVirtualSpaces}</div>
                        <div className="text-xs text-emerald-300">Total Spaces</div>
                      </div>
                      <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{deploymentStats.activeVirtualSpaces}</div>
                        <div className="text-xs text-green-300">Active</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-emerald-400 font-medium">{buildStats.virtualSpaceSuccessRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Environment:</span>
                        <span className="text-emerald-400 font-medium">VS Code IDE</span>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => router.push("/vspace")}
                      className="w-full mt-4 p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-green-500/30 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-emerald-300 font-medium">View Virtual Space</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technology Distribution - Updated for all platforms */}
          <motion.div variants={fadeIn}>
            <div className="relative overflow-hidden">
              <div className="relative bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 group transition-all duration-300 hover:border-pink-500/40">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    Technology Distribution
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* App Platform Technologies */}
                    {Array.from(new Set(activeProjects.map(p => p.techused).filter(Boolean))).map((tech, index) => {
                      const count = activeProjects.filter(p => p.techused === tech).length;
                      return (
                        <motion.div
                          key={`app-${tech}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg hover:bg-pink-500/20 transition-all duration-300"
                        >
                          <div className="text-2xl mb-2">
                            {tech === 'React' ? '⚛️' : 
                             tech === 'Vue.js' ? '💚' :
                             tech === 'Angular' ? '🅰️' :
                             tech === 'Next.js' ? '▲' :
                             tech === 'Node.js' ? '🟢' :
                             tech === 'Python' ? '🐍' : '💻'}
                          </div>
                          <div className="font-semibold text-pink-400">{count}</div>
                          <div className="text-xs text-gray-400 mt-1">{tech}</div>
                        </motion.div>
                      );
                    })}

                    {/* WebBuilder Technologies */}
                    {Array.from(new Set(activeWebBuilders.map(w => w.webbuilder).filter(Boolean))).map((webBuilder, index) => {
                      const count = activeWebBuilders.filter(w => w.webbuilder === webBuilder).length;
                      return (
                        <motion.div
                          key={`web-${webBuilder}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (activeProjects.length + index) * 0.1 }}
                          className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all duration-300"
                        >
                          <div className="text-2xl mb-2">
                            {webBuilder === 'WordPress' ? '🏗️' :
                             webBuilder === 'Joomla' ? '⚡' :
                             webBuilder === 'Drupal' ? '🛡️' :
                             webBuilder === 'PrestaShop' ? '🛒' :
                             webBuilder === 'OpenCart' ? '🛍️' :
                             webBuilder === 'Magento' ? '💼' : '🌐'}
                          </div>
                          <div className="font-semibold text-purple-400">{count}</div>
                          <div className="text-xs text-gray-400 mt-1">{webBuilder}</div>
                        </motion.div>
                      );
                    })}

                    {/* Virtual Space Technologies */}
                    {activeVirtualSpaces.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (activeProjects.length + activeWebBuilders.length) * 0.1 }}
                        className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all duration-300"
                      >
                        <div className="text-2xl mb-2">💻</div>
                        <div className="font-semibold text-emerald-400">{activeVirtualSpaces.length}</div>
                        <div className="text-xs text-gray-400 mt-1">Virtual Spaces</div>
                      </motion.div>
                    )}

                    {/* Cloud IDE Environment */}
                    {activeVirtualSpaces.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (activeProjects.length + activeWebBuilders.length + 1) * 0.1 }}
                        className="text-center p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-all duration-300"
                      >
                        <div className="text-2xl mb-2">☁️</div>
                        <div className="font-semibold text-cyan-400">{activeVirtualSpaces.filter(v => v.projectstatus === 'live').length}</div>
                        <div className="text-xs text-gray-400 mt-1">Cloud IDEs</div>
                      </motion.div>
                    )}
                  </div>

                  {(activeProjects.length === 0 && activeWebBuilders.length === 0 && activeVirtualSpaces.length === 0) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-gray-400 py-12"
                    >
                      <div className="text-6xl opacity-20 mb-4">📊</div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">No technology data available</p>
                        <p className="text-sm text-gray-500">Deploy projects to see technology distribution</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardHero;