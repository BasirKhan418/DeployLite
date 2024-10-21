"use client"
import { Search, Download, RefreshCw, XCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RuntimeLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [logLevel, setLogLevel] = useState("all")

  // Simulated log entries
  const logs = [
    { timestamp: "2023-05-01 10:00:15", level: "INFO", message: "Application started", service: "App" },
    { timestamp: "2023-05-01 10:01:23", level: "DEBUG", message: "Connected to database", service: "Database" },
    { timestamp: "2023-05-01 10:02:45", level: "INFO", message: "User authentication successful", service: "Auth" },
    { timestamp: "2023-05-01 10:03:12", level: "WARN", message: "High CPU usage detected", service: "Monitor" },
    { timestamp: "2023-05-01 10:04:56", level: "ERROR", message: "Failed to process payment", service: "Payment" },
    { timestamp: "2023-05-01 10:05:34", level: "INFO", message: "Scheduled task completed", service: "Scheduler" },
    { timestamp: "2023-05-01 10:06:01", level: "DEBUG", message: "Cache cleared successfully", service: "Cache" },
    { timestamp: "2023-05-01 10:07:19", level: "WARN", message: "Low disk space warning", service: "Storage" },
    { timestamp: "2023-05-01 10:08:42", level: "INFO", message: "New user registered", service: "Auth" },
    { timestamp: "2023-05-01 10:09:57", level: "ERROR", message: "API request timeout", service: "API" },
  ]

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (logLevel === "all" || log.level.toLowerCase() === logLevel)
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Runtime Logs</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
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
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warn</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700">
                <span className="text-sm font-medium">Log Output</span>
                <Button variant="outline" size="sm" className="text-xs">
                  Clear Logs
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <pre className="p-4 text-sm font-mono">
                  {filteredLogs.map((log, index) => (
                    <div key={index} className="pb-1">
                      <span className="text-gray-500 dark:text-gray-400">{log.timestamp}</span>{" "}
                      <span
                        className={`font-semibold ${
                          log.level === "ERROR"
                            ? "text-red-600 dark:text-red-400"
                            : log.level === "WARN"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : log.level === "INFO"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        [{log.level}]
                      </span>{" "}
                      <span className="text-purple-600 dark:text-purple-400">[{log.service}]</span> {log.message}
                    </div>
                  ))}
                </pre>
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-4">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold mb-2">Log Summary</h3>
                <ul className="space-y-2">
                  <li>Total Logs: {logs.length}</li>
                  <li>Errors: {logs.filter((log) => log.level === "ERROR").length}</li>
                  <li>Warnings: {logs.filter((log) => log.level === "WARN").length}</li>
                  <li>Info: {logs.filter((log) => log.level === "INFO").length}</li>
                  <li>Debug: {logs.filter((log) => log.level === "DEBUG").length}</li>
                </ul>
              </TabsContent>
              <TabsContent value="stats" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold mb-2">Log Statistics</h3>
                <ul className="space-y-2">
                  <li>Most Active Service: Auth</li>
                  <li>Average Logs/min: 2.5</li>
                  <li>Peak Time: 10:00 - 11:00</li>
                </ul>
              </TabsContent>
            </Tabs>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  Pause Logging
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Archive Logs
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Configure Alerts
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}