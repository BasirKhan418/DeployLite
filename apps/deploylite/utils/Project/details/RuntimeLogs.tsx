import { useState, useEffect, useMemo } from "react";
import { Search, Download, RefreshCw, XCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, RefreshCcw } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { io, Socket } from 'socket.io-client';

// Type Definitions
interface ProjectData {
  _id: string;
  name: string;
  projectstatus: 'creating' | 'live' | 'failed';
  error?: string;
}

interface LogMessage {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
  projectId?: string;
}

interface StatusCardProps {
  deploymentTime: number;
  error?: string | null;
}

interface RuntimeLogsProps {
  projectdata: ProjectData;
}

type StatusCardComponent = React.FC<StatusCardProps>;

// Status Card Components
const CreatingCard: StatusCardComponent = ({ deploymentTime }) => (
  <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 border-indigo-200 dark:border-indigo-700">
    <CardHeader>
      <CardTitle className="flex items-center text-indigo-900 dark:text-indigo-100">
        <Rocket className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        Deployment Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
            Deployment in Progress
          </h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Building and deploying your application
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-indigo-200 dark:bg-indigo-700 rounded-full h-2.5">
          <div className="bg-indigo-600 dark:bg-indigo-400 h-2.5 rounded-full animate-pulse" 
               style={{ width: '60%' }} />
        </div>
        <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
          Time elapsed: {deploymentTime}s
        </p>
      </div>
    </CardContent>
  </Card>
);

const LiveCard: StatusCardComponent = ({ deploymentTime }) => (
  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 border-emerald-200 dark:border-emerald-700">
    <CardHeader>
      <CardTitle className="flex items-center text-emerald-900 dark:text-emerald-100">
        <Rocket className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
        Deployment Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="rounded-full h-10 w-10 bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Deployment Successful
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Your application is live
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-emerald-700 dark:text-emerald-300">
          <span>Total Time</span>
          <span>{deploymentTime}s</span>
        </div>
        <div className="flex items-center justify-between text-sm text-emerald-700 dark:text-emerald-300">
          <span>Status</span>
          <span>Live</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FailedCard: StatusCardComponent = ({ error }) => (
  <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200 dark:border-red-700">
    <CardHeader>
      <CardTitle className="flex items-center text-red-900 dark:text-red-100">
        <Rocket className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
        Deployment Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="rounded-full h-10 w-10 bg-red-500 dark:bg-red-400 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Deployment Failed
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">
            Error occurred during deployment
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="p-3 bg-red-200 dark:bg-red-800/50 rounded-md text-sm text-red-800 dark:text-red-200 font-mono">
          {error || "Check the logs for more details"}
        </div>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry Deployment
        </Button>
      </div>
    </CardContent>
  </Card>
);

const STATUS_CARDS: Record<ProjectData['projectstatus'], StatusCardComponent> = {
  creating: CreatingCard,
  live: LiveCard,
  failed: FailedCard
};

const RuntimeLogs: React.FC<RuntimeLogsProps> = ({ projectdata }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [projectData, setProjectData] = useState<ProjectData>(projectdata);
  const [deploymentTime, setDeploymentTime] = useState<number>(0);
  const [messages, setMessages] = useState<LogMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

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

  const createLogMessage = (content: string, type: 'info' | 'error' | 'success' | 'warning' = 'info'): LogMessage => {
    return {
      timestamp: new Date().toISOString(),
      message: content,
      type,
      projectId: projectdata._id
    };
  };

  const handleMessageContent = (content: any): void => {
    let logMessage: LogMessage;

    if (typeof content === 'string') {
      // Handle connection messages
      if (content.startsWith('Joined logs:')) {
        logMessage = createLogMessage(`Connected to log stream`, 'info');
      } else {
        logMessage = createLogMessage(content, 'info');
        if (JSON.parse(content).message.toLowerCase().includes('deployment status updated to:')) {
          fetchProjectData(projectdata._id);
        }
      }
    } else {
      // Handle structured log messages
      logMessage = {
        timestamp: content.timestamp || new Date().toISOString(),
        message: content.message || content.log || '',
        type: content.type || 'info',
        projectId: content.projectId
      };
    console.log('logMessage:', logMessage);
 console.log('logMessage:', logMessage.message);
 console.log('logMessage:', content);
      // Check if this message indicates a status change
      if (JSON.parse(content).message.toLowerCase().includes('deployment status updated to:')) {
        fetchProjectData(projectdata._id);
      }
    }

    // Only add the message if it belongs to this project or is a system message
    if (!logMessage.projectId || logMessage.projectId === projectdata._id) {
      setMessages(prev => [...prev, logMessage]);
    }
  };

  useEffect(() => {
    if (!projectdata?._id) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      setDeploymentTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const newSocket: Socket = io('http://localhost:9000', {
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
    if (!socket || !projectdata?.name) return;

    const handleMessage = (msg: any) => {
      console.log('Received message:', msg);
      try {
        // If the message is a string, try to parse it as JSON first
        if (typeof msg === 'string') {
          try {
            // const parsedMsg = JSON.parse(msg);
            handleMessageContent(msg);
          } catch (parseError) {
            // If parsing fails, treat it as a plain text message
            handleMessageContent(msg);
          }
        } else {
          // If it's already an object, handle it directly
          handleMessageContent(msg);
        }
      } catch (err) {
        console.error('Error handling message:', err);
        setMessages(prev => [...prev, createLogMessage(`Error processing log message: ${err.message}`, 'error')]);
      }
    };

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe', `logs:${projectdata.name}`);
    });

    socket.on('message', handleMessage);
    socket.on('disconnect', () => {
      setIsConnected(false);
      setMessages(prev => [...prev, createLogMessage('Disconnected from log stream', 'warning')]);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('disconnect');
    };
  }, [socket, projectdata?.name, projectdata?._id]);

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return messages;
    
    const query = searchQuery.toLowerCase();
    return messages.filter(log => 
      log?.message?.toLowerCase().includes(query)
    );
  }, [messages, searchQuery]);

  const handleExport = (): void => {
    const logText = messages
      .filter(log => log?.message && log?.timestamp)
      .map(log => `[${log.timestamp}] [${log.type}] ${log.message}`)
      .join('\n');
      
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-logs-${projectData.name}-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatusCard = STATUS_CARDS[projectData.projectstatus];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      {StatusCard && (
        <div className="mt-6 mb-4">
          <StatusCard deploymentTime={deploymentTime} error={error} />
        </div>
      )}
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Runtime Logs</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => projectdata?._id && fetchProjectData(projectdata._id)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
              disabled={messages.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700">
                <span className="text-sm font-medium flex items-center gap-2">
                  Log Output
                  {isConnected && (
                    <span className="flex items-center text-emerald-500 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                      Connected
                    </span>
                  )}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setMessages([])}
                  disabled={messages.length === 0}
                >
                  Clear Logs
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <pre className="p-4 text-sm font-mono">
                  {filteredLogs.map((log, index) => (
                    <div 
                      key={`${log.timestamp}-${index}`} 
                      className={`pb-1 ${
                        log.type === 'error' ? 'text-red-500' :
                        log.type === 'success' ? 'text-emerald-500' :
                        log.type === 'warning' ? 'text-yellow-500' :
                        'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-gray-500 dark:text-gray-400">
                        [{log.timestamp}]
                      </span>{" "}
                      <span className="text-gray-400">[{log.type}]</span>{" "}
                      {log.message}
                    </div>
                  ))}
                </pre>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RuntimeLogs;