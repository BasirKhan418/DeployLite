import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, RefreshCw, XCircle, Rocket, Copy, Play, Pause, Terminal, Filter, ChevronDown, Code, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { io, Socket } from 'socket.io-client';
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};


interface ProjectData {
  _id: string;
  name: string;
  projectstatus: 'creating' | 'live' | 'failed';
  error?: string;
}

interface LogMessage {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning' | 'debug';
  projectId?: string;
  level?: number;
  component?: string;
}

interface StatusCardProps {
  deploymentTime: number;
  error?: string | null;
  projectData: ProjectData;
}

interface RuntimeLogsProps {
  projectdata: ProjectData;
}

// JSON Formatter Component
const JsonFormatter = ({ data, level = 0 }: { data: any; level?: number }) => {
  const [collapsed, setCollapsed] = useState(level > 2);
  
  if (typeof data !== 'object' || data === null) {
    return (
      <span className={`
        ${typeof data === 'string' ? 'text-emerald-400' : ''}
        ${typeof data === 'number' ? 'text-blue-400' : ''}
        ${typeof data === 'boolean' ? 'text-purple-400' : ''}
        ${data === null ? 'text-gray-400' : ''}
      `}>
        {JSON.stringify(data)}
      </span>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray ? data : Object.entries(data);
  const isEmpty = entries.length === 0;

  return (
    <div className="inline">
      <span className="text-yellow-400">{isArray ? '[' : '{'}</span>
      {!isEmpty && (
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 mx-1 hover:bg-gray-700"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
        </Button>
      )}
      
      {!collapsed && !isEmpty && (
        <div className="ml-4 border-l border-gray-600 pl-2">
          {isArray ? (
            data.map((item: any, index: number) => (
              <div key={index} className="my-1">
                <span className="text-gray-400">{index}: </span>
                <JsonFormatter data={item} level={level + 1} />
                {index < data.length - 1 && <span className="text-yellow-400">,</span>}
              </div>
            ))
          ) : (
            Object.entries(data).map(([key, value], index) => (
              <div key={key} className="my-1">
                <span className="text-pink-400">"{key}"</span>
                <span className="text-yellow-400">: </span>
                <JsonFormatter data={value} level={level + 1} />
                {index < Object.entries(data).length - 1 && <span className="text-yellow-400">,</span>}
              </div>
            ))
          )}
        </div>
      )}
      
      {collapsed && !isEmpty && (
        <span className="text-gray-500 mx-1">...</span>
      )}
      
      <span className="text-yellow-400">{isArray ? ']' : '}'}</span>
    </div>
  );
};

// Enhanced Status Cards
const CreatingCard: React.FC<StatusCardProps> = ({ deploymentTime, projectData }) => (
  <motion.div variants={fadeIn}>
    <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-indigo-100">
          <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg">
            <Rocket className="w-6 h-6 text-indigo-400" />
          </div>
          Deployment in Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-100">
              Building "{projectData.name}"
            </h3>
            <p className="text-sm text-indigo-300">
              Compiling and deploying your application
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-indigo-300">
            <span>Progress</span>
            <span>{Math.min(Math.floor((deploymentTime / 300) * 100), 95)}%</span>
          </div>
          <div className="w-full bg-indigo-900/30 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(Math.floor((deploymentTime / 300) * 100), 95)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-indigo-400">
            <span>Time elapsed: {deploymentTime}s</span>
            <span>Est. {Math.max(300 - deploymentTime, 30)}s remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-indigo-300">Installing dependencies</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-purple-300">Building assets</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const LiveCard: React.FC<StatusCardProps> = ({ deploymentTime, projectData }) => (
  <motion.div variants={fadeIn}>
    <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-emerald-100">
          <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          Deployment Successful
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full opacity-30 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-100">
              "{projectData.name}" is Live
            </h3>
            <p className="text-sm text-emerald-300">
              Your application is successfully deployed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-2xl font-bold text-emerald-400">{deploymentTime}s</div>
            <div className="text-xs text-emerald-300">Build Time</div>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">100%</div>
            <div className="text-xs text-green-300">Success Rate</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-300">Status</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Live</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-300">Health</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400">Healthy</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const FailedCard: React.FC<StatusCardProps> = ({ error, projectData }) => (
  <motion.div variants={fadeIn}>
    <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-red-100">
          <div className="p-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          Deployment Failed
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <XCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-100">
              Build Error in "{projectData.name}"
            </h3>
            <p className="text-sm text-red-300">
              Deployment failed during build process
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-300 mb-1">Error Details:</div>
                <code className="text-xs text-red-200 font-mono break-all">
                  {error}
                </code>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Deployment
          </Button>
          <Button 
            variant="outline"
            className="border-red-500/30 text-red-300 hover:bg-red-500/10"
          >
            <Terminal className="w-4 h-4 mr-2" />
            Debug
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const STATUS_CARDS: Record<ProjectData['projectstatus'], React.FC<StatusCardProps>> = {
  creating: CreatingCard,
  live: LiveCard,
  failed: FailedCard
};

const RuntimeLogs: React.FC<RuntimeLogsProps> = ({ projectdata }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [projectData, setProjectData] = useState<ProjectData>(projectdata);
  const [deploymentTime, setDeploymentTime] = useState<number>(0);
  const [messages, setMessages] = useState<LogMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);


  const [pendingScrolls, setPendingScrolls] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [messageQueue, setMessageQueue] = useState<LogMessage[]>([]);
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef<number>(0);
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const formattedLogsContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("logs");

  const fetchProjectData = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/project/details?id=${id}`);
      const result = await response.json();
      
      if (result.success) {
        setProjectData(result.projectdata);
        setError(null);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("Service temporarily unavailable");
    }
  };


  const scrollToBottomSmooth = useCallback(() => {
    if (!autoScroll || isScrolling) return;

    const currentContainer = activeTab === 'logs' ? logsContainerRef.current : formattedLogsContainerRef.current;
    
    if (currentContainer) {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      
    
      if (timeSinceLastScroll < 200) {
        setPendingScrolls(prev => prev + 1);
        return;
      }

      setIsScrolling(true);
      lastScrollTime.current = now;

     
      requestAnimationFrame(() => {
        if (currentContainer) {
          currentContainer.scrollTo({
            top: currentContainer.scrollHeight,
            behavior: 'smooth'
          });

      
          setTimeout(() => {
            setIsScrolling(false);
         
            if (pendingScrolls > 0) {
              setPendingScrolls(0);
              setTimeout(() => {
                if (autoScroll && currentContainer) {
                  currentContainer.scrollTo({
                    top: currentContainer.scrollHeight,
                    behavior: 'smooth'
                  });
                }
              }, 100);
            }
          }, 400); 
        }
      });
    }
  }, [autoScroll, activeTab, pendingScrolls]);

  const flushMessageQueue = useCallback(() => {
    if (messageQueue.length > 0) {
      setMessages(prev => [...prev, ...messageQueue]);
      setMessageQueue([]);
      
     
      setTimeout(() => {
        scrollToBottomSmooth();
      }, 50);
    }
  }, [messageQueue, scrollToBottomSmooth]);


  const addMessageToQueue = useCallback((message: LogMessage) => {
    setMessageQueue(prev => [...prev, message]);
    

    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }
    
    flushTimeoutRef.current = setTimeout(() => {
      flushMessageQueue();
    }, 150);
  }, [flushMessageQueue]);

  
  const parseLogMessage = useCallback((content: any): LogMessage => {
    let message = '';
    let type: LogMessage['type'] = 'info';
    let timestamp = new Date().toISOString();

    try {
      if (typeof content === 'string') {
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(content);
          message = parsed.message || parsed.log || content;
          type = parsed.level || parsed.type || 'info';
          timestamp = parsed.timestamp || timestamp;
        } catch {
          message = content;
        }
      } else if (typeof content === 'object') {
        message = content.message || content.log || JSON.stringify(content);
        type = content.level || content.type || 'info';
        timestamp = content.timestamp || timestamp;
      }

     
      if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
        type = 'error';
      } else if (message.toLowerCase().includes('warning') || message.toLowerCase().includes('warn')) {
        type = 'warning';
      } else if (message.toLowerCase().includes('success') || message.toLowerCase().includes('completed')) {
        type = 'success';
      } else if (message.toLowerCase().includes('debug')) {
        type = 'debug';
      }

    } catch (err) {
      message = 'Error parsing log message';
      type = 'error';
    }

    return {
      timestamp,
      message,
      type,
      projectId: projectdata._id
    };
  }, [projectdata._id]);

  useEffect(() => {
    if (!projectdata?._id) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      setDeploymentTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    const newSocket: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      clearInterval(timer);
    };
  }, [projectdata?._id]);

  useEffect(() => {
    if (!socket || !projectdata?.name || isPaused) return;

    const handleMessage = (msg: any) => {
      try {
        const logMessage = parseLogMessage(msg);
        
        if (!logMessage.projectId || logMessage.projectId === projectdata._id) {
          // Add to queue instead of directly to messages
          addMessageToQueue(logMessage);
          
          // Check for deployment status updates
          if (logMessage.message.toLowerCase().includes('deployment status updated')) {
            fetchProjectData(projectdata._id);
          }
        }
      } catch (err) {
        console.error('Error handling message:', err);
      }
    };

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe', `logs:${projectdata.name}`);
      const connectMessage = {
        timestamp: new Date().toISOString(),
        message: `Connected to log stream for ${projectdata.name}`,
        type: 'success' as LogMessage['type'],
        projectId: projectdata._id
      };
      addMessageToQueue(connectMessage);
    });

    socket.on('message', handleMessage);
    
    socket.on('disconnect', () => {
      setIsConnected(false);
      const disconnectMessage = {
        timestamp: new Date().toISOString(),
        message: 'Disconnected from log stream',
        type: 'warning' as LogMessage['type'],
        projectId: projectdata._id
      };
      addMessageToQueue(disconnectMessage);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('disconnect');
    };
  }, [socket, projectdata?.name, projectdata?._id, isPaused, parseLogMessage, addMessageToQueue]);

  // Enhanced scroll detection to pause auto-scroll when user manually scrolls up
  useEffect(() => {
    const currentContainer = activeTab === 'logs' ? logsContainerRef.current : formattedLogsContainerRef.current;
    
    if (!currentContainer) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (!autoScroll) return;
      
      const { scrollTop, scrollHeight, clientHeight } = currentContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // If user scrolled away from bottom, temporarily disable auto-scroll
      if (!isNearBottom && !isScrolling) {
        setAutoScroll(false);
        toast.info("Auto-scroll paused. Scroll to bottom or click the button to resume.");
        
        // Re-enable auto-scroll after 10 seconds of no manual scrolling
        scrollTimeout = setTimeout(() => {
          setAutoScroll(true);
          toast.success("Auto-scroll resumed");
        }, 10000);
      }
    };

    currentContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      currentContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeTab, autoScroll, isScrolling]);

  // Scroll when tab changes or auto-scroll is toggled
  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      setTimeout(() => {
        scrollToBottomSmooth();
      }, 100);
    }
  }, [activeTab, autoScroll, scrollToBottomSmooth]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Filter logs based on search and type
  const filteredLogs = useMemo(() => {
    let filtered = messages;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log?.message?.toLowerCase().includes(query)
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.type === filterType);
    }
    
    return filtered;
  }, [messages, searchQuery, filterType]);

  const handleExport = (): void => {
    const logText = messages
      .filter(log => log?.message && log?.timestamp)
      .map(log => `[${log.timestamp}] [${log.type?.toUpperCase()}] ${log.message}`)
      .join('\n');
      
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-logs-${projectData.name}-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exported successfully");
  };

  const formatMessage = (message: string) => {
    // Try to parse and format JSON
    try {
      const parsed = JSON.parse(message);
      return <JsonFormatter data={parsed} />;
    } catch {
      // Not JSON, return as regular text with syntax highlighting
      return (
        <span className="break-words">
          {message.split(/(\b(?:error|warning|success|info|debug)\b)/gi).map((part, index) => {
            const lower = part.toLowerCase();
            if (lower === 'error') return <span key={index} className="text-red-400 font-semibold">{part}</span>;
            if (lower === 'warning') return <span key={index} className="text-yellow-400 font-semibold">{part}</span>;
            if (lower === 'success') return <span key={index} className="text-emerald-400 font-semibold">{part}</span>;
            if (lower === 'info') return <span key={index} className="text-blue-400 font-semibold">{part}</span>;
            if (lower === 'debug') return <span key={index} className="text-purple-400 font-semibold">{part}</span>;
            return <span key={index}>{part}</span>;
          })}
        </span>
      );
    }
  };

  const getLogTypeColor = (type: LogMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'debug': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-gray-300 bg-gray-500/10 border-gray-500/20';
    }
  };

  // Scroll indicator component
  const ScrollIndicator = () => {
    if (!autoScroll && messages.length > 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => {
              setAutoScroll(true);
              scrollToBottomSmooth();
              toast.success("Auto-scroll enabled");
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/25 rounded-full px-6 py-3 font-medium"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Jump to bottom
          </Button>
        </motion.div>
      );
    }
    return null;
  };

  const StatusCard = STATUS_CARDS[projectData.projectstatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black p-4 sm:p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Status Card */}
        {StatusCard && (
          <StatusCard 
            deploymentTime={deploymentTime} 
            error={error} 
            projectData={projectData}
          />
        )}

        {/* Main Logs Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5" />
          
          {/* Header */}
          <CardHeader className="relative border-b border-pink-500/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                  <Terminal className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Runtime Logs
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    {isConnected ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span>Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                        <span>Disconnected</span>
                      </div>
                    )}
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm">{filteredLogs.length} logs</span>
                    {isPaused && (
                      <>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-amber-400 text-sm">Paused</span>
                      </>
                    )}
                  </div>
                </div>
              </CardTitle>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`bg-black/50 border-pink-500/30 hover:bg-pink-500/10 text-gray-200 transition-all duration-300 ${
                    autoScroll ? 'bg-pink-500/20 border-pink-500/50 text-pink-300' : ''
                  }`}
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Auto-scroll {autoScroll ? 'ON' : 'OFF'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                  className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 text-gray-200"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => projectdata?._id && fetchProjectData(projectdata._id)}
                  className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 text-gray-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                  disabled={messages.length === 0}
                  className="bg-black/50 border-pink-500/30 hover:bg-pink-500/10 text-gray-200 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative p-0">
            <Tabs defaultValue="logs" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between p-4 border-b border-pink-500/10">
                <TabsList className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-pink-500/20">
                  <TabsTrigger value="logs" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
                    <Terminal className="w-4 h-4 mr-2" />
                    Live Logs
                  </TabsTrigger>
                  <TabsTrigger value="formatted" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
                    <Code className="w-4 h-4 mr-2" />
                    Formatted View
                  </TabsTrigger>
                </TabsList>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Search logs..."
                      className="pl-10 w-64 bg-black/50 border-gray-700 focus:border-pink-500/50 text-white placeholder-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-black/50 border-gray-700">
                        <Filter className="w-4 h-4 mr-2" />
                        {filterType === 'all' ? 'All' : filterType}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                      <DropdownMenuItem onClick={() => setFilterType('all')}>All Logs</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('error')}>Errors</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('warning')}>Warnings</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('success')}>Success</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('info')}>Info</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('debug')}>Debug</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMessages([]);
                      setMessageQueue([]);
                      toast.success("Logs cleared");
                    }}
                    disabled={messages.length === 0}
                    className="bg-black/50 border-gray-700 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <TabsContent value="logs" className="mt-0">
                <div 
                  className="h-[70vh] overflow-auto scroll-smooth" 
                  ref={logsContainerRef}
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="p-4 space-y-2 font-mono text-sm">
                    <AnimatePresence mode="popLayout">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                          <motion.div
                            key={`${log.timestamp}-${index}`}
                            variants={slideIn}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            layout
                            className={`group relative p-3 rounded-lg border transition-all duration-200 hover:bg-opacity-80 ${getLogTypeColor(log.type)}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 pt-1">
                                <Badge variant="outline" className={`text-xs border ${getLogTypeColor(log.type)}`}>
                                  {log.type?.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-gray-400">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </span>
                                  <Clock className="w-3 h-3 text-gray-500" />
                                </div>
                                <div className="break-words">
                                  {formatMessage(log.message)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(log.message);
                                  toast.success("Log message copied to clipboard");
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          variants={fadeIn}
                          className="text-center text-gray-400 py-12"
                        >
                          <Terminal className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <div className="space-y-2">
                            <p className="text-lg font-medium">
                              {messages.length === 0 ? 'No logs yet' : 'No logs match your filter'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {messages.length === 0 
                                ? 'Logs will appear here as your deployment progresses'
                                : 'Try adjusting your search or filter criteria'
                              }
                            </p>
                            {(searchQuery || filterType !== 'all') && (
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setSearchQuery("");
                                  setFilterType("all");
                                }}
                                className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 mt-4"
                              >
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="formatted" className="mt-0">
                <div 
                  className="h-[70vh] overflow-auto scroll-smooth" 
                  ref={formattedLogsContainerRef}
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="p-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                          <motion.div
                            key={`formatted-${log.timestamp}-${index}`}
                            variants={slideIn}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            layout
                            className="relative p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-pink-500/30 transition-all duration-200"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className={getLogTypeColor(log.type)}>
                                  {log.type?.toUpperCase()}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                    onClick={() => {
                                      navigator.clipboard.writeText(log.message);
                                      toast.success("Log message copied to clipboard");
                                    }}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-black/50 p-4 rounded-lg border border-gray-700/50 font-mono text-sm overflow-x-auto">
                                {formatMessage(log.message)}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          variants={fadeIn}
                          className="text-center text-gray-400 py-12"
                        >
                          <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p className="text-lg font-medium">No formatted logs available</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {messages.length === 0 
                              ? 'Logs will appear here as your deployment progresses'
                              : 'Try adjusting your search or filter criteria'
                            }
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Log Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['info', 'error', 'warning', 'success', 'debug'].map((type) => {
            const count = messages.filter(m => m.type === type).length;
            const percentage = messages.length > 0 ? Math.round((count / messages.length) * 100) : 0;
            return (
              <motion.div
                key={type}
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden"
              >
                <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative p-4 text-center">
                    <div className={`text-2xl font-bold ${getLogTypeColor(type as LogMessage['type']).split(' ')[0]} mb-1`}>
                      {count}
                    </div>
                    <div className="text-xs text-gray-400 capitalize mb-2">{type}</div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          type === 'error' ? 'bg-red-400' :
                          type === 'warning' ? 'bg-yellow-400' :
                          type === 'success' ? 'bg-emerald-400' :
                          type === 'debug' ? 'bg-purple-400' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Connection Status Footer */}
        <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-sm text-gray-300">
                    {isConnected ? 'Connected to log stream' : 'Disconnected from log stream'}
                  </span>
                </div>
                {messageQueue.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-sm text-amber-300">
                      Processing {messageQueue.length} messages...
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>Project: <span className="text-gray-300">{projectData.name}</span></span>
                <span>Status: <span className="text-gray-300 capitalize">{projectData.projectstatus}</span></span>
                <span>Total Logs: <span className="text-gray-300">{messages.length}</span></span>
                <span>Filtered: <span className="text-gray-300">{filteredLogs.length}</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default RuntimeLogs;